<?php

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class GGSA_Teacher_Pathway_REST_Controller {

	public function __construct(
		private GGSA_Teacher_Pathway_Meta_Repository $repository,
		private GGSA_Teacher_Pathway_Permissions $permissions,
		private GGSA_Teacher_Pathway_Learning_Plan_Generator $learning_plan_generator,
		private GGSA_Teacher_Pathway_Evidence_Upload_Policy $evidence_upload_policy
	) {
	}

	public function register_hooks(): void {
		add_action( 'rest_api_init', [ $this, 'register_routes' ] );
	}

	public function register_routes(): void {
		register_rest_route(
			'ggsa/v1',
			'/teacher-pathway-submissions',
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'list_learning_plans' ],
					'permission_callback' => [ $this->permissions, 'can_access_api' ],
				],
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'create_learning_plan' ],
					'permission_callback' => [ $this->permissions, 'can_access_api' ],
				],
			]
		);

		register_rest_route(
			'ggsa/v1',
			'/teacher-pathway-submissions/evidence',
			[
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => [ $this, 'upload_learning_plan_evidence' ],
				'permission_callback' => [ $this->permissions, 'can_access_api' ],
			]
		);

		register_rest_route(
			'ggsa/v1',
			'/teacher-pathway-submissions/readiness',
			[
				'methods'             => WP_REST_Server::CREATABLE,
				'callback'            => [ $this, 'update_learning_plan_readiness' ],
				'permission_callback' => [ $this->permissions, 'can_access_api' ],
			]
		);
	}

	public function list_learning_plans(): WP_REST_Response {
		$query = new WP_Query(
			[
				'post_type'      => GGSA_TEACHER_PATHWAY_POST_TYPE,
				'post_status'    => [ 'publish', 'draft' ],
				'posts_per_page' => 50,
				'orderby'        => 'date',
				'order'          => 'DESC',
			]
		);

		$items = array_map(
			fn ( WP_Post $post ): array => $this->repository->learning_plan_to_register_item( $post ),
			$query->posts
		);

		return rest_ensure_response( $items );
	}

	public function create_learning_plan( WP_REST_Request $request ): WP_REST_Response|WP_Error {
		$payload = $request->get_json_params();

		if ( ! is_array( $payload ) ) {
			return new WP_Error( 'ggsa_invalid_payload', 'Expected a JSON learning plan payload.', [ 'status' => 400 ] );
		}

		$school  = sanitize_text_field( (string) ( $payload['organisationName'] ?? '' ) );
		$pathway = sanitize_text_field( (string) ( $payload['productName'] ?? 'Teacher Learning Plan' ) );

		if ( $school === '' ) {
			return new WP_Error( 'ggsa_missing_school', 'School or organisation is required.', [ 'status' => 422 ] );
		}

		$post_id = wp_insert_post(
			[
				'post_type'   => GGSA_TEACHER_PATHWAY_POST_TYPE,
				'post_title'  => sprintf( '%s - %s', $school, $pathway ),
				'post_status' => 'publish',
			],
			true
		);

		if ( is_wp_error( $post_id ) ) {
			return $post_id;
		}

		$reference = sprintf( 'GGSA-TP-%s-%03d', gmdate( 'Y' ), (int) $post_id );
		$record    = $this->learning_plan_generator->generate_from_enrolment(
			[
				'id'              => (string) $post_id,
				'referenceNumber' => $reference,
				'submittedAt'     => gmdate( DATE_ATOM ),
				...$payload,
			]
		);

		$this->repository->update_learning_plan_meta(
			(int) $post_id,
			[
				...$record,
				'organisationName' => $school,
				'productName'      => $pathway,
			]
		);

		return rest_ensure_response( $record );
	}

	public function upload_learning_plan_evidence( WP_REST_Request $request ): WP_REST_Response|WP_Error {
		$validated = $this->evidence_upload_policy->validate_request( $request );

		if ( is_wp_error( $validated ) ) {
			return $validated;
		}

		require_once ABSPATH . 'wp-admin/includes/file.php';

		$upload = wp_handle_sideload(
			$validated['file'],
			[
				'test_form' => false,
				'mimes'     => [
					'pdf'  => 'application/pdf',
					'png'  => 'image/png',
					'jpg'  => 'image/jpeg',
					'jpeg' => 'image/jpeg',
					'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				],
			]
		);

		if ( isset( $upload['error'] ) ) {
			return new WP_Error( 'ggsa_evidence_upload_failed', sanitize_text_field( (string) $upload['error'] ), [ 'status' => 500 ] );
		}

		$document = [
			'fileId'     => sanitize_title( (string) ( $upload['file'] ?? uniqid( 'evidence-', true ) ) ),
			'fileName'   => $validated['fileName'],
			'fileType'   => $validated['fileType'],
			'fileSize'   => $validated['fileSize'],
			'category'   => $validated['category'],
			'owner'      => $validated['owner'],
			'retention'  => $validated['retention'],
			'uploadedAt' => gmdate( DATE_ATOM ),
			'url'        => esc_url_raw( (string) ( $upload['url'] ?? '' ) ),
		];

		$post_id = $this->repository->find_learning_plan_post_id(
			[
				'id'              => (string) ( $validated['owner']['learningPlanId'] ?? '' ),
				'referenceNumber' => (string) ( $validated['owner']['referenceNumber'] ?? '' ),
			]
		);

		if ( $post_id > 0 ) {
			$payload  = json_decode( (string) get_post_meta( $post_id, 'ggsa_learning_plan_payload', true ), true );
			$existing = is_array( $payload ) && isset( $payload['evidenceDocuments'] ) && is_array( $payload['evidenceDocuments'] )
				? $payload['evidenceDocuments']
				: [];

			$this->repository->update_learning_plan_payload(
				$post_id,
				[
					'evidenceDocuments' => [
						...$existing,
						$document,
					],
				]
			);
		}

		return rest_ensure_response( $document );
	}

	public function update_learning_plan_readiness( WP_REST_Request $request ): WP_REST_Response|WP_Error {
		$payload = $request->get_json_params();

		if ( ! is_array( $payload ) ) {
			return new WP_Error( 'ggsa_invalid_payload', 'Expected a JSON readiness controls payload.', [ 'status' => 400 ] );
		}

		$post_id = $this->repository->find_learning_plan_post_id( $payload );

		if ( $post_id === 0 ) {
			return new WP_Error( 'ggsa_learning_plan_not_found', 'Learning plan could not be found for readiness update.', [ 'status' => 404 ] );
		}

		$control_checks = $payload['controlChecks'] ?? null;

		if ( ! is_array( $control_checks ) ) {
			return new WP_Error( 'ggsa_missing_readiness_controls', 'Readiness controls are required.', [ 'status' => 422 ] );
		}

		$sanitized_checks = array_map(
			fn ( mixed $check ): array => $this->repository->sanitize_control_check( $check ),
			$control_checks
		);
		$this->repository->update_learning_plan_payload( $post_id, [ 'controlChecks' => $sanitized_checks ] );

		$record = json_decode( (string) get_post_meta( $post_id, 'ggsa_learning_plan_payload', true ), true );

		if ( ! is_array( $record ) ) {
			$record = [];
		}

		return rest_ensure_response(
			[
				...$record,
				'id'              => (string) $post_id,
				'referenceNumber' => (string) get_post_meta( $post_id, 'ggsa_reference_number', true ),
				'controlChecks'   => $sanitized_checks,
			]
		);
	}
}
