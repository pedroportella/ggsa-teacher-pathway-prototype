<?php

declare(strict_types=1);

$wordpress_path = getenv('GGSA_LOCAL_WORDPRESS_PATH') ?: realpath(__DIR__ . '/../../../../.wordpress');

if (!is_string($wordpress_path) || !file_exists($wordpress_path . '/wp-load.php')) {
    fwrite(STDERR, "Local WordPress runtime not found. Run `pnpm backend:setup:local` first.\n");
    exit(1);
}

require_once $wordpress_path . '/wp-load.php';

if (!function_exists('ggsa_seed_learning_plan_register')) {
    fwrite(STDERR, "GGSA Teacher Pathway plugin is not active in the local WordPress runtime.\n");
    exit(1);
}

ggsa_seed_learning_plan_register(true);

$admin_id = (int) get_user_by('login', 'admin')->ID;

if ($admin_id === 0) {
    fwrite(STDERR, "Admin user was not found in the local WordPress runtime.\n");
    exit(1);
}

$failures = [];

function ggsa_assert(bool $condition, string $message): void
{
    global $failures;

    if (!$condition) {
        $failures[] = $message;
        fwrite(STDERR, "FAIL {$message}\n");
        return;
    }

    fwrite(STDOUT, "PASS {$message}\n");
}

function ggsa_rest_request(string $method, string $route, ?array $payload = null, ?string $token = null): WP_REST_Response
{
    $request = new WP_REST_Request($method, $route);

    if ($payload !== null) {
        $request->set_body(wp_json_encode($payload));
        $request->set_header('content-type', 'application/json');
    }

    if ($token !== null) {
        $request->set_header('x-ggsa-portal-token', $token);
    }

    return rest_do_request($request);
}

wp_set_current_user(0);

$unauthenticated = ggsa_rest_request('GET', '/ggsa/v1/teacher-pathway-submissions');
ggsa_assert($unauthenticated->get_status() >= 400, 'unauthenticated request is rejected');

$token_response = ggsa_rest_request(
    'GET',
    '/ggsa/v1/teacher-pathway-submissions',
    null,
    'local-teacher-pathway-portal-token'
);
$token_data = $token_response->get_data();
ggsa_assert($token_response->get_status() === 200, 'portal-token request is accepted');
ggsa_assert(is_array($token_data) && count($token_data) >= 3, 'register list returns seeded records');
ggsa_assert(
    is_array($token_data)
    && isset($token_data[0]['id'], $token_data[0]['referenceNumber'], $token_data[0]['organisationName'], $token_data[0]['productName'], $token_data[0]['workflowStatus'], $token_data[0]['riskLevel'], $token_data[0]['submittedAt']),
    'register list returns expected fields'
);

wp_set_current_user($admin_id);

$admin_response = ggsa_rest_request('GET', '/ggsa/v1/teacher-pathway-submissions');
ggsa_assert($admin_response->get_status() === 200, 'admin-capability request is accepted');

wp_set_current_user(0);

$malformed_create = ggsa_rest_request(
    'POST',
    '/ggsa/v1/teacher-pathway-submissions',
    ['productName' => 'Mastery Teaching Foundations'],
    'local-teacher-pathway-portal-token'
);
ggsa_assert($malformed_create->get_status() === 422, 'malformed create payload is rejected');

$organisation_name = 'Contract Test School ' . gmdate('YmdHis');
$valid_create = ggsa_rest_request(
    'POST',
    '/ggsa/v1/teacher-pathway-submissions',
    [
        'organisationName' => $organisation_name,
        'contactName' => 'Contract Tester',
        'contactEmail' => 'contract.tester@example.test',
        'productName' => 'Mastery Teaching Foundations',
        'productVersion' => '2026 cohort',
        'pathwayProfile' => 'Mastery Teaching Foundations',
        'integrationType' => 'REST contract test',
        'workflowStatus' => 'Enrolled',
        'riskLevel' => 'Low',
        'targetReleaseDate' => '2026-08-01',
    ],
    'local-teacher-pathway-portal-token'
);
$created = $valid_create->get_data();
$created_id = is_array($created) ? absint($created['id'] ?? 0) : 0;

ggsa_assert($valid_create->get_status() === 200, 'valid create payload is accepted');
ggsa_assert($created_id > 0 && get_post_type($created_id) === GGSA_TEACHER_PATHWAY_POST_TYPE, 'valid create payload creates a learning plan post');
ggsa_assert((string) get_post_meta($created_id, 'ggsa_school_name', true) === $organisation_name, 'valid create payload persists learning plan meta');

$readiness_update = ggsa_rest_request(
    'POST',
    '/ggsa/v1/teacher-pathway-submissions/readiness',
    [
        'id' => (string) $created_id,
        'referenceNumber' => is_array($created) ? (string) ($created['referenceNumber'] ?? '') : '',
        'controlChecks' => [
            [
                'id' => 'prerequisite-complete',
                'label' => 'Prerequisite module complete',
                'category' => 'LearnDash',
                'status' => 'Complete',
            ],
        ],
    ],
    'local-teacher-pathway-portal-token'
);
$readiness_data = $readiness_update->get_data();

ggsa_assert($readiness_update->get_status() === 200, 'readiness update is accepted');
ggsa_assert(
    is_array($readiness_data)
    && isset($readiness_data['controlChecks'][0]['status'])
    && $readiness_data['controlChecks'][0]['status'] === 'Complete',
    'readiness update persists controlChecks'
);

if (count($failures) > 0) {
    fwrite(STDERR, sprintf("\n%d REST contract assertion(s) failed.\n", count($failures)));
    exit(1);
}

fwrite(STDOUT, "\nREST contract tests passed.\n");
