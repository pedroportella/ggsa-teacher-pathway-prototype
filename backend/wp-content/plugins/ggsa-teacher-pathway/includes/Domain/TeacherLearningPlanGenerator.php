<?php

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class GGSA_Teacher_Pathway_Learning_Plan_Generator {

	public function __construct(
		private GGSA_Teacher_Pathway_Membership_User_Gateway $membership_gateway,
		private GGSA_Teacher_Pathway_WooCommerce_Entitlement_Gateway $woocommerce_gateway,
		private GGSA_Teacher_Pathway_LearnDash_Gateway $learndash_gateway
	) {
	}

	public function generate_from_enrolment( array $payload ): array {
		$teacher_profile    = $this->membership_gateway->resolve_teacher_profile( $payload );
		$entitlement        = $this->woocommerce_gateway->resolve_teacher_entitlement( $teacher_profile, $payload );
		$assigned_modules   = $this->learndash_gateway->list_assigned_modules( $teacher_profile, $payload );
		$certificates       = $this->learndash_gateway->list_certificates( $teacher_profile );
		$pathway_profile    = sanitize_text_field( (string) ( $payload['pathwayProfile'] ?? $payload['productName'] ?? 'Mastery Teaching Foundations' ) );
		$organisation_name  = sanitize_text_field( (string) ( $payload['organisationName'] ?? $teacher_profile['schoolName'] ?? 'Good to Great Schools Australia' ) );
		$teacher_name       = sanitize_text_field( (string) ( $payload['contactName'] ?? $teacher_profile['fullName'] ?? 'Teacher Pathway Participant' ) );
		$teacher_email      = sanitize_email( (string) ( $payload['contactEmail'] ?? $teacher_profile['email'] ?? 'teacher@example.test' ) );
		$target_start_date  = sanitize_text_field( (string) ( $payload['targetReleaseDate'] ?? $entitlement['accessStartsAt'] ?? gmdate( 'Y-m-d' ) ) );
		$generated_context  = $this->integration_context( $teacher_profile, $entitlement, $assigned_modules, $certificates );
		$generated_evidence = $this->evidence_summary( $certificates, $assigned_modules );

		return [
			...$payload,
			'organisationName'   => $organisation_name,
			'contactName'        => $teacher_name,
			'contactEmail'       => $teacher_email,
			'productName'        => sanitize_text_field( (string) ( $payload['productName'] ?? $entitlement['productName'] ?? 'Teacher Learning Plan' ) ),
			'productVersion'     => sanitize_text_field( (string) ( $payload['productVersion'] ?? '2026 cohort' ) ),
			'pathwayProfile'     => $pathway_profile,
			'integrationType'    => 'Generated from Membership, WooCommerce and LearnDash adapter context',
			'workflowStatus'     => sanitize_text_field( (string) ( $payload['workflowStatus'] ?? 'Enrolled' ) ),
			'riskLevel'          => sanitize_text_field( (string) ( $payload['riskLevel'] ?? $this->risk_level( $assigned_modules, $certificates ) ) ),
			'targetReleaseDate'  => $target_start_date,
			'standards'          => $payload['standards'] ?? [
				'Australian Professional Standards for Teachers',
				'Recognition of Prior Learning',
				'LearnDash course progress',
			],
			'controlChecks'      => $payload['controlChecks'] ?? $this->control_checks( $assigned_modules, $certificates ),
			'evidenceDocuments'  => $payload['evidenceDocuments'] ?? [],
			'evidenceSummary'    => $generated_evidence,
			'integrationContext' => $generated_context,
			'generatedFrom'      => [
				'membershipRole' => $teacher_profile['membershipRole'] ?? 'Teacher',
				'entitlement'    => $entitlement['source'] ?? 'local-prototype',
				'lms'            => count( $assigned_modules ) > 0 ? 'learndash-adapter' : 'local-prototype',
			],
		];
	}

	public function integration_context( array $teacher_profile, array $entitlement, array $assigned_modules, array $certificates ): array {
		return [
			'membership'  => [
				'available'      => $this->membership_gateway->has_membership_platform(),
				'teacherProfile' => $teacher_profile,
			],
			'wooCommerce' => [
				'available'   => $this->woocommerce_gateway->has_woocommerce(),
				'entitlement' => $entitlement,
			],
			'learnDash'   => [
				'available'    => $this->learndash_gateway->has_learndash(),
				'modules'      => $assigned_modules,
				'certificates' => $certificates,
			],
		];
	}

	private function control_checks( array $assigned_modules, array $certificates ): array {
		$prerequisites = array_filter(
			$assigned_modules,
			fn ( array $module ): bool => (string) ( $module['moduleType'] ?? '' ) === 'prerequisite'
		);
		$core_modules  = array_filter(
			$assigned_modules,
			fn ( array $module ): bool => in_array( (string) ( $module['moduleType'] ?? '' ), [ 'core', 'learndash-course' ], true )
		);

		return [
			[
				'id'       => 'prerequisites',
				'label'    => 'Prerequisite LearnDash courses are assigned from enrolment',
				'category' => 'Prerequisites',
				'status'   => count( $prerequisites ) > 0 ? 'Needs evidence' : 'Not started',
			],
			[
				'id'       => 'core-modules',
				'label'    => 'Core pathway modules are assigned for the teacher career stage',
				'category' => 'Core modules',
				'status'   => count( $core_modules ) > 0 ? 'Needs evidence' : 'Not started',
			],
			[
				'id'       => 'evidence-portfolio',
				'label'    => 'Certificates, classroom artefacts and mastery evidence are available for review',
				'category' => 'Evidence portfolio',
				'status'   => count( $certificates ) > 0 ? 'Complete' : 'Not started',
			],
			[
				'id'       => 'certification',
				'label'    => 'RPL evidence can be prepared for partner assessment',
				'category' => 'Certification',
				'status'   => count( $certificates ) > 0 ? 'Needs evidence' : 'Not started',
			],
		];
	}

	private function evidence_summary( array $certificates, array $assigned_modules ): array {
		return [
			'certificateCount'      => count( $certificates ),
			'assignedModuleCount'   => count( $assigned_modules ),
			'readyForRplReview'     => count( $certificates ) > 0,
			'requiresCoachEvidence' => count( $certificates ) === 0,
		];
	}

	private function risk_level( array $assigned_modules, array $certificates ): string {
		if ( count( $assigned_modules ) === 0 ) {
			return 'High';
		}

		return count( $certificates ) > 0 ? 'Low' : 'Medium';
	}
}
