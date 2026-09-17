# Modelo de contenido

El plugin `wordpress/plugins/3cuartos-content-model` registra CPTs REST: `services`, `case-studies`, `testimonials` y `team-members`. Recursos usan `post` nativo. Relaciones se guardan como IDs; media usa la imagen destacada y galerías de IDs.

Cada CPT expone `3cuartos_is_provisional` (booleano, `true` por defecto). No se carga contenido de ejemplo. Servicios incluyen resumen, capacidades, CTA, orden y SEO; casos incluyen cliente, reto, solución, servicios, resultados, métricas, galería, testimonio, CTA y SEO; testimonios incluyen persona, cargo, empresa, caso y orden; equipo incluye rol, enlaces y orden. Título, slug, contenido y media usan campos nativos.

La configuración global es una única opción sanitizada. El endpoint público solo entrega marca, contacto público, WhatsApp, agenda, enlaces sociales/legal, CTA y SEO. No existen destinatarios ni credenciales en su esquema.

PHP no está disponible en este entorno. Para probar el plugin: instalar WordPress 6.4+/PHP 8.1+, activar el plugin, ejecutar `php -l` sobre los archivos y ejecutar PHPUnit con el framework de pruebas de WordPress. Mientras tanto, `tests/wordpress-plugin-static.test.ts` valida el contrato estático reproducible.
