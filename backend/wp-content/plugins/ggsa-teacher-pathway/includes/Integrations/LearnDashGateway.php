<?php

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class GGSA_Teacher_Pathway_LearnDash_Gateway {

	public function list_assigned_modules( array $teacher_profile, array $payload ): array {
		$user_id = absint( $teacher_profile['userId'] ?? 0 );

		if ( $this->has_learndash() && $user_id > 0 && function_exists( 'learndash_user_get_enrolled_courses' ) ) {
			$course_ids = learndash_user_get_enrolled_courses( $user_id );

			if ( is_array( $course_ids ) && count( $course_ids ) > 0 ) {
				return array_map(
					fn ( int|string $course_id ): array => $this->learndash_course_to_module( absint( $course_id ), $user_id ),
					$course_ids
				);
			}
		}

		$pathway_profile = sanitize_text_field( (string) ( $payload['pathwayProfile'] ?? 'Mastery Teaching Foundations' ) );

		return [
			[
				'courseId'        => 'ld-effective-teaching-essentials',
				'courseTitle'     => 'Learn Effective Teaching Essentials',
				'moduleType'      => 'prerequisite',
				'progressPercent' => 0,
				'completedAt'     => null,
				'source'          => 'local-prototype',
			],
			[
				'courseId'        => 'ld-cycles-of-school-practice',
				'courseTitle'     => 'Learn Cycles of School Practice',
				'moduleType'      => 'prerequisite',
				'progressPercent' => 0,
				'completedAt'     => null,
				'source'          => 'local-prototype',
			],
			[
				'courseId'        => 'ld-classroom-core',
				'courseTitle'     => $pathway_profile,
				'moduleType'      => 'core',
				'progressPercent' => 0,
				'completedAt'     => null,
				'source'          => 'local-prototype',
			],
		];
	}

	public function list_certificates( array $teacher_profile ): array {
		$user_id = absint( $teacher_profile['userId'] ?? 0 );

		if ( $this->has_learndash() && $user_id > 0 && function_exists( 'learndash_get_certificate_count' ) ) {
			return [
				[
					'certificateId' => 'learndash-user-' . $user_id,
					'moduleTitle'   => 'LearnDash certificate record',
					'issuedAt'      => null,
					'url'           => null,
					'source'        => 'learndash',
				],
			];
		}

		return [];
	}

	public function has_learndash(): bool {
		return class_exists( 'SFWD_LMS' )
			|| function_exists( 'learndash_user_get_enrolled_courses' )
			|| function_exists( 'learndash_course_progress' );
	}

	private function learndash_course_to_module( int $course_id, int $user_id ): array {
		$progress = function_exists( 'learndash_course_progress' )
			? learndash_course_progress(
				[
					'user_id'   => $user_id,
					'course_id' => $course_id,
					'array'     => true,
				]
			)
			: null;

		return [
			'courseId'        => (string) $course_id,
			'courseTitle'     => get_the_title( $course_id ),
			'moduleType'      => 'learndash-course',
			'progressPercent' => is_array( $progress ) ? absint( $progress['percentage'] ?? 0 ) : 0,
			'completedAt'     => null,
			'source'          => 'learndash',
		];
	}
}
