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
| **#32** · Cerrar sesión | `feat/cerrar-sesion` | Pendiente de revisión de Gabi; **sin merge autorizado**. | Verde |

| **#22** · Prototipo de ofertas | `proto/productos-ofertas` | **No mergear.** Ya está implementado (#24 a #27). Cerrarlo y borrar la rama cuando Gabi diga. | Verde |

## Próximas tareas, en orden

1. **Revisar #32 (Cerrar sesión).** Espera el ok de Gabi; no mergear ni iniciar onboarding 2–4 antes de su revisión. #27 ya está integrado (`03902bb`).
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


## Cierre autorizado de #27 · 24-oct-2026

- Gabi autorizó integrar #27 tras dos ajustes: ayuda inline en opciones llamadas Medidas/Medida/Dimensiones/Tamaño en cm con enlace al editor de medidas; título público genérico "Medidas". Implementado sin cambiar los datos de la opción.
- La rama ya contiene el main actualizado (`b6cf172`). Se verificará el preview y producción /muna/cartera-cher a 390, sin reset ni datos de prueba en producción.
- Siguiente tarea autorizada: un PR nuevo desde main para Cerrar sesión, con confirmación, borrar la tienda recordada y volver a /registro. **Detenerse para revisión de ese PR**; onboarding 2–4 queda después de la revisión.

- Preview final `1834d47`: https://tiendly-14ble200s-gaabrielavelasquez-8525s-projects.vercel.app/panel/productos/m6. Tokens y build local/Vercel verdes. Chrome y WebKit a 360/390/1440 pasan los cuatro nombres de opción, enlace con/sin Talla, título genérico y plegado; sin scroll horizontal. Capturas finales a 390/1440 en `docs/capturas/pr-27-final/`. No se guardaron cambios de prueba.


## #27 integrado y PR de Cerrar sesión · 24-oct-2026

- #27 integrado con autorización de Gabi y preview verde: merge commit `03902bbcd3edcfe6325e66a01717f028039d2e75`, head `5a63229`. Producción READY y /muna/cartera-cher confirmada en Chrome/WebKit a 390×844: HTTP 200, sin scroll horizontal ni fotos rotas. La ficha guardada no tiene medidas; no se inyectaron valores de la semilla ni se reinició Redis. Capturas locales en /private/tmp/tiendly-pr27-produccion/ y comentario final en #27.
- Nueva rama `feat/cerrar-sesion` desde ese main actualizado; worktree /private/tmp/tiendly-cerrar-sesion. No se modifica el checkout principal ni el servidor 3100. Build/tokens locales pasan. Pruebas en 3203, sin Redis.
- Menú de cuenta conserva Configuración y agrega Cerrar sesión. Confirmación nativa con foco seguro; cookie HttpOnly borrada en servidor, borrador del onboarding borrado en esta pestaña y navegación completa a /registro. Sin borrar datos de tienda, carritos u otros datos del navegador. Carga, error y reintento; Escape bloqueado mientras confirma. Decisión 0040.
- Este PR nuevo **no se mergea**: Gabi pidió detenerse para revisión. Onboarding 2–4 queda pendiente para después, sin iniciar su pase en esta sesión.

- PR único de Cerrar sesión: [#32](https://github.com/gaabrielavelasquez/tiendly-web/pull/32), desde main `03902bb`, código `78d905b`. Preview: https://tiendly-auginlbq2-gaabrielavelasquez-8525s-projects.vercel.app/panel/pedidos. Build habitual Vercel y tokens verdes; sin tokens o dependencias nuevos.
- Chrome/WebKit locales pasan 360×844, 390×844 y 1440×1000: menú y Configuración, Escape/clic fuera, foco seguro, Conservar, carga con Escape bloqueado, fallo de red y reintento, cookie borrada, primer paso del registro tras recarga. Se conservan carritos, otra cookie y otras claves de almacenamiento. Solo memoria local, sin Redis.
- Se usa cookies.delete del servidor con path /, compatible con el entorno HTTP local y HTTPS del preview. La limpieza de la cookie y del borrador solo ocurre al confirmar con éxito.

- Verificación final Vercel de #32 completada en Chrome/WebKit a 360×844, 390×844 y 1440×1000: confirmación, carga/error/reintento, Set-Cookie real de borrado, primer paso tras recarga y conservación de datos ajenos, sin scroll horizontal. Capturas a 390/1440 de menú, hoja, carga, error y registro en `docs/capturas/cerrar-sesion/`, inspeccionadas y enlazadas en el PR.
- Servidor propio 3203 cerrado tras comprobar PID y carpeta. El 3100 de Gabi sigue activo. No hubo escrituras de prueba de producción ni reset de Redis. #27 integrado y producción confirmada; **#32 queda abierto, sin merge, para revisión de Gabi**. Se detiene la sesión; no se inicia onboarding 2–4.


## #32 integrado; pase completo de acceso/onboarding y montos · 24-oct-2026

- #32 integrado tras aprobación explícita y preview verde: merge commit `c0f46827707a9b6eac9000f913f7c40c5918531e`. Producción READY; /registro y cierre/ingreso simulado comprobados en Chrome/WebKit a 390×844, sin scroll horizontal. Borrado de cookie correcto. Número ficticio y código de prueba; sin mensajes reales, sin crear tiendas o modificar datos de producción. Capturas locales en /private/tmp/tiendly-pr32-produccion/ y resultado en comentario de #32.
- Único PR nuevo: rama `feat/auth-onboarding-diseno` desde ese main, worktree /private/tmp/tiendly-auth-onboarding. Todo auth/onboarding, Otro, regla global de céntimos y precios con dos decimales, como pidió Gabi. Decisión 0041 y DESIGN.md actualizados. Sin tokens o dependencias nuevos.
- Antes capturado desde el preview de #32 (78d905b, mismo código funcional que main c0f4682) a 390/1440 en docs/capturas/auth-onboarding/before/. El flujo anterior no tenía estado de código vencido; se documenta esa ausencia, no se inventa una captura de ese estado.
- Verificación de reglas puras pasa: enteros sin .00, fracciones con dos decimales, lectura/validación/guardado/edición del precio, totales y cupones a céntimos, lote sigue entero, Otro guardado con la tienda.
- **No mergear el PR nuevo.** Gabi pidió antes/después y detenerse para su revisión. El 3100 y el checkout principal siguen intactos.

- Compra decimal comprobada en navegador local: 90.99 y precio antes 119.10 se conservan al guardar/recargar; el precio aparece en vitrina, carrito y checkout; un pedido ficticio con envío llega a Pedidos e Inicio como 105.99, sin .00. Sin mensajes ni cobros reales.
- La prueba con nombre/link largo detectó overflow en la tarjeta del link de Inicio de una tienda nueva; se limita la grilla a minmax(0,1fr) y el contenedor a min-w-0. También se fija el foco seguro de las hojas al abrir tras navegación interna, no solo tras una carga completa. Sin cambios visuales adicionales en Inicio/Pedidos.

- PR único [#33](https://github.com/gaabrielavelasquez/tiendly-web/pull/33), código funcional `5d60b6a`. Preview Vercel READY: https://tiendly-ni5lpwjr2-gaabrielavelasquez-8525s-projects.vercel.app/registro. Build habitual Vercel y tokens/build locales verdes. Galería comparativa de las siete pantallas a 390/1440 en docs/capturas/auth-onboarding/README.md; incluye código incorrecto/vencido, Otro, errores de link/creación y campos decimales. Capturas inspeccionadas sin editar imágenes.
- Chrome/WebKit locales completan creación real, Otro guardado, tienda propia, cierre e ingreso a 360/390/1440. En Vercel se prueban estados con sesión ficticia, errores/reintento bloqueando solicitudes y campos decimales sin guardar: no se crean tiendas ni se guarda ningún producto en Redis. WhatsApp e ingreso siguen simulados; Google sin backend conectado.
- Servidor aislado 3204 cerrado tras comprobar PID 30586 y carpeta del worktree. El servidor 3100 de Gabi queda intacto. #32 está integrado y confirmado en producción; **#33 queda abierto, sin merge, para revisión de Gabi**. Se detiene aquí y no se inicia otra tarea.

- Verificación final del preview en Chrome/WebKit a 360/390/1440 completa: registro/ingreso, código incorrecto y vencido, reenvío, datos/Otro, vista propia, foco seguro y borrado real de cookie al cerrar. Sin scroll horizontal. Resultados en docs/capturas/auth-onboarding/resultado-preview.json. La última actualización solo agrega evidencia/documentación y corrige un comentario; el código funcional coincide con el preview capturado.

## Ajustes solicitados de #33 · 24-oct-2026

- Se continúa exclusivamente en #33, rama feat/auth-onboarding-diseno y worktree aislado; main remoto sigue en c0f4682. Sin merge autorizado.
- Código móvil sin vista ni beneficios, Verificar al pie; desktop conserva vista lateral. Datos usa nombre/link en vivo y muestras por rubro, compactas bajo el botón en móvil, sin beneficios. Link libre con Check y texto success, sin caja.
- Tienda creada en una columna centrada con vista propia vacía, halo bg-halo-hoy y entrada suave/reducir movimiento; sin muestras ficticias guardadas ni beneficios. Agregar mi primer producto abre /panel/productos/nuevo; Ir a mi panel, copiar con éxito/error y wa.me sin envío automático. Registro desktop recupera halo detrás de la vista rotatoria.
- Cuatro fotos reales adicionales para hogar/repostería/hecho a mano, WebP 480×600; fuentes en public/onboarding/FUENTES.md y originales ignorados en fotos-originales/onboarding/. Los demás rubros reutilizan fotos existentes. Sin tokens o dependencias nuevos.
- Tokens y build local pasan. Pruebas locales en 3204; producción, Redis y servidor 3100 intactos. Antes de esta ronda copiado sin editar de las capturas Vercel del head funcional previo de #33, en docs/capturas/auth-ajustes/before/.
- Pendiente completar evidencia y verificación desde el preview Vercel de esta ronda, actualizar #33 y detenerse para revisión de Gabi. No mergear.

- Cierre de la ronda de #33: código funcional `6eea253`, preview READY https://tiendly-qnzrju0m5-gaabrielavelasquez-8525s-projects.vercel.app/registro. Chrome/WebKit locales y Vercel pasan a 390, después 1440 y 360: código normal/incorrecto/vencido/reenvío, CTA al pie móvil, datos propios con rubros y nombres/URL largos, éxito/error de copia, logro centrado, formulario nuevo y panel. Sin scroll horizontal. Resultados y antes/después en docs/capturas/auth-ajustes/README.md y resultado-preview.json. Capturas inspeccionadas, sin editar imágenes.
- Creación real verificada solo en memoria local: Otro conservado, slug retornado visible y catálogo vacío; las muestras no se guardan. En Vercel solo estado de sesión ficticio y lecturas del slug; copiar éxito/error con portapapeles simulado, wa.me inspeccionado sin enviar mensajes. Sin escrituras de producción ni Redis. Dinero/precios de la primera ronda se conservan.
- DESIGN.md y decisión 0041 actualizados con la presentación por paso y halos solo detrás de las protagonistas. Servidor propio 3204 cerrado tras comprobar PID 47903 y carpeta del worktree. Checkout principal y 3100 intactos. **#33 actualizado, sin merge. Detenerse para revisión de Gabi.** La última subida solo añade evidencia y documentación, con el mismo código funcional del preview capturado.

## Último toque de Tienda creada en #33 · 24-oct-2026

- Solicitud de Gabi: halo visible, centrado y envolvente; continuar la tienda construida en Datos con sus mismas muestras por rubro.
- Se reutiliza TiendaDatosPreview en la celebración, con nombre, link retornado (abre la tienda), mismas muestras y nota Productos de muestra. Se elimina el componente vacío anterior. Las muestras siguen siendo visuales: no se guardan productos.
- Halo específico bg-halo-logro, centrado en la caja de la tarjeta y con desvanecido en sus cuatro bordes mediante máscara CSS. Reutiliza glow-sky/glow-warm, sin nuevos tokens, blur, destellos ni cambios al halo de otras pantallas. Se conserva la entrada con reducir movimiento y las cuatro acciones finales.
- La primera revisión local detectó un corte recto en el degradado: corregido y revisado visualmente antes de publicar. Se completarán build/tokens y evidencia Vercel 390/1440, con Chrome/WebKit a 360/390. Sin merge ni cambios en producción/Redis; servidor principal 3100 intacto.

- Cierre del último toque de #33: código funcional `67963b1`, preview verde https://tiendly-ca14p3ri7-gaabrielavelasquez-8525s-projects.vercel.app/registro. Build/tokens locales y Vercel pasan. Chrome/WebKit pasan a 390, 1440 y 360: continuidad exacta de muestras (nombres, precios y fotos) entre Datos y Creada para hogar y multirrubro, nota visible, enlace confirmado, centro geométrico del halo y máscara soportada, nombres/URL largos y ausencia de scroll horizontal. Copiar, enlace wa.me y formulario nuevo conservados.
- Antes/después Vercel a 390/1440 en docs/capturas/auth-logro/README.md, con capturas Safari y resultado-preview.json; imágenes inspeccionadas sin edición. Estado ficticio sembrado solo en el navegador, sin crear tiendas/productos en Vercel ni enviar mensajes. Las muestras siguen fuera del catálogo real.
- Mi servidor 3204 (PID 57456) se cerró tras verificar carpeta antes del build final; 3100 confirmado activo (PID 77610). Sin tocar checkout principal, producción ni Redis. La última subida solo agrega evidencia/documentación. **#33 actualizado y sin merge: detenerse para revisión de Gabi.**

## Aprobación de #33 y siguiente pase · 24-oct-2026

- Gabi autoriza integrar #33 tras sumar un toque durazno al halo y preview verde. Se refuerza glow-warm hacia abajo/derecha, conservando azul arriba/izquierda y la máscara centrada. Sin nuevos colores o tokens.
- Después del merge se comprobarán /registro y registro completo en producción a 390 con número ficticio y una tienda aislada de prueba, sin productos, cobros o mensajes reales. No resetear ni modificar tiendas existentes.
- Siguiente tarea autorizada: un único PR desde main actualizado para Configuración y Mi tienda, reglas 0031, interruptores con check, entrega con zona obligatoria y preview de compra nunca vacío. Preservar 0003/0007/0009 y detenerse para revisión sin merge.

## #33 integrado y pase Configuración/Mi tienda · 24-oct-2026

- #33 integrado tras aprobación y preview final verde: merge commit f296d212f3eca1d796a50260743ba7d84f68b6d3, head 5961217. Último halo suma durazno, con captura en docs/capturas/auth-durazno/. Producción confirmada con registro real completo en Chrome a 390 y lectura de /registro/panel en WebKit a 390.
- Tienda de prueba aislada creada por la verificación autorizada: prueba-registro-33-5135991, teléfono ficticio 900000000, sin productos ni mensajes/cobros. Se comprobó cookie, formulario de primer producto, catálogo vacío y vitrina HTTP 200. No se borró la tienda ni se modificaron MUÑA u otras tiendas existentes. Evidencia en /private/tmp/tiendly-pr33-produccion/.
- Nueva rama feat/configuracion-mi-tienda-diseno desde main f296d21, worktree /private/tmp/tiendly-configuracion-diseno. Un único PR, sin autorización de merge. Decisión 0042. Antes Vercel a 390/1440 desde el preview funcional de main en docs/capturas/configuracion-mi-tienda/before/.
- Se preservan 0003/0007/0009 tal como están implementadas/documentadas. Originales fuera del repo; Drive sin resultados de Tiendly. Sin nuevas funciones o persistencia, sin cambios de tokens o dependencias. Tests de guardado se harán solo en memoria local, puerto 3205; servidor principal 3100 intacto.

- PR único [#34](https://github.com/gaabrielavelasquez/tiendly-web/pull/34), código funcional 3a6e3ce. Preview verde: https://tiendly-e452gb7qz-gaabrielavelasquez-8525s-projects.vercel.app/panel/configuracion. Tokens y build locales/Vercel pasan. Antes/después de Configuración, Pagos, Entregas y Mi tienda a 390/1440 en docs/capturas/configuracion-mi-tienda/README.md; incluye vacío, carga, error/reintento, zonas vacías, preview y pies de página. Capturas inspeccionadas sin edición de imágenes.
- Chrome/WebKit locales pasan 390/1440/360: guardado/recarga de entrega, campos obligatorios, fallo de red/reintento, último método WhatsApp protegido, tema/acento/ofertas, preview y aviso al salir conservando/descartando. Prueba adicional local de pagos: guardado inmediato, rollback y último método automático protegido; fixture independiente. Tienda vacía ficticia local con nombre largo: sin productos inventados, imagen guardada/recargada y error de almacenamiento con reintento. Se corrige duplicación del aviso de guardado y truncado de nombres largos del preview.
- Chrome/WebKit en Vercel pasan 390/1440/360, sin scroll horizontal: cuatro estados, interruptor con check, Delivery sin zonas y Guardar deshabilitado, preview sin prometer envío gratis, contenido final visible sobre barra fija, preview/guardado local de apariencia y recuperación de tab bar. No se guardaron datos del servidor en Vercel; solo localStorage. Resultado en docs/capturas/configuracion-mi-tienda/resultado-preview.json.
- Servidor propio 3205 cerrado tras comprobar PID 81834/carpeta; 3100 confirmado activo (PID 77610). Checkout principal y datos existentes de producción intactos. Única creación autorizada de producción fue la tienda vacía de prueba de #33, anotada arriba. Sin reset de Redis ni mensajes/cobros reales.
- **#33 integrado y producción confirmada. #34 listo para revisión, sin merge. Detenerse aquí y esperar a Gabi.** Última subida solo documenta el check del interruptor y adjunta evidencia/traspaso; código funcional idéntico al preview capturado.


## Correcciones de Mi tienda en #34 · 24-oct-2026

- Gabi pidió datos reales, miniaturas de tiendas propias, ayudas únicas de imágenes e íconos sin caja gris. Se continúa en la rama autorizada de #34, sin merge. Código funcional `8ad9767`; preview verde https://tiendly-gwdmopb9g-gaabrielavelasquez-8525s-projects.vercel.app/panel/mi-tienda.
- Causa corregida: apariencia separada en localStorage y vitrina con datos estáticos. Ahora identidadDe lee el documento real de la tienda con compatibilidad en lectura para ejemplos existentes; MUÑA carga Editorial/Terracota, /tiendas-ejemplo/muna/portada.webp y Piezas para usar mucho. No se escribe al migrar ni se reinicia Redis. Los borradores antiguos del navegador se ignoran.
- Guardar publica tema/acento/logo/portada/bienvenida/Instagram/horario junto con WhatsApp/nombre de ofertas en una sola escritura validada del almacén existente. Panel, preview, vitrina/ficha/checkout comparten identidad; Instagram y horario aparecen en el pie público. Pro conserva banner con su portada propia. Imágenes JPG/PNG/WebP hasta 1 MB; ayuda única por imagen e ícono sin caja.
- Miniaturas con portada/logo y productos activos propios; sin productos, muestras por rubro identificadas como muestras (no se guardan), comprobado con tiendas nuevas Hogar locales. La vista previa completa mantiene el vacío sin inventar catálogo.
- Tokens y build final Webpack pasan; Vercel verde. Chrome/WebKit locales verificaron todos los campos al guardar/recargar y desde otro contexto, tres temas/acentos, eliminación explícita, validaciones, fallo de red/reintento, datos de MUÑA y aislamiento entre tiendas a 390/1440/360. Publicación y borrado de portada comprobados en MUÑA solo en memoria local. Formatos/tamaños de imagen inválidos y tema inválido rechazados. Ningún guardado de prueba en producción o Vercel.
- Capturas actualizadas antes/después a 390/1440 en docs/capturas/mi-tienda-datos-reales/README.md. La galería anterior conserva evidencia histórica y enlaza la corrección vigente. El cuerpo del PR se actualiza para reflejar la fuente de datos del servidor, en lugar del guardado por navegador anterior.
- **Sin merge autorizado: actualizar #34 y detenerse para revisión de Gabi.** Sin otras tareas, mensajes/cobros, reset de Redis ni cambios en el checkout principal o el servidor 3100.

- Verificación final Vercel completada en Chrome y WebKit a 390/1440/360: identidad MUÑA, portada/productos en miniaturas, ayudas únicas, ícono neutro, borrador corrupto ignorado, preview propia, vacío/error y vitrina sin scroll. Resultados en docs/capturas/mi-tienda-datos-reales/resultado-preview.json. Capturas inspeccionadas a 390/1440 sin edición de imágenes. Servidor propio 3205 cerrado (PID 96208, carpeta verificada); 3100 activo (PID 77610). La última subida adjunta evidencia y documentación, sin cambios de código funcional respecto al preview 8ad9767.
