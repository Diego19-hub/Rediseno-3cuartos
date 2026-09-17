# Plan de trabajo — Home inmersiva y 3D

## Objetivo final

Entregar una Home animada y editorial que cuente una sola historia al desplazarse:

`separated → assembled → expanded → servicios → primer proyecto`.

El objeto principal estará formado por tres piezas arquitectónicas incompletas alrededor de un vacío central:

- **Estrategia:** sólida, estable y precisa.
- **Creatividad:** curva, translúcida y expresiva.
- **Tecnología:** modular, segmentada y técnica.

El titular y los enlaces permanecerán como HTML accesible. En escritorio, el Canvas ocupará el hero como capa decorativa sticky. En móvil, la experiencia usará una composición 2.5D sin cargar Three.js.

## Estado actual

- [x] Dependencias de Three.js, React Three Fiber y Framer Motion instaladas.
- [x] Canvas cargado dinámicamente solo en escritorio.
- [x] Primera geometría procedural con tres materiales diferenciados.
- [x] Estados base `separated`, `assembled` y `expanded`.
- [x] Respuesta inicial al puntero y movimiento ambiental.
- [ ] Objeto estático aprobado visualmente.
- [ ] Estados controlados por scroll; actualmente cambian mediante temporizador.
- [ ] Narrativa completa hasta Servicios y primer proyecto.
- [ ] Fallback móvil 2.5D definitivo.

## Fase 1 — Objeto estático

- [ ] Ajustar silueta de las tres piezas para evitar apariencia genérica.
- [ ] Refinar proporciones y relación entre masas.
- [ ] Hacer legible el vacío central.
- [ ] Confirmar que la unión genera un símbolo reconocible.
- [ ] Aprobar composición estática antes de animar el scroll.

**Aprobación:** captura a 1440 px donde se distingan las tres identidades y el símbolo funcione ensamblado.

## Fase 2 — Materiales, luz y encuadre

- [ ] Afinar material sólido de Estrategia.
- [ ] Afinar transparencia de Creatividad sin artefactos visuales.
- [ ] Reforzar modularidad de Tecnología.
- [ ] Ajustar luces, sombras y contraste sobre fondo oscuro.
- [ ] Encuadrar el objeto a la derecha con invasión controlada del centro.

**Aprobación:** titular y CTAs siguen dominando la lectura; el objeto tiene profundidad sin perder detalle.

## Fase 3 — Movimiento ambiental

- [ ] Añadir flotación muy lenta y diferenciada por pieza.
- [ ] Limitar la respuesta del puntero en cámara, luz y rotación.
- [ ] Evitar mareo, jitter y movimiento permanente innecesario.
- [ ] Desactivar estos efectos con `prefers-reduced-motion`.

**Aprobación:** la escena se siente viva, pero permanece estable al leer.

## Fase 4 — Scroll-driven storytelling

- [ ] Crear un único progreso normalizado de scroll.
- [ ] Eliminar el temporizador de cambio de estado.
- [ ] Mapear rangos continuos a `separated`, `assembled` y `expanded`.
- [ ] Animar entrada y reducción del titular mediante máscaras.
- [ ] Mantener la escena sticky durante la secuencia.
- [ ] Asegurar reversibilidad al subir el scroll.

**Aprobación:** la secuencia no salta y responde igual al avanzar y retroceder.

## Fase 5 — Entrega a Servicios

- [ ] Asociar cada pieza con Diseño y Branding, Desarrollo Web y Marketing Digital.
- [ ] Revelar los nombres de servicio en HTML, no dentro del Canvas.
- [ ] Abrir las piezas en tres direcciones.
- [ ] Resolver la salida del sticky y la continuidad visual con Servicios.
- [ ] Retirar las tarjetas antiguas del primer viewport sin eliminar contenido necesario.

**Aprobación:** se entiende que el sistema unido produce tres disciplinas conectadas.

## Fase 6 — Primer proyecto

- [ ] Reducir el protagonismo del objeto al terminar Servicios.
- [ ] Crear una transición limpia hacia el primer caso/proyecto.
- [ ] Reutilizar el lenguaje de profundidad sin repetir la misma animación.
- [ ] Mantener el contenido del proyecto fuera del alcance de este frente.

**Aprobación:** Hero, Servicios y primer proyecto se perciben como una sola narrativa.

## Fase 7 — Móvil, accesibilidad y rendimiento

- [ ] Crear fallback 2.5D para móvil sin importar Canvas/R3F/Three.js.
- [ ] Completar variante `prefers-reduced-motion`.
- [ ] Limitar DPR y sombras según capacidad.
- [ ] Pausar o reducir render cuando la escena no sea visible.
- [ ] Revisar listeners, geometrías, materiales y limpieza de recursos.
- [ ] Verificar 375, 768, 1024 y 1440 px.
- [ ] Ejecutar lint, typecheck, tests y build.

**Aprobación:** experiencia estable, legible y funcional en los modos soportados.

## Regla para archivos

Antes de crear un archivo nuevo, responder:

1. ¿Ya existe un archivo con esa responsabilidad?
2. ¿El cambio cabe de forma clara en el componente actual?
3. ¿El archivo nuevo reduce complejidad o solo reparte código?

Si no reduce complejidad real, no se crea.
