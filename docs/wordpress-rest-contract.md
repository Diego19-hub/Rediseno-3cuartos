# Contrato REST de WordPress

Endpoints públicos: `GET /wp-json/wp/v2/services`, `/case-studies`, `/testimonials`, `/team-members`, `/posts` y `GET /wp-json/3cuartos/v1/settings`. Las colecciones aceptan `page`, `per_page`, `search`, `include` y `_embed`; el adaptador limita `per_page` a 100.

Ejemplo de servicio: `{ "id": 1, "slug": "branding", "title": { "rendered": "Provisional" }, "meta": { "3cuartos_summary": "", "3cuartos_is_provisional": true } }`.

Los metadatos públicos están registrados con esquema REST, sanitización y autorización de edición por post. Settings no se publica mediante `/wp/v2/settings`; el endpoint agregado entrega solo el subconjunto público. Preview, escritura REST autenticada y datos privados quedan fuera de esta etapa.
