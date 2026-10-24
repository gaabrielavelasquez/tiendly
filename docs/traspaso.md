# Traspaso · 24-oct-2026

Para el agente que sigue (Codex) y para Gabi. Antes de tocar código, lee [`AGENTS.md`](../AGENTS.md), [`CLAUDE.md`](../CLAUDE.md), [`DESIGN.md`](../DESIGN.md) y las decisiones de [`docs/decisiones/`](decisiones/README.md).

**Regla que no cambia:** nada se mergea sin el ok de Gabi.

## Estado confirmado de MUÑA · 24-oct-2026

- **PR #29 integrado**, con merge commit `3298c2be6bbd0b37bfd69015cb727aeaae61ad91`, tras aprobación explícita de Gabi y checks en verde.
- Producción desplegó ese commit. Se respaldó y reinició **solo** `production:tienda:muna`; la siguiente visita guardó los ocho productos y la oferta de la falda en Redis. **No repetir el reset.**
- https://tiendly-web-sigma.vercel.app/muna confirmado en Chrome y Safari de iPhone (WebKit) a 390 px: ocho productos, Editorial/Terracota, Ofertas y Falda Lluvia a S/ 199 (antes S/ 249), sin scroll horizontal.
- Tabla cerrada al entrar, dos columnas (Talla y Largo del pie) al abrir. Muestras camel y vino de 14 px con borde fino. El enlace antiguo del botín redirige a la URL nueva.
- Evidencia posterior al despliegue: `docs/capturas/muna-produccion/` en la rama `evidencia/muna-produccion-20261024`, enlazada desde el PR #29. El PR de producto sigue siendo uno solo.
- Respaldo privado: `/private/tmp/muna-production-backup-20261024.json`, permisos 0600, fuera del repo. No contiene credenciales de Redis. No se tocaron otras tiendas, ni se enviaron mensajes, cobros o pedidos. El servidor de Gabi en 3100 se mantuvo intacto.

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

| **#22** · Prototipo de ofertas | `proto/productos-ofertas` | **No mergear.** Ya está implementado (#24 a #27). Cerrarlo y borrar la rama cuando Gabi diga. | Verde |

## Próximas tareas, en orden

1. **Terminar y revisar el #27 (tabla de tallas).** Ajustar lo que pida Gabi y mergear con su ok. Decisión 0037, que viaja en ese PR.
2. **MUÑA ya está publicada y verificada (#29)**, que reemplaza al #23: fotos nuevas, ocho productos, Editorial/Terracota y miniaturas de color con agotadas tachadas. La oferta de la falda y las tablas existentes se conservan. No se muestra selector para opciones de un solo valor.
3. El merge y el reinicio de MUÑA se completaron. No repetir esa operación; las capturas y mediciones de producción están en la rama de evidencia enlazada desde el #29.
4. Las tablas por producto siguen en el #27; no se integró esa rama abierta como parte de esta tarea.
5. **#31 integrado y verificado en producción** (0031/0039, `b6cf172`). #27 queda para revisión de Gabi. Mi tienda y cualquier otra tarea quedan fuera de esta sesión.

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
- **El preview de una rama aparece recién al abrir el PR.** Los previews están protegidos: para Playwright, usa respuestas autenticadas mediante el comando oficial `vercel curl` y un proxy de solo lectura. No exportes variables de entorno ni credenciales.
- **iPhone:** los campos con texto de menos de 16 px hacen zoom al tocarlos. En el panel, los campos usan `text-body`.
- **`.next/types` viejo** rompe el build después de borrar páginas: `rm -rf .next/types`.
- **#23 quedó reemplazado por #29; #19 se cerró por reemplazo en #30.** #30 y #31 están integrados con autorización; #27 sigue abierto y espera revisión, sin merge.
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

1. El PR #29 quedó integrado y verificado en producción (ver estado confirmado al inicio de este documento).
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

## Revisión de PRs #27 y #19 · 24-oct-2026

- #27 **sigue siendo necesario**: #29 solo aporta la guía fija de calzado en la vitrina. #27 añade editor del panel, tabla por producto, copia independiente desde otro producto, medidas y rangos, selección explícita "Sin tabla" y limpieza de filas/columnas al guardar. Se actualizó su rama desde main, conservando el catálogo y la presentación de #29. Sigue abierto, sin merge: falta la revisión de Gabi de estos flujos.
- Compatibilidad del #27: los documentos guardados antes de ese PR conservan la guía de calzado en lectura. Una elección explícita "Sin tabla" se guarda como null y no recupera la guía al recargar. No se escribe ni reinicia Redis para actualizar la rama.
- [#30](https://github.com/gaabrielavelasquez/tiendly-web/pull/30) reemplaza #19 desde `origin/main` (`3298c2b`) en `feat/multirubro-copy-actualizado`. Sus tres conflictos se resolvieron conservando el formulario y el catálogo actuales (ambos ya contienen los textos nuevos) y la portada propia de MUÑA. El CTA general pasa a "Ver productos"; Heather conserva su contenido propio.
- Se conservan los IDs de rubro existentes; se amplían las etiquetas y los rubros en orden alfabético, con Otro al final. Copy con tuteo y sin género; ejemplos de varios rubros (0032). Sin cambios de tokens, precios, ofertas ni datos de producción.
- Pruebas en worktrees aislados: copy en 3200 y tablas en 3201. El servidor de Gabi en 3100 queda intacto. Ambos `check:tokens` y builds locales con Webpack pasan; el build habitual se comprueba también en Vercel.

- Cierre de revisión técnica: Chrome y WebKit completaron ambos previews Vercel a 360, 390 y 1440 sin scroll horizontal. Se comprobó el guardado de tablas solo en memoria local: copia independiente, edición y selección persistida "Sin tabla". No hay prueba de escritura en Redis de producción.
- Evidencia renovada del #27: `docs/capturas/pr-27-actualizado/` en su rama; del #30: `docs/capturas/pr-30/`. Capturas de Vercel a 390/1440 enlazadas en cada PR. Ambos `check:tokens`, build local y despliegue Vercel pasan.
- #19 queda cerrado por reemplazo en #30, con comentario explicativo y enlace. #27 y #30 quedan abiertos para revisar; **ninguno autorizado para merge** en esta tarea. Las medidas personalizadas de la falda en #27 son datos de ejemplo: para una tienda guardada se configuran desde el panel tras el merge aprobado; no reiniciar MUÑA.
- Servidores de pruebas propios 3200 y 3201 cerrados al terminar, tras comprobar sus PID. El servidor de Gabi en 3100 y el checkout principal no se modifican. Pagos, bancos, envíos y WhatsApp siguen simulados.


## Pase de diseño de Pedidos · 24-oct-2026

- Única tarea activa: lista y detalle de Pedidos, conforme a 0031 y al alcance pedido por Gabi. Rama nueva `feat/pedidos-diseno-0031`, desde `origin/main` `3298c2b`. Worktree `/private/tmp/tiendly-pedidos-diseno`. No incluye #27 ni #30 y no inicia Mi tienda.
- Filtros/búsqueda fuera de la caja; cada lista agrupada en un contenedor con divisores; grupos móviles conservan el plegado. Títulos de sección externos con `Seccion`, separación 40/48 px, iconos neutros sin círculos, montos normales/tabulares con moneda y decimales atenuados. Solo el total del detalle usa SemiBold.
- Detalle: pago existente separado como sección, plazo de reserva en texto de advertencia, historial neutro, cliente y enlaces de WhatsApp/correo como filas; acciones móviles fijas con zona segura. Fila completa de desktop y móvil abre el pedido; WhatsApp conserva su enlace independiente.
- Reglas 0010 conservadas: `reglas.ts`, `detalle.ts`, `acciones.ts` y los hooks no cambian. Comprobado límite exacto de 24 h, auto-cancelación, excepción contra entrega, pagar/enviar/entregar/recoger manualmente, deshacer, cancelar y filtros. Los enlaces `wa.me` cambian el texto según estado; no se abrieron ni enviaron mensajes.
- Cuatro estados: skeletons acordes, vacío/sin coincidencias y error/reintento; el detalle inexistente vuelve a la lista. `?escenario=carga` retrasa cinco segundos solo en local/preview y el detalle admite el error simulado ya usado en la lista. En producción esos escenarios se ignoran.
- Previews aislados de antes/después con `TIENDLY_TIENDA_DEMO=heather` solo para ese despliegue: no se cambia la demo del proyecto ni sus variables. Las fotos de Heather siguen excluidas de Vercel por `.vercelignore`; se muestra el icono neutro si una foto no carga. Los fixtures de contacto usan números ficticios 900000… y correos example.com.
- Antes: https://tiendly-k2q13flil-gaabrielavelasquez-8525s-projects.vercel.app/panel/pedidos (main 3298c2b). Capturas Vercel en `docs/capturas/pedidos-0031/before/` a 390 y 1440.
- Validación local en 3202: Chrome y WebKit a 360/390/1440 con búsqueda, filtros, etapas y acciones fijas. Guardado de notas tras recarga, cancelación/deshacer y confirmación manual comprobados sin Redis. Tokens y build pasan; ver evidencia final del PR para los previews y capturas posteriores.
- **No mergear**: propuesta visual pendiente de revisión de Gabi. No hay autorización para producción, Redis o envíos. No se tocó el servidor 3100 ni el checkout principal.

- PR único del pase: [#31](https://github.com/gaabrielavelasquez/tiendly-web/pull/31). Preview con datos: https://tiendly-774d7ttio-gaabrielavelasquez-8525s-projects.vercel.app/panel/pedidos (código fadc778). La preview automática usa MUÑA y muestra su estado vacío; usar la preview con datos enlazada para revisar las etapas.
- Verificación final del preview: once rutas × tres tamaños × Chrome/WebKit, sin scroll horizontal; filtros, búsqueda, reservas, pago, entrega, recojo, cancelado y estados sin dato/error. Textos y precios largos comprobados en navegador local tras hidratación, sin persistir datos de prueba. El skeleton se capturó desde el stream real de Vercel, con proxy de solo lectura; WebKit puede agrupar el stream y mostrar el dato antes de la captura.
- Capturas antes/después a 390/1440 en `docs/capturas/pedidos-0031/`, enlazadas en #31. Decisión 0039 registra el alcance visual pendiente de revisión. Tokens sin cambios; `check:tokens` y build local pasan, build habitual Vercel verde.

- Cierre de sesión: servidores propios 3202 (app) y 3204 (proxy Vercel de solo lectura) cerrados tras comprobar sus PID. El 3100 de Gabi sigue activo. Se deja #31 listo para revisión, sin merge ni otra tarea iniciada.


## Cambio de aprobaciones y ampliación de #27 · 24-oct-2026

- Gabi autorizó **solo el merge de #30**: integrado con merge commit `31edb4180386737e3abe7b0db0777c18819e3bbc`, sobre el head aprobado `5b31464`, con preview verde. El despliegue de main terminó en verde. No se reinició Redis ni se modificaron datos de producción.
- #27 actualizado desde ese main mediante merge commit, sin force-push, en su worktree `/private/tmp/tiendly-tabla-tallas`. El checkout principal y el servidor 3100 no cambian. #31 queda intacto y pendiente de revisión; no está autorizado su merge.
- Nuevos requisitos en #27: limpiar unidades de números/rangos, medidas únicas sin opción Talla y enlace de cabecera "Ver en la tienda" en pestaña nueva. La ampliación está en 0037; CLAUDE.md y DESIGN.md aclaran que las medidas únicas no necesitan selector de talla.
- Normalización al escribir, desenfocar y guardar: `30 cm` → `30`, `86 cm - 90 cm` → `86–90`, coma decimal → punto. No se convierten escalas. Rango incompleto: error, sin guardar ni perder el borrador. Los encabezados indican cm una sola vez.
- Sin Talla: sección Medidas con el mismo editor y copia independiente. Fila interna vacía, sin nuevas opciones o variantes; se conserva al guardar/recargar y se elimina con "Sin medidas". Ficha: "Medidas de la prenda", tabla Medida / Valor (cm), sin selector. Sugerencias genéricas Alto/Ancho/Largo; se pueden renombrar para una prenda única.
- Enlace de cabecera: usa la URL guardada y se actualiza tras crear/renombrar. Pausado: deshabilitado con una nota; activar sin guardar no habilita una URL que aún no está publicada. El nombre sin guardar conserva la URL anterior.
- Demo: la semilla de Cartera Cher ilustra medidas sin Talla (Alto/Ancho/Profundidad). Son valores ficticios para revisar; no se inyectan en documentos existentes ni cambian sus precios, opciones o variantes. **No resetear MUÑA.**
- Validación local inicial: números/rangos, unidades, copia independiente, medidas únicas tras serializar y guía heredada/null pasan. Chrome y WebKit a 360/390/1440 sin scroll horizontal: editor con/sin talla, activo/pausado, producto nuevo, guía de calzado, guardado/recarga, cambio de slug y nueva pestaña. Tokens y build local aprobados; se agregará la evidencia final de Vercel al PR.
- **#27 no se mergea**: Gabi pidió capturas 390/1440 y detenerse para esperar su revisión.

- Validación adicional local: prenda única sin ninguna opción, medidas guardadas/recargadas y carrito; pausa persistida, activar requiere guardar, quitar medidas y enlace tras crear un producto con foto. Todo pasó con datos ficticios en memoria, sin Redis.
- Las abreviaturas con punto (30 cm.) también se limpian. La tabla única puede ajustar valores largos dentro de la página sin scroll horizontal.

- Evidencia renovada del código `bbecd23`: https://tiendly-iwau3gcyb-gaabrielavelasquez-8525s-projects.vercel.app/panel/productos/m6. Capturas 390/1440 en `docs/capturas/pr-27-medidas/`, enlazadas desde #27 (incluyen activo, pausado, nuevo, ficha sin Talla y error de rango).
- Build final local y Vercel pasan, sin cambios de tokens ni dependencias. Chrome y WebKit completaron el preview final a 360/390/1440, incluida abreviatura con punto y tabla única con valores largos, sin scroll horizontal. Las capturas se inspeccionaron y se enlazaron en #27.
- Servidor propio 3201 cerrado tras verificar su PID. El 3100 de Gabi sigue activo. No se modificaron el checkout principal, Redis ni datos de producción. Se detiene el trabajo tras actualizar #27 para esperar revisión, sin merge de #27 o #31.


## Correcciones de #31 pedidas por Gabi · 24-oct-2026

- Trabajo solo en `feat/pedidos-diseno-0031`, worktree `/private/tmp/tiendly-pedidos-diseno`. Se integró main (`31edb41`, #30) con merge commit; el único conflicto fue docs/traspaso.md y se conservó el traspaso más reciente de #27. No se incorporó el código de #27.
- Ocho ajustes: soles enteros con el formateador de la tienda; actual con punto lleno indicator/fill, hechos con check y futuros atenuados; orden móvil cabecera/Productos/Pago/Cliente/Historial/Entrega/Notas; botón completo "Cancelar pedido" con diálogo; vencimiento una sola vez en Pago en formato Inicio; placeholder desde SSR para fotos fallidas; moneda e importe cancelados atenuados y tachados; mayor espacio al pie para las barras.
- Cancelar pasa a ser irreversible, como pidió Gabi: diálogo nativo reutilizado, Escape y Conservar pedido no cancelan, confirmación explícita y sin Deshacer posterior. Las demás acciones conservan Deshacer. El estado y el almacén rechazan reactivar un pedido cancelado. Se conservan las etapas, confirmación manual, reserva de 24 h, contra entrega, stock y enlaces wa.me.
- Local sin Redis, en 3202: Chrome y WebKit a 390×844, 360×844 y 1440×1000 pasan. Comprobados orden de secciones, punto actual, plazo único, soles sin .00, importe cancelado tachado, modal/escape/conservar/confirmar, ausencia de Deshacer al cancelar y conservación de Deshacer para pago. Notas y última fila quedan completamente por encima de la barra correspondiente al llegar al final. La tab bar no aparece en el detalle.
- Comprobaciones puras: límite de 24 h y excepción contra entrega, hoy/mañana y la/las en Lima, cancelación irreversible en dominio/almacén, sin plazo repetido en Historial. check:tokens y build local pasan sin cambios en tokens o dependencias.
- Evidencia final del código `b5a3143`: https://tiendly-2xu5w1h1h-gaabrielavelasquez-8525s-projects.vercel.app/panel/pedidos. Preview aislado Heather, build Turbopack y check:tokens verdes. Capturas actuales 390/1440 y mediciones en `docs/capturas/pedidos-corregidos/`; la comparación inicial queda en `pedidos-0031/`.
- Chrome y WebKit completaron el preview a 360×844, 390×844 y 1440×1000, sin scroll horizontal. Comprobados soles enteros, tachado, paso actual, orden móvil, plazo único, fotos, diálogo, vacío/error/inexistente y acciones sin mutaciones remotas. A 390×844: Notas termina aproximadamente en y=676, barra fija empieza en y=779; última fila termina en y=740, tab bar empieza en y=787. Se inspeccionaron las capturas de viewport, historial, modal y desktop.
- Servidor propio 3202 cerrado después de verificar PID y carpeta. El 3100 de Gabi sigue activo; checkout principal, Redis y producción intactos. **Sin merge** de #31; se actualiza el PR y se detiene para esperar revisión. No se inicia otra tarea.


## Aprobación de #31 y corrección permanente del pago · 24-oct-2026

- Gabi autorizó integrar #31 después de tres ajustes y preview verde: aviso Deshacer de 8 segundos pausado con hover/foco; corrección permanente de pago con hoja y auditoría; foco inicial de cancelación en Conservar pedido.
- Implementado sin renovar la reserva: se conserva creadoEl + 24 h; si ya venció, se cancela al corregir. Contra entrega no vence. Se advierte si ya salió o se entregó, sin cambiar la etapa de entrega. La auditoría se conserva al volver a pagar. Las marcas usan la hora real de la acción.
- Validación local en worktree 3202: reglas puras, tokens y build pasan. Chrome y WebKit a 360/390/1440 pasan foco seguro, corrección, aviso de envío y reserva vencida. Reloj del navegador comprueba 8 segundos efectivos y pausa independiente de hover/foco.
- #30 ya estaba integrado (31edb41); no repetir su merge. Tras integrar #31, actualizar #27 desde main y su evidencia, sin merge de #27. No iniciar otra tarea.

- Corrección permanente comprobada con un pedido ficticio del checkout local: persiste tras recarga y conserva la auditoría al volver a pagar, sin Redis. Las pruebas no envían WhatsApp ni cobran.
- Preview final `a4a305c`: https://tiendly-idl65syg4-gaabrielavelasquez-8525s-projects.vercel.app/panel/pedidos. Build y tokens verdes. Chrome/WebKit pasan 360/390/1440. Capturas de hojas, foco y auditoría en `docs/capturas/pedidos-pago/`, para adjuntar a #31 antes del merge autorizado.


## Cierre de #31 y actualización de #27 · 24-oct-2026

- #31 integrado con autorización explícita de Gabi mediante merge commit `b6cf172754bd727147bac54c771ec9bdd9de1f2a`, sobre el head `88eff2e` con preview verde. Incluye las ocho correcciones anteriores y los tres ajustes finales de pago/foco. Servidor local propio 3202 cerrado; 3100 intacto.
- #30 ya estaba integrado (`31edb41`); no se repite el merge.
- #27 se actualiza desde ese main, sin force-push. El único conflicto es este traspaso: se conservó el registro completo más reciente de #31 y los ajustes/validaciones anteriores de #27. No hay conflictos de código.
- Se conservan los tres requisitos de #27 ya implementados: números/rangos sin unidades, medidas sin Talla y Ver en la tienda activo/pausado. Se renueva la verificación y evidencia desde el main actualizado. **#27 no se mergea**; al actualizarlo se detiene para esperar revisión de Gabi.

- Producción de #31 READY en el commit `b6cf172`. https://tiendly-web-sigma.vercel.app/panel/pedidos responde 200 y se confirmó a 390×844 en Chrome/WebKit: MUÑA sin pedidos, estado vacío correcto, tab bar visible y sin scroll horizontal. Verificación solo GET; sin pedidos ficticios en producción, sin reset ni escrituras de prueba en Redis. Capturas y resultados en `docs/capturas/pr-27-tras-main/pedidos-produccion-*`.
- #27 actualizado mediante merge commit `2e60539`; tokens y build local pasan. Chrome/WebKit locales a 360/390/1440 pasan las tres ampliaciones y guardado/recarga, rango inválido, slug guardado y pestaña nueva. Servidor propio 3201 cerrado tras verificar PID/carpeta; el 3100 de Gabi permanece activo.

- Preview renovado de #27, código `2e60539`: https://tiendly-csokdlogy-gaabrielavelasquez-8525s-projects.vercel.app/panel/productos/m6. Build habitual y tokens verdes. Capturas actuales a 390/1440 en `docs/capturas/pr-27-tras-main/`, inspeccionadas y para enlazar en #27. Chrome/WebKit completan 360/390/1440 sin scroll horizontal.
- Cierre: #31 y #30 integrados y producción de #31 verificada; #27 actualizado y abierto para revisión, sin merge. No iniciar otras tareas. Sin datos de prueba en producción ni reset de Redis. Checkout principal y servidor 3100 intactos.
