<?php

declare(strict_types=1);

namespace ThreeCuartos\ContentModel;

function sanitize_boolean( $value ): bool {
	return filter_var( $value, FILTER_VALIDATE_BOOLEAN );
}

function sanitize_id( $value ): int {
	return absint( $value );
}

function sanitize_id_list( $value ): array {
	return array_values( array_filter( array_map( 'absint', is_array( $value ) ? $value : array() ) ) );
}

function sanitize_string_list( $value ): array {
	return array_values( array_filter( array_map( 'sanitize_text_field', is_array( $value ) ? $value : array() ) ) );
}

function sanitize_cta( $value ): array {
	$value = is_array( $value ) ? $value : array();
	return array(
		'label' => sanitize_text_field( $value['label'] ?? '' ),
		'url'   => esc_url_raw( $value['url'] ?? '' ),
	);
}

function sanitize_seo( $value ): array {
	$value = is_array( $value ) ? $value : array();
	return array(
		'title'       => sanitize_text_field( $value['title'] ?? '' ),
		'description' => sanitize_textarea_field( $value['description'] ?? '' ),
		'noindex'     => sanitize_boolean( $value['noindex'] ?? false ),
	);
}

function sanitize_metrics( $value ): array {
	$metrics = is_array( $value ) ? $value : array();
	return array_values( array_map( static function ( $metric ): array {
		$metric = is_array( $metric ) ? $metric : array();
		return array(
			'label'   => sanitize_text_field( $metric['label'] ?? '' ),
			'value'   => sanitize_text_field( $metric['value'] ?? '' ),
			'context' => sanitize_text_field( $metric['context'] ?? '' ),
		);
	}, $metrics ) );
}

function sanitize_profile_links( $value ): array {
	$links = is_array( $value ) ? $value : array();
	return array_values( array_map( static function ( $link ): array {
		$link = is_array( $link ) ? $link : array();
		return array(
			'label' => sanitize_text_field( $link['label'] ?? '' ),
			'url'   => esc_url_raw( $link['url'] ?? '' ),
		);
	}, $links ) );
}
