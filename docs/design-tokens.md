# Tokens de diseño

## Fuente de verdad

La referencia exacta es [`design-tokens.json`](./design-tokens.json), copia sin transformación del export de Penpot. El conjunto activo es `core`; no hay temas activos ni definidos en el export.

El inventario actual es de 95 tokens: 83 tokens históricos, 11 estilos tipográficos semánticos y 1 color de error añadido.

| Tipo | Cantidad |
|---|---:|
| `spacing` | 15 |
| `dimension` | 14 |
| `borderRadius` | 6 |
| `shadow` | 3 |
| `fontFamilies` | 2 |
| `fontSizes` | 12 |
| `fontWeights` | 4 |
| `letterSpacing` | 3 |
| `typography` | 11 |
| `color` | 25 |
| **Total** | **95** |

No existen descripciones por token en este export. Los nombres, tipos, valores, alias y objetos compuestos permanecen íntegros en el JSON.

## Convención y correspondencia CSS

Los nombres DTCG de Penpot permanecen en el JSON. En CSS se elimina solo el prefijo de conjunto `core.` y los puntos se reemplazan por guiones: `core.color.neutral.900` se convierte en `--color-neutral-900`. Cada alias lleva un comentario que conserva su nombre original y valor resuelto.

Los 13 aliases de color se preservan como `var()`:

- `border.default`, `border.strong`, `focus.ring`
- `surface.canvas`, `surface.default`, `surface.inverse`
- `text.primary`, `text.secondary`, `text.muted`, `text.inverse`
- `action.primary`, `action.primary-hover`, `action.disabled`

`core.color.action.primary-active` y `core.color.status.error` son valores directos; no son aliases.

`core.color.text.primary` conserva la referencia `{color.neutral.900}` y se expresa como `--color-text-primary: var(--color-neutral-900)`. Su valor resuelto es `#171716`. `core.color.neutral.950` se conserva como `--color-neutral-950: #10100F` y no se reasigna como texto principal.

## Tipografía semántica

Los 11 objetos `core.type.*` se descomponen en siete propiedades CSS: familia, tamaño, peso, tracking, line-height, text-transform y text-decoration. No se aplanan contra los tokens primitivos, porque el JSON los declara como objetos tipográficos directos. Esto produce 77 variables CSS para representar fielmente 11 tokens compuestos.

## Contratos técnicos sin equivalencia nativa

- Los breakpoints de Penpot están disponibles como variables de auditoría, pero CSS no permite usarlas directamente en `@media`; las media queries conservan su valor equivalente documentado.
- `clamp()` para márgenes fluidos, la cadena de fallback de fuentes, curvas Bézier y la política `prefers-reduced-motion` son contratos técnicos, no tokens presentes en Penpot.
- Estas cuatro extensiones se encuentran separadas al final de `tokens.css`; no pertenecen al conteo de 95 y no sustituyen tokens de Foundations.

## Actualización

Cuando Penpot cambie, reemplaza únicamente este JSON por un export directo, valida sus conteos/aliases y vuelve a generar la traducción CSS manteniendo aliases como `var()`. No se deben editar valores manualmente para compensar diferencias.
