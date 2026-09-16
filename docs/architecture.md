# Arquitectura técnica

## Frontend

Next.js 16 con App Router, TypeScript y React. Las rutas viven en `src/app`; los componentes reciben modelos normalizados y no respuestas crudas del CMS. El CSS global concentra reset y tokens; los componentes usan CSS Modules.

## Contenido

WordPress será una instalación nueva y headless. La API elegida es REST: es nativa, reduce plugins y permite exponer CPTs, taxonomías, media y metadatos registrados. Las credenciales de preview y revalidación se usan exclusivamente en rutas del servidor.

## Movimiento

Framer Motion `13.4.0` es la única biblioteca de animación instalada. Su carga se limitará a islas cliente que realmente animen. CSS cubre estados simples. La utilidad `lib/animations/reduced-motion.ts` y el media query global son la base para una alternativa sin desplazamientos ni ensamblajes.

## Tokens

Penpot es la fuente de verdad definitiva. [`design-tokens.json`](./design-tokens.json) es la copia exacta del export del conjunto activo `core`; contiene 95 tokens: 83 históricos, 11 estilos tipográficos semánticos y 1 color de error añadido. `src/styles/tokens.css` traduce los tokens sin aplanar los 13 aliases de color y separa los contratos técnicos que Penpot no representa de forma nativa.

## Límites de esta etapa

La Etapa 1 está completada. No hay Home final, WordPress operativo, formularios reales, analítica, servicios externos ni animaciones complejas.
