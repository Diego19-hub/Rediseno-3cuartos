<?php

declare(strict_types=1);

namespace ThreeCuartos\ContentModel;

final class MetaFields {
	public static function register(): void {
		self::service_fields();
		self::case_study_fields();
		self::testimonial_fields();
		self::team_member_fields();
		self::post_fields();
	}

	private static function common_args( string $type, $default, callable $sanitize ): array {
		return array(
			'type'              => $type,
			'single'            => true,
			'default'           => $default,
			'sanitize_callback' => $sanitize,
			'auth_callback'     => array( Permissions::class, 'can_edit_meta' ),
			'show_in_rest'      => array( 'schema' => self::schema( $type, $default ) ),
		);
	}

	private static function schema( string $type, $default ): array {
		$schema = array( 'type' => $type, 'default' => $default );
		if ( 'array' === $type ) {
			$schema['items'] = array();
		}
		if ( 'object' === $type ) {
			$schema['additionalProperties'] = true;
		}
		return $schema;
	}

	private static function add( string $post_type, string $key, string $type, $default, callable $sanitize ): void {
		register_post_meta( $post_type, $key, self::common_args( $type, $default, $sanitize ) );
	}

	private static function service_fields(): void {
		$type = '3cuartos_service';
		self::add( $type, '3cuartos_summary', 'string', '', 'sanitize_textarea_field' );
		// A short editor-selected identifier is the approved non-media fallback for service cards.
		self::add( $type, '3cuartos_visual_identifier', 'string', '', 'sanitize_text_field' );
		self::add( $type, '3cuartos_capabilities', 'array', array(), __NAMESPACE__ . '\\sanitize_string_list' );
		self::add( $type, '3cuartos_cta', 'object', array(), __NAMESPACE__ . '\\sanitize_cta' );
		self::add( $type, '3cuartos_sort_order', 'integer', 0, 'absint' );
		self::add( $type, '3cuartos_seo', 'object', array(), __NAMESPACE__ . '\\sanitize_seo' );
		self::add( $type, '3cuartos_is_provisional', 'boolean', true, __NAMESPACE__ . '\\sanitize_boolean' );
	}

	private static function case_study_fields(): void {
		$type = '3cuartos_case_study';
		self::add( $type, '3cuartos_client_name', 'string', '', 'sanitize_text_field' );
		self::add( $type, '3cuartos_challenge', 'string', '', 'wp_kses_post' );
		self::add( $type, '3cuartos_objectives', 'array', array(), __NAMESPACE__ . '\\sanitize_string_list' );
		self::add( $type, '3cuartos_solution', 'string', '', 'wp_kses_post' );
		self::add( $type, '3cuartos_service_ids', 'array', array(), __NAMESPACE__ . '\\sanitize_id_list' );
		self::add( $type, '3cuartos_results', 'array', array(), __NAMESPACE__ . '\\sanitize_string_list' );
		self::add( $type, '3cuartos_metrics', 'array', array(), __NAMESPACE__ . '\\sanitize_metrics' );
		self::add( $type, '3cuartos_gallery_ids', 'array', array(), __NAMESPACE__ . '\\sanitize_id_list' );
		self::add( $type, '3cuartos_testimonial_id', 'integer', 0, __NAMESPACE__ . '\\sanitize_id' );
		self::add( $type, '3cuartos_cta', 'object', array(), __NAMESPACE__ . '\\sanitize_cta' );
		self::add( $type, '3cuartos_seo', 'object', array(), __NAMESPACE__ . '\\sanitize_seo' );
		self::add( $type, '3cuartos_is_provisional', 'boolean', true, __NAMESPACE__ . '\\sanitize_boolean' );
	}

	private static function testimonial_fields(): void {
		$type = '3cuartos_testimonial';
		self::add( $type, '3cuartos_person_name', 'string', '', 'sanitize_text_field' );
		self::add( $type, '3cuartos_job_title', 'string', '', 'sanitize_text_field' );
		self::add( $type, '3cuartos_company', 'string', '', 'sanitize_text_field' );
		self::add( $type, '3cuartos_case_study_id', 'integer', 0, __NAMESPACE__ . '\\sanitize_id' );
		self::add( $type, '3cuartos_sort_order', 'integer', 0, 'absint' );
		self::add( $type, '3cuartos_is_provisional', 'boolean', true, __NAMESPACE__ . '\\sanitize_boolean' );
	}

	private static function team_member_fields(): void {
		$type = '3cuartos_team_member';
		self::add( $type, '3cuartos_role', 'string', '', 'sanitize_text_field' );
		self::add( $type, '3cuartos_profile_links', 'array', array(), __NAMESPACE__ . '\\sanitize_profile_links' );
		self::add( $type, '3cuartos_sort_order', 'integer', 0, 'absint' );
		self::add( $type, '3cuartos_is_provisional', 'boolean', true, __NAMESPACE__ . '\\sanitize_boolean' );
	}

	private static function post_fields(): void {
		self::add( 'post', '3cuartos_featured_excerpt', 'string', '', 'sanitize_textarea_field' );
		self::add( 'post', '3cuartos_cta', 'object', array(), __NAMESPACE__ . '\\sanitize_cta' );
		self::add( 'post', '3cuartos_reading_time', 'integer', 0, 'absint' );
	}
}
