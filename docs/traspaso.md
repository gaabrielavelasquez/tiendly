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
| **#29** · MUÑA: ocho productos, galerías por color y Terracota | `feat/muna-catalogo` | Reemplaza al #23, cerrado. Merge y reset autorizados; resultado final en el PR. | Verde |
| **#19** · Multirubro: rubros, placeholders y textos | `feat/multirubro-copy` | **Conflicto con `main`** en `formulario-producto.tsx`, `productos-vista.tsx` y `portada.tsx`. Parte de sus textos ya entró por otros PR. | Verde |
| **#22** · Prototipo de ofertas | `proto/productos-ofertas` | **No mergear.** Ya está implementado (#24 a #27). Cerrarlo y borrar la rama cuando Gabi diga. | Verde |

## Próximas tareas, en orden

1. **Terminar y revisar el #27 (tabla de tallas).** Ajustar lo que pida Gabi y mergear con su ok. Decisión 0037, que viaja en ese PR.
2. **Consultar el registro final de MUÑA en el #29**, que reemplaza al #23: fotos nuevas, ocho productos, Editorial/Terracota y miniaturas de color con agotadas tachadas. La oferta de la falda y las tablas existentes se conservan. No se muestra selector para opciones de un solo valor.
3. Gabi autorizó el merge y el reinicio de `production:tienda:muna` al cerrar el #29. Consultar su registro final antes de repetir esa operación.
4. Las tablas por producto siguen en el #27; no se integró esa rama abierta como parte de esta tarea.
5. **Pase de diseño de Pedidos y Mi tienda** con las reglas de 0031 (`CLAUDE.md` §5 y `DESIGN.md` §3–4). Igual que en Inicio: propuesta con capturas, ok de Gabi y después código.

Pendiente sin fecha: precio y SKU por variante (`docs/backlog.md`); renombrar el campo `duena` cuando llegue el backend; cerrar #22 y borrar `src/features/prototipo-ofertas`.

## Riesgos conocidos

- **MUÑA: actualización del catálogo en producción (#29).**
  - Los datos viven en Upstash Redis (`production:tienda:muna`) y, antes del cierre del #29, contenían tres productos sin la oferta de la falda. El resultado del reset autorizado y su verificación se registra en la descripción del #29.
  - Gabi autorizó reiniciar únicamente esa clave después del merge del #29. Consultar el resultado y el respaldo en el registro final del PR antes de repetir un reset; las demás tiendas quedan fuera.
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
- **#23 quedó reemplazado por #29; #19 tiene conflictos.** No los fuerces: actualízalos con `main` (merge, sin force-push) y vuelve a probar en el preview.
- Redis tiene una clave vieja, `preview:tienda:aurora`. No molesta, pero se puede borrar con el ok de Gabi.

## Sesión MUÑA · 24 de octubre de 2026

### Actualización del catálogo

- PR único: [#29](https://github.com/gaabrielavelasquez/tiendly-web/pull/29), reemplaza al #23.
- Rama: `feat/muna-catalogo`, creada desde `origin/main` actualizado (`3882c00`). Worktree: `/private/tmp/tiendly-muna-catalogo`. Luego se integró `origin/main` (`aa965f4`), con la documentación del #28. La rama y el servidor de Gabi se mantuvieron intactos.
- Se integró `origin/feat/muna-fotos` (PR #23) con merge commit en la nueva rama. Conflicto de `semillas.ts` resuelto conservando la oferta de Falda Lluvia (S/ 199, antes S/ 249), las tallas de ropa y calzado y los bolsos sin talla.
- Catálogo de ocho productos. Botín Otoño (S/ 289): Color Camel (gamuza), Vino (cuero), y Talla 35–40; galerías de tres y dos fotos. Guantes Malbec (S/ 159): Burdeos, S/M/L, tres fotos. Slingback Brillo (S/ 269): Burdeos, 35–39, tres fotos. Cartera Cher: dos fotos.
- Nuevas fotos WebP (hasta 1200 × 1500, sin agrandar). Originales movidos a `fotos-originales/muna/` en el espacio principal, ignorados por Git. Retirado el WebP anterior del botín.
- Editorial con Terracota existente, también en el registro. Color con miniaturas cuando su galería tiene fotos, cruz y botón deshabilitado si no hay stock; se conserva el selector previo si no hay fotos. Decisión 0038.

### Validación

- `npm run check:tokens`: pasa.
- `npm run build`: pasa en Vercel con Turbopack. Localmente pasa `npm run build -- --webpack`; Turbopack local falla al intentar abrir un puerto interno por restricciones del entorno.
- Servidor local aislado en 3200, sin credenciales Redis. No se usó ni se detuvo el puerto 3100.
- Preview: https://tiendly-i5slar9wp-gaabrielavelasquez-8525s-projects.vercel.app/muna (protegida por el acceso habitual de Vercel).
- Capturas de esa preview en `docs/capturas/muna-catalogo/`, a 390 y 1440: registro, catálogo, ofertas, las fichas modificadas, botín en vino, color agotado y carrito.
- Chrome y WebKit (Safari): ocho rutas a 360/390/1440, local y Vercel, sin desbordamiento horizontal ni imágenes rotas. Verificados cambio de color y reinicio de galería, color agotado según talla, tabla de calzado, carrito en vino/talla 37 y nombres, URLs de Vercel y precios largos sin persistirlos.
- WebKit completó las comprobaciones funcionales; al cerrar el navegador automatizado registró cinco cancelaciones de prefetch RSC (`access control checks`), tanto localmente como en Vercel. No se cambió el código de prefetch.

### Pendiente tras aprobación

1. Gabi revisa el PR #29 que reemplaza al #23. **No se hizo merge.**
2. Tras su aprobación explícita y el merge, esperar a que producción termine de desplegar.
3. Reiniciar únicamente `production:tienda:muna` en Redis para que la siguiente visita cargue los ocho productos y Ofertas. **No se modificaron datos de producción.** Esta acción sigue pendiente hasta el ok de Gabi.
4. Verificar en producción catálogo, oferta de la falda y galerías por color.

Pagos, bancos, entregas y WhatsApp siguen simulados. No se enviaron mensajes, cobros ni pedidos. `docs/traspaso.md` no existía al comenzar en main ni en la rama #23; al entrar el #28 durante la sesión, se consolidó este registro con su traspaso general.

### Correcciones de nombres y enlaces · PR #29

- Nombres definitivos: Cartera Cher (fashion-3 + bolso-detalle), Cartera Noche (fashion-7), Slingback Brillo, Botín Otoño, Chompa Bruma, Falda Lluvia, Conjunto Arena y Guantes Malbec.
- Confirmado: `bolso-detalle` está únicamente en la galería del producto m6 (Cartera Cher), junto con la foto derivada de fashion-3. Cartera Noche (m5, fashion-7) conserva su foto de cadena.
- Los slugs cambian con los nombres. `next.config.ts` mantiene redirecciones permanentes 308 de las siete URLs anteriores hacia las nuevas, solo bajo `/muna/`, conservando los parámetros. Falda Lluvia conserva su URL.
- Los IDs de producto, variantes, precios, oferta y stock no cambian; los carritos guardados por ID conservan sus productos.
- Preview actualizada: https://tiendly-f3t6rvm4c-gaabrielavelasquez-8525s-projects.vercel.app/muna. Capturas renovadas desde Vercel; acceso autenticado con `vercel curl`, sin exportar variables de entorno ni credenciales.
- Se mantiene pendiente el ok de Gabi para merge y reinicio de Redis en producción. No se tocó producción ni el servidor del puerto 3100.

- Validación de esta corrección: `check:tokens` y build local con Webpack pasan; build habitual con Turbopack pasa en Vercel. Chrome y WebKit locales completaron 66 revisiones de rutas/ancho (once rutas × tres tamaños × dos navegadores), las siete redirecciones con parámetros y las comprobaciones de galerías y carrito.
- Comprobado además en navegador local: los siete enlaces antiguos llegan a páginas 200 con las URLs nuevas; un carrito previo con m5/m6 conserva sus productos y enlaza a Cartera Noche y Cartera Cher. El servidor propio de pruebas en 3200 se cerró al terminar.
- Preview corregida: Chrome y WebKit completaron las once rutas en 360/390/1440 (33 comprobaciones por navegador), sin scroll horizontal; las siete URLs anteriores respondieron 308 con parámetros conservados. Galerías de Cher/Noche y carrito en Vino · Talla 37 verificados. Capturas actualizadas: 28 archivos, todos enlazados en el PR.
- Automatización de la preview: se usó el acceso oficial de `vercel curl`, sin exportar variables ni credenciales. En WebKit se espera solo a imágenes visibles (ancho y alto mayores que cero): las precargas ocultas del registro son diferidas. La prueba que modifica textos en el DOM antes de completar hidratación provoca un 418 artificial; la comprobación aislada de la interfaz real y del carrito pasó sin ese error. Los textos largos se comprobaron en local y Chrome sobre la preview.

### Cierre autorizado del PR #29 · 24-oct-2026

- Gabi autorizó explícitamente corregir la tabla y las muestras, hacer merge del #29 y reiniciar únicamente `production:tienda:muna` en Redis después del despliegue.
- Tabla cerrada al entrar; abierta muestra Talla y Largo del pie, una talla por fila, en móvil y desktop.
- Muestras de color de 14 px con borde fino. Se reconoce Camel (gamuza) como camel y Vino (cuero) como vino; los grupos sin colores conocidos se omiten.
- La ejecución final del merge, la copia de respaldo del documento de MUÑA, el reset y la captura de producción a 390 px se registran en la descripción del [PR #29](https://github.com/gaabrielavelasquez/tiendly-web/pull/29). Consultar ese registro antes de repetir un reset.
- Pagos, bancos, envíos y WhatsApp siguen simulados. Solo se autoriza reiniciar MUÑA; no otras tiendas ni claves de Redis.
- Ajustes finales: `check:tokens` y build local pasan. Las capturas finales de Vercel a 390/1440 están en `tabla-tallas-*.jpg`, `catalogo-muestras-*.jpg` y `muestras-botin-390.png`; verificaciones a 360/390/1440 en Chrome y WebKit.
