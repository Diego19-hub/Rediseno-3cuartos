<?php

declare(strict_types=1);

namespace ThreeCuartos\ContentModel;

final class Permissions {
	public static function can_edit_meta( bool $allowed, string $meta_key, int $post_id ): bool {
		return current_user_can( 'edit_post', $post_id );
	}

	public static function can_manage_settings(): bool {
		return current_user_can( 'manage_options' );
	}

	public static function can_read_public_settings(): bool {
		return true;
	}
}
