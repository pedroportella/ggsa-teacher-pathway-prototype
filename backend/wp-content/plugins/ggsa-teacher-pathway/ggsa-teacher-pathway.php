<?php
/**
 * Plugin Name: GGSA Teacher Pathway Headless API
 * Description: Adapter-ready headless WordPress API for Teacher Learning Pathways and evidence portfolio workflow records.
 * Version: 0.1.0
 * Author: Pedro Portella
 */

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

const GGSA_TEACHER_PATHWAY_POST_TYPE        = 'ggsa_learning_plan';
const GGSA_TEACHER_PATHWAY_STATUSES         = [
	'Learning plan draft',
	'Enrolled',
	'In progress',
	'Coach action required',
	'RPL evidence ready',
];
const GGSA_TEACHER_PATHWAY_SUPPORT_LEVELS   = [ 'Low', 'Medium', 'High' ];
const GGSA_TEACHER_PATHWAY_CONTROL_STATUSES = [ 'Complete', 'Needs evidence', 'Not started' ];

require_once __DIR__ . '/includes/Support/MetaRepository.php';
require_once __DIR__ . '/includes/Security/Permissions.php';
require_once __DIR__ . '/includes/Integrations/MembershipUserGateway.php';
require_once __DIR__ . '/includes/Integrations/WooCommerceEntitlementGateway.php';
require_once __DIR__ . '/includes/Integrations/LearnDashGateway.php';
require_once __DIR__ . '/includes/Domain/TeacherLearningPlanGenerator.php';
require_once __DIR__ . '/includes/Domain/EvidenceUploadPolicy.php';
require_once __DIR__ . '/includes/PostTypes/LearningPlanPostType.php';
require_once __DIR__ . '/includes/Shortcodes/PortalLaunchShortcode.php';
require_once __DIR__ . '/includes/Rest/TeacherPathwayController.php';
require_once __DIR__ . '/includes/Plugin.php';

function ggsa_teacher_pathway_plugin(): GGSA_Teacher_Pathway_Plugin {
	static $plugin = null;

	if ( ! $plugin instanceof GGSA_Teacher_Pathway_Plugin ) {
		$plugin = new GGSA_Teacher_Pathway_Plugin();
	}

	return $plugin;
}

function ggsa_seed_learning_plan_register( bool $refresh = false ): array {
	return ggsa_teacher_pathway_plugin()->seed_learning_plan_register( $refresh );
}

ggsa_teacher_pathway_plugin()->register_hooks();
