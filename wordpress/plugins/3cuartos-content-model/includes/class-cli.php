<?php

declare(strict_types=1);

namespace ThreeCuartos\ContentModel;

if ( defined( 'WP_CLI' ) && WP_CLI ) {
	final class Cli {
		public static function seed_demo(): void {
			$capabilities = array( 'Estrategia de marca', 'Diseño de interfaces', 'Desarrollo WordPress', 'Marketing de contenidos' );
			foreach ( $capabilities as $capability ) if ( ! term_exists( $capability, '3cuartos_service_capability' ) ) wp_insert_term( $capability, '3cuartos_service_capability' );
			$services = array(
				'diseno-branding' => array( 'title' => 'Diseño y Branding', 'summary' => 'Servicio provisional para explorar identidad, sistemas visuales y comunicación.', 'capabilities' => array( 'Estrategia de marca', 'Diseño de interfaces' ), 'order' => 1 ),
				'desarrollo-web' => array( 'title' => 'Desarrollo Web', 'summary' => 'Servicio provisional para productos digitales y sitios web conectados.', 'capabilities' => array( 'Desarrollo WordPress' ), 'order' => 2 ),
				'marketing-digital' => array( 'title' => 'Marketing Digital', 'summary' => 'Servicio provisional para contenidos, campañas y aprendizaje continuo.', 'capabilities' => array( 'Marketing de contenidos' ), 'order' => 3 ),
			);
			$service_ids = array(); foreach ( $services as $slug => $service ) { $id = self::upsert( '3cuartos_service', $slug, $service['title'], $service['summary'] ); $service_ids[ $slug ] = $id; self::meta( $id, array( '3cuartos_summary' => $service['summary'], '3cuartos_visual_identifier' => 'Módulo ' . $service['order'], '3cuartos_capabilities' => $service['capabilities'], '3cuartos_cta' => array( 'label' => 'Encontrar mi solución', 'url' => '#contacto' ), '3cuartos_sort_order' => $service['order'], '3cuartos_is_provisional' => true ) ); wp_set_object_terms( $id, $service['capabilities'], '3cuartos_service_capability' ); }
			$testimonial_ids = array(); foreach ( array( 'testimonio-provisional-1' => array( 'Persona provisional 01', 'Rol provisional', 'Empresa provisional' ), 'testimonio-provisional-2' => array( 'Persona provisional 02', 'Rol provisional', 'Empresa provisional' ), 'testimonio-provisional-3' => array( 'Persona provisional 03', 'Rol provisional', 'Empresa provisional' ) ) as $index => $person ) { $id = self::upsert( '3cuartos_testimonial', $index, 'Testimonio provisional', 'Testimonio demostrativo. Sustituir por una cita aprobada por el cliente.' ); $testimonial_ids[] = $id; self::meta( $id, array( '3cuartos_person_name' => $person[0], '3cuartos_job_title' => $person[1], '3cuartos_company' => $person[2], '3cuartos_sort_order' => count( $testimonial_ids ), '3cuartos_is_provisional' => true ) ); }
			$case_id = self::upsert( '3cuartos_case_study', 'caso-destacado-provisional', 'Caso destacado provisional', 'Caso demostrativo para validar la estructura editorial. No representa un cliente ni resultados reales.' ); self::meta( $case_id, array( '3cuartos_client_name' => 'Cliente provisional', '3cuartos_challenge' => 'Problema provisional por confirmar con el cliente.', '3cuartos_solution' => 'Solución provisional que conecta estrategia, creatividad y tecnología.', '3cuartos_service_ids' => array_values( $service_ids ), '3cuartos_metrics' => array( array( 'label' => 'Métrica provisional', 'value' => 'Pendiente', 'context' => 'Validar con el cliente' ) ), '3cuartos_testimonial_id' => $testimonial_ids[0], '3cuartos_cta' => array( 'label' => 'Ver caso', 'url' => '#casos' ), '3cuartos_is_provisional' => true ) );
			foreach ( array( 'recurso-provisional-1' => 'Guía provisional: una estrategia que conecta', 'recurso-provisional-2' => 'Perspectiva provisional: sistemas digitales', 'recurso-provisional-3' => 'Nota provisional: medir para mejorar' ) as $slug => $title ) { $id = self::upsert( 'post', $slug, $title, 'Recurso demostrativo. Este contenido es provisional y no representa una publicación aprobada.' ); self::meta( $id, array( '3cuartos_featured_excerpt' => 'Extracto provisional para validar la tarjeta de recursos.', '3cuartos_cta' => array( 'label' => 'Explorar recursos', 'url' => '#recursos' ), '3cuartos_reading_time' => 0 ) ); }
			$member_id = self::upsert( '3cuartos_team_member', 'integrante-provisional', 'Integrante provisional', 'Biografía demostrativa pendiente de aprobación.' ); self::meta( $member_id, array( '3cuartos_role' => 'Cargo provisional', '3cuartos_profile_links' => array(), '3cuartos_sort_order' => 1, '3cuartos_is_provisional' => true ) );
			update_option( GlobalSettings::OPTION_NAME, GlobalSettings::sanitize( array( 'brandName' => '3cuartos — contenido provisional', 'contact' => array( 'publicEmail' => 'contacto@ejemplo.local', 'phone' => '' ), 'globalCta' => array( 'label' => 'Cuéntanos tu proyecto', 'url' => '#contacto' ) ) ) );
			\WP_CLI::success( 'Contenido provisional creado o actualizado sin duplicados.' );
		}
		private static function upsert( string $post_type, string $slug, string $title, string $content ): int { $existing = get_page_by_path( $slug, OBJECT, $post_type ); $args = array( 'post_type' => $post_type, 'post_name' => $slug, 'post_title' => $title, 'post_content' => $content, 'post_excerpt' => $content, 'post_status' => 'publish' ); if ( $existing instanceof \WP_Post ) { $args['ID'] = $existing->ID; return (int) wp_update_post( $args ); } return (int) wp_insert_post( $args ); }
		private static function meta( int $post_id, array $values ): void { foreach ( $values as $key => $value ) update_post_meta( $post_id, $key, $value ); }
	}
	\WP_CLI::add_command( '3cuartos seed-demo', array( Cli::class, 'seed_demo' ) );
}
