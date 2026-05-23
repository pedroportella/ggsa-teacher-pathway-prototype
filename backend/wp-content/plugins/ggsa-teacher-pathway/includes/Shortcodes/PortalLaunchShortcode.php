<?php
/**
 * Divi-friendly shortcode for launching or embedding the Teacher Pathway portal.
 */

declare(strict_types=1);

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class GGSA_Teacher_Pathway_Portal_Launch_Shortcode {

	public function register_hooks(): void {
		add_shortcode( 'ggsa_teacher_pathway_portal', [ $this, 'render' ] );
	}

	public function render( array|string $attributes = [] ): string {
		$attributes = shortcode_atts(
			[
				'cta'     => 'Open Teacher Pathway portal',
				'height'  => '760',
				'mode'    => 'link',
				'summary' => 'Open the Teacher Pathway portal to review enrolment-generated learning plans, pathway readiness and evidence portfolio progress.',
				'title'   => 'Teacher Pathway portal',
				'url'     => $this->default_portal_url(),
			],
			is_array( $attributes ) ? $attributes : [],
			'ggsa_teacher_pathway_portal'
		);

		$mode = sanitize_key( (string) $attributes['mode'] );

		if ( $mode === 'embed' ) {
			return $this->render_embed( $attributes );
		}

		return $this->render_link_card( $attributes );
	}

	private function default_portal_url(): string {
		$environment_url = getenv( 'GGSA_TEACHER_PATHWAY_PORTAL_URL' );
		$portal_url      = is_string( $environment_url ) && $environment_url !== ''
			? $environment_url
			: home_url( '/teacher-pathway/' );

		/**
		 * Allows production WordPress to point the shortcode at a separate Next.js
		 * app domain without hard-coding environment details into Divi content.
		 */
		return esc_url_raw(
			(string) apply_filters( 'ggsa_teacher_pathway_portal_url', $portal_url )
		);
	}

	private function render_link_card( array $attributes ): string {
		$title_id = wp_unique_id( 'ggsa-teacher-pathway-portal-title-' );

		ob_start();
		?>
		<section class="ggsa-teacher-pathway-portal-card" aria-labelledby="<?php echo esc_attr( $title_id ); ?>">
			<h2 id="<?php echo esc_attr( $title_id ); ?>"><?php echo esc_html( (string) $attributes['title'] ); ?></h2>
			<p><?php echo esc_html( (string) $attributes['summary'] ); ?></p>
			<p>
				<a class="ggsa-teacher-pathway-portal-card__button" href="<?php echo esc_url( (string) $attributes['url'] ); ?>">
					<?php echo esc_html( (string) $attributes['cta'] ); ?>
				</a>
			</p>
		</section>
		<?php
		return (string) ob_get_clean();
	}

	private function render_embed( array $attributes ): string {
		$height = max( 320, min( 1200, absint( $attributes['height'] ) ) );

		ob_start();
		?>
		<div class="ggsa-teacher-pathway-portal-embed">
			<iframe
				allow="clipboard-write"
				loading="lazy"
				referrerpolicy="strict-origin-when-cross-origin"
				sandbox="allow-forms allow-same-origin allow-scripts allow-popups"
				src="<?php echo esc_url( (string) $attributes['url'] ); ?>"
				style="border: 0; min-height: <?php echo esc_attr( (string) $height ); ?>px; width: 100%;"
				title="<?php echo esc_attr( (string) $attributes['title'] ); ?>"
			></iframe>
		</div>
		<?php
		return (string) ob_get_clean();
	}
}
