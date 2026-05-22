<?php
/**
 * Plugin Name: GGSA Teacher Pathway Headless API
 * Description: Headless WordPress prototype API for Teacher Learning Pathways, LearnDash-style modules and evidence portfolio records.
 * Version: 0.1.0
 * Author: Pedro Portella
 */

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

const GGSA_TEACHER_PATHWAY_POST_TYPE = 'ggsa_learning_plan';
const GGSA_TEACHER_PATHWAY_STATUSES = [
    'Learning plan draft',
    'Enrolled',
    'In progress',
    'Coach action required',
    'Certification ready',
];
const GGSA_TEACHER_PATHWAY_SUPPORT_LEVELS = ['Low', 'Medium', 'High'];

add_action('init', 'ggsa_register_learning_plan_post_type');
add_action('rest_api_init', 'ggsa_register_teacher_pathway_routes');
add_action('add_meta_boxes_' . GGSA_TEACHER_PATHWAY_POST_TYPE, 'ggsa_add_learning_plan_meta_boxes');
add_action('save_post_' . GGSA_TEACHER_PATHWAY_POST_TYPE, 'ggsa_save_learning_plan_admin_fields');
add_filter('manage_' . GGSA_TEACHER_PATHWAY_POST_TYPE . '_posts_columns', 'ggsa_learning_plan_admin_columns');
add_action('manage_' . GGSA_TEACHER_PATHWAY_POST_TYPE . '_posts_custom_column', 'ggsa_render_learning_plan_admin_column', 10, 2);

function ggsa_register_learning_plan_post_type(): void
{
    register_post_type(
        GGSA_TEACHER_PATHWAY_POST_TYPE,
        [
            'label' => 'Teacher Learning Plans',
            'labels' => [
                'name' => 'Teacher Learning Plans',
                'singular_name' => 'Teacher Learning Plan',
            ],
            'public' => false,
            'show_ui' => true,
            'show_in_menu' => true,
            'show_in_rest' => true,
            'menu_icon' => 'dashicons-welcome-learn-more',
            'supports' => ['title', 'custom-fields'],
        ]
    );
}

function ggsa_register_teacher_pathway_routes(): void
{
    register_rest_route(
        'ggsa/v1',
        '/teacher-pathway-submissions',
        [
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => 'ggsa_list_learning_plans',
                'permission_callback' => '__return_true',
            ],
            [
                'methods' => WP_REST_Server::CREATABLE,
                'callback' => 'ggsa_create_learning_plan',
                'permission_callback' => '__return_true',
            ],
        ]
    );

    register_rest_route(
        'ggsa/v1',
        '/teacher-pathway-submissions/evidence',
        [
            'methods' => WP_REST_Server::CREATABLE,
            'callback' => 'ggsa_upload_learning_plan_evidence',
            'permission_callback' => '__return_true',
        ]
    );
}

function ggsa_list_learning_plans(): WP_REST_Response
{
    $query = new WP_Query([
        'post_type' => GGSA_TEACHER_PATHWAY_POST_TYPE,
        'post_status' => ['publish', 'draft'],
        'posts_per_page' => 50,
        'orderby' => 'date',
        'order' => 'DESC',
    ]);

    $items = array_map(
        static fn (WP_Post $post): array => ggsa_learning_plan_to_register_item($post),
        $query->posts
    );

    return rest_ensure_response($items);
}

function ggsa_create_learning_plan(WP_REST_Request $request): WP_REST_Response|WP_Error
{
    $payload = $request->get_json_params();

    if (!is_array($payload)) {
        return new WP_Error('ggsa_invalid_payload', 'Expected a JSON learning plan payload.', ['status' => 400]);
    }

    $school = sanitize_text_field((string) ($payload['organisationName'] ?? ''));
    $pathway = sanitize_text_field((string) ($payload['productName'] ?? 'Teacher Learning Plan'));

    if ($school === '') {
        return new WP_Error('ggsa_missing_school', 'School or organisation is required.', ['status' => 422]);
    }

    $post_id = wp_insert_post([
        'post_type' => GGSA_TEACHER_PATHWAY_POST_TYPE,
        'post_title' => sprintf('%s - %s', $school, $pathway),
        'post_status' => 'publish',
    ], true);

    if (is_wp_error($post_id)) {
        return $post_id;
    }

    $reference = sprintf('GGSA-TP-%s-%03d', gmdate('Y'), (int) $post_id);
    $record = [
        'id' => (string) $post_id,
        'referenceNumber' => $reference,
        'submittedAt' => gmdate(DATE_ATOM),
        ...$payload,
    ];

    update_post_meta($post_id, 'ggsa_learning_plan_payload', wp_json_encode($record));
    update_post_meta($post_id, 'ggsa_reference_number', $reference);
    update_post_meta($post_id, 'ggsa_school_name', $school);
    update_post_meta($post_id, 'ggsa_pathway_name', $pathway);
    update_post_meta($post_id, 'ggsa_contact_name', sanitize_text_field((string) ($payload['contactName'] ?? '')));
    update_post_meta($post_id, 'ggsa_contact_email', sanitize_email((string) ($payload['contactEmail'] ?? '')));
    update_post_meta($post_id, 'ggsa_pathway_profile', sanitize_text_field((string) ($payload['pathwayProfile'] ?? '')));
    update_post_meta($post_id, 'ggsa_integration_type', sanitize_text_field((string) ($payload['integrationType'] ?? '')));
    update_post_meta($post_id, 'ggsa_target_release_date', sanitize_text_field((string) ($payload['targetReleaseDate'] ?? '')));
    update_post_meta($post_id, 'ggsa_workflow_status', ggsa_sanitize_learning_plan_status((string) ($payload['workflowStatus'] ?? 'Enrolled')));
    update_post_meta($post_id, 'ggsa_support_level', ggsa_sanitize_support_level((string) ($payload['riskLevel'] ?? 'Medium')));

    return rest_ensure_response($record);
}

function ggsa_upload_learning_plan_evidence(WP_REST_Request $request): WP_REST_Response
{
    $files = $request->get_file_params();
    $file = $files['file'] ?? null;

    if (!is_array($file)) {
        return rest_ensure_response([
            'fileId' => 'sample-evidence',
            'fileName' => 'teacher-pathway-evidence.pdf',
            'fileType' => 'application/pdf',
            'fileSize' => 428000,
            'uploadedAt' => gmdate(DATE_ATOM),
        ]);
    }

    require_once ABSPATH . 'wp-admin/includes/file.php';

    $upload = wp_handle_upload($file, ['test_form' => false]);

    if (isset($upload['error'])) {
        return rest_ensure_response([
            'fileId' => uniqid('evidence-', true),
            'fileName' => sanitize_file_name((string) ($file['name'] ?? 'teacher-pathway-evidence.pdf')),
            'fileType' => sanitize_text_field((string) ($file['type'] ?? 'application/octet-stream')),
            'fileSize' => (int) ($file['size'] ?? 0),
            'uploadedAt' => gmdate(DATE_ATOM),
            'error' => sanitize_text_field((string) $upload['error']),
        ]);
    }

    return rest_ensure_response([
        'fileId' => sanitize_title((string) ($upload['file'] ?? uniqid('evidence-', true))),
        'fileName' => sanitize_file_name((string) ($file['name'] ?? 'teacher-pathway-evidence.pdf')),
        'fileType' => sanitize_text_field((string) ($file['type'] ?? 'application/octet-stream')),
        'fileSize' => (int) ($file['size'] ?? 0),
        'uploadedAt' => gmdate(DATE_ATOM),
        'url' => esc_url_raw((string) ($upload['url'] ?? '')),
    ]);
}

function ggsa_learning_plan_to_register_item(WP_Post $post): array
{
    return [
        'id' => (string) $post->ID,
        'referenceNumber' => (string) get_post_meta($post->ID, 'ggsa_reference_number', true),
        'organisationName' => (string) get_post_meta($post->ID, 'ggsa_school_name', true),
        'productName' => (string) get_post_meta($post->ID, 'ggsa_pathway_name', true),
        'workflowStatus' => (string) get_post_meta($post->ID, 'ggsa_workflow_status', true),
        'riskLevel' => (string) get_post_meta($post->ID, 'ggsa_support_level', true),
        'submittedAt' => get_post_datetime($post, 'date', 'gmt')?->format(DATE_ATOM),
    ];
}

function ggsa_add_learning_plan_meta_boxes(WP_Post $post): void
{
    add_meta_box(
        'ggsa-learning-plan-details',
        'Teacher pathway details',
        'ggsa_render_learning_plan_details_meta_box',
        GGSA_TEACHER_PATHWAY_POST_TYPE,
        'normal',
        'high'
    );
}

function ggsa_render_learning_plan_details_meta_box(WP_Post $post): void
{
    wp_nonce_field('ggsa_save_learning_plan_details', 'ggsa_learning_plan_nonce');

    $fields = [
        'reference' => (string) get_post_meta($post->ID, 'ggsa_reference_number', true),
        'school' => (string) get_post_meta($post->ID, 'ggsa_school_name', true),
        'pathway' => (string) get_post_meta($post->ID, 'ggsa_pathway_name', true),
        'contact_name' => (string) get_post_meta($post->ID, 'ggsa_contact_name', true),
        'contact_email' => (string) get_post_meta($post->ID, 'ggsa_contact_email', true),
        'pathway_profile' => (string) get_post_meta($post->ID, 'ggsa_pathway_profile', true),
        'integration_type' => (string) get_post_meta($post->ID, 'ggsa_integration_type', true),
        'target_release_date' => (string) get_post_meta($post->ID, 'ggsa_target_release_date', true),
        'workflow_status' => (string) get_post_meta($post->ID, 'ggsa_workflow_status', true),
        'support_level' => (string) get_post_meta($post->ID, 'ggsa_support_level', true),
    ];

    if ($fields['workflow_status'] === '') {
        $fields['workflow_status'] = 'Learning plan draft';
    }

    if ($fields['support_level'] === '') {
        $fields['support_level'] = 'Medium';
    }

    ?>
    <style>
        .ggsa-learning-plan-grid {
            display: grid;
            gap: 16px;
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .ggsa-learning-plan-field label {
            display: block;
            font-weight: 600;
            margin-bottom: 6px;
        }

        .ggsa-learning-plan-field input,
        .ggsa-learning-plan-field select {
            width: 100%;
        }

        .ggsa-learning-plan-field--wide {
            grid-column: 1 / -1;
        }
    </style>
    <div class="ggsa-learning-plan-grid">
        <?php ggsa_render_text_admin_field('Reference number', 'ggsa_reference_number', $fields['reference'], true); ?>
        <?php ggsa_render_select_admin_field('Workflow status', 'ggsa_workflow_status', $fields['workflow_status'], GGSA_TEACHER_PATHWAY_STATUSES); ?>
        <?php ggsa_render_text_admin_field('School / organisation', 'ggsa_school_name', $fields['school']); ?>
        <?php ggsa_render_text_admin_field('Teacher pathway', 'ggsa_pathway_name', $fields['pathway']); ?>
        <?php ggsa_render_text_admin_field('Contact name', 'ggsa_contact_name', $fields['contact_name']); ?>
        <?php ggsa_render_text_admin_field('Contact email', 'ggsa_contact_email', $fields['contact_email']); ?>
        <?php ggsa_render_select_admin_field('Support level', 'ggsa_support_level', $fields['support_level'], GGSA_TEACHER_PATHWAY_SUPPORT_LEVELS); ?>
        <?php ggsa_render_text_admin_field('Target date', 'ggsa_target_release_date', $fields['target_release_date']); ?>
        <?php ggsa_render_text_admin_field('Pathway profile', 'ggsa_pathway_profile', $fields['pathway_profile'], false, true); ?>
        <?php ggsa_render_text_admin_field('Integration notes', 'ggsa_integration_type', $fields['integration_type'], false, true); ?>
    </div>
    <?php
}

function ggsa_render_text_admin_field(
    string $label,
    string $name,
    string $value,
    bool $readonly = false,
    bool $wide = false
): void {
    $class = $wide ? 'ggsa-learning-plan-field ggsa-learning-plan-field--wide' : 'ggsa-learning-plan-field';
    ?>
    <p class="<?php echo esc_attr($class); ?>">
        <label for="<?php echo esc_attr($name); ?>"><?php echo esc_html($label); ?></label>
        <input
            id="<?php echo esc_attr($name); ?>"
            name="<?php echo esc_attr($name); ?>"
            type="text"
            value="<?php echo esc_attr($value); ?>"
            <?php echo $readonly ? 'readonly' : ''; ?>
        />
    </p>
    <?php
}

function ggsa_render_select_admin_field(string $label, string $name, string $value, array $options): void
{
    ?>
    <p class="ggsa-learning-plan-field">
        <label for="<?php echo esc_attr($name); ?>"><?php echo esc_html($label); ?></label>
        <select id="<?php echo esc_attr($name); ?>" name="<?php echo esc_attr($name); ?>">
            <?php foreach ($options as $option) : ?>
                <option value="<?php echo esc_attr($option); ?>" <?php selected($value, $option); ?>>
                    <?php echo esc_html($option); ?>
                </option>
            <?php endforeach; ?>
        </select>
    </p>
    <?php
}

function ggsa_save_learning_plan_admin_fields(int $post_id): void
{
    if (
        !isset($_POST['ggsa_learning_plan_nonce'])
        || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['ggsa_learning_plan_nonce'])), 'ggsa_save_learning_plan_details')
        || (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE)
        || !current_user_can('edit_post', $post_id)
    ) {
        return;
    }

    $school = sanitize_text_field(wp_unslash($_POST['ggsa_school_name'] ?? ''));
    $pathway = sanitize_text_field(wp_unslash($_POST['ggsa_pathway_name'] ?? ''));
    $status = ggsa_sanitize_learning_plan_status((string) wp_unslash($_POST['ggsa_workflow_status'] ?? 'Learning plan draft'));
    $support = ggsa_sanitize_support_level((string) wp_unslash($_POST['ggsa_support_level'] ?? 'Medium'));

    update_post_meta($post_id, 'ggsa_school_name', $school);
    update_post_meta($post_id, 'ggsa_pathway_name', $pathway);
    update_post_meta($post_id, 'ggsa_contact_name', sanitize_text_field(wp_unslash($_POST['ggsa_contact_name'] ?? '')));
    update_post_meta($post_id, 'ggsa_contact_email', sanitize_email(wp_unslash($_POST['ggsa_contact_email'] ?? '')));
    update_post_meta($post_id, 'ggsa_pathway_profile', sanitize_text_field(wp_unslash($_POST['ggsa_pathway_profile'] ?? '')));
    update_post_meta($post_id, 'ggsa_integration_type', sanitize_text_field(wp_unslash($_POST['ggsa_integration_type'] ?? '')));
    update_post_meta($post_id, 'ggsa_target_release_date', sanitize_text_field(wp_unslash($_POST['ggsa_target_release_date'] ?? '')));
    update_post_meta($post_id, 'ggsa_workflow_status', $status);
    update_post_meta($post_id, 'ggsa_support_level', $support);
    ggsa_update_learning_plan_payload($post_id, [
        'organisationName' => $school,
        'productName' => $pathway,
        'contactName' => sanitize_text_field(wp_unslash($_POST['ggsa_contact_name'] ?? '')),
        'contactEmail' => sanitize_email(wp_unslash($_POST['ggsa_contact_email'] ?? '')),
        'pathwayProfile' => sanitize_text_field(wp_unslash($_POST['ggsa_pathway_profile'] ?? '')),
        'integrationType' => sanitize_text_field(wp_unslash($_POST['ggsa_integration_type'] ?? '')),
        'targetReleaseDate' => sanitize_text_field(wp_unslash($_POST['ggsa_target_release_date'] ?? '')),
        'workflowStatus' => $status,
        'riskLevel' => $support,
    ]);

    if ($school !== '' && $pathway !== '') {
        remove_action('save_post_' . GGSA_TEACHER_PATHWAY_POST_TYPE, 'ggsa_save_learning_plan_admin_fields');
        wp_update_post([
            'ID' => $post_id,
            'post_title' => sprintf('%s - %s', $school, $pathway),
        ]);
        add_action('save_post_' . GGSA_TEACHER_PATHWAY_POST_TYPE, 'ggsa_save_learning_plan_admin_fields');
    }
}

function ggsa_learning_plan_admin_columns(array $columns): array
{
    return [
        'cb' => $columns['cb'] ?? '',
        'title' => 'Learning plan',
        'ggsa_reference_number' => 'Reference',
        'ggsa_school_name' => 'School',
        'ggsa_workflow_status' => 'Workflow status',
        'ggsa_support_level' => 'Support',
        'date' => $columns['date'] ?? 'Date',
    ];
}

function ggsa_render_learning_plan_admin_column(string $column, int $post_id): void
{
    $meta_key = match ($column) {
        'ggsa_reference_number' => 'ggsa_reference_number',
        'ggsa_school_name' => 'ggsa_school_name',
        'ggsa_workflow_status' => 'ggsa_workflow_status',
        'ggsa_support_level' => 'ggsa_support_level',
        default => '',
    };

    if ($meta_key !== '') {
        echo esc_html((string) get_post_meta($post_id, $meta_key, true));
    }
}

function ggsa_sanitize_learning_plan_status(string $status): string
{
    return in_array($status, GGSA_TEACHER_PATHWAY_STATUSES, true) ? $status : 'Learning plan draft';
}

function ggsa_sanitize_support_level(string $support): string
{
    return in_array($support, GGSA_TEACHER_PATHWAY_SUPPORT_LEVELS, true) ? $support : 'Medium';
}

function ggsa_update_learning_plan_payload(int $post_id, array $updates): void
{
    $payload = json_decode((string) get_post_meta($post_id, 'ggsa_learning_plan_payload', true), true);

    if (!is_array($payload)) {
        $payload = [];
    }

    update_post_meta($post_id, 'ggsa_learning_plan_payload', wp_json_encode([
        ...$payload,
        ...$updates,
    ]));
}
