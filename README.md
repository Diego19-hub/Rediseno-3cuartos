# 3cuartos — rediseño web

Rediseño de 3cuartos con Next.js App Router, TypeScript y WordPress headless previsto para una etapa posterior.

## Objetivo visual actual

La prioridad es construir una Home con narrativa controlada por scroll. Tres piezas 3D —Estrategia, Creatividad y Tecnología— rodean un vacío central, se ensamblan para formar “El sistema 3cuartos” y después se expanden para presentar los servicios.

Secuencia objetivo:

`Hero → separated → assembled → expanded → Servicios → primer proyecto`.

El trabajo se desarrolla por aprobaciones visuales. Primero se valida el objeto estático; después materiales y encuadre; luego movimiento, scroll, transiciones y finalmente optimización.

Consulta [TASKS.md](./TASKS.md) para el plan y [AGENTS.md](./AGENTS.md) para los límites de trabajo.

## Alcance de este frente

Se permite trabajar en composición visual, Three.js/R3F, Framer Motion, scroll, movimiento reducido, fallback móvil y rendimiento de la experiencia animada.

Quedan fuera de este frente SEO, metadata, WordPress, consultas de contenido, formularios, analítica, backend y debugging general ajeno a la animación.

## Estado actual

- Escena procedural disponible mediante un feature flag.
- Tres piezas con geometría extruida, materiales diferenciados y estados base.
- Canvas dinámico únicamente en escritorio.
- Movimiento ambiental y puntero en prototipo.
- Los estados aún cambian con temporizador; falta conectarlos al scroll.
- El objeto, materiales, iluminación y encuadre todavía requieren aprobación.

## Requisitos

- Node.js 22 LTS (`.nvmrc`; mínimo `22.12.0`)
- npm 10 o superior

## Instalación

```bash
nvm use
npm ci
cp .env.example .env.local
```

No agregues secretos a `.env.example` ni a Git. Las variables no requeridas pueden permanecer vacías.

Para activar el prototipo narrativo:

```bash
NEXT_PUBLIC_IMMERSIVE_HOME_STORY=true
```

## Comandos

```bash
npm run dev
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
```

## Estructura relevante

- `src/app`: rutas y layout.
- `src/components/immersive`: experiencia inmersiva actual.
- `src/components/immersive/story`: prototipo del objeto 3D y su narrativa.
- `src/components`: UI, layout y secciones reutilizables.
- `src/styles`: tokens y estilos globales.
- `src/lib`: adaptadores y utilidades.
- `docs`: arquitectura y tokens de diseño.
- `wordpress/plugins/3cuartos-content-model`: etapa CMS, fuera del alcance visual actual.

## Principios de implementación

- Reutilizar antes de crear archivos.
- Preferir el cambio completo más pequeño.
- Mantener contenido y CTAs como HTML real.
- Tratar el Canvas como una capa decorativa.
- No cargar Three.js en móvil.
- Respetar `prefers-reduced-motion`.
- No agregar dependencias ni eliminar archivos sin una necesidad comprobada.
- No optimizar una dirección visual antes de aprobarla.

## Tokens de diseño

Penpot es la fuente de verdad. La copia del export está en `docs/design-tokens.json` y su guía en `docs/design-tokens.md`. Los valores aprobados no se cambian directamente en CSS sin actualizar la fuente correspondiente.

## Pruebas UI

`npm run test:e2e` requiere Google Chrome local y usa los viewports 375×812, 768×1024, 1024×768 y 1440×1000. Las capturas se guardan en `artifacts/ui-review/`, ignorado por Git.
