<?php

declare(strict_types=1);

namespace ThreeCuartos\ContentModel;

use WP_REST_Request;
use WP_REST_Response;

final class RestApi {
	public static function register_routes(): void {
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

	public static function get_settings( WP_REST_Request $request ): WP_REST_Response {
		return new WP_REST_Response( GlobalSettings::public_value(), 200 );
	}
}
