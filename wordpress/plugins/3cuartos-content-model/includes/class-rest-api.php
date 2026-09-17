<?php

declare(strict_types=1);

namespace ThreeCuartos\ContentModel;

use WP_REST_Request;
use WP_REST_Response;
use WP_Post;

final class RestApi {
	public static function register_routes(): void {
		foreach ( array( '3cuartos_service', '3cuartos_case_study', '3cuartos_testimonial', '3cuartos_team_member', 'post' ) as $post_type ) {
			add_filter( "rest_prepare_{$post_type}", array( self::class, 'append_public_meta' ), 10, 3 );
		}
		register_rest_route(
			'3cuartos/v1',
			'/settings',
			array(
				'methods'             => 'GET',
				'callback'            => array( self::class, 'get_settings' ),
				'permission_callback' => array( Permissions::class, 'can_read_public_settings' ),
			)
		);
	}

	public static function append_public_meta( WP_REST_Response $response, WP_Post $post, WP_REST_Request $request ): WP_REST_Response {
		$fields = array(
			'3cuartos_service' => array( '3cuartos_summary', '3cuartos_visual_identifier', '3cuartos_capabilities', '3cuartos_cta', '3cuartos_sort_order', '3cuartos_seo', '3cuartos_is_provisional' ),
			'3cuartos_case_study' => array( '3cuartos_client_name', '3cuartos_challenge', '3cuartos_objectives', '3cuartos_solution', '3cuartos_service_ids', '3cuartos_results', '3cuartos_metrics', '3cuartos_gallery_ids', '3cuartos_testimonial_id', '3cuartos_cta', '3cuartos_seo', '3cuartos_is_provisional' ),
			'3cuartos_testimonial' => array( '3cuartos_person_name', '3cuartos_job_title', '3cuartos_company', '3cuartos_case_study_id', '3cuartos_sort_order', '3cuartos_is_provisional' ),
			'3cuartos_team_member' => array( '3cuartos_role', '3cuartos_profile_links', '3cuartos_sort_order', '3cuartos_is_provisional' ),
			'post' => array( '3cuartos_featured_excerpt', '3cuartos_cta', '3cuartos_reading_time' ),
		);
		$data = $response->get_data(); $data['meta'] = is_array( $data['meta'] ?? null ) ? $data['meta'] : array();
		foreach ( $fields[ $post->post_type ] ?? array() as $field ) $data['meta'][ $field ] = get_post_meta( $post->ID, $field, true );
		$response->set_data( $data ); return $response;
	}

	public static function get_settings( WP_REST_Request $request ): WP_REST_Response {
		return new WP_REST_Response( GlobalSettings::public_value(), 200 );
	}
}
