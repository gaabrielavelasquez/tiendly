# Traspaso · 24-oct-2026

Para el agente que sigue (Codex) y para Gabi. Antes de tocar código, lee [`AGENTS.md`](../AGENTS.md), [`CLAUDE.md`](../CLAUDE.md), [`DESIGN.md`](../DESIGN.md) y las decisiones de [`docs/decisiones/`](decisiones/README.md).

**Regla que no cambia:** nada se mergea sin el ok de Gabi.

## Lo que se hizo esta semana (19 al 24 de octubre)

| PR | Qué | Decisión |
|---|---|---|
| #4 a #12 | Core Loop completo: limpieza, checkout y carrito, pagos, entregas, cupones, panel móvil con barra inferior, Mi tienda, Afiliación y prueba de punta a punta. | 0027 a 0030 |
| #13 a #16 | Pase de diseño de Inicio (de-layering) y sus reglas en `DESIGN.md`. | 0031 |
| #17 y #18 | Tiendly es multirubro y sin género. Variantes como opciones genéricas (hasta 3), con migración de datos al leer. | 0032 |
| #20 y #21 | Registro: titular en dos tonos y vista previa con 3 tiendas de ejemplo (MUÑA, keyhaus, Glow Labo). MUÑA reemplaza a Aurora como demo pública. Arreglo del scroll horizontal en móvil. | 0033 |
| #24 | Ofertas 1/4. Formulario de producto: opciones, stock por variante y oferta con fechas. | 0034 |
| #25 | Ofertas 2/4. Productos: filtro "En oferta", ofertas en lote y modo selección en móvil. | 0034 |
| #26 | Ofertas 3/4. Tienda: oferta visible, sección con nombre propio (editable en Mi tienda), chips en móvil, selectores genéricos, ficha en dos columnas desde 768 px y **carrito como drawer** (con /carrito como página). | 0034, 0035 y 0036 |

## PRs abiertos

| PR | Rama | Estado | Preview |
|---|---|---|---|
| **#27** · Tabla de tallas por producto (ofertas 4/4) | `feat/tabla-tallas` | Listo, **espera revisión de Gabi**. Sin conflictos. | Verde |
| **#23** · MUÑA: portada nueva y 6 productos | `feat/muna-fotos` | **Conflicto con `main`** en `src/lib/datos/semillas.ts`. | Verde (de antes del conflicto) |
| **#19** · Multirubro: rubros, placeholders y textos | `feat/multirubro-copy` | **Conflicto con `main`** en `formulario-producto.tsx`, `productos-vista.tsx` y `portada.tsx`. Parte de sus textos ya entró por otros PR. | Verde |
| **#22** · Prototipo de ofertas | `proto/productos-ofertas` | **No mergear.** Ya está implementado (#24 a #27). Cerrarlo y borrar la rama cuando Gabi diga. | Verde |

## Próximas tareas, en orden

1. **Terminar y revisar el #27 (tabla de tallas).** Ajustar lo que pida Gabi y mergear con su ok. Decisión 0037, que viaja en ese PR.
2. **Fotos nuevas de MUÑA.** Portada `fashion-portada`; productos `fashion-1`, `2`, `3`, `5`, `7` y `8`; fuera `fashion-4` y `fashion-6`.
   - Ya está hecho en el **#23**. Falta actualizarlo con `main` y resolver el conflicto en `semillas.ts`, conservando lo que agregaron #24 a #27:
     - formato de opciones;
     - la Falda Lluvia en oferta (`precio: 199`, `precioAntes: 249`);
     - las tablas de tallas del botín y la falda (la chompa, sin tabla).
   - Originales en `fotos-originales/` (ignorada por git): nunca al repo ni a `public/` sin procesar.
   - Después del merge, MUÑA en producción necesita reiniciar sus datos (ver Riesgos).
3. **MUÑA pasa al acento Terracota** (tema Editorial). Con los acentos que ya existen en Mi tienda (módulo 9), sin tokens nuevos.
4. **Página de producto:**
   - Las opciones de color se muestran como miniaturas de foto, y las agotadas, tachadas.
   - Si una opción tiene un solo valor, no se muestra su selector. Esto ya pasa hoy en `ficha-producto.tsx` (solo se muestran las opciones con más de un valor). Verificarlo y dejarlo explícito.
   - Hoy el color usa muestras con `HEX_COLOR` en `selector-opcion.tsx`, o botones si no conoce el color.
5. **Pase de diseño de Pedidos y Mi tienda** con las reglas de 0031 (`CLAUDE.md` §5 y `DESIGN.md` §3–4). Igual que en Inicio: propuesta con capturas, ok de Gabi y después código.

Pendiente sin fecha: precio y SKU por variante (`docs/backlog.md`); renombrar el campo `duena` cuando llegue el backend; cerrar #22 y borrar `src/features/prototipo-ofertas`.

## Riesgos conocidos

- **MUÑA en producción tiene datos viejos.**
  - Los datos viven en Upstash Redis (`production:tienda:muna`) y se crearon antes de la oferta de la falda y de las tablas de tallas. Por eso en producción MUÑA no muestra la sección de ofertas ni las tablas.
  - Arreglo: borrar esa clave para que se vuelva a sembrar. **Solo con el ok de Gabi.** Conviene hacerlo una sola vez, después del #23.
  - Glow Labo no tiene este problema.
- **En los previews de Vercel no hay Redis:** los datos viven en la memoria de cada instancia.
  - Algo que se guarda en el panel (un cupón, un producto) puede no verse en la tienda si la otra página cae en otra instancia.
  - Para probar flujos que guardan, usa un solo proceso local **en un `git worktree` aparte**: `npm run build` y después `TIENDLY_TIENDA_DEMO=muna npx next start -p 3200`.
  - **El puerto 3100 es el servidor de desarrollo de Gabi** (`TIENDLY_TIENDA_DEMO=muna PORT=3100 npx next dev`, en la carpeta principal): no lo cierres ni hagas build en esa carpeta.
  - Antes de levantar algo, revisa el puerto con `lsof -ti tcp:<puerto>`, y al terminar cierra solo el proceso que levantaste: `pkill` no siempre lo cierra.
  - En local, sin la variable, la demo es Heather.
- **El preview de una rama aparece recién al abrir el PR.** Los previews están protegidos: para Playwright, usa el header `x-vercel-trusted-oidc-idp-token` con el token de `vercel env pull` en una carpeta temporal, y borra el archivo después. Nunca lo subas al repo.
- **iPhone:** los campos con texto de menos de 16 px hacen zoom al tocarlos. En el panel, los campos usan `text-body`.
- **`.next/types` viejo** rompe el build después de borrar páginas: `rm -rf .next/types`.
- **#23 y #19 tienen conflictos.** No los fuerces: actualízalos con `main` (merge, sin force-push) y vuelve a probar en el preview.
- Redis tiene una clave vieja, `preview:tienda:aurora`. No molesta, pero se puede borrar con el ok de Gabi.
