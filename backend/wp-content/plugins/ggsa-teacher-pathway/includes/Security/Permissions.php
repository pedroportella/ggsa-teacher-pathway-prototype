<?php

declare(strict_types=1);

if (!defined('ABSPATH')) {
    exit;
}

class GGSA_Teacher_Pathway_Permissions
{
    public function can_access_api(WP_REST_Request $request): bool
    {
        if (current_user_can('edit_posts')) {
            return true;
        }

        $expected_token = $this->api_token();
        $request_token = (string) $request->get_header('x-ggsa-portal-token');

        return $expected_token !== '' && hash_equals($expected_token, $request_token);
    }

    private function api_token(): string
    {
        if (defined('GGSA_TEACHER_PATHWAY_API_TOKEN')) {
            return (string) constant('GGSA_TEACHER_PATHWAY_API_TOKEN');
        }

        return (string) getenv('GGSA_TEACHER_PATHWAY_API_TOKEN');
    }
}
