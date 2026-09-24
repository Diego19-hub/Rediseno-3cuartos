# Plan de trabajo de la Home inmersiva

Estado basado en el código actual de `feat/immersive-home-story`.

- [x] **1. Objeto estático** — Existen tres piezas distintas generadas con `THREE.Shape` y `ExtrudeGeometry`; rodean un vacío central. La composición está implementada, pendiente de aprobación visual formal.
- [x] **2. Materiales, iluminación y encuadre** — Hay materiales oscuros/azul petróleo, transmisión moderada, biseles, sombras y luces contenidas. El Canvas cubre el hero y concentra el objeto a la derecha. Pendiente de aprobación visual formal.
- [x] **3. Movimiento ambiental y puntero** — Rotación ambiental lenta y respuesta sutil mediante refs, sin `setState` por frame. Implementado; pendiente de aprobación visual formal.
- [ ] **4. Control continuo por scroll** — No implementado. Los estados aún no dependen del scroll.
- [ ] **5. Transición a Servicios** — No implementada para la escena 3D.
- [ ] **6. Entrega visual al primer proyecto** — No implementada.
- [x] **7. Fallback móvil, accesibilidad, rendimiento y verificación inicial** — Carga diferida en escritorio, Canvas decorativo, `prefers-reduced-motion` estático, fallback `ImmersiveHome` y DPR máximo 1.5. Falta la verificación visual en navegador y la validación final de rendimiento.

## Estados actuales

`separated`, `assembled` y `expanded` ya existen en `story-canvas.tsx` como estados internos. En escritorio se recorren mediante un temporizador local para probar la composición; no están controlados por scroll. Con `prefers-reduced-motion`, la escena permanece estática en `assembled`. En móvil no se monta la escena 3D.

## Próximo orden aprobado

No avanzar a una fase no marcada hasta aprobar visualmente la anterior. La siguiente fase pendiente es validar la composición estática y después materiales/encuadre antes de conectar cualquier control continuo.
