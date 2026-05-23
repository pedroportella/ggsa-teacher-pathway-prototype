<?php

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class GGSA_Teacher_Pathway_Plugin {

	private GGSA_Teacher_Pathway_Meta_Repository $repository;
	private GGSA_Teacher_Pathway_Learning_Plan_Post_Type $post_type;
	private GGSA_Teacher_Pathway_REST_Controller $rest_controller;
	private GGSA_Teacher_Pathway_Membership_User_Gateway $membership_gateway;
	private GGSA_Teacher_Pathway_WooCommerce_Entitlement_Gateway $woocommerce_gateway;
	private GGSA_Teacher_Pathway_LearnDash_Gateway $learndash_gateway;
	private GGSA_Teacher_Pathway_Learning_Plan_Generator $learning_plan_generator;
	private GGSA_Teacher_Pathway_Evidence_Upload_Policy $evidence_upload_policy;
	private GGSA_Teacher_Pathway_Portal_Launch_Shortcode $portal_launch_shortcode;

	public function __construct() {
		$this->repository              = new GGSA_Teacher_Pathway_Meta_Repository();
		$permissions                   = new GGSA_Teacher_Pathway_Permissions();
		$this->membership_gateway      = new GGSA_Teacher_Pathway_Membership_User_Gateway();
		$this->woocommerce_gateway     = new GGSA_Teacher_Pathway_WooCommerce_Entitlement_Gateway();
		$this->learndash_gateway       = new GGSA_Teacher_Pathway_LearnDash_Gateway();
		$this->learning_plan_generator = new GGSA_Teacher_Pathway_Learning_Plan_Generator(
			$this->membership_gateway,
			$this->woocommerce_gateway,
			$this->learndash_gateway
		);
		$this->evidence_upload_policy  = new GGSA_Teacher_Pathway_Evidence_Upload_Policy();

		$this->post_type               = new GGSA_Teacher_Pathway_Learning_Plan_Post_Type( $this->repository );
		$this->portal_launch_shortcode = new GGSA_Teacher_Pathway_Portal_Launch_Shortcode();
		$this->rest_controller         = new GGSA_Teacher_Pathway_REST_Controller(
			$this->repository,
			$permissions,
			$this->learning_plan_generator,
			$this->evidence_upload_policy
		);
	}

	public function register_hooks(): void {
		$this->post_type->register_hooks();
		$this->portal_launch_shortcode->register_hooks();
		$this->rest_controller->register_hooks();
	}

	public function seed_learning_plan_register( bool $refresh = false ): array {
		if ( $refresh ) {
			$existing_posts = get_posts(
				[
					'post_type'      => GGSA_TEACHER_PATHWAY_POST_TYPE,
					'post_status'    => 'any',
					'fields'         => 'ids',
					'posts_per_page' => -1,
				]
			);

			foreach ( $existing_posts as $post_id ) {
				wp_delete_post( (int) $post_id, true );
			}
		}

		$seed_records = [
			[
				'referenceNumber'   => 'GGSA-TP-2026-001',
				'organisationName'  => 'Cairns West State School',
				'contactName'       => 'Mia Thompson',
				'contactEmail'      => 'mia.thompson@example.org.au',
				'productName'       => 'Mastery Teaching Foundations',
				'productVersion'    => '2026 cohort',
				'pathwayProfile'    => 'Mastery Teaching Foundations',
				'integrationType'   => 'WordPress seed data refresh',
				'workflowStatus'    => 'In progress',
				'riskLevel'         => 'Medium',
				'targetReleaseDate' => '2026-07-01',
				'submittedAt'       => '2026-05-17T23:45:00+10:00',
			],
			[
				'referenceNumber'   => 'GGSA-TP-2026-002',
				'organisationName'  => 'Cape York Academy',
				'contactName'       => 'Noah Williams',
				'contactEmail'      => 'noah.williams@example.org.au',
				'productName'       => 'Mastery Teaching Towards Excellence',
				'productVersion'    => '2026 cohort',
				'pathwayProfile'    => 'Mastery Teaching Towards Excellence',
				'integrationType'   => 'WordPress seed data refresh',
				'workflowStatus'    => 'Coach action required',
				'riskLevel'         => 'High',
				'targetReleaseDate' => '2026-07-15',
				'submittedAt'       => '2026-05-16T13:10:00+10:00',
			],
			[
				'referenceNumber'   => 'GGSA-TP-2026-003',
				'organisationName'  => 'St Marys Catholic School',
				'contactName'       => 'Olivia Nguyen',
				'contactEmail'      => 'olivia.nguyen@example.org.au',
				'productName'       => 'Mastery Teaching Fellow',
				'productVersion'    => '2026 cohort',
				'pathwayProfile'    => 'Mastery Teaching Fellow',
				'integrationType'   => 'WordPress seed data refresh',
				'workflowStatus'    => 'RPL evidence ready',
				'riskLevel'         => 'Low',
				'targetReleaseDate' => '2026-08-01',
				'submittedAt'       => '2026-05-15T09:20:00+10:00',
			],
		];

		$created_ids = [];

		foreach ( $seed_records as $record ) {
			$record   = $this->generate_learning_plan( $record );
			$existing = get_posts(
				[
					'post_type'      => GGSA_TEACHER_PATHWAY_POST_TYPE,
					'post_status'    => 'any',
					'meta_key'       => 'ggsa_reference_number',
					'meta_value'     => $record['referenceNumber'],
					'fields'         => 'ids',
					'posts_per_page' => 1,
				]
			);

			$post_id = $existing[0] ?? wp_insert_post(
				[
					'post_type'     => GGSA_TEACHER_PATHWAY_POST_TYPE,
					'post_title'    => sprintf( '%s - %s', $record['organisationName'], $record['productName'] ),
					'post_status'   => 'publish',
					'post_date_gmt' => gmdate( 'Y-m-d H:i:s', strtotime( (string) $record['submittedAt'] ) ),
					'post_date'     => get_date_from_gmt( gmdate( 'Y-m-d H:i:s', strtotime( (string) $record['submittedAt'] ) ) ),
				]
			);

			if ( ! is_wp_error( $post_id ) ) {
				$this->repository->update_learning_plan_meta( (int) $post_id, $record );
				$created_ids[] = (int) $post_id;
			}
		}

		return $created_ids;
	}

	public function integration_context( array $payload ): array {
		return $this->generate_learning_plan( $payload )['integrationContext'];
	}

	public function generate_learning_plan( array $payload ): array {
		return $this->learning_plan_generator->generate_from_enrolment( $payload );
	}
}
