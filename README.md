# 3cuartos — rediseño web

Base técnica para el rediseño de 3cuartos con Next.js, App Router y WordPress headless (REST). La Home incorpora una prueba técnica de storytelling 3D detrás de una bandera local, manteniendo el hero inmersivo HTML como fallback.

## Requisitos

- Node.js 22 LTS (`.nvmrc`; mínimo `22.12.0`)
- npm 10 o superior

## Instalación

```bash
nvm use
npm ci
cp .env.example .env.local
```

No agregues secretos a `.env.example` ni a Git. Las variables no requeridas en esta etapa pueden permanecer vacías.

## Comandos

```bash
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
```

También están disponibles `npm run start`, `npm run tokens:check` y `npm run test:e2e` (este último requiere Google Chrome local).

## Estructura

- `src/app`: rutas, layout y metadata.
- `src/components`: primitives UI, layout y secciones reutilizables.
- `src/styles`: tokens y estilos globales.
- `src/lib`: adaptadores futuros de WordPress, animación, SEO y validación.
- `src/components/immersive/immersive-home.tsx`: hero inmersivo HTML/2.5D existente y fallback estable.
- `src/components/immersive/story`: isla cliente diferida para la prueba Three.js/React Three Fiber de escritorio.
- `src/app/(site)/page.tsx`: frontera Server Component y selección de la Home mediante banderas de entorno.
- `wordpress/plugins/3cuartos-content-model`: plugin versionado que se implementará en la etapa CMS.
- `docs/architecture.md`: decisiones de arquitectura y límites actuales.

La página inicial es deliberadamente provisional. No representa contenido final de cliente.

## Tokens de diseño

Penpot es la fuente de verdad. La copia exacta del export se encuentra en `docs/design-tokens.json`; la guía de correspondencia y actualización está en `docs/design-tokens.md`. No edites valores aprobados directamente en CSS: reemplaza el export, valida el inventario y conserva aliases mediante `var()`.

## Estado actual

La base técnica y el modelo de contenido provisional existen. La escena story contiene tres piezas procedurales (`THREE.Shape` + `ExtrudeGeometry`), iluminación, sombras, movimiento ambiental, respuesta sutil al puntero y estados locales `separated`, `assembled` y `expanded` controlados temporalmente. Todavía no está conectada al scroll ni a la transición de Servicios/proyecto.

La bandera `NEXT_PUBLIC_IMMERSIVE_HOME_STORY` solo activa la isla cuando vale exactamente `"true"`; por defecto permanece desactivada. Con la bandera desactivada se conserva `ImmersiveHome`. En móvil no se monta el Canvas ni se carga Three.js.

La dirección de contenido WordPress y sus secciones inferiores quedan fuera de este frente.

## Pruebas UI

`npm run test:e2e` requiere Google Chrome local y usa los viewports 375×812, 768×1024, 1024×768 y 1440×1000. Las capturas se guardan en `artifacts/ui-review/`, ignorado por Git. El menú móvil es un desplegable no modal: mueve foco al primer enlace al abrir y restaura el disparador al cerrar con Escape.
