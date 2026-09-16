<?php

declare(strict_types=1);

namespace ThreeCuartos\ContentModel;

final class PostTypes {
	public static function register(): void {
		self::register_type( '3cuartos_service', 'Servicio', 'Servicios', 'services' );
		self::register_type( '3cuartos_case_study', 'Caso de éxito', 'Casos de éxito', 'case-studies' );
		self::register_type( '3cuartos_testimonial', 'Testimonio', 'Testimonios', 'testimonials' );
		self::register_type( '3cuartos_team_member', 'Integrante', 'Integrantes', 'team-members' );
	}

	private static function register_type( string $post_type, string $singular, string $plural, string $rest_base ): void {
		register_post_type(
			$post_type,
			array(
				'labels' => array(
					'name'          => $plural,
					'singular_name' => $singular,
					'add_new_item'  => "Añadir {$singular}",
					'edit_item'     => "Editar {$singular}",
				),
				'public'              => true,
				'show_in_rest'        => true,
				'rest_base'           => $rest_base,
				'rest_controller_class' => 'WP_REST_Posts_Controller',
				'has_archive'         => true,
				'rewrite'             => array( 'slug' => $rest_base ),
				'supports'            => array( 'title', 'editor', 'excerpt', 'thumbnail', 'page-attributes', 'custom-fields' ),
				'menu_icon'           => 'dashicons-screenoptions',
				'show_in_graphql'     => false,
			)
		);
	}
}
