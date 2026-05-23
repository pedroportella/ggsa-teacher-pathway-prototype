<?php

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class GGSA_Teacher_Pathway_WooCommerce_Entitlement_Gateway {

	public function resolve_teacher_entitlement( array $teacher_profile, array $payload ): array {
		$product_name = sanitize_text_field( (string) ( $payload['productName'] ?? 'Teacher Learning Plan' ) );

		if ( $this->has_woocommerce() && (string) ( $teacher_profile['userId'] ?? '' ) !== '' ) {
			return [
				'productName'    => $product_name,
				'source'         => 'woocommerce',
				'status'         => 'adapter-ready',
				'accessStartsAt' => gmdate( 'Y-m-d' ),
				'accessEndsAt'   => null,
			];
		}

		return [
			'productName'    => $product_name,
			'source'         => 'local-prototype',
			'status'         => 'active',
			'accessStartsAt' => sanitize_text_field( (string) ( $payload['targetReleaseDate'] ?? gmdate( 'Y-m-d' ) ) ),
			'accessEndsAt'   => null,
		];
	}

	public function has_woocommerce(): bool {
		return class_exists( 'WooCommerce' ) || function_exists( 'wc_get_product' );
	}
}
