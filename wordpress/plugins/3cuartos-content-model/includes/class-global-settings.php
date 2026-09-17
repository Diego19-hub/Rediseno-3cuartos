<?php

declare(strict_types=1);

namespace ThreeCuartos\ContentModel;

final class GlobalSettings {
	public const OPTION_NAME = '3cuartos_global_settings';

	public static function register(): void {
		register_setting(
			'3cuartos_global_settings',
			self::OPTION_NAME,
			array(
				'type'              => 'object',
				'default'           => array(),
				'sanitize_callback' => array( self::class, 'sanitize' ),
				'show_in_rest'      => false,
			)
		);
	}

	public static function sanitize( $settings ): array {
		$settings = is_array( $settings ) ? $settings : array();
		return array(
			'brandName'    => sanitize_text_field( $settings['brandName'] ?? '' ),
			'contact'      => array(
				'publicEmail' => sanitize_email( $settings['contact']['publicEmail'] ?? '' ),
				'phone'       => sanitize_text_field( $settings['contact']['phone'] ?? '' ),
			),
			'whatsappUrl'  => esc_url_raw( $settings['whatsappUrl'] ?? '' ),
			'bookingUrl'   => esc_url_raw( $settings['bookingUrl'] ?? '' ),
			'socialLinks'  => sanitize_profile_links( $settings['socialLinks'] ?? array() ),
			'legalLinks'   => sanitize_profile_links( $settings['legalLinks'] ?? array() ),
			'globalCta'    => sanitize_cta( $settings['globalCta'] ?? array() ),
			'defaultSeo'   => sanitize_seo( $settings['defaultSeo'] ?? array() ),
		);
	}

	public static function public_value(): array {
		return self::sanitize( get_option( self::OPTION_NAME, array() ) );
	}
}
