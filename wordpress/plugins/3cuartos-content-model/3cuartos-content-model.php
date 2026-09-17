<?php
/**
 * Plugin Name: 3cuartos Content Model
 * Description: Modelo de contenido estructurado y REST para el sitio headless de 3cuartos.
 * Version: 0.1.0
 * Requires at least: 6.4
 * Requires PHP: 8.1
 * Text Domain: 3cuartos-content-model
 */

declare(strict_types=1);

namespace ThreeCuartos\ContentModel;

defined( 'ABSPATH' ) || exit;

define( 'THREECUARTOS_CONTENT_MODEL_PATH', plugin_dir_path( __FILE__ ) );
define( 'THREECUARTOS_CONTENT_MODEL_VERSION', '0.1.0' );

require_once THREECUARTOS_CONTENT_MODEL_PATH . 'includes/helpers.php';
require_once THREECUARTOS_CONTENT_MODEL_PATH . 'includes/class-permissions.php';
require_once THREECUARTOS_CONTENT_MODEL_PATH . 'includes/class-post-types.php';
require_once THREECUARTOS_CONTENT_MODEL_PATH . 'includes/class-taxonomies.php';
require_once THREECUARTOS_CONTENT_MODEL_PATH . 'includes/class-meta-fields.php';
require_once THREECUARTOS_CONTENT_MODEL_PATH . 'includes/class-global-settings.php';
require_once THREECUARTOS_CONTENT_MODEL_PATH . 'includes/class-admin-fields.php';
require_once THREECUARTOS_CONTENT_MODEL_PATH . 'includes/class-rest-api.php';
require_once THREECUARTOS_CONTENT_MODEL_PATH . 'includes/class-plugin.php';
require_once THREECUARTOS_CONTENT_MODEL_PATH . 'includes/class-cli.php';
require_once THREECUARTOS_CONTENT_MODEL_PATH . 'includes/class-contact-requests.php';

Plugin::boot();
