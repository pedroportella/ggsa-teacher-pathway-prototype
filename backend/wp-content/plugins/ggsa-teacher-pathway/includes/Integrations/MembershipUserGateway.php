<?php

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class GGSA_Teacher_Pathway_Membership_User_Gateway {

	public function resolve_teacher_profile( array $payload ): array {
		$user = wp_get_current_user();

		if ( $user instanceof WP_User && $user->exists() ) {
			return [
				'userId'          => (string) $user->ID,
				'email'           => (string) $user->user_email,
				'enrolmentSource' => 'wordpress-user',
				'fullName'        => $this->display_name( $user, $payload ),
				'membershipRole'  => $this->membership_role( $user ),
				'schoolName'      => sanitize_text_field( (string) ( $payload['organisationName'] ?? '' ) ),
			];
		}

		return [
			'userId'          => '',
			'email'           => sanitize_email( (string) ( $payload['contactEmail'] ?? 'teacher@example.test' ) ),
			'enrolmentSource' => 'local-prototype',
			'fullName'        => sanitize_text_field( (string) ( $payload['contactName'] ?? 'Teacher Pathway Participant' ) ),
			'membershipRole'  => 'Teacher',
			'schoolName'      => sanitize_text_field( (string) ( $payload['organisationName'] ?? 'Good to Great Schools Australia' ) ),
		];
	}

	public function has_membership_platform(): bool {
		return function_exists( 'wc_memberships_get_user_memberships' )
			|| class_exists( 'WC_Memberships' )
			|| class_exists( 'MeprUser' );
	}

	private function display_name( WP_User $user, array $payload ): string {
		$display_name = trim( (string) $user->display_name );

		if ( '' !== $display_name ) {
			return $display_name;
		}

		return sanitize_text_field( (string) ( $payload['contactName'] ?? 'Teacher Pathway Participant' ) );
	}

	private function membership_role( WP_User $user ): string {
		if ( in_array( 'teacher', $user->roles, true ) ) {
			return 'Teacher';
		}

		if ( count( $user->roles ) > 0 ) {
			return sanitize_text_field( ucwords( str_replace( [ '-', '_' ], ' ', (string) $user->roles[0] ) ) );
		}

		return 'Teacher';
	}
}
