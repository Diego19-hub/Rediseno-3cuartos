# 3cuartos — rediseño web

Base técnica para el rediseño de 3cuartos con Next.js, App Router y WordPress headless (REST) previsto para una etapa posterior.

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

## Estructura

- `src/app`: rutas, layout y metadata.
- `src/components`: primitives UI, layout y secciones reutilizables.
- `src/styles`: tokens y estilos globales.
- `src/lib`: adaptadores futuros de WordPress, animación, SEO y validación.
- `wordpress/plugins/3cuartos-content-model`: plugin versionado que se implementará en la etapa CMS.
- `docs/architecture.md`: decisiones de arquitectura y límites actuales.

La página inicial es deliberadamente provisional. No representa contenido final de cliente.

## Tokens de diseño

Penpot es la fuente de verdad. La copia exacta del export se encuentra en `docs/design-tokens.json`; la guía de correspondencia y actualización está en `docs/design-tokens.md`. No edites valores aprobados directamente en CSS: reemplaza el export, valida el inventario y conserva aliases mediante `var()`.

## Estado

La Etapa 1 — base técnica — está completada. La Etapa 2 (WordPress y modelo de contenido) requiere una nueva aprobación.

## Pruebas UI

`npm run test:e2e` requiere Google Chrome local y usa los viewports 375×812, 768×1024, 1024×768 y 1440×1000. Las capturas se guardan en `artifacts/ui-review/`, ignorado por Git. El menú móvil es un desplegable no modal: mueve foco al primer enlace al abrir y restaura el disparador al cerrar con Escape.
