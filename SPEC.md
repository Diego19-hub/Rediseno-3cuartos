# Especificación funcional de 3Cuartos

## Objetivo

El proyecto es el sitio editorial y comercial de 3Cuartos. Su objetivo es explicar cómo la estrategia, la creatividad y la tecnología se conectan para ayudar a equipos y negocios a construir, mejorar o transformar experiencias digitales.

La experiencia conserva una identidad editorial basada en Outfit, composición arquitectónica, líneas, numeración y la paleta institucional carbón `#090B0D`, mineral `#F2F2EE`, azul `#4A70CC` y dorado de uso limitado `#CCA64A`.

## Usuarios y cliente

- Visitantes que exploran servicios y necesitan entender qué puede resolver 3Cuartos.
- Personas que evalúan proyectos y colaboraciones.
- Equipos de negocio que necesitan iniciar una conversación de proyecto.
- Administradores del cliente que editan contenido desde WordPress.

El cliente administra el contenido editorial en WordPress. Next.js consume ese contenido y presenta la experiencia pública.

## Arquitectura de páginas

- `/`: Home con Hero, Problemas, Tres disciplinas, Proyectos, Cómo trabajamos, Confianza, FAQ, CTA y Footer.
- `/servicios`: listado editorial de disciplinas y capacidades.
- `/servicios/[slug]`: detalle dinámico de un servicio, con contenido, capacidades, media y CTA.
- `/casos-de-exito`: listado editorial de casos publicados.
- `/casos-de-exito/[slug]`: detalle dinámico de un caso, con cliente, narrativa, media, relaciones y CTA.
- `/nosotros`: posicionamiento institucional, forma de pensar, proceso, capacidades, equipo y CTA.
- `/recursos`: hub editorial preparado para recursos, temas, necesidades y CTA.
- `/recursos/[slug]`: detalle de un recurso publicado.
- `/contacto`: formulario editorial para solicitar una conversación.
- `/proceso`: redirección a `/nosotros#proceso`.
- `/aviso-de-privacidad`: contenido legal obtenido desde WordPress con fallback controlado.

## Comportamiento esperado

### Home

Comunica la relación entre estrategia, creatividad y tecnología. La experiencia desktop puede incluir narrativa visual, video, scroll y 3D donde estén implementados; mobile prioriza flujo lineal, legibilidad y rendimiento. Servicios, casos, testimonios, recursos, configuración y CTA se resuelven por sección.

### Servicios

Muestra disciplinas y capacidades. Las URLs públicas usan los slugs normalizados de WordPress. La página individual muestra resumen, descripción, capacidades, imagen destacada, CTA y relaciones disponibles.

### Casos de éxito

Muestra casos con datos utilizables del CMS o el fallback configurado. Cada caso puede incluir cliente, problema, objetivos, solución, resultados, métricas, imágenes, servicios relacionados, testimonio y CTA. Media y CTA solo se muestran cuando existen datos válidos.

### Nosotros

Explica quiénes son 3Cuartos, la idea institucional, cómo piensa y cómo trabaja junto al equipo del cliente. Integrantes y testimonios aparecen cuando existen registros publicados y datos utilizables. No se inventan perfiles ni historia institucional.

### Recursos

Funciona como hub editorial. Los recursos publicados se obtienen desde WordPress y se organizan por tema. Sin artículos reales, muestra un estado vacío editorial sin títulos, imágenes o placeholders ficticios visibles como publicaciones.

### Contacto

Presenta el mensaje institucional y un formulario con nombre, empresa, email, teléfono, necesidades múltiples, mensaje y consentimiento. El envío pasa por `/api/contact` y después por el endpoint privado de WordPress. El éxito solo se muestra cuando WordPress confirma la solicitud; envío y error deben ser explícitos.

## Integración WordPress → REST → Next.js

WordPress registra los CPT públicos `services`, `case-studies`, `testimonials` y `team-members`. Recursos utiliza `posts` nativos. La configuración pública se consulta mediante `/wp-json/3cuartos/v1/settings`.

El flujo es:

1. Un Server Component o una función de datos solicita una colección REST.
2. `src/lib/wordpress/client.ts` ejecuta la petición con timeout, abortado, headers y caché dependiente del entorno.
3. `src/lib/wordpress/queries.ts` resuelve colecciones, endpoints, paginación y relaciones auxiliares.
4. `src/lib/wordpress/normalizers.ts` transforma la respuesta cruda a modelos internos de `src/types/wordpress.ts`.
5. La ruta entrega esos modelos a componentes React sin acoplarlos a la respuesta cruda.

Las relaciones se conservan como IDs internos. La media usa `featured_media`, `_embedded.wp:featuredmedia` y galerías de IDs cuando existen.

## Contenido editable por el cliente

El cliente puede editar títulos, slugs, extractos y contenido; resúmenes, descripciones, capacidades, CTA, orden, SEO y estado provisional de servicios; datos narrativos, relaciones, métricas, media y CTA de casos; citas y datos de testimonios; perfiles y enlaces de integrantes; artículos, categorías, imágenes y metadatos editoriales; además de configuración pública de marca, contacto y CTA global.

## Estados de fallback

Los fallbacks son provisionales y no sustituyen datos válidos de WordPress. Home, Servicios y Casos resuelven cada sección de forma independiente: una respuesta válida conserva sus datos aunque otra sección falle o esté vacía. Si una colección no tiene contenido utilizable, se usa únicamente su fallback o un estado vacío explícito.

El contenido provisional debe conservar su marca interna y no presentarse como evidencia, cliente, resultado o testimonio autorizado.

## Criterios de aceptación generales

- Las rutas públicas principales renderizan sin errores.
- Los datos publicados en WordPress aparecen en la sección correspondiente.
- Relaciones, imágenes, CTA y slugs usan valores reales del CMS.
- No se inventan datos para completar estados vacíos.
- No existe overflow horizontal en los breakpoints soportados.
- Navegación, foco, labels, estados de formulario y reduced motion son utilizables.
- Mobile no descarga recursos desktop innecesarios cuando existe una variante ligera.
- Los cambios pasan las validaciones técnicas definidas para la tarea.
