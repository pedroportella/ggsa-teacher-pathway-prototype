<?php

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class GGSA_Teacher_Pathway_Evidence_Upload_Policy {

	private const DEFAULT_MAX_BYTES = 10485760;

	private const ALLOWED_TYPES = [
		'pdf'  => 'application/pdf',
		'png'  => 'image/png',
		'jpg'  => 'image/jpeg',
		'jpeg' => 'image/jpeg',
		'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	];

	private const ALLOWED_CATEGORIES = [
		'LearnDash certificate',
		'Classroom artefact',
		'Mastery evidence',
		'RPL supporting document',
	];

	public function validate_request( WP_REST_Request $request ): array|WP_Error {
		$files = $request->get_file_params();
		$file  = $files['file'] ?? null;

		if ( ! is_array( $file ) ) {
			return new WP_Error( 'ggsa_evidence_file_required', 'Evidence file is required.', [ 'status' => 422 ] );
		}

		$reference = sanitize_text_field( (string) $request->get_param( 'referenceNumber' ) );
		$post_id   = absint( $request->get_param( 'learningPlanId' ) );

		if ( '' === $reference && 0 === $post_id ) {
			return new WP_Error( 'ggsa_evidence_owner_required', 'Evidence must be attached to a learning plan ID or reference number.', [ 'status' => 422 ] );
		}

		if ( (int) ( $file['size'] ?? 0 ) <= 0 ) {
			return new WP_Error( 'ggsa_evidence_empty_file', 'Evidence file is empty.', [ 'status' => 422 ] );
		}

		if ( (int) $file['size'] > $this->max_file_size_bytes() ) {
			return new WP_Error( 'ggsa_evidence_file_too_large', 'Evidence file exceeds the configured upload size limit.', [ 'status' => 413 ] );
		}

		$file_name = sanitize_file_name( (string) ( $file['name'] ?? '' ) );
		$file_type = sanitize_text_field( (string) ( $file['type'] ?? '' ) );
		$extension = strtolower( pathinfo( $file_name, PATHINFO_EXTENSION ) );

		if ( ! isset( self::ALLOWED_TYPES[ $extension ] ) ) {
			return new WP_Error( 'ggsa_evidence_type_not_allowed', 'Evidence file type is not allowed.', [ 'status' => 415 ] );
		}

		if ( '' !== $file_type && self::ALLOWED_TYPES[ $extension ] !== $file_type ) {
			return new WP_Error( 'ggsa_evidence_mime_mismatch', 'Evidence file extension and MIME type do not match.', [ 'status' => 415 ] );
		}

		$category = sanitize_text_field( (string) $request->get_param( 'category' ) );

		if ( '' === $category ) {
			return new WP_Error( 'ggsa_evidence_category_required', 'Evidence category is required.', [ 'status' => 422 ] );
		}

		if ( ! in_array( $category, self::ALLOWED_CATEGORIES, true ) ) {
			return new WP_Error( 'ggsa_evidence_category_invalid', 'Evidence category is not supported.', [ 'status' => 422 ] );
		}

		return [
			'file'      => $file,
			'category'  => $category,
			'fileName'  => $file_name,
			'fileType'  => self::ALLOWED_TYPES[ $extension ],
			'fileSize'  => (int) $file['size'],
			'owner'     => [
				'learningPlanId'  => $post_id,
				'referenceNumber' => $reference,
			],
			'retention' => [
				'access'          => 'private-review',
				'malwareScanning' => 'required-before-production',
				'privacyReview'   => 'required-before-production',
			],
		];
	}

	public function max_file_size_bytes(): int {
		$configured = absint( getenv( 'GGSA_TEACHER_PATHWAY_MAX_EVIDENCE_BYTES' ) );

		return $configured > 0 ? $configured : self::DEFAULT_MAX_BYTES;
	}
}
