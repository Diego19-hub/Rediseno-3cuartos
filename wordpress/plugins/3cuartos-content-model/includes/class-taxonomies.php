<?php

declare(strict_types=1);

namespace ThreeCuartos\ContentModel;

final class Taxonomies {
	public static function register(): void {
		register_taxonomy(
			'3cuartos_service_capability',
			array( '3cuartos_service' ),
			array(
				'labels'       => array( 'name' => 'Capacidades', 'singular_name' => 'Capacidad' ),
				'public'       => true,
				'show_in_rest' => true,
				'rest_base'    => 'service-capabilities',
				'hierarchical' => false,
				'rewrite'      => array( 'slug' => 'service-capabilities' ),
			)
		);
	}
}
