# 3cuartos Content Model

El modelo de WordPress se versionará aquí durante la etapa de CMS.

La decisión provisional es implementar Custom Post Types, taxonomías y metadatos con APIs nativas de WordPress (`register_post_type`, `register_taxonomy` y `register_post_meta`) y `show_in_rest: true`. Esto evita depender de ACF/ACF Pro y de licencias no autorizadas. Si un campo editorial complejo justificara ACF más adelante, se documentará y requerirá aprobación previa.
