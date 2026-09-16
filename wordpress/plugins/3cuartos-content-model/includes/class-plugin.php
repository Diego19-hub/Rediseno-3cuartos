<?php

declare(strict_types=1);

namespace ThreeCuartos\ContentModel;

final class Plugin {
	public static function boot(): void {
		add_action( 'init', array( PostTypes::class, 'register' ) );
		add_action( 'init', array( Taxonomies::class, 'register' ) );
		add_action( 'init', array( MetaFields::class, 'register' ) );
		add_action( 'admin_init', array( GlobalSettings::class, 'register' ) );
		add_action( 'rest_api_init', array( RestApi::class, 'register_routes' ) );
	}
}
