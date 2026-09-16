# Validación runtime de WordPress

Estado: entorno local validado con Docker Compose. `https://3cuartos.duob.tech` permanece documentado únicamente como posible entorno temporal; el CMS definitivo se configurará mediante variables de entorno.

## Verificación previa de staging

- Confirmar certificado HTTPS válido para el CMS.
- Confirmar acceso autorizado a `/wp-admin`; no almacenar credenciales en el repositorio.
- Confirmar respuesta JSON en `/wp-json` y en `/wp-json/3cuartos/v1/settings` tras activar el plugin.
- Confirmar enlaces permanentes legibles y reescrituras activas.
- Confirmar PHP 8.1+ y una versión estable compatible de WordPress 6.4+.
- Confirmar base de datos disponible y una instalación limpia, independiente del WordPress anterior.
- Instalar y activar `wordpress/plugins/3cuartos-content-model`.
- Confirmar los CPT `services`, `case-studies`, `testimonials`, `team-members` y la taxonomía `service-capabilities`.
- Crear contenido mínimo de prueba únicamente marcado como provisional.
- Bloquear indexación del CMS durante desarrollo mediante ajustes de WordPress y/o cabeceras del entorno.

- Ejecutar `php -l` sobre cada archivo PHP del plugin.
- Activar, desactivar y reinstalar sin errores fatales ni pérdida de contenido.
- Verificar los CPTs `services`, `case-studies`, `testimonials`, `team-members` y la taxonomía `service-capabilities`.
- Confirmar REST, enlaces permanentes, paginación, `_embed` y compatibilidad del adaptador Next.js.
- Crear, actualizar y leer metadatos; probar sanitización de strings, IDs, arrays, CTA, SEO, métricas y enlaces.
- Validar relaciones por ID, booleano provisional, campos vacíos y datos malformados.
- Verificar el endpoint público `3cuartos/v1/settings` y ausencia de credenciales, destinatarios internos o campos privados.
- Probar permisos con visitante anónimo, editor y administrador.
- Confirmar que la desinstalación no borra contenido automáticamente.
