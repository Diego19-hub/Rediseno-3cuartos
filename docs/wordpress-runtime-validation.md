# Validación runtime de WordPress

Estado: pendiente de un entorno WordPress con PHP 8.1+ y una versión estable compatible de WordPress 6.4+.

- Ejecutar `php -l` sobre cada archivo PHP del plugin.
- Activar, desactivar y reinstalar sin errores fatales ni pérdida de contenido.
- Verificar los CPTs `services`, `case-studies`, `testimonials`, `team-members` y la taxonomía `service-capabilities`.
- Confirmar REST, enlaces permanentes, paginación, `_embed` y compatibilidad del adaptador Next.js.
- Crear, actualizar y leer metadatos; probar sanitización de strings, IDs, arrays, CTA, SEO, métricas y enlaces.
- Validar relaciones por ID, booleano provisional, campos vacíos y datos malformados.
- Verificar el endpoint público `3cuartos/v1/settings` y ausencia de credenciales, destinatarios internos o campos privados.
- Probar permisos con visitante anónimo, editor y administrador.
- Confirmar que la desinstalación no borra contenido automáticamente.
