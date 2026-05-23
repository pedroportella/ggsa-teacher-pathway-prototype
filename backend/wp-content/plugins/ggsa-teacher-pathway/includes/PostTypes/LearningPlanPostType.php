<?php

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

class GGSA_Teacher_Pathway_Learning_Plan_Post_Type
{
    public function __construct(private GGSA_Teacher_Pathway_Meta_Repository $repository)
    {
    }

    public function register_hooks(): void
    {
        add_action('init', [$this, 'register']);
        add_action('add_meta_boxes_' . GGSA_TEACHER_PATHWAY_POST_TYPE, [$this, 'add_meta_boxes']);
        add_action('save_post_' . GGSA_TEACHER_PATHWAY_POST_TYPE, [$this, 'save_admin_fields']);
        add_filter('manage_' . GGSA_TEACHER_PATHWAY_POST_TYPE . '_posts_columns', [$this, 'admin_columns']);
        add_action('manage_' . GGSA_TEACHER_PATHWAY_POST_TYPE . '_posts_custom_column', [$this, 'render_admin_column'], 10, 2);
    }

    public function register(): void
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

    public function add_meta_boxes(WP_Post $post): void
    {
        add_meta_box(
            'ggsa-learning-plan-details',
            'Teacher pathway details',
            [$this, 'render_details_meta_box'],
            GGSA_TEACHER_PATHWAY_POST_TYPE,
            'normal',
            'high'
        );
    }

    public function render_details_meta_box(WP_Post $post): void
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
            <?php $this->render_text_admin_field('Reference number', 'ggsa_reference_number', $fields['reference'], true); ?>
            <?php $this->render_select_admin_field('Workflow status', 'ggsa_workflow_status', $fields['workflow_status'], GGSA_TEACHER_PATHWAY_STATUSES); ?>
            <?php $this->render_text_admin_field('School / organisation', 'ggsa_school_name', $fields['school']); ?>
            <?php $this->render_text_admin_field('Teacher pathway', 'ggsa_pathway_name', $fields['pathway']); ?>
            <?php $this->render_text_admin_field('Contact name', 'ggsa_contact_name', $fields['contact_name']); ?>
            <?php $this->render_text_admin_field('Contact email', 'ggsa_contact_email', $fields['contact_email']); ?>
            <?php $this->render_select_admin_field('Support level', 'ggsa_support_level', $fields['support_level'], GGSA_TEACHER_PATHWAY_SUPPORT_LEVELS); ?>
            <?php $this->render_text_admin_field('Target date', 'ggsa_target_release_date', $fields['target_release_date']); ?>
            <?php $this->render_text_admin_field('Pathway profile', 'ggsa_pathway_profile', $fields['pathway_profile'], false, true); ?>
            <?php $this->render_text_admin_field('Integration notes', 'ggsa_integration_type', $fields['integration_type'], false, true); ?>
        </div>
        <?php
    }

    public function save_admin_fields(int $post_id): void
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
        $status = $this->repository->sanitize_learning_plan_status((string) wp_unslash($_POST['ggsa_workflow_status'] ?? 'Learning plan draft'));
        $support = $this->repository->sanitize_support_level((string) wp_unslash($_POST['ggsa_support_level'] ?? 'Medium'));

        update_post_meta($post_id, 'ggsa_school_name', $school);
        update_post_meta($post_id, 'ggsa_pathway_name', $pathway);
        update_post_meta($post_id, 'ggsa_contact_name', sanitize_text_field(wp_unslash($_POST['ggsa_contact_name'] ?? '')));
        update_post_meta($post_id, 'ggsa_contact_email', sanitize_email(wp_unslash($_POST['ggsa_contact_email'] ?? '')));
        update_post_meta($post_id, 'ggsa_pathway_profile', sanitize_text_field(wp_unslash($_POST['ggsa_pathway_profile'] ?? '')));
        update_post_meta($post_id, 'ggsa_integration_type', sanitize_text_field(wp_unslash($_POST['ggsa_integration_type'] ?? '')));
        update_post_meta($post_id, 'ggsa_target_release_date', sanitize_text_field(wp_unslash($_POST['ggsa_target_release_date'] ?? '')));
        update_post_meta($post_id, 'ggsa_workflow_status', $status);
        update_post_meta($post_id, 'ggsa_support_level', $support);
        $this->repository->update_learning_plan_payload($post_id, [
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
            remove_action('save_post_' . GGSA_TEACHER_PATHWAY_POST_TYPE, [$this, 'save_admin_fields']);
            wp_update_post([
                'ID' => $post_id,
                'post_title' => sprintf('%s - %s', $school, $pathway),
            ]);
            add_action('save_post_' . GGSA_TEACHER_PATHWAY_POST_TYPE, [$this, 'save_admin_fields']);
        }
    }

    public function admin_columns(array $columns): array
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

    public function render_admin_column(string $column, int $post_id): void
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

    private function render_text_admin_field(
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

    private function render_select_admin_field(string $label, string $name, string $value, array $options): void
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
}
