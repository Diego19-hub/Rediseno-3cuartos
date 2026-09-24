# Separar fallbacks por sección en la integración WordPress

## Contexto

El sitio obtiene contenido editorial desde WordPress mediante REST y mantiene datos provisionales para estados sin contenido. Home, Servicios y Casos comparten parte de la capa de consultas, pero cada página necesita conservar las secciones válidas que sí lleguen desde el CMS.

## Problema actual

Un fallo o respuesta vacía en una sección puede provocar que se use un fallback agregado, descartando contenido válido de otras secciones. `/servicios` no debe depender del agregado completo de Home y `/casos-de-exito` debe resolver casos, servicios y testimonios de forma independiente.

## Archivos relevantes

- `src/lib/wordpress/home.ts`
- `src/lib/wordpress/services.ts`
- `src/lib/wordpress/case-studies.ts`
- `src/lib/wordpress/queries.ts`
- `src/lib/wordpress/normalizers.ts`
- `src/types/wordpress.ts`
- `src/app/(site)/page.tsx`
- `src/app/(site)/servicios/page.tsx`
- `src/app/(site)/casos-de-exito/page.tsx`
- Tests de WordPress y contenido en `tests/`

## Cambios concretos

1. Mantener `getHomeContent()` como API de Home y resolver independientemente servicios, casos, testimonios, recursos y settings.
2. Conservar los datos válidos de WordPress por sección y marcar su `source` como `wordpress` cuando corresponda.
3. Usar únicamente el fallback de la sección que falle o llegue vacía.
4. Hacer que Servicios consulte directamente `getServices({ perPage: 20 })` y `getGlobalSettings()`.
5. Hacer que Casos consulte directamente casos, servicios, testimonios y settings, aplicando fallback por grupo.
6. Mantener compatibilidad con tipos, normalizadores, componentes y el contrato REST existente.
7. No modificar CSS, layout, copy, animaciones, Three.js, videos ni responsive.

## Criterios de hecho

- `/servicios` consulta servicios directamente y no depende de recursos, testimonios o ajustes globales.
- `/casos-de-exito` consulta casos, servicios y testimonios de forma independiente.
- La Home conserva fallback por sección.
- Los datos publicados en WordPress aparecen en Next.js.
- No se modifica el diseño visual.
- `npm run lint` pasa.
- `npm run typecheck` pasa.
- `npm run build` pasa.
- Se revisa `git diff` y `git diff --check`.

## Validaciones obligatorias

```bash
npm run lint
npm run typecheck
npm run build
git diff --check
```

Verificar en desarrollo que un servicio publicado en WordPress aparezca en `/servicios`, que los casos publicados aparezcan en `/casos-de-exito` y que una sección vacía no descarte datos válidos de las demás.
