<?php

declare(strict_types=1);

namespace ThreeCuartos\ContentModel;

use WP_Post;

final class AdminFields {
	private const NONCE = '3cuartos_editorial_fields';

	public static function register(): void {
		add_action( 'add_meta_boxes', array( self::class, 'add_meta_boxes' ) );
		add_action( 'save_post', array( self::class, 'save_post' ) );
		add_action( 'admin_enqueue_scripts', array( self::class, 'enqueue_admin_assets' ) );
		add_action( 'admin_menu', array( self::class, 'add_settings_page' ) );
		add_action( 'admin_init', array( self::class, 'save_settings' ) );
	}

	public static function enqueue_admin_assets( string $hook ): void {
		if ( ! in_array( $hook, array( 'post.php', 'post-new.php' ), true ) ) return;
		$screen = get_current_screen();
		if ( ! $screen || '3cuartos_case_study' !== $screen->post_type ) return;

		wp_enqueue_media();
		wp_add_inline_script( 'media-editor', <<<'JS'
(function ($) {
  $(function () {
    var field = $('#threecuartos-gallery-ids');
    var list = $('#threecuartos-gallery-preview');
    var frame;
    if (!field.length || !list.length) return;

    function syncIds() {
      var ids = [];
      list.find('[data-attachment-id]').each(function () { ids.push($(this).data('attachment-id')); });
      field.val(ids.join("\n"));
    }

    $('#threecuartos-gallery-select').on('click', function (event) {
      event.preventDefault();
      if (frame) { frame.open(); return; }
      frame = wp.media({
        title: 'Seleccionar imágenes',
        button: { text: 'Usar imágenes seleccionadas' },
        multiple: true,
        library: { type: 'image' }
      });
      frame.on('select', function () {
        frame.state().get('selection').each(function (attachment) {
          var data = attachment.toJSON();
          if (list.find('[data-attachment-id="' + data.id + '"]').length) return;
          var src = data.sizes && data.sizes.thumbnail ? data.sizes.thumbnail.url : data.url;
          var item = $('<li>', { 'data-attachment-id': data.id, style: 'list-style:none' });
          $('<img>', { src: src, alt: '', style: 'display:block;width:100px;height:75px;object-fit:cover' }).appendTo(item);
          $('<button>', { type: 'button', class: 'button-link threecuartos-gallery-remove', text: 'Eliminar' }).appendTo(item);
          list.append(item);
        });
        syncIds();
      });
      frame.open();
    });

    list.on('click', '.threecuartos-gallery-remove', function () {
      $(this).closest('[data-attachment-id]').remove();
      syncIds();
    });
  });
})(jQuery);
JS
);
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
			self::textarea( '3cuartos_challenge', 'Problema', $post->ID ); self::textarea( '3cuartos_objectives', 'Objetivos (uno por línea)', $post->ID, true ); self::textarea( '3cuartos_solution', 'Solución', $post->ID );
			self::related_services( $post->ID );
			self::textarea( '3cuartos_results', 'Resultados (uno por línea)', $post->ID, true );
			self::textarea( '3cuartos_metrics', 'Métricas: etiqueta | valor | contexto (una por línea)', $post->ID, true );
			self::gallery( $post->ID );
			self::related_testimonial( $post->ID );
			self::seo( $post->ID ); self::cta( $post->ID );
		}
		if ( '3cuartos_testimonial' === $type ) {
			self::input( '3cuartos_person_name', 'Nombre', $post->ID ); self::input( '3cuartos_job_title', 'Puesto', $post->ID ); self::input( '3cuartos_company', 'Empresa', $post->ID ); self::input( '3cuartos_sort_order', 'Orden', $post->ID, 'number' );
			printf( '<p class="description">La cita se escribe en el editor principal de WordPress. No se utiliza el título como cita.</p>' );
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
		foreach ( $fields as $key ) {
			if ( ! isset( $_POST[ $key ] ) ) continue;
			$value = self::post_value( $key );
			$value = in_array( $key, array( '3cuartos_challenge', '3cuartos_solution' ), true ) ? wp_kses_post( $value ) : sanitize_text_field( $value );
			update_post_meta( $post_id, $key, $value );
		}
		foreach ( array( '3cuartos_sort_order', '3cuartos_testimonial_id' ) as $key ) if ( isset( $_POST[ $key ] ) ) update_post_meta( $post_id, $key, absint( self::post_value( $key ) ) );
		if ( isset( $_POST['3cuartos_capabilities'] ) ) update_post_meta( $post_id, '3cuartos_capabilities', self::lines( self::post_value( '3cuartos_capabilities' ) ) );
		if ( isset( $_POST['3cuartos_objectives'] ) ) update_post_meta( $post_id, '3cuartos_objectives', self::lines( self::post_value( '3cuartos_objectives' ) ) );
		if ( isset( $_POST['3cuartos_results'] ) ) update_post_meta( $post_id, '3cuartos_results', self::lines( self::post_value( '3cuartos_results' ) ) );
		if ( isset( $_POST['3cuartos_service_ids'] ) ) update_post_meta( $post_id, '3cuartos_service_ids', self::post_ids( '3cuartos_service_ids' ) );
		if ( isset( $_POST['3cuartos_gallery_ids'] ) ) update_post_meta( $post_id, '3cuartos_gallery_ids', array_map( 'absint', self::lines( self::post_value( '3cuartos_gallery_ids' ) ) ) );
		if ( isset( $_POST['3cuartos_metrics'] ) ) update_post_meta( $post_id, '3cuartos_metrics', self::metrics( self::post_value( '3cuartos_metrics' ) ) );
		if ( isset( $_POST['3cuartos_profile_links'] ) ) update_post_meta( $post_id, '3cuartos_profile_links', self::links( self::post_value( '3cuartos_profile_links' ) ) );
		if ( isset( $_POST['3cuartos_cta_label'], $_POST['3cuartos_cta_url'] ) ) update_post_meta( $post_id, '3cuartos_cta', array( 'label' => sanitize_text_field( self::post_value( '3cuartos_cta_label' ) ), 'url' => esc_url_raw( self::post_value( '3cuartos_cta_url' ) ) ) );
		if ( isset( $_POST['3cuartos_seo_title'], $_POST['3cuartos_seo_description'] ) ) update_post_meta( $post_id, '3cuartos_seo', array( 'title' => sanitize_text_field( self::post_value( '3cuartos_seo_title' ) ), 'description' => sanitize_textarea_field( self::post_value( '3cuartos_seo_description' ) ), 'noindex' => isset( $_POST['3cuartos_seo_noindex'] ) ) );
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
	private static function related_services( int $post_id ): void {
		$selected = self::stored_ids( get_post_meta( $post_id, '3cuartos_service_ids', true ) );
		$services = get_posts( array( 'post_type' => '3cuartos_service', 'post_status' => 'publish', 'posts_per_page' => -1, 'orderby' => 'title', 'order' => 'ASC' ) );
		printf( '<fieldset><legend><strong>%s</strong></legend><p class="description">Selecciona los servicios relacionados. Se guardan internamente sus IDs.</p><input type="hidden" name="3cuartos_service_ids[]" value="">', esc_html( 'Servicios relacionados' ) );
		if ( empty( $services ) ) {
			printf( '<p class="description">No hay servicios publicados disponibles.</p></fieldset>' );
			return;
		}
		foreach ( $services as $service ) {
			printf( '<label style="display:block;margin:6px 0"><input type="checkbox" name="3cuartos_service_ids[]" value="%d" %s> %s</label>', absint( $service->ID ), checked( in_array( $service->ID, $selected, true ), true, false ), esc_html( get_the_title( $service ) ) );
		}
		echo '</fieldset>';
	}
	private static function related_testimonial( int $post_id ): void {
		$current = absint( get_post_meta( $post_id, '3cuartos_testimonial_id', true ) );
		$testimonials = get_posts( array( 'post_type' => '3cuartos_testimonial', 'post_status' => 'publish', 'posts_per_page' => -1, 'orderby' => 'title', 'order' => 'ASC' ) );
		echo '<p><label><strong>Testimonio relacionado</strong><br><select class="widefat" name="3cuartos_testimonial_id">';
		printf( '<option value="0" %s>— Sin testimonio —</option>', selected( 0, $current, false ) );
		foreach ( $testimonials as $testimonial ) {
			$name = (string) get_post_meta( $testimonial->ID, '3cuartos_person_name', true );
			$company = (string) get_post_meta( $testimonial->ID, '3cuartos_company', true );
			$parts = array_filter( array( $name, $company ) );
			$label = ! empty( $parts ) ? implode( ' — ', $parts ) : get_the_title( $testimonial );
			printf( '<option value="%d" %s>%s</option>', absint( $testimonial->ID ), selected( $testimonial->ID, $current, false ), esc_html( $label ) );
		}
		echo '</select></label></p>';
	}
	private static function gallery( int $post_id ): void {
		$ids = self::stored_ids( get_post_meta( $post_id, '3cuartos_gallery_ids', true ) );
		echo '<div class="threecuartos-gallery-field"><strong>Imágenes adicionales</strong><p class="description">Selecciona varias imágenes desde la Biblioteca de medios.</p><textarea id="threecuartos-gallery-ids" name="3cuartos_gallery_ids" hidden>' . esc_textarea( implode( "\n", $ids ) ) . '</textarea><p><button type="button" class="button" id="threecuartos-gallery-select">Seleccionar imágenes</button></p><ul id="threecuartos-gallery-preview" style="display:flex;flex-wrap:wrap;gap:10px;margin:0">';
		foreach ( $ids as $id ) {
			$image = wp_get_attachment_image( $id, 'thumbnail', false, array( 'alt' => '', 'style' => 'display:block;width:100px;height:75px;object-fit:cover' ) );
			if ( ! $image ) continue;
			printf( '<li data-attachment-id="%d" style="list-style:none">%s<br><button type="button" class="button-link threecuartos-gallery-remove">Eliminar</button></li>', absint( $id ), $image );
		}
		echo '</ul></div>';
	}
	private static function seo( int $post_id ): void { $value = get_post_meta( $post_id, '3cuartos_seo', true ); $value = is_array( $value ) ? $value : array(); printf( '<p><strong>SEO</strong><br><input class="widefat" name="3cuartos_seo_title" placeholder="Título SEO" value="%s"><textarea class="widefat" rows="3" name="3cuartos_seo_description" placeholder="Descripción SEO">%s</textarea><label><input type="checkbox" name="3cuartos_seo_noindex" value="1" %s> No indexar</label></p>', esc_attr( (string) ( $value['title'] ?? '' ) ), esc_textarea( (string) ( $value['description'] ?? '' ) ), checked( ! empty( $value['noindex'] ), true, false ) ); }
	private static function textarea( string $key, string $label, int $post_id, bool $array = false ): void { $v = get_post_meta( $post_id, $key, true ); if ( $array && is_array( $v ) ) $v = implode( "\n", array_map( static fn( $i ) => is_array( $i ) ? implode( ' | ', $i ) : (string) $i, $v ) ); printf( '<p><label><strong>%s</strong><br><textarea class="widefat" rows="4" name="%s">%s</textarea></label></p>', esc_html( $label ), esc_attr( $key ), esc_textarea( (string) $v ) ); }
	private static function checkbox( string $key, string $label, int $post_id ): void { printf( '<p><label><input type="checkbox" name="%s" value="1" %s> %s</label></p>', esc_attr( $key ), checked( (bool) get_post_meta( $post_id, $key, true ), true, false ), esc_html( $label ) ); }
	private static function cta( int $post_id ): void { $v = get_post_meta( $post_id, '3cuartos_cta', true ); $v = is_array( $v ) ? $v : array(); printf( '<p><strong>CTA</strong><br><input name="3cuartos_cta_label" placeholder="Etiqueta" value="%s"> <input class="regular-text" name="3cuartos_cta_url" placeholder="URL" value="%s"></p>', esc_attr( $v['label'] ?? '' ), esc_attr( $v['url'] ?? '' ) ); }
	private static function post_value( string $key ): string { $value = $_POST[ $key ] ?? ''; return is_scalar( $value ) ? (string) wp_unslash( $value ) : ''; }
	private static function post_ids( string $key ): array {
		$value = $_POST[ $key ] ?? array();
		$values = is_array( $value ) ? $value : preg_split( '/\r\n|\r|\n/', (string) $value );
		$ids = array_map( 'absint', array_map( static fn( $item ) => is_scalar( $item ) ? wp_unslash( (string) $item ) : '', $values ) );
		return array_values( array_unique( array_filter( $ids ) ) );
	}
	private static function stored_ids( $value ): array {
		$values = is_array( $value ) ? $value : preg_split( '/\r\n|\r|\n/', (string) $value );
		$ids = array_map( 'absint', $values );
		return array_values( array_unique( array_filter( $ids ) ) );
	}
	private static function lines( $value ): array { return array_values( array_filter( array_map( 'sanitize_text_field', preg_split( '/\r\n|\r|\n/', (string) wp_unslash( $value ) ) ) ) ); }
	private static function metrics( $value ): array { return array_values( array_filter( array_map( static function( $line ) { $p = array_map( 'trim', explode( '|', $line ) ); return array( 'label' => sanitize_text_field( $p[0] ?? '' ), 'value' => sanitize_text_field( $p[1] ?? '' ), 'context' => sanitize_text_field( $p[2] ?? '' ) ); }, self::lines( $value ) ), static fn( $m ) => '' !== $m['label'] ) ); }
	private static function links( $value ): array { return array_values( array_filter( array_map( static function( $line ) { $p = array_map( 'trim', explode( '|', $line, 2 ) ); return array( 'label' => sanitize_text_field( $p[0] ?? '' ), 'url' => esc_url_raw( $p[1] ?? '' ) ); }, self::lines( $value ) ), static fn( $l ) => '' !== $l['label'] ) ); }
}
