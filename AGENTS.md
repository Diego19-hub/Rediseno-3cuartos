# AGENTS.md — Home inmersiva de 3cuartos

## Objetivo

Construir una Home con narrativa visual controlada por scroll, donde tres piezas 3D representen Estrategia, Creatividad y Tecnología. Las piezas parten separadas, se ensamblan alrededor de un vacío central y después se expanden para revelar los servicios.

La experiencia final debe conectar de forma continua:

`Hero → sistema 3cuartos → servicios → primer proyecto`.

## Alcance autorizado

Este frente puede modificar exclusivamente:

- La composición visual y el layout de la Home.
- Three.js y React Three Fiber.
- Framer Motion y animaciones CSS.
- Animación vinculada al scroll.
- Estados `separated`, `assembled` y `expanded`.
- Movimiento ambiental y respuesta sutil al puntero.
- Transición visual de Hero a Servicios y primer proyecto.
- Fallback móvil 2.5D y `prefers-reduced-motion`.
- Rendimiento directamente relacionado con la experiencia animada.
- Componentes y estilos estrictamente necesarios para lo anterior.

## Fuera de alcance

No modificar:

- SEO, metadata, Open Graph o estructura de indexación.
- WordPress, modelos de contenido, consultas REST o normalización.
- Formularios, analítica, conversiones o integraciones externas.
- Rutas, autenticación, backend o infraestructura.
- Contenido definitivo del cliente, salvo texto provisional necesario para presentar la animación.
- Bugs generales no causados por esta experiencia.

Si una tarea requiere uno de estos cambios, documentar la dependencia y detenerse; corresponde a otro frente del proyecto.

## Reglas de implementación

1. Inspeccionar y reutilizar antes de crear archivos.
2. Preferir el cambio coherente más pequeño; no fragmentar un componente sin una razón técnica clara.
3. Mantener las tres geometrías procedurales mientras no se apruebe un modelo externo.
4. No agregar dependencias si Three.js, R3F, Framer Motion o CSS resuelven el caso.
5. Mantener el titular, enlaces y servicios como HTML real; el Canvas es decorativo.
6. No cargar Canvas ni Three.js en móvil. Usar una alternativa 2.5D o render estático.
7. Respetar `prefers-reduced-motion` sin ensamblajes, parallax ni desplazamientos fuertes.
8. Limitar el parallax del puntero y evitar animaciones que compitan con la lectura.
9. No optimizar prematuramente una dirección visual aún no aprobada; sí evitar fugas, listeners innecesarios y trabajo por frame evitable.
10. No eliminar archivos sin comprobar que no tienen consumidores y sin explicar primero el motivo.
11. No tocar áreas ajenas para “arreglar de paso”.
12. Cada fase debe poder revisarse visualmente antes de comenzar la siguiente.

## Arquitectura preferida

Mantener, mientras siga siendo suficiente:

- `immersive-home-story.tsx`: orquestación cliente, media queries, puntero y progreso narrativo.
- `story-canvas.tsx`: escena R3F, geometrías, materiales, luces y transformación de piezas.
- `immersive-home-story.module.css`: capas, sticky, composición responsive y fallback.
- Componentes existentes de la Home para el contenido HTML.

Crear un archivo nuevo solo cuando reduzca complejidad real, tenga una responsabilidad estable o pueda probarse/reutilizarse.

## Orden obligatorio de trabajo

1. Aprobar objeto estático: silueta, proporciones y vacío central.
2. Aprobar materiales, iluminación y encuadre.
3. Añadir movimiento ambiental y respuesta al puntero.
4. Sustituir el ciclo temporal por progreso de scroll.
5. Construir la transición hacia Servicios.
6. Conectar visualmente el primer proyecto.
7. Optimizar y verificar escritorio, móvil y movimiento reducido.

No avanzar a la fase siguiente si la dirección visual actual no está aprobada.

## Criterios de calidad

- No debe parecer un loader, órbitas ni un diagrama corporativo plano.
- Las tres piezas deben distinguirse y, unidas, formar un símbolo equilibrado.
- El vacío central debe seguir siendo legible.
- El scroll debe sentirse continuo y reversible, sin saltos.
- El Canvas no debe bloquear interacción ni lectura.
- En móvil debe existir una experiencia ligera y completa sin Three.js.
- Sin errores de consola ni overflow horizontal.
- Mantener navegación por teclado y contraste legible.
- Verificar al menos 375 px y 1440 px, además de `prefers-reduced-motion`.

## Verificación mínima por cambio

Ejecutar, cuando corresponda:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Para cambios visibles, revisar también la Home real en escritorio y móvil. No afirmar que una prueba pasó si no se ejecutó.
