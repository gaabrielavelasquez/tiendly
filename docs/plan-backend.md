# Plan de backend · Tiendly

- **Fecha:** 29-oct-2026.
- **Para:** Gabi (decide) y Diego (retoma el plan más adelante).
- **Estado:** propuesta. No se aplicó nada: ni carpetas movidas, ni código, ni datos de producción.
- **Fuentes de Cloudflare y OpenNext:** consultadas el 29-oct-2026 (lista al final, §13). Lo que no se pudo confirmar dice **sin verificar**.
- **Rutas:** el plan está escrito para la estructura objetivo (§10): un solo repo, `tiendly`, con `frontend/` (la app de hoy), `backend/` (base de datos, Workers y scripts) y, en la raíz, `docs/`, `AGENTS.md` y `CLAUDE.md`. Solo §2, que describe el código de hoy, usa las rutas actuales (`src/…`, que pasa a ser `frontend/src/…`).

## Resumen en seis líneas

1. **No hay nada que bloquee el plan.** OpenNext soporta Next.js 16 con App Router, y Tiendly no usa las dos cosas que OpenNext todavía no soporta (middleware de Node y runtime edge).
2. **Conviene el plan Workers Paid (US$5 al mes).** El plan gratis da 10 ms de CPU por visita, poco para una app Next.js; el pago incluye la base de datos (D1) con mucho margen. Las fotos (R2) entran en la capa gratis.
3. **El riesgo más grave hoy no es la base de datos: es el ingreso.** El panel confía en una cookie que solo dice el link de la tienda; quien la escriba a mano entra a cualquier tienda real. Google + permisos por tienda va antes de invitar a nadie.
4. **Dos etapas de datos.** Etapa 1 (para la beta): la misma forma de hoy, un documento por tienda, pero en D1 y con control de versiones, que arregla los guardados que se pisan. Etapa 2 (antes de enero): tablas por módulo.
5. **Fecha:** a 12–15 h por semana, llegar al 15 de noviembre es posible pero sin margen. La fecha realista es la semana del 16 al 22 de noviembre; con Diego tomando el ingreso con Google en paralelo, se gana una semana.
6. **Ante la duda, las demos se protegen.** Si `TIENDLY_ENTORNO` falta o trae un valor raro, la app se comporta como producción: las demos no se editan y no hay ingreso de prueba (§7.1).

---

## 1. Palabras que vas a ver

Cada término, en una frase. Si aparece otro nuevo más abajo, se explica ahí mismo.

| Término | Qué es |
|---|---|
| **Backend** | La parte de la app que corre en un servidor: guarda datos, valida y decide quién puede hacer qué. |
| **Cloudflare Workers** | El servicio de Cloudflare que ejecuta nuestro código en sus servidores, cerca de cada visitante, sin que administremos máquinas. |
| **Worker** | Un programa publicado en Cloudflare Workers; Tiendly entera sería un Worker. |
| **OpenNext** | Una herramienta que traduce una app Next.js para que funcione dentro de un Worker (Next.js está pensado para Vercel). |
| **D1** | La base de datos de Cloudflare; por dentro es SQLite, una base de datos de tablas con filas y columnas. |
| **R2** | El almacén de archivos de Cloudflare; ahí van las fotos de productos. |
| **Binding** | La "conexión" que Cloudflare le da al Worker para usar D1 o R2 sin contraseñas en el código. |
| **Tabla / fila / columna** | Una tabla es como una hoja de cálculo: cada fila es un registro (un producto) y cada columna un dato (su precio). |
| **Clave primaria** | La columna que identifica cada fila sin repetirse (el `id`). |
| **Clave foránea** | Una columna que apunta a la fila de otra tabla (el `tienda_id` de un producto). |
| **Migración** | Un archivo SQL numerado que cambia la forma de la base (crear una tabla, sumar una columna); se aplica una sola vez y en orden. |
| **SQL** | El lenguaje para leer y escribir en una base de tablas. |
| **Transacción** | Un grupo de cambios que se guarda completo o no se guarda nada. |
| **Entorno** | Una copia separada de la app: local (tu compu), preview (cada PR) y producción (la real). |
| **Preview** | La versión de un PR publicada en una URL temporal para revisarla. |
| **OAuth / "Continuar con Google"** | El protocolo con el que Google confirma quién es la persona sin que Tiendly vea su contraseña. |
| **Sesión** | La prueba, guardada en una cookie, de que alguien ya ingresó; el servidor la verifica en cada pedido. |
| **Cron** | Una tarea que corre sola cada cierto tiempo (por ejemplo, cada 15 minutos). |
| **Monorepo** | Un solo repositorio con varias partes (aquí, `frontend/` y `backend/`). |

---

## 2. Cómo guarda Tiendly hoy (lo que dice el código)

Esto sale de leer `src/lib/datos/` y `src/features/*/lib/` en `main` (`e87804d`, con #41). Las rutas de esta sección son las de hoy; después del PR 1 (§10) llevan `frontend/` adelante.

### 2.1 Un documento por tienda

- Todo lo de una tienda vive en **un solo JSON** (`DatosTienda`, en `src/lib/datos/tienda.ts`): la tienda, sus productos, pedidos, inventario, cupones, configuración de pagos y entregas, y rubros.
- Se guarda en Upstash Redis con la clave `<entorno>:tienda:<slug>` (`production:`, `preview:` o `local:`). Sin credenciales, queda en la memoria del proceso (`almacen.ts`).
- Existe un índice aparte para el ingreso por número: `<entorno>:ingreso:<celular>` → slug (`ingreso.ts`).
- Las fotos que sube el panel van a Vercel Blob (`fotos.ts`), en `productos/<slug>/<uuid>.jpg`. Las fotos de las demos son archivos de `public/`.
- El carrito, la copia del pedido para la confirmación y el borrador de Afiliación viven en el navegador (`localStorage`), no en el servidor.

### 2.2 Qué hay dentro del documento

| Parte | Tipo en el código | Detalle que importa para el backend |
|---|---|---|
| `tienda` | `TiendaSesion` | `slug`, `nombre`, `plan` (`"free" \| "pro"`), `celularVentas`, `celularIngreso`, `duena` (pendiente de renombrar), `apariencia`, `nombreOfertas`, `hechos`, `creadaEl` (ISO, solo tiendas nuevas desde #39). |
| `productos` | `Producto[]` | Precio en soles con hasta 2 decimales (0041). Oferta = `precio` + `precioAntes` + `oferta.desde/hasta` como días `AAAA-MM-DD` de Lima (0034). Hasta 3 `opciones` (`color`, `talla`, `otra`) y `variantes` con `valores` y `stock` (0032). Fotos por valor de opción. `tablaTallas`: objeto, `null` ("Sin tabla") o ausente (guía heredada) (0037). El link del producto se calcula del nombre; no se guarda. |
| `inventario` | `Record<pedidoId, Asignacion>` | Por pedido: `vendido` o `reservado` con `hasta`. El stock disponible = stock base − vendido − reservas vigentes. Una reserva vencida "se libera sola" al calcular. |
| `pedidos` | `{ ultimo, creados[] }` | `ultimo` es el contador del número `#TL-` (la primera es TL-1001). Cada pedido guarda una copia de nombre, variante, precio y foto de cada línea. |
| `cupones` | `Cupon[]` | `porcentaje`, `monto` o `envio`; fechas en días de Lima; `usos` y `limiteUsos`. Plan Free: máximo 3 en uso (0008). |
| `config.pagos` | `ConfigPagos` | WhatsApp (activo + celular) y cobros automáticos (`sin-activar`, `en-revision`, `activo`), con la solicitud de Afiliación. |
| `config.entregas` | `ConfigEntregas` | Delivery por zona (`lima`, `callao`, `provincias`) con `costo` y `plazo` **como texto**; envío gratis desde un monto; recojo con dirección y horario (0009). |
| `rubros`, `rubroOtro` | | Del registro (0032). |

### 2.3 Pedidos, reserva de 24 h y estados

- **Pago:** `pagado`, `pendiente` o `cancelado`. **Entrega:** `por-enviar`, `enviado` o `entregado`, con método `delivery`, `recojo` o `coordinar`.
- **Reserva de 24 h (0010):** un pedido por WhatsApp queda `pendiente` y reserva su stock hasta `creadoEl + 24 h`. Contra entrega no vence.
- **La auto-cancelación no se guarda: se calcula al leer** (`conReglas` en `pedidos/lib/reglas.ts`). En la base, un pedido vencido sigue diciendo `pendiente`.
- Cancelar es irreversible (#31). Las correcciones de pago quedan en `pagosDesmarcados`, como auditoría.
- Tarjeta y Yape están **simulados**: el pedido nace `pagado`.

### 2.4 Los cinco problemas que el backend tiene que resolver

1. **Guardados que se pisan.** `mutarTienda` lee el documento entero, lo cambia y lo escribe entero, sin bloqueo (lo dice su propio comentario). Si dos personas guardan a la vez, gana la última y lo de la otra se pierde.
2. **Se puede vender más stock del que hay.** `registrarPedido` revisa el stock con una lectura y guarda con otra; entre las dos, otra compra puede llevarse la misma unidad. Igual con `reservarNumero` (número) y con los usos del cupón.
3. **Local y previews pueden escribir en producción.** Hay una sola base de Upstash; solo el prefijo de la clave separa entornos (riesgo anotado en `docs/traspaso.md`).
4. **El panel no tiene ingreso real.** `slugPanel()` abre la tienda que diga la cookie `tiendly_tienda`. No hay contraseña ni verificación: quien ponga el slug de otra tienda en esa cookie puede editarla. #41 protege solo las demos.
5. **El panel manda el pedido entero.** `sincronizarPedido` recibe el pedido y su detalle desde el navegador y los reemplaza (incluido el total). Con sesión real, cada acción (pagar, enviar, cancelar) tiene que ser su propia acción de servidor, que cambie solo lo que le toca.

---

## 3. Arquitectura propuesta

### 3.1 El dibujo

```
 Navegador (cliente o quien vende)
            │  https://tiendly.<subdominio>.workers.dev  →  luego https://tiendly.pe
            ▼
 ┌─────────────────────────────── Cloudflare ───────────────────────────────┐
 │  Worker "tiendly"  (Next.js 16 traducido por OpenNext)                    │
 │    · páginas de la tienda, panel, checkout                                │
 │    · acciones de servidor = el "API" de Tiendly                           │
 │    · ingreso con Google (Better Auth)                                     │
 │        │ binding DB                     │ binding FOTOS                   │
 │        ▼                                ▼                                 │
 │   D1  "tiendly-prod"               R2  "tiendly-fotos-prod"               │
 │                                                                           │
 │  Worker "tiendly-tareas" (cron cada 15 min): cierra reservas vencidas     │
 └───────────────────────────────────────────────────────────────────────────┘
```

- **No hay un servidor de API aparte.** Las acciones de servidor de Next.js (las funciones `"use server"` que ya usa Tiendly) siguen siendo la puerta de entrada; solo cambia a dónde escriben. Es una pieza menos que publicar y vigilar.
- **Cuándo separar un API:** si llega la app de React Native (CLAUDE.md §4), las mismas consultas se mueven a un Worker de API en `backend/api/`. El modelo de datos no cambia.

### 3.1.1 Dónde vive cada pieza

| Pieza | Carpeta |
|---|---|
| App Next.js, acciones de servidor y consultas a D1 | `frontend/src/` (las consultas, en `frontend/src/lib/datos/`) |
| Configuración del Worker de la app | `frontend/wrangler.jsonc` y `frontend/open-next.config.ts` (PR 2) |
| Variables locales (no van al repo) | `frontend/.dev.vars` |
| Semillas de las demos | `frontend/src/lib/datos/semillas.ts` (como hoy) |
| Migraciones SQL | `backend/db/migraciones/`. El binding de D1 en `frontend/wrangler.jsonc` apunta ahí con `migrations_dir: "../backend/db/migraciones"` [17]. |
| Worker del cron | `backend/workers/tareas/`, con su propio `wrangler.jsonc` y el mismo binding de D1 |
| Scripts (mudanza, respaldo) | `backend/scripts/` |
| API separado, si llega | `backend/api/` |

**Por qué las consultas quedan en `frontend/`:** corren dentro del Worker de Next.js. Ponerlas en `backend/` y que `frontend/` las importe pide configurar *workspaces* de npm (varios paquetes en un repo que se usan entre sí), una pieza más para alguien que empieza. Si Diego lo prefiere, se mueven a `backend/datos/` cuando aparezca el API separado.

### 3.2 ¿Next.js 16 funciona en Workers? Lo verificado

| Pregunta | Respuesta | Fuente |
|---|---|---|
| ¿OpenNext soporta Next.js 16? | **Sí.** "All minor and patch versions of Next.js 16 and the latest minors of Next.js 14 and 15 are supported." Tiendly usa 16.4.2. | [1] |
| ¿App Router? | **Sí**, en la lista de funciones soportadas. | [1] |
| ¿Middleware? | El middleware estándar, sí. El **middleware de Node** (Next 15.2+), **todavía no**. Tiendly **no tiene** `middleware.ts` ni `proxy.ts`: no le afecta. | [1] |
| ¿Runtime edge? | **No soportado**. Tiendly **no** declara `runtime = "edge"`: no le afecta. | [2] |
| ¿Acciones de servidor? | La página de OpenNext no las nombra. Son parte del App Router y deberían funcionar: **sin verificar**, se prueba en el PR 2 (§9). | — |
| ¿`revalidatePath`? | Tiendly lo usa en Mi tienda. OpenNext necesita un caché configurado (R2) para el caché de Next. **Sin verificar** que `revalidatePath` funcione sin más configuración; se prueba en el PR 2. | [2] |
| ¿Turbopack? | Aparece como soportado, sin aclarar si incluye el build. **Sin verificar** para el build. | [1] |
| ¿Fotos con `next/image`? | Pide un binding de Cloudflare Images o un *loader* propio (una función que arma la URL de la imagen optimizada). Ver §6. | [6] |
| ¿Cómo lee D1 el código? | Con `getCloudflareContext().env.DB`. En páginas estáticas, solo en modo asíncrono. | [7] |

**Una contradicción entre fuentes, a resolver midiendo.** OpenNext dice que un Worker puede pesar hasta 3 MiB comprimido en el plan gratis y 10 MiB en el pago [1]. La página de límites de Cloudflare, consultada el mismo día, dice que solo cuenta el tamaño sin comprimir, hasta 64 MiB en ambos planes [4]. Manda Cloudflare (es quien aplica el límite), pero se confirma en el PR 2 con un `wrangler deploy --dry-run`.

### 3.3 Planes y límites que importan

| | Workers Free | Workers Paid (US$5 al mes mínimo) | Fuente |
|---|---|---|---|
| Visitas | 100 000 por día | 10 millones al mes incluidos; luego US$0.30 por millón | [3][4] |
| **CPU por visita** | **10 ms** | Hasta 5 min (30 s por defecto); 30 millones de ms al mes incluidos | [3][4] |
| Cron | 5 por cuenta | 250 por cuenta | [4] |
| D1: filas leídas | 5 millones por día | 25 000 millones al mes incluidas | [5] |
| D1: filas escritas | 100 000 por día | 50 millones al mes incluidas | [5] |
| D1: espacio | 5 GB en total; 500 MB por base | 5 GB incluidos; 10 GB por base | [5][8] |
| D1: consultas por visita | 50 | 1000 | [8] |
| D1: copia para volver atrás (*Time Travel*) | 7 días | 30 días | [8][9] |
| D1: tamaño máximo de una fila | 2 MB | 2 MB | [8] |

**Por qué Workers Paid y no Free:** 10 ms de CPU es muy poco para dibujar una página de Next.js en el servidor; si una visita se pasa, falla. No se midió con Tiendly (**sin verificar**), pero el riesgo de que la tienda de alguien no cargue en plena campaña no vale US$5. Además, con el plan gratis, si un día se pasa el límite de lecturas, D1 deja de responder hasta el día siguiente [5].

Dos datos de D1 que cambian cómo se programa:

- **Una base D1 atiende una consulta a la vez** [8]. Para 5–10 tiendas no es problema y simplifica la concurrencia: dos escrituras nunca se mezclan a la mitad.
- **No hay transacciones "interactivas"** (abrir, leer, decidir, escribir, cerrar). Lo que sí hay es `batch()`: una lista de sentencias que se guarda completa o se deshace completa [10]. Todo el plan de concurrencia (§4.3) se apoya en eso.

---

## 4. Modelo de datos

### 4.1 Dos etapas, y por qué

| | Etapa 1 · para la beta (noviembre) | Etapa 2 · antes del registro abierto (diciembre–enero) |
|---|---|---|
| Forma | El mismo documento por tienda de hoy, en una fila de D1, con un número de versión. | Tablas por módulo: tiendas, productos, variantes, pedidos, cupones… |
| Cambia en el código | `almacen.ts`, `tienda.ts`, `ingreso.ts` y `fotos.ts`, en `frontend/src/lib/datos/`. El resto de la app no se entera. | Cada módulo pasa a sus propias consultas, uno por PR. |
| Migraciones | `backend/db/migraciones/0001_etapa_1.sql` | `backend/db/migraciones/0002_…` en adelante, una por módulo |
| Arregla | Guardados que se pisan (§2.4-1), stock y número duplicados (§2.4-2), entornos mezclados (§2.4-3). | Además: búsquedas y reportes entre tiendas, sin tope de tamaño, auditoría por fila. |
| Horas estimadas | 5–6 h | 25–35 h |
| Límite | Una fila de D1 pesa hasta 2 MB. Con fotos como URLs, una tienda llega a cientos de pedidos antes de acercarse. Se vigila el tamaño. | — |

La plataforma se migra **una sola vez** (hosting y datos juntos, en noviembre). Pasar de la Etapa 1 a la 2 es una migración dentro de D1, sin mudanza de proveedor.

### 4.2 Etapa 1 · tablas

| Tabla | Columnas clave | Para qué |
|---|---|---|
| `tiendas_documento` | `slug` (clave primaria), `datos` (el JSON de hoy), `version` (entero), `creada_el`, `actualizada_el` | Reemplaza `production:tienda:<slug>`. |
| `ingreso_celular` | `celular` (clave primaria), `slug` | Reemplaza `production:ingreso:<celular>`. Se conserva solo para la bandera `NEXT_PUBLIC_INGRESO_CELULAR` (#40). |
| `user`, `session`, `account`, `verification` | Las crea la librería de ingreso (§5) | Personas que ingresan con Google y sus sesiones. |
| `miembros` | `usuario_id`, `tienda_slug`, `rol` (`titular`), `creado_el` | Quién puede abrir el panel de qué tienda. |

Ya no hacen falta los prefijos `production:`/`preview:`/`local:`: cada entorno tiene **su propia base** (§7).

**Guardar sin pisar a nadie (control optimista):** se lee la fila con su `version`; al guardar se escribe solo si nadie la cambió mientras tanto.

```sql
UPDATE tiendas_documento
SET datos = ?, version = version + 1, actualizada_el = ?
WHERE slug = ? AND version = ?;   -- la versión que se leyó
```

Si la respuesta dice "0 filas cambiadas", otra persona guardó primero: `mutarTienda` vuelve a leer y a aplicar el cambio (hasta 3 intentos). Por eso la función que se le pasa a `mutarTienda` no puede tener efectos fuera del documento (subir fotos, por ejemplo, se hace antes, como hoy).

**Dos arreglos chicos que la Etapa 1 necesita en el checkout:** `registrarPedido` y `reservarNumero` tienen que revisar stock, número y cupón **dentro** del cambio que se le pasa a `mutarTienda`, no en una lectura previa. Con el control de versiones, si dos compras se cruzan, la segunda se repite con el stock ya descontado.

### 4.3 Etapa 2 · tablas por módulo

Convenciones:

- **Dinero en céntimos, como entero** (S/ 90.99 → `9099`). Evita errores de redondeo con decimales; la app convierte al leer y al mostrar.
- **Momentos en texto ISO en UTC** (`2026-11-20T15:30:00.000Z`), como `creadaEl` y `creadoEl` hoy. La hora de Lima se aplica al mostrar (`frontend/src/lib/reloj.ts`).
- **Días de Lima como texto `AAAA-MM-DD`** para ofertas y cupones, como hoy. SQLite no sabe de zonas horarias: la app calcula "hoy en Lima" y lo pasa en la consulta.
- **Listas cortas y ordenadas como JSON** (valores de una opción, categorías, rubros) cuando no se buscan por separado.
- `CHECK`: una regla en la tabla que rechaza valores fuera de una lista (por ejemplo, un estado de pago inventado).

#### Tiendas, personas y plan

| Tabla | Columnas clave | Relaciones y reglas |
|---|---|---|
| `tiendas` | `id`, `slug` (único), `nombre`, `plan` (`free`, `beta_plus`, `pro`), `plan_vence_el`, `celular_ventas`, `celular_ingreso` (único, opcional), `nombre_ofertas`, `rubros` (JSON), `rubro_otro`, `apariencia` (JSON: tema, acento, logo, portada, bienvenida, Instagram, horario), `hechos` (JSON), `es_demo`, `ultimo_numero` (empieza en 1000), `version`, `creada_el`, `actualizada_el` | `ultimo_numero` reemplaza `pedidos.ultimo`. `celular_ingreso` existe solo para la bandera de #40. |
| `user`, `account`, `session` | Las define la librería de ingreso | `account` guarda el identificador de Google. |
| `miembros` | `tienda_id`, `usuario_id`, `rol` (`titular`, `equipo`), `creado_el` | Clave primaria (`tienda_id`, `usuario_id`). En la beta, una persona titular por tienda. |

`duena` (nombre de pila de Google) deja de guardarse en la tienda: sale de `user.name`. Así se cumple el pendiente de `docs/traspaso.md` de renombrarlo cuando llegue el backend, y se quita una palabra con género.

#### Catálogo, opciones, variantes y ofertas

| Tabla | Columnas clave | Relaciones y reglas |
|---|---|---|
| `productos` | `id`, `tienda_id`, `slug`, `nombre`, `descripcion`, `sku`, `estado` (`activo`, `pausado`), `precio`, `precio_antes`, `oferta_desde`, `oferta_hasta`, `categorias` (JSON), `opcion_fotos`, `tabla_tallas` (JSON), `tabla_tallas_modo` (`heredada`, `sin-tabla`, `propia`), `orden`, `version`, `creado_el`, `actualizado_el` | Único (`tienda_id`, `slug`): hoy el link sale del nombre y dos productos con el mismo nombre chocan. `precio_antes > precio` o vacío. `tabla_tallas_modo` guarda la diferencia entre `null` y ausente que hoy usa 0037. |
| `producto_opciones` | `producto_id`, `posicion` (0–2), `nombre`, `tipo` (`color`, `talla`, `otra`), `valores` (JSON en orden) | Hasta 3 por producto (0032). |
| `variantes` | `id`, `producto_id`, `clave` (`"Plata\|36"`; `""` sin opciones), `valores` (JSON), `stock` (≥ 0) | Único (`producto_id`, `clave`). `stock` es el stock base que escribe quien vende. |
| `producto_fotos` | `id`, `producto_id`, `grupo` (valor de la opción que cambia fotos; `""` = galería única), `posicion`, `r2_clave` | La primera foto del grupo general es la principal. |

**Ofertas:** no necesitan tabla propia; son tres columnas del producto. La regla de 0034 no cambia: la oferta está activa si `precio_antes > precio`, `oferta_desde` ≤ hoy en Lima y `oferta_hasta` ≥ hoy en Lima (vacías: sin límite). Fuera de esas fechas se cobra `precio_antes`.

#### Pedidos, líneas, reservas y pagos

| Tabla | Columnas clave | Relaciones y reglas |
|---|---|---|
| `pedidos` | `id`, `tienda_id`, `numero` (entero; se muestra como `#TL-1042`), `creado_el`, `cliente_nombre`, `cliente_celular`, `cliente_email`, `unidades`, `subtotal`, `descuento`, `envio`, `total`, `cupon_codigo`, `pago_estado`, `pago_metodo`, `reserva_hasta`, `entrega_metodo`, `entrega_estado`, `distrito`, `direccion`, `referencia`, `recojo` (JSON, copia al comprar), `enviado_el`, `entregado_el`, `cancelado_el`, `cancelacion` (`tienda`, `reserva-vencida`), `nota`, `version` | Único (`tienda_id`, `numero`). `reserva_hasta` = `creado_el` + 24 h solo si el pago es pendiente y no es contra entrega. Un pedido cancelado no vuelve a otro estado (#31). |
| `pedido_items` | `id`, `pedido_id`, `producto_id` (puede quedar vacío si se borra el producto), `variante_clave`, `nombre`, `texto_variante`, `cantidad`, `precio_unitario`, `foto_url` | Copia de cómo era el producto al comprar, como hoy. |
| `reservas_stock` | `pedido_id`, `variante_id`, `cantidad`, `tipo` (`vendido`, `reservado`), `hasta` | Es el `inventario` de hoy, fila por fila. Disponible = `variantes.stock` − vendidos − reservas con `hasta` en el futuro. |
| `pagos` | `id`, `pedido_id`, `metodo`, `monto`, `estado` (`confirmado`, `anulado`), `registrado_el`, `registrado_por` (persona o `checkout`), `nota` | **Manual por ahora:** quien vende marca "Pagado" y se crea una fila. Desmarcar no borra: la pasa a `anulado` (hoy, `pagosDesmarcados`). Cuando haya pasarela, la pasarela crea la fila. |
| `pedido_eventos` | `id`, `pedido_id`, `tipo`, `ocurrido_el`, `usuario_id`, `detalle` (JSON) | Historial y auditoría: creado, pagado, enviado, entregado, cancelado, corrección de pago. |

Estados de un pedido (0007, 0010 y #31):

```
pago:     pendiente ──(paga)──► pagado
              │                   │
              │(vence 24 h o      │(la tienda cancela)
              │ la tienda cancela)▼
              └────────────► cancelado   ← no se reabre
entrega:  por-enviar ──► enviado ──► entregado   (recojo: por recoger ──► recogido)
```

**Reserva de 24 h, en dos capas:**

1. **Al leer** (como hoy): `conReglas` muestra como cancelado lo vencido. Así la regla se cumple aunque el cron se atrase.
2. **Cron cada 15 min** en el Worker `tiendly-tareas`: pasa a `cancelado` los pedidos con `reserva_hasta` vencida, con `cancelacion = 'reserva-vencida'`, borra su fila de `reservas_stock` y deja un evento. Así la base dice la verdad y los reportes no tienen que repetir la regla. El cron va en un Worker aparte porque **no está verificado** que el Worker de OpenNext acepte tareas programadas.

**Comprar sin vender de más (Etapa 2):** el pedido, sus líneas, sus reservas, el número y el uso del cupón se guardan en **un solo `batch()`**. La protección contra sobreventa sería un *trigger* (una regla que la base ejecuta sola antes de insertar) que aborta si la reserva deja el disponible bajo cero; al fallar esa sentencia, se deshace el lote entero [10]. **Sin verificar** que D1 acepte triggers con `RAISE(ABORT)`: se prueba en el PR de pedidos de la Etapa 2. Si no, la alternativa es mantener la Etapa 1 (documento con versión) para el checkout.

#### Cupones

| Tabla | Columnas clave | Reglas |
|---|---|---|
| `cupones` | `id`, `tienda_id`, `codigo`, `tipo` (`porcentaje`, `monto`, `envio`), `valor`, `compra_minima`, `desde`, `hasta`, `limite_usos`, `usos`, `activo` | Único (`tienda_id`, `codigo`) sin distinguir mayúsculas. El uso se suma en el mismo lote que el pedido, solo si `usos < limite_usos`. Free: máximo 3 en uso (0008). |

#### Pagos de la tienda, entregas por zona y Afiliación

| Tabla | Columnas clave | Reglas |
|---|---|---|
| `config_pagos` | `tienda_id` (clave primaria), `whatsapp_activo`, `whatsapp_celular`, `cobros_estado` (`sin-activar`, `en-revision`, `activo`), `tarjeta`, `yape`, `cuenta` (JSON: banco, tipo, últimos 4, titular) | Una fila por tienda. |
| `config_entregas` | `tienda_id` (clave primaria), `delivery_activo`, `envio_gratis_activo`, `envio_gratis_desde`, `recojo_activo`, `recojo_direccion`, `recojo_distrito`, `recojo_horario`, `recojo_nota` | Una fila por tienda (0009). |
| `zonas_entrega` | `tienda_id`, `zona` (`lima`, `callao`, `provincias`), `activa`, `costo`, `plazo` | Clave primaria (`tienda_id`, `zona`). **Hoy `costo` es texto libre**; en la Etapa 2 pasa a céntimos (pregunta abierta en §12). |
| `solicitudes_afiliacion` | `id`, `tienda_id`, `numero`, `estado` (`revision`, `observada`, `aprobada`), `datos` (JSON), `negocio` (JSON), `enviada_el`, `respuesta` | Tiene DNI y CCI: solo la persona titular la lee. El borrador sigue en el navegador. |

#### Plan por tienda

- `tiendas.plan` acepta `free`, `beta_plus` y `pro`; `plan_vence_el` permite un plan de prueba con fecha.
- Hoy el código conoce solo `free` y `pro` (`TiendaSesion.plan`, límite de cupones). **Qué incluye `beta_plus` no está definido** (§12). Mientras tanto, la app lo trata como `pro`.
- Los límites por plan viven en una sola función del código (hoy, `limiteCupones`), no en la base: cambiar un límite no pide migración.

---

## 5. Ingreso con Google

### 5.1 La librería

**Recomendación: Better Auth.** Es una librería de ingreso para apps JavaScript. Desde su versión 1.5 acepta el binding de D1 directamente, sin adaptador [11], y ofrece Google como proveedor. Guarda personas y sesiones en D1 (`user`, `session`, `account`). Alternativa: Auth.js, que tiene adaptador para D1 [12].

Lo que Better Auth **no** puede hacer en D1: funciones que piden transacciones interactivas, como su plugin SCIM [11]. Tiendly no las necesita.

### 5.2 Cómo cambia el flujo

1. `/registro` → "Continuar con Google" → Google confirma la cuenta → vuelve a Tiendly con una sesión.
2. Si la persona no tiene tienda, sigue el onboarding de hoy (nombre, link, WhatsApp de ventas, rubros). `crearTienda` crea la tienda **y** la fila de `miembros`.
3. Si ya tiene tienda, va directo al panel.
4. **`slugPanel()` deja de confiar en la cookie `tiendly_tienda`.** La tienda del panel sale de la sesión → `miembros`. Cada acción de servidor del panel lo comprueba antes de guardar.
5. Sin sesión, el panel sigue mostrando la demo de solo lectura (0046). En cualquier entorno que no sea exactamente `local` o `preview`, también de solo lectura (§7.1).

### 5.3 Compatibilidad con #40 y el ingreso por número

- La bandera `NEXT_PUBLIC_INGRESO_CELULAR` sigue igual: apagada en producción, encendida en local y en las pruebas E2E.
- `celular_ingreso` (Etapa 2) o `ingreso_celular` (Etapa 1) conserva el índice de hoy. Con la bandera apagada, el servidor rechaza el ingreso por número, como en #40.
- Cuando el código de WhatsApp se envíe y verifique de verdad, el número se suma como **otra forma de ingresar a la misma persona** (en `account`), no como una tienda aparte. **Sin verificar** qué plugin de Better Auth sirve para eso.

### 5.4 Lo que hay que preparar en Google

- Un proyecto de Google Cloud con la cuenta de Tiendly y una credencial OAuth de tipo "aplicación web".
- **Direcciones de retorno exactas:** Google solo vuelve a URLs registradas, sin comodines. Se registran la de producción (`https://tiendly.<subdominio>.workers.dev/api/auth/callback/google`), la de local (`http://localhost:3100/...`) y, cuando exista, la de `tiendly.pe`.
- **Previews:** sus URLs cambian, así que Google no puede volver a ellas. En preview y local se usa un **ingreso de prueba** que solo existe cuando `TIENDLY_ENTORNO` vale exactamente `local` o `preview`. Si falta o es otro valor, el servidor lo rechaza (§7.1).
- **Pantalla de consentimiento:** con los permisos básicos (correo, nombre y foto), Google no debería pedir revisión; en modo "Testing" se pueden anotar los correos de la beta como cuentas de prueba. **Sin verificar**: confirmarlo en la consola al crear la credencial.
- La contraseña de la credencial (*client secret*) se guarda como **secreto** en Cloudflare: un valor cifrado que el Worker lee y que no va al repo.

---

## 6. Fotos en R2

- **Buckets** (un *bucket* es una carpeta raíz de R2): `tiendly-fotos-prod` y `tiendly-fotos-preview`. Local usa la emulación de R2 en la compu (§7).
- **Claves:** `productos/<tienda_id>/<uuid>.jpg`, igual que hoy en Blob.
- **Subida:** igual que hoy (la foto llega achicada a 1200 px desde el navegador, por la acción de guardar), pero `frontend/src/lib/datos/fotos.ts` escribe en el binding de R2.
- **Cómo se sirven, sin dominio todavía:** una ruta del propio Worker, `/fotos/<clave>`, lee de R2 y responde con caché larga. No hace falta dominio ni bucket público.
- **`next/image`:** al inicio, `images.unoptimized: true` en `frontend/next.config.ts` (las fotos ya llegan achicadas). Optimizar con Cloudflare Images pide un dominio en Cloudflare para el *loader*; el plan gratis permite 5000 transformaciones únicas al mes y, pasado eso, falla sin cobrar [13][6]. Se activa cuando esté `tiendly.pe`.
- **Costo:** la capa gratis de R2 da 10 GB al mes, 1 millón de escrituras y 10 millones de lecturas, sin cobrar la salida [14]. Una foto de ~200 KB → unas 50 000 fotos en 10 GB.

---

## 7. Entornos separados

| | Local (tu compu) | Preview (cada PR) | Producción |
|---|---|---|---|
| App | `next dev` en `frontend/` | Worker de preview de Workers Builds | Worker `tiendly` |
| D1 | Copia en la compu (archivo SQLite en `.wrangler/`) | `tiendly-preview` | `tiendly-prod` |
| R2 | Copia en la compu | `tiendly-fotos-preview` | `tiendly-fotos-prod` |
| Google | Ingreso de prueba (o Google con `localhost`) | Ingreso de prueba | Google real |
| `TIENDLY_ENTORNO` | `local` | `preview` | `production` |

- **Por qué esto cierra el riesgo de hoy:** en local, OpenNext conecta `next dev` con una D1 y una R2 de mentira dentro de la compu (`initOpenNextCloudflareForDev()`) [2]. La compu **no tiene** credenciales de producción, así que no puede escribir ahí aunque se equivoque un prefijo.
- **Previews:** Workers Builds crea un preview por rama y usa los bindings y variables de "Preview", distintos de los de producción [15]. La base de preview se puede vaciar y volver a sembrar con las demos cuando haga falta.
- **Solo Workers Builds publica producción**, desde `main`. Nadie hace `wrangler deploy` a mano.
- **`VERCEL_ENV` deja de existir.** Hoy lo usan `src/lib/entorno.ts`, `src/lib/datos/tienda.ts`, `ingreso.ts`, `semillas.ts`, `src/lib/sesion.ts` (protección de demos), y las páginas de Mi tienda y Afiliación. En Cloudflare valdría vacío, y la protección de demos de 0046 **se apagaría en producción**. Se reemplaza por una sola variable, `TIENDLY_ENTORNO`, con la regla de §7.1.

### 7.1 Regla a prueba de fallas: `TIENDLY_ENTORNO`

**El problema de hoy.** `demoProtegida` (en `src/lib/sesion.ts`) protege las demos solo si `VERCEL_ENV === "production"`. Si la variable falta, las demos quedan **editables**: la regla falla abierta. Las páginas de Mi tienda y Afiliación hacen lo mismo con sus datos de ejemplo. En Cloudflare, donde `VERCEL_ENV` no existe, eso pasaría en producción.

**La regla nueva: ante la duda, producción.**

| Valor de `TIENDLY_ENTORNO` | Se trata como | Demos | Ingreso de prueba | `/kit` y `?escenario=` |
|---|---|---|---|---|
| `local` (exacto) | local | Se editan | Sí | Sí |
| `preview` (exacto) | preview | Se editan | Sí | Sí |
| `production` | producción | **Solo lectura** | **No** | No |
| Falta, vacío o cualquier otro (`prod`, `Production`, `" local"`, un error de tipeo) | **producción** | **Solo lectura** | **No** | No |

- **Se compara exacto:** sin quitar espacios ni ignorar mayúsculas. Un valor casi correcto cuenta como inválido, a propósito.
- **Lo que relaja la protección siempre se pide de forma explícita.** Ningún valor por defecto, ninguna variable ausente y ningún error de configuración puede encender la edición de demos ni el ingreso de prueba.
- **Un solo lugar lee la variable:** `frontend/src/lib/entorno.ts`. El resto del código usa sus funciones (por ejemplo, `entorno()`, `puedeEditarDemos()`, `ingresoDePruebaActivo()`) y nunca lee `process.env.TIENDLY_ENTORNO` directo.
- **Un valor inválido deja un aviso** en los registros del Worker (una línea por arranque), sin cortar la app. Así se nota el error sin que la tienda se caiga.
- **`TIENDLY_ENTORNO` no elige la base de datos.** La base y el bucket los fija el binding de cada entorno (tabla de arriba). Aunque la variable estuviera mal en un preview, ese preview solo puede escribir en `tiendly-preview`.
- **La demo por defecto sigue la misma lógica:** si `TIENDLY_TIENDA_DEMO` falta y el entorno se trata como producción, la demo es `muna`. Heather (sin permiso para ser pública, 0030) solo aparece si la variable lo pide y el entorno es exactamente `local`.
- **Costo de la regla:** en tu compu, sin la variable, las demos no se editan. Hay que poner `TIENDLY_ENTORNO=local` en `frontend/.dev.vars`; `frontend/README.md` lo explica en "Primeros pasos".
- **Pruebas mínimas** (funciones puras, en el PR 2): `undefined`, `""`, `"prod"`, `"Production"` y `" local"` → producción; `"local"` → local; `"preview"` → preview; `"production"` → producción.

### 7.2 Link de las tiendas configurable

- Ya existe `TIENDLY_URL_TIENDAS` (`frontend/src/lib/link-tienda.ts`). Se suma `TIENDLY_URL_BASE` para la app (la que usa el ingreso con Google). Hoy valen lo mismo:
  - Antes del dominio: `https://tiendly.<subdominio>.workers.dev`.
  - Con dominio: `https://tiendly.pe`.
- **Recomendación:** comprar `tiendly.pe` **antes de invitar a la beta**. Los links que la beta pegue en su bio de Instagram o en sus estados de WhatsApp son difíciles de cambiar después. Si no se compra a tiempo, el Worker sigue respondiendo en `workers.dev` y se agrega una redirección al dominio cuando llegue.

---

## 8. Mudanza desde Redis y Blob

### 8.1 Lo que hay que mudar hoy es casi nada

Tras la limpieza del 29-oct, producción tiene solo `production:tienda:muna` y `production:tienda:glow-labo` (demos). **Si la beta empieza ya en Cloudflare, no hay tiendas reales que mudar**: las demos se siembran desde `semillas.ts`. Por eso: **no invitar a ninguna tienda antes de la mudanza**.

### 8.2 Igual se escribe el script, por si acaso

`backend/scripts/migrar-desde-redis.ts` (se corre con `npx tsx`, que ejecuta TypeScript sin compilarlo antes):

1. Lee Redis con el token **de solo lectura** (`KV_REST_API_READ_ONLY_TOKEN`), recorriendo `production:tienda:*` y `production:ingreso:*`.
2. Guarda un respaldo JSON fuera del repo (`~/tiendly-respaldos/`, permisos 0600), como en la limpieza del 29-oct.
3. Pasa cada documento por `migrarDatos` (formato 0032, importado de `frontend/src/lib/datos/migrar.ts`) y le quita el prefijo de entorno.
4. Descarga cada foto de `*.public.blob.vercel-storage.com`, la sube a R2 y cambia la URL por `/fotos/<clave>`.
5. Escribe un archivo SQL y lo aplica con `wrangler d1 execute`, **primero en `tiendly-preview`**; solo con el ok de Gabi, en `tiendly-prod`.
6. Se puede correr dos veces sin duplicar (si la tienda existe, la reemplaza).

### 8.3 El día del cambio

1. Producción en Cloudflare con las demos sembradas y Google funcionando (PRs 1–6 de §9).
2. Script en modo prueba contra preview; revisión de las tiendas migradas, si las hay.
3. Script contra producción, con ok de Gabi.
4. `TIENDLY_URL_TIENDAS` apunta a Cloudflare.
5. **Vercel sigue encendido dos semanas** como respaldo, sin cambios. Después, su dirección redirige a Cloudflare.
6. Upstash y Blob se borran **solo** con el ok de Gabi y con respaldo comprobado.

### 8.4 Copias de seguridad

- *Time Travel* de D1, siempre activo: vuelve la base a cualquier minuto de los últimos 30 días (plan Paid) [9]. Restaurar **reemplaza** la base entera: se hace solo con ok de Gabi.
- Además, una exportación semanal (`wrangler d1 export`) guardada fuera de Cloudflare.

---

## 9. Orden de trabajo

Todo sale de `main` actualizado, en ramas y worktrees aparte (AGENTS.md), y **nada se mergea sin el ok de Gabi**. "Quién" es una sugerencia.

| # | PR / paso | Qué incluye | Horas | Quién |
|---|---|---|---|---|
| 0 | Decisiones (sin PR) | Aprobar este plan; cerrar #22; decidir qué pasa con #40 (§10.1); activar Workers Paid en la cuenta de Tiendly. | 1 | Gabi |
| 1 | `chore/monorepo` | Mover todo a `frontend/` y crear `backend/` (§10). Sin cambios de código. Renombre del repo justo después (§10.4). | 2–3 | Gabi o agente |
| 2 | `chore/cloudflare-prueba` | **La prueba de riesgo:** la app actual en un Worker de prueba, sin datos (memoria). `frontend/wrangler.jsonc`, `frontend/open-next.config.ts`, `.dev.vars` en `.gitignore`. Mide CPU por visita y peso del Worker; prueba acciones de servidor, `revalidatePath`, fotos y `next/image`. Cambia `VERCEL_ENV` por `TIENDLY_ENTORNO` con la regla de §7.1 y sus pruebas. | 4–6 | Diego o agente |
| 3 | `feat/d1-etapa-1` | `backend/db/migraciones/0001_etapa_1.sql` (tablas de §4.2), `frontend/src/lib/datos/almacen.ts` sobre D1 con versión, D1 local, demos sembradas, arreglos del checkout de §4.2, `backend/README.md` con los comandos. | 5–6 | Agente, con revisión de Diego |
| 4 | `feat/fotos-r2` | `frontend/src/lib/datos/fotos.ts` sobre R2, ruta `/fotos/<clave>`, `frontend/next.config.ts` sin Blob. | 2–3 | Agente |
| 5 | `feat/ingreso-google` | Better Auth + Google, `miembros`, `slugPanel()` desde la sesión, permisos en cada acción del panel, ingreso de prueba en local/preview, el contenido de #40. | 7–9 | **Diego** (en paralelo con 3–4) |
| 6 | Mudanza | Script de §8.2, bases y buckets de producción, Workers Builds conectado a `main`, cambio de §8.3. | 3–4 | Gabi + agente |
| 7 | `feat/reservas-cron` | Worker `tiendly-tareas` en `backend/workers/tareas/`, con el cron de §4.3. | 2 | Agente |
| — | **Beta con 5–10 tiendas** | Invitaciones. | — | Gabi |
| 8–12 | Etapa 2, un PR por módulo | Tiendas y personas → catálogo → pedidos/stock/pagos → cupones → configuración y Afiliación. Cada uno con su migración y su script de paso desde la Etapa 1. | 25–35 | Diego + agente |

### 9.1 Calendario realista

- **Hasta la beta (PRs 0–6):** unas 25–32 h.
- A 12–15 h por semana, solo Gabi: termina entre el **16 y el 22 de noviembre**.
- Con Diego en el PR 5 en paralelo: **alrededor del 15 de noviembre**.
- El PR 7 (cron) puede ir después de las invitaciones: la regla de 24 h ya se cumple al leer.
- La Etapa 2 va en diciembre y la primera quincena de enero, **antes del registro abierto**. Hasta entonces, la beta funciona sobre la Etapa 1.

### 9.2 Si la prueba del PR 2 falla

Si Next.js 16 no funciona en Workers por algo que no se arregla en un día, **la alternativa más chica** es:

- La app sigue en Vercel.
- D1 y R2 se usan a través de un Worker de API chico (`backend/api/`), al que las acciones de servidor llaman con un secreto compartido.
- Los datos quedan en Cloudflare igual; el hosting se muda cuando OpenNext lo permita.

Costo: un Worker y un secreto más. Ojo: si el proyecto de Vercel está en el plan Hobby, revisar si el uso comercial está permitido (**sin verificar**).

---

## 10. Reorganización del repo (PR 1)

### 10.1 Qué tiene que ser cierto antes

- **Ningún PR abierto.** Cada PR abierto quedaría con todas sus rutas viejas y su preview se rompería.
- **#22 cerrado** (ya está decidido que no se mergea) y su rama borrada, junto con `src/features/prototipo-ofertas`, si Gabi lo confirma.
- **Decisión sobre #40.** Mi recomendación: cerrarlo con un comentario que apunte al PR 5 y traer sus commits a ese PR con `git cherry-pick` después de la mudanza (Git reconoce los archivos movidos). Son 4 archivos de código y la decisión 0047. Mantenerlo abierto también funciona, pero pide un merge de `main` con conflictos de rutas.
- **El servidor de Gabi en 3100 detenido por Gabi.** Después de la mudanza se levanta desde `frontend/`:
  `cd frontend && npm install && TIENDLY_TIENDA_DEMO=muna PORT=3100 npx next dev -p 3100`.
- Los worktrees de `/private/tmp/tiendly-*` quedan con rutas viejas: se borran.

### 10.2 Qué se mueve

```
tiendly/
├── AGENTS.md            (se queda; rutas actualizadas)
├── CLAUDE.md            (se queda; rutas actualizadas)
├── README.md            (nuevo y corto: qué hay en cada carpeta)
├── docs/                (se queda: decisiones, traspaso, capturas, este plan)
├── frontend/
│   ├── DESIGN.md
│   ├── README.md        (el README de hoy)
│   ├── design/  public/  scripts/  src/
│   ├── package.json  package-lock.json  tsconfig.json
│   ├── next.config.ts  postcss.config.mjs  next-env.d.ts
│   ├── .vercelignore
│   └── fotos-originales/   (ignorada por Git; se mueve a mano)
└── backend/
    ├── README.md        (cómo crear la base local y aplicar migraciones)
    ├── db/migraciones/  (SQL numerado, vacío al inicio)
    ├── workers/tareas/  (el cron, en el PR 7)
    └── scripts/         (migrar-desde-redis, exportar respaldo)
```

Se mueve con `git mv`, en un commit que **solo** mueve, para que el historial de cada archivo se siga con `git log --follow`.

### 10.3 Qué se rompe si se hace mal

| Qué | Qué pasa | Cómo se evita |
|---|---|---|
| **Root Directory en Vercel** | Sin cambiarlo a `frontend`, el build de `main` no encuentra `package.json` y falla. Producción se queda en el último despliegue bueno, pero nada nuevo sale. | Cambiar el ajuste en Vercel **justo antes** del merge y mirar el despliegue de `main`. En Cloudflare (PR 6) se configura `frontend` desde el inicio [15]. |
| **Previews** | Un PR abierto antes de la mudanza construye con las rutas viejas y falla. | Mudanza sin PRs abiertos (§10.1). |
| **`check:tokens` y `tokens`** | Usan rutas relativas a `scripts/` (`../src`, `../design/tokens.json`). Si `scripts/`, `src/` y `design/` se mueven juntos, siguen funcionando. Si se separan, fallan. | Moverlos juntos y correr `npm run check:tokens` y `npm run build` en `frontend/`. |
| **AGENTS.md, CLAUDE.md, DESIGN.md** | Nombran `src/…`, `design/tokens.json`, `DESIGN.md` y `docs/…` como si todo estuviera en la raíz. Un agente buscaría archivos que no existen. | Actualizar las rutas en el mismo PR (`frontend/src/…`, `frontend/DESIGN.md`). Las de `docs/` no cambian. Agregar a AGENTS.md: "los comandos `npm` se corren en `frontend/`". |
| **Decisiones viejas** | `docs/decisiones/00xx` citan `src/…`. | No reescribirlas: una nota en su README dice que las rutas anteriores a esta fecha son relativas a `frontend/`. |
| **`.gitignore`** | `/fotos-originales/` está anclada a la raíz y dejaría de ignorar la carpeta movida: fotos pesadas podrían subirse. | Cambiarla a `/frontend/fotos-originales/`. `node_modules`, `.next` y `.env*` funcionan en cualquier carpeta. En el PR 2 se suman `.dev.vars`, `.wrangler/` y `.open-next/`. |
| **Links a archivos en GitHub** | Los links de PRs y del traspaso a `blob/main/src/…` darán 404 (GitHub no redirige rutas de archivos movidos). | Aceptarlo para PRs viejos; corregir solo los de AGENTS.md, CLAUDE.md y `docs/traspaso.md`. Las capturas en `docs/capturas/` no se mueven. |
| **Memorias y skills de los agentes** | Algunas notas citan `src/lib/datos/…` y el servidor desde la raíz. | Actualizarlas después del merge. |

### 10.4 ¿Renombrar `tiendly-web` → `tiendly` en el mismo paso?

**Sí, el mismo día, pero como paso separado:** después del merge del PR 1 con el despliegue en verde, y **antes** de conectar Cloudflare (PR 6), para que Cloudflare se conecte ya al nombre final.

Qué pasa al renombrar, según GitHub [16]:

| Qué | Efecto |
|---|---|
| Links web a issues y PRs | Redirigen al nombre nuevo. Los links de `docs/traspaso.md` siguen funcionando. |
| `git pull` y `git push` con la URL vieja | Siguen funcionando por redirección. Se recomienda actualizar: `git remote set-url origin https://github.com/gaabrielavelasquez/tiendly.git`. Los worktrees comparten esa configuración: basta una vez. |
| GitHub Actions | GitHub no redirige llamadas a acciones de un repo renombrado. Tiendly no tiene `.github/`, así que no le afecta. |
| Crear otro repo llamado `tiendly-web` | **Nunca:** rompe todas las redirecciones. |
| Conexión con Vercel | **Sin verificar** que Vercel siga el nombre nuevo solo. Después de renombrar, revisar en el proyecto de Vercel → Git que diga `tiendly` y hacer un despliegue de prueba. |
| Conexión con Cloudflare | Se conecta después del renombre: no hay nada que romper. |
| Nombre del proyecto en Vercel y su URL | No cambian (`tiendly-web-sigma.vercel.app` sigue igual). |
| `"name"` en `package.json` | Puede quedar `tiendly-web` o pasar a `tiendly-frontend`; no afecta nada. |

---

## 11. Costos al mes

| Concepto | Costo | Nota |
|---|---|---|
| Workers Paid | US$5 | Incluye D1 (25 000 millones de lecturas, 50 millones de escrituras, 5 GB) y 10 millones de visitas [3][5]. |
| R2 | US$0 | Dentro de la capa gratis (10 GB) [14]. |
| Cloudflare Images | US$0 | Apagado al inicio; con dominio, 5000 transformaciones gratis [13]. |
| Better Auth y Google OAuth | US$0 | |
| Vercel y Upstash durante la transición | Lo de hoy | Se apagan dos semanas después del cambio. |
| **Total base de datos y hosting** | **≈ US$5** | Dentro del tope de US$15. |
| Dominio `tiendly.pe` | Aparte | No entra en el tope de base de datos. Precio **sin verificar**. |

Cuándo mirar AWS: si una base pasa de unos 8 GB (el límite por base es 10 GB) o si D1 empieza a ser lento por atender una consulta a la vez. Para 5–10 tiendas, ninguna de las dos cosas es probable este año.

---

## 12. Preguntas abiertas para Gabi

1. **`beta_plus`:** ¿qué incluye frente a `free` y `pro`, y vence en una fecha?
2. **Costo de envío por zona:** hoy es texto libre ("S/ 10", "desde 8"). ¿Se pasa a un número en soles (lo que permite sumarlo al total) o se queda como texto informativo?
3. **#40:** ¿cerrarlo y traer sus commits al PR de Google (recomendado) o mantenerlo abierto durante la mudanza?
4. **Dominio:** ¿se compra `tiendly.pe` antes de invitar a la beta?
5. **Etapa 1 primero:** ¿de acuerdo con pasar por el documento por tienda en D1 antes de las tablas, para llegar a noviembre?

---

## 13. Fuentes

Consultadas el 29-oct-2026.

1. OpenNext para Cloudflare, página principal (versiones de Next.js soportadas, funciones, tamaño del Worker): https://opennext.js.org/cloudflare
2. OpenNext, primeros pasos (configuración de Wrangler, `nodejs_compat`, caché en R2, runtime edge no soportado, desarrollo local): https://opennext.js.org/cloudflare/get-started
3. Cloudflare Workers, precios: https://developers.cloudflare.com/workers/platform/pricing/
4. Cloudflare Workers, límites: https://developers.cloudflare.com/workers/platform/limits/
5. Cloudflare D1, precios: https://developers.cloudflare.com/d1/platform/pricing/
6. OpenNext, imágenes: https://opennext.js.org/cloudflare/howtos/image
7. OpenNext, bindings: https://opennext.js.org/cloudflare/bindings
8. Cloudflare D1, límites: https://developers.cloudflare.com/d1/platform/limits/
9. Cloudflare D1, Time Travel: https://developers.cloudflare.com/d1/reference/time-travel/
10. Cloudflare D1, API de la base (`batch()` como transacción): https://developers.cloudflare.com/d1/worker-api/d1-database/
11. Better Auth 1.5 (D1 nativo) y documentación de base de datos: https://better-auth.com/blog/1-5 · https://better-auth.com/docs/concepts/database
12. Auth.js, adaptador de D1: https://authjs.dev/getting-started/adapters/d1
13. Cloudflare Images, precios: https://developers.cloudflare.com/images/pricing/
14. Cloudflare R2, precios: https://developers.cloudflare.com/r2/pricing/
15. Cloudflare Workers Builds, configuración (directorio raíz, previews, bindings de preview): https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
16. GitHub, renombrar un repositorio: https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository
17. Wrangler, configuración (`migrations_dir` y `preview_database_id` del binding de D1): https://developers.cloudflare.com/workers/wrangler/configuration/

### Sin verificar (resumen)

- Que las acciones de servidor, `revalidatePath` y el build con Turbopack funcionen en Workers sin configuración extra (se prueba en el PR 2).
- El peso real del Worker de Tiendly y su CPU por visita (PR 2).
- Que D1 acepte triggers con `RAISE(ABORT)` (Etapa 2).
- Que el Worker de OpenNext acepte un cron propio (por eso va en un Worker aparte).
- Que Google no pida revisión con permisos básicos.
- Que Vercel siga solo el renombre del repo.
- El plugin de Better Auth para el ingreso por número.
- Si el plan actual de Vercel permite uso comercial, y el precio de `tiendly.pe`.
