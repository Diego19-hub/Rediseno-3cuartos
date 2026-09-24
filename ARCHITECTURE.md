# Arquitectura técnica de 3Cuartos

## Aplicación

El frontend usa Next.js 16 con App Router, React 19 y TypeScript. Las rutas viven en `src/app`. Los Server Components son la opción por defecto; los Client Components se reservan para interacción, estado local, eventos de navegador, motion y experiencias que requieren APIs del cliente.

## Organización

- `src/app`: rutas, layouts, metadata, páginas dinámicas y Route Handlers.
- `src/components/layout`: Header, menú y Footer compartidos.
- `src/components/sections`: secciones editoriales y módulos reutilizables.
- `src/components/immersive`: experiencias visuales, Canvas y variantes narrativas.
- `src/components/ui`: primitives como botones, cards, breadcrumbs y estados.
- `src/lib/wordpress`: cliente REST, endpoints, queries, normalizadores, errores y metadatos.
- `src/types`: contratos internos TypeScript para contenido normalizado.
- `src/content`: contenido provisional y configuración local de fallback.
- `src/styles`: tokens de diseño y estilos globales.
- `wordpress/plugins/3cuartos-content-model`: modelo de contenido y endpoints del CMS.
- `tests`: pruebas unitarias, de integración estática y E2E.

## WordPress headless

WordPress es el CMS headless. El plugin `3cuartos-content-model` registra los CPT `3cuartos_service`, `3cuartos_case_study`, `3cuartos_testimonial` y `3cuartos_team_member`, además de taxonomías, metadatos y el endpoint público de settings.

Las respuestas públicas se consultan por REST con `_embed=1` cuando se necesita media o términos relacionados. La autenticación para operaciones privadas, como contacto, permanece en el servidor y nunca se expone al navegador.

## Flujo de datos

```text
WordPress REST
  → wordpressFetch()
  → queries.ts
  → normalizers.ts
  → modelos de src/types/wordpress.ts
  → Server Components / props
  → componentes visuales
```

`queries.ts` conoce colecciones, paginación y endpoints. `normalizers.ts` traduce títulos, contenido, meta, media, relaciones y estados a contratos internos estables. Los componentes no dependen directamente de campos crudos de REST.

## Caché y revalidación

`src/lib/wordpress/client.ts` centraliza headers, timeout, `AbortController`, errores y opciones de `fetch`. En desarrollo usa `cache: "no-store"` para reflejar cambios del CMS al recargar. En producción mantiene `next: { revalidate: 300, ...init.next }`, salvo una política específica compatible.

No se utiliza `unstable_cache` como capa paralela para estas colecciones. Las rutas dinámicas respetan las funciones de consulta y la revalidación configurada por el cliente.

## Fallbacks

Los fallbacks viven principalmente en `src/lib/wordpress/home.ts`, `src/content` y las capas específicas de Servicios y Casos. Se resuelven por sección, no como sustitución global del contenido. Un fallback es provisional, conserva su estado identificable y no reemplaza datos válidos recibidos desde WordPress.

## Animación y experiencias visuales

Framer Motion se usa en Client Components para reveals, transiciones y motion discreto. Three.js y React Three Fiber se usan únicamente en experiencias inmersivas específicas, con carga diferida y exclusión de la variante mobile cuando corresponde. El texto, navegación y CTA permanecen en HTML accesible fuera del Canvas.

Las animaciones respetan `prefers-reduced-motion`, evitan scroll-jacking y limpian listeners, observers y RAFs al desmontar. El video narrativo de Servicios y el scrubbing de Problemas son recursos de presentación, no reproductores interactivos convencionales.

## Variables de entorno

Las variables se documentan en `.env.example` y se leen solo en el servidor cuando contienen URLs, credenciales o configuración de WordPress. No se agregan secretos al repositorio ni a código cliente. `NEXT_PUBLIC_IMMERSIVE_HOME_STORY` controla la variante experimental de Home cuando está habilitada.

## Validación y comandos

```bash
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
git diff --check
```

`test:e2e` requiere Chrome local. La validación del plugin PHP requiere WordPress/PHP disponibles; el repositorio incluye pruebas estáticas para el contrato del plugin cuando ese entorno no está disponible.
