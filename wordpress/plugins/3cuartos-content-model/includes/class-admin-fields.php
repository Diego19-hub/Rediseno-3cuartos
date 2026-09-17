<?php

declare(strict_types=1);

namespace ThreeCuartos\ContentModel;

use WP_Post;

final class AdminFields {
	private const NONCE = '3cuartos_editorial_fields';

	public static function register(): void {
		add_action( 'add_meta_boxes', array( self::class, 'add_meta_boxes' ) );
		add_action( 'save_post', array( self::class, 'save_post' ) );
		add_action( 'admin_menu', array( self::class, 'add_settings_page' ) );
		add_action( 'admin_init', array( self::class, 'save_settings' ) );
	}

	public static function add_meta_boxes(): void {
		foreach ( array( '3cuartos_service', '3cuartos_case_study', '3cuartos_testimonial', '3cuartos_team_member' ) as $post_type ) {
			add_meta_box( '3cuartos-editorial', 'Contenido 3cuartos', array( self::class, 'render_meta_box' ), $post_type, 'normal', 'high' );
		}
	}

	public static function render_meta_box( WP_Post $post ): void {
		wp_nonce_field( self::NONCE, self::NONCE );
		$type = $post->post_type;
		if ( '3cuartos_service' === $type ) {
			self::textarea( '3cuartos_summary', 'Resumen o descripción', $post->ID );
			self::input( '3cuartos_visual_identifier', 'Identificador visual', $post->ID );
			self::textarea( '3cuartos_capabilities', 'Capacidades (una por línea)', $post->ID, true );
			self::cta( $post->ID ); self::input( '3cuartos_sort_order', 'Orden', $post->ID, 'number' );
		}
		if ( '3cuartos_case_study' === $type ) {
			self::input( '3cuartos_client_name', 'Cliente (provisional si aplica)', $post->ID );
			self::textarea( '3cuartos_challenge', 'Problema', $post->ID ); self::textarea( '3cuartos_solution', 'Solución', $post->ID );
			self::textarea( '3cuartos_service_ids', 'IDs de servicios relacionados (uno por línea)', $post->ID, true );
			self::textarea( '3cuartos_metrics', 'Métricas: etiqueta | valor | contexto (una por línea)', $post->ID, true ); self::cta( $post->ID );
		}
		if ( '3cuartos_testimonial' === $type ) {
			self::input( '3cuartos_person_name', 'Nombre', $post->ID ); self::input( '3cuartos_job_title', 'Puesto', $post->ID ); self::input( '3cuartos_company', 'Empresa', $post->ID ); self::input( '3cuartos_sort_order', 'Orden', $post->ID, 'number' );
		}
		if ( '3cuartos_team_member' === $type ) {
			self::input( '3cuartos_role', 'Cargo', $post->ID ); self::textarea( '3cuartos_profile_links', 'Redes: etiqueta | URL (una por línea)', $post->ID, true ); self::input( '3cuartos_sort_order', 'Orden', $post->ID, 'number' );
		}
		self::checkbox( '3cuartos_is_provisional', 'Contenido provisional', $post->ID );
		printf( '<p class="description">La imagen destacada se administra con la herramienta nativa de WordPress.</p>' );
	}

	public static function save_post( int $post_id ): void {
		if ( ! isset( $_POST[ self::NONCE ] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST[ self::NONCE ] ) ), self::NONCE ) || wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) || ! current_user_can( 'edit_post', $post_id ) ) return;
		$post_type = get_post_type( $post_id ); if ( ! in_array( $post_type, array( '3cuartos_service', '3cuartos_case_study', '3cuartos_testimonial', '3cuartos_team_member' ), true ) ) return;
		$fields = array( '3cuartos_summary', '3cuartos_visual_identifier', '3cuartos_client_name', '3cuartos_challenge', '3cuartos_solution', '3cuartos_person_name', '3cuartos_job_title', '3cuartos_company', '3cuartos_role' );
		foreach ( $fields as $key ) if ( isset( $_POST[ $key ] ) ) update_post_meta( $post_id, $key, wp_unslash( $_POST[ $key ] ) );
		foreach ( array( '3cuartos_sort_order' ) as $key ) if ( isset( $_POST[ $key ] ) ) update_post_meta( $post_id, $key, absint( $_POST[ $key ] ) );
		if ( isset( $_POST['3cuartos_capabilities'] ) ) update_post_meta( $post_id, '3cuartos_capabilities', self::lines( $_POST['3cuartos_capabilities'] ) );
		if ( isset( $_POST['3cuartos_service_ids'] ) ) update_post_meta( $post_id, '3cuartos_service_ids', array_map( 'absint', self::lines( $_POST['3cuartos_service_ids'] ) ) );
		if ( isset( $_POST['3cuartos_metrics'] ) ) update_post_meta( $post_id, '3cuartos_metrics', self::metrics( $_POST['3cuartos_metrics'] ) );
		if ( isset( $_POST['3cuartos_profile_links'] ) ) update_post_meta( $post_id, '3cuartos_profile_links', self::links( $_POST['3cuartos_profile_links'] ) );
		if ( isset( $_POST['3cuartos_cta_label'], $_POST['3cuartos_cta_url'] ) ) update_post_meta( $post_id, '3cuartos_cta', array( 'label' => sanitize_text_field( wp_unslash( $_POST['3cuartos_cta_label'] ) ), 'url' => esc_url_raw( wp_unslash( $_POST['3cuartos_cta_url'] ) ) ) );
		update_post_meta( $post_id, '3cuartos_is_provisional', isset( $_POST['3cuartos_is_provisional'] ) );
	}

	public static function add_settings_page(): void { add_options_page( 'Configuración 3cuartos', '3cuartos', 'manage_options', '3cuartos-settings', array( self::class, 'settings_page' ) ); }
	public static function settings_page(): void {
		if ( ! current_user_can( 'manage_options' ) ) return; $s = GlobalSettings::public_value();
		?><div class="wrap"><h1>Configuración global 3cuartos</h1><form method="post"><?php wp_nonce_field( '3cuartos_settings', '3cuartos_settings_nonce' ); ?>
		<table class="form-table"><tr><th>Marca</th><td><input class="regular-text" name="brandName" value="<?php echo esc_attr( $s['brandName'] ); ?>"></td></tr><tr><th>Email público</th><td><input class="regular-text" type="email" name="publicEmail" value="<?php echo esc_attr( $s['contact']['publicEmail'] ); ?>"></td></tr><tr><th>Teléfono</th><td><input class="regular-text" name="phone" value="<?php echo esc_attr( $s['contact']['phone'] ); ?>"></td></tr><tr><th>CTA global</th><td><input name="ctaLabel" placeholder="Etiqueta" value="<?php echo esc_attr( $s['globalCta']['label'] ); ?>"> <input class="regular-text" name="ctaUrl" placeholder="URL" value="<?php echo esc_attr( $s['globalCta']['url'] ); ?>"></td></tr></table><?php submit_button( 'Guardar configuración' ); ?></form></div><?php
	}
	public static function save_settings(): void {
		if ( ! isset( $_POST['3cuartos_settings_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['3cuartos_settings_nonce'] ) ), '3cuartos_settings' ) || ! current_user_can( 'manage_options' ) ) return;
		$settings = GlobalSettings::public_value(); $settings['brandName'] = wp_unslash( $_POST['brandName'] ?? '' ); $settings['contact'] = array( 'publicEmail' => wp_unslash( $_POST['publicEmail'] ?? '' ), 'phone' => wp_unslash( $_POST['phone'] ?? '' ) ); $settings['globalCta'] = array( 'label' => wp_unslash( $_POST['ctaLabel'] ?? '' ), 'url' => wp_unslash( $_POST['ctaUrl'] ?? '' ) );
		update_option( GlobalSettings::OPTION_NAME, GlobalSettings::sanitize( $settings ) );
	}
	private static function input( string $key, string $label, int $post_id, string $type = 'text' ): void { printf( '<p><label><strong>%s</strong><br><input class="widefat" type="%s" name="%s" value="%s"></label></p>', esc_html( $label ), esc_attr( $type ), esc_attr( $key ), esc_attr( (string) get_post_meta( $post_id, $key, true ) ) ); }
	private static function textarea( string $key, string $label, int $post_id, bool $array = false ): void { $v = get_post_meta( $post_id, $key, true ); if ( $array && is_array( $v ) ) $v = implode( "\n", array_map( static fn( $i ) => is_array( $i ) ? implode( ' | ', $i ) : (string) $i, $v ) ); printf( '<p><label><strong>%s</strong><br><textarea class="widefat" rows="4" name="%s">%s</textarea></label></p>', esc_html( $label ), esc_attr( $key ), esc_textarea( (string) $v ) ); }
	private static function checkbox( string $key, string $label, int $post_id ): void { printf( '<p><label><input type="checkbox" name="%s" value="1" %s> %s</label></p>', esc_attr( $key ), checked( (bool) get_post_meta( $post_id, $key, true ), true, false ), esc_html( $label ) ); }
	private static function cta( int $post_id ): void { $v = get_post_meta( $post_id, '3cuartos_cta', true ); $v = is_array( $v ) ? $v : array(); printf( '<p><strong>CTA</strong><br><input name="3cuartos_cta_label" placeholder="Etiqueta" value="%s"> <input class="regular-text" name="3cuartos_cta_url" placeholder="URL" value="%s"></p>', esc_attr( $v['label'] ?? '' ), esc_attr( $v['url'] ?? '' ) ); }
	private static function lines( $value ): array { return array_values( array_filter( array_map( 'sanitize_text_field', preg_split( '/\r\n|\r|\n/', (string) wp_unslash( $value ) ) ) ) ); }
	private static function metrics( $value ): array { return array_values( array_filter( array_map( static function( $line ) { $p = array_map( 'trim', explode( '|', $line ) ); return array( 'label' => sanitize_text_field( $p[0] ?? '' ), 'value' => sanitize_text_field( $p[1] ?? '' ), 'context' => sanitize_text_field( $p[2] ?? '' ) ); }, self::lines( $value ) ), static fn( $m ) => '' !== $m['label'] ) ); }
	private static function links( $value ): array { return array_values( array_filter( array_map( static function( $line ) { $p = array_map( 'trim', explode( '|', $line, 2 ) ); return array( 'label' => sanitize_text_field( $p[0] ?? '' ), 'url' => esc_url_raw( $p[1] ?? '' ) ); }, self::lines( $value ) ), static fn( $l ) => '' !== $l['label'] ) ); }
}
