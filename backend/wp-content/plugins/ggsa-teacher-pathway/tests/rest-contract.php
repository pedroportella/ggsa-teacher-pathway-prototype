<?php

declare(strict_types=1);

$wordpress_path = getenv( 'GGSA_LOCAL_WORDPRESS_PATH' );

if ( false === $wordpress_path ) {
	$wordpress_path = realpath( __DIR__ . '/../../../../.wordpress' );
}

if ( ! is_string( $wordpress_path ) || ! file_exists( $wordpress_path . '/wp-load.php' ) ) {
	fwrite( STDERR, "Local WordPress runtime not found. Run `pnpm backend:setup:local` first.\n" );
	exit( 1 );
}

require_once $wordpress_path . '/wp-load.php';

if ( ! function_exists( 'ggsa_seed_learning_plan_register' ) ) {
	fwrite( STDERR, "GGSA Teacher Pathway plugin is not active in the local WordPress runtime.\n" );
	exit( 1 );
}

ggsa_seed_learning_plan_register( true );

$admin_id = (int) get_user_by( 'login', 'admin' )->ID;

if ( $admin_id === 0 ) {
	fwrite( STDERR, "Admin user was not found in the local WordPress runtime.\n" );
	exit( 1 );
}

$failures = [];

function ggsa_assert( bool $condition, string $message ): void {
	global $failures;

	if ( ! $condition ) {
		$failures[] = $message;
		fwrite( STDERR, "FAIL {$message}\n" );
		return;
	}

	fwrite( STDOUT, "PASS {$message}\n" );
}

function ggsa_rest_request( string $method, string $route, ?array $payload = null, ?string $token = null ): WP_REST_Response {
	$request = new WP_REST_Request( $method, $route );

	if ( $payload !== null ) {
		$request->set_body( wp_json_encode( $payload ) );
		$request->set_header( 'content-type', 'application/json' );
	}

	if ( $token !== null ) {
		$request->set_header( 'x-ggsa-portal-token', $token );
	}

	return rest_do_request( $request );
}

function ggsa_evidence_request( array $file, array $params = [] ): WP_REST_Response {
	$request = new WP_REST_Request( 'POST', '/ggsa/v1/teacher-pathway-submissions/evidence' );
	$request->set_file_params( [ 'file' => $file ] );
	$request->set_header( 'x-ggsa-portal-token', 'local-teacher-pathway-portal-token' );

	foreach ( $params as $key => $value ) {
		$request->set_param( (string) $key, $value );
	}

	return rest_do_request( $request );
}

wp_set_current_user( 0 );

$unauthenticated = ggsa_rest_request( 'GET', '/ggsa/v1/teacher-pathway-submissions' );
ggsa_assert( $unauthenticated->get_status() >= 400, 'unauthenticated request is rejected' );

$token_response = ggsa_rest_request(
	'GET',
	'/ggsa/v1/teacher-pathway-submissions',
	null,
	'local-teacher-pathway-portal-token'
);
$token_data     = $token_response->get_data();
ggsa_assert( $token_response->get_status() === 200, 'portal-token request is accepted' );
ggsa_assert( is_array( $token_data ) && count( $token_data ) >= 3, 'register list returns seeded records' );
ggsa_assert(
	is_array( $token_data )
	&& isset( $token_data[0]['id'], $token_data[0]['referenceNumber'], $token_data[0]['organisationName'], $token_data[0]['productName'], $token_data[0]['workflowStatus'], $token_data[0]['riskLevel'], $token_data[0]['submittedAt'] ),
	'register list returns expected fields'
);

wp_set_current_user( $admin_id );

$admin_response = ggsa_rest_request( 'GET', '/ggsa/v1/teacher-pathway-submissions' );
ggsa_assert( $admin_response->get_status() === 200, 'admin-capability request is accepted' );

wp_set_current_user( 0 );

$malformed_create = ggsa_rest_request(
	'POST',
	'/ggsa/v1/teacher-pathway-submissions',
	[ 'productName' => 'Mastery Teaching Foundations' ],
	'local-teacher-pathway-portal-token'
);
ggsa_assert( $malformed_create->get_status() === 422, 'malformed create payload is rejected' );

$organisation_name = 'Contract Test School ' . gmdate( 'YmdHis' );
$valid_create      = ggsa_rest_request(
	'POST',
	'/ggsa/v1/teacher-pathway-submissions',
	[
		'organisationName'  => $organisation_name,
		'contactName'       => 'Contract Tester',
		'contactEmail'      => 'contract.tester@example.test',
		'productName'       => 'Mastery Teaching Foundations',
		'productVersion'    => '2026 cohort',
		'pathwayProfile'    => 'Mastery Teaching Foundations',
		'integrationType'   => 'REST contract test',
		'workflowStatus'    => 'Enrolled',
		'riskLevel'         => 'Low',
		'targetReleaseDate' => '2026-08-01',
	],
	'local-teacher-pathway-portal-token'
);
$created           = $valid_create->get_data();
$created_id        = is_array( $created ) ? absint( $created['id'] ?? 0 ) : 0;

ggsa_assert( $valid_create->get_status() === 200, 'valid create payload is accepted' );
ggsa_assert( $created_id > 0 && get_post_type( $created_id ) === GGSA_TEACHER_PATHWAY_POST_TYPE, 'valid create payload creates a learning plan post' );
ggsa_assert( (string) get_post_meta( $created_id, 'ggsa_school_name', true ) === $organisation_name, 'valid create payload persists learning plan meta' );
ggsa_assert(
	is_array( $created )
	&& isset( $created['integrationContext']['membership']['teacherProfile'] )
	&& isset( $created['integrationContext']['wooCommerce']['entitlement'] )
	&& isset( $created['integrationContext']['learnDash']['modules'][0]['courseId'] ),
	'valid create payload includes adapter integration context'
);
ggsa_assert(
	is_array( $created )
	&& isset( $created['generatedFrom']['membershipRole'] )
	&& isset( $created['evidenceSummary']['assignedModuleCount'] )
	&& count( $created['controlChecks'] ?? [] ) >= 4,
	'valid create payload is generated from enrolment context'
);

$readiness_update = ggsa_rest_request(
	'POST',
	'/ggsa/v1/teacher-pathway-submissions/readiness',
	[
		'id'              => (string) $created_id,
		'referenceNumber' => is_array( $created ) ? (string) ( $created['referenceNumber'] ?? '' ) : '',
		'controlChecks'   => [
			[
				'id'       => 'prerequisite-complete',
				'label'    => 'Prerequisite module complete',
				'category' => 'LearnDash',
				'status'   => 'Complete',
			],
		],
	],
	'local-teacher-pathway-portal-token'
);
$readiness_data   = $readiness_update->get_data();

ggsa_assert( $readiness_update->get_status() === 200, 'readiness update is accepted' );
ggsa_assert(
	is_array( $readiness_data )
	&& isset( $readiness_data['controlChecks'][0]['status'] )
	&& $readiness_data['controlChecks'][0]['status'] === 'Complete',
	'readiness update persists controlChecks'
);

$valid_pdf_path = tempnam( sys_get_temp_dir(), 'ggsa-evidence-' );
file_put_contents( $valid_pdf_path, "%PDF-1.4\n% GGSA contract evidence\n" );

$valid_evidence       = ggsa_evidence_request(
	[
		'name'     => 'teacher-evidence.pdf',
		'type'     => 'application/pdf',
		'tmp_name' => $valid_pdf_path,
		'error'    => UPLOAD_ERR_OK,
		'size'     => filesize( $valid_pdf_path ),
	],
	[
		'learningPlanId'  => (string) $created_id,
		'referenceNumber' => is_array( $created ) ? (string) ( $created['referenceNumber'] ?? '' ) : '',
		'category'        => 'Classroom artefact',
	]
);
$valid_evidence_data  = $valid_evidence->get_data();
$payload_after_upload = json_decode( (string) get_post_meta( $created_id, 'ggsa_learning_plan_payload', true ), true );

ggsa_assert( $valid_evidence->get_status() === 200, 'valid evidence upload is accepted' );
ggsa_assert(
	is_array( $valid_evidence_data )
	&& isset( $valid_evidence_data['owner']['learningPlanId'] )
	&& (int) $valid_evidence_data['owner']['learningPlanId'] === $created_id
	&& isset( $valid_evidence_data['category'] )
	&& $valid_evidence_data['category'] === 'Classroom artefact'
	&& isset( $valid_evidence_data['retention']['malwareScanning'] ),
	'valid evidence upload returns owner and policy metadata'
);
ggsa_assert(
	is_array( $payload_after_upload )
	&& isset( $payload_after_upload['evidenceDocuments'][0]['fileName'] )
	&& $payload_after_upload['evidenceDocuments'][0]['fileName'] === 'teacher-evidence.pdf',
	'valid evidence upload attaches metadata to the learning plan payload'
);

$missing_owner_path = tempnam( sys_get_temp_dir(), 'ggsa-evidence-' );
file_put_contents( $missing_owner_path, "%PDF-1.4\n% GGSA missing owner\n" );
$missing_owner = ggsa_evidence_request(
	[
		'name'     => 'teacher-evidence.pdf',
		'type'     => 'application/pdf',
		'tmp_name' => $missing_owner_path,
		'error'    => UPLOAD_ERR_OK,
		'size'     => filesize( $missing_owner_path ),
	]
);
ggsa_assert( $missing_owner->get_status() === 422, 'evidence upload requires owner or reference' );

$invalid_type_path = tempnam( sys_get_temp_dir(), 'ggsa-evidence-' );
file_put_contents( $invalid_type_path, '#!/bin/sh' );
$invalid_type = ggsa_evidence_request(
	[
		'name'     => 'teacher-evidence.sh',
		'type'     => 'application/x-sh',
		'tmp_name' => $invalid_type_path,
		'error'    => UPLOAD_ERR_OK,
		'size'     => filesize( $invalid_type_path ),
	],
	[ 'learningPlanId' => (string) $created_id ]
);
ggsa_assert( $invalid_type->get_status() === 415, 'evidence upload rejects disallowed file types' );

$oversized_path = tempnam( sys_get_temp_dir(), 'ggsa-evidence-' );
file_put_contents( $oversized_path, "%PDF-1.4\n% GGSA oversized placeholder\n" );
$oversized = ggsa_evidence_request(
	[
		'name'     => 'teacher-evidence.pdf',
		'type'     => 'application/pdf',
		'tmp_name' => $oversized_path,
		'error'    => UPLOAD_ERR_OK,
		'size'     => 10485761,
	],
	[
		'learningPlanId' => (string) $created_id,
		'category'       => 'Classroom artefact',
	]
);
ggsa_assert( $oversized->get_status() === 413, 'evidence upload rejects oversized files' );

$missing_category_path = tempnam( sys_get_temp_dir(), 'ggsa-evidence-' );
file_put_contents( $missing_category_path, "%PDF-1.4\n% GGSA missing category\n" );
$missing_category = ggsa_evidence_request(
	[
		'name'     => 'teacher-evidence.pdf',
		'type'     => 'application/pdf',
		'tmp_name' => $missing_category_path,
		'error'    => UPLOAD_ERR_OK,
		'size'     => filesize( $missing_category_path ),
	],
	[ 'learningPlanId' => (string) $created_id ]
);
ggsa_assert( $missing_category->get_status() === 422, 'evidence upload requires a category' );

if ( count( $failures ) > 0 ) {
	fwrite( STDERR, sprintf( "\n%d REST contract assertion(s) failed.\n", count( $failures ) ) );
	exit( 1 );
}

fwrite( STDOUT, "\nREST contract tests passed.\n" );
