<?php

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

class GGSA_Teacher_Pathway_Meta_Repository
{
    public function learning_plan_to_register_item(WP_Post $post): array
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

    public function update_learning_plan_meta(int $post_id, array $record): void
    {
        update_post_meta($post_id, 'ggsa_learning_plan_payload', wp_json_encode($record));
        update_post_meta($post_id, 'ggsa_reference_number', sanitize_text_field((string) ($record['referenceNumber'] ?? '')));
        update_post_meta($post_id, 'ggsa_school_name', sanitize_text_field((string) ($record['organisationName'] ?? '')));
        update_post_meta($post_id, 'ggsa_pathway_name', sanitize_text_field((string) ($record['productName'] ?? '')));
        update_post_meta($post_id, 'ggsa_contact_name', sanitize_text_field((string) ($record['contactName'] ?? '')));
        update_post_meta($post_id, 'ggsa_contact_email', sanitize_email((string) ($record['contactEmail'] ?? '')));
        update_post_meta($post_id, 'ggsa_pathway_profile', sanitize_text_field((string) ($record['pathwayProfile'] ?? '')));
        update_post_meta($post_id, 'ggsa_integration_type', sanitize_text_field((string) ($record['integrationType'] ?? '')));
        update_post_meta($post_id, 'ggsa_target_release_date', sanitize_text_field((string) ($record['targetReleaseDate'] ?? '')));
        update_post_meta($post_id, 'ggsa_workflow_status', $this->sanitize_learning_plan_status((string) ($record['workflowStatus'] ?? 'Enrolled')));
        update_post_meta($post_id, 'ggsa_support_level', $this->sanitize_support_level((string) ($record['riskLevel'] ?? 'Medium')));
    }

    public function update_learning_plan_payload(int $post_id, array $updates): void
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

    public function find_learning_plan_post_id(array $payload): int
    {
        $id = absint($payload['id'] ?? 0);

        if ($id > 0 && get_post_type($id) === GGSA_TEACHER_PATHWAY_POST_TYPE) {
            return $id;
        }

        $reference = sanitize_text_field((string) ($payload['referenceNumber'] ?? ''));

        if ($reference === '') {
            return 0;
        }

        $posts = get_posts([
            'post_type' => GGSA_TEACHER_PATHWAY_POST_TYPE,
            'post_status' => 'any',
            'meta_key' => 'ggsa_reference_number',
            'meta_value' => $reference,
            'fields' => 'ids',
            'posts_per_page' => 1,
        ]);

        return (int) ($posts[0] ?? 0);
    }

    public function sanitize_learning_plan_status(string $status): string
    {
        return in_array($status, GGSA_TEACHER_PATHWAY_STATUSES, true) ? $status : 'Learning plan draft';
    }

    public function sanitize_support_level(string $support): string
    {
        return in_array($support, GGSA_TEACHER_PATHWAY_SUPPORT_LEVELS, true) ? $support : 'Medium';
    }

    public function sanitize_control_check(mixed $check): array
    {
        if (!is_array($check)) {
            $check = [];
        }

        $status = sanitize_text_field((string) ($check['status'] ?? 'Not started'));

        return [
            'id' => sanitize_key((string) ($check['id'] ?? '')),
            'label' => sanitize_text_field((string) ($check['label'] ?? '')),
            'category' => sanitize_text_field((string) ($check['category'] ?? '')),
            'status' => in_array($status, GGSA_TEACHER_PATHWAY_CONTROL_STATUSES, true) ? $status : 'Not started',
        ];
    }
}
