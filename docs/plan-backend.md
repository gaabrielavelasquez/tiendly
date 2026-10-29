# Plan de backend · Tiendly

- **Fecha:** 29-oct-2026.
- **Para:** Gabi (decide) y Diego (retoma el plan más adelante).
- **Estado:** propuesta con las decisiones de Gabi del 29-oct-2026 (§12). No se aplicó nada: ni carpetas movidas, ni código, ni datos de producción.
- **Fuentes de Cloudflare y OpenNext:** consultadas el 29-oct-2026 (lista al final, §16). Lo que no se pudo confirmar dice **sin verificar**.
- **Rutas:** el plan está escrito para la estructura objetivo (§10): un solo repo, `tiendly`, con `frontend/` (la app de hoy), `backend/` (base de datos, Workers y scripts) y, en la raíz, `docs/`, `AGENTS.md` y `CLAUDE.md`. Solo §2, que describe el código de hoy, usa las rutas actuales (`src/…`, que pasa a ser `frontend/src/…`).

## Resumen

1. **No hay nada que bloquee el plan.** OpenNext soporta Next.js 16 con App Router, y Tiendly no usa las dos cosas que OpenNext todavía no soporta (middleware de Node y runtime edge).
2. **Conviene el plan Workers Paid (US$5 al mes).** El plan gratis da 10 ms de CPU por visita, poco para una app Next.js; el pago incluye la base de datos (D1) con mucho margen. Las fotos (R2) entran en la capa gratis.
3. **El riesgo más grave hoy no es la base de datos: es el ingreso.** El panel confía en una cookie que solo dice el link de la tienda; quien la escriba a mano entra a cualquier tienda real. Google + permisos por tienda va antes de invitar a nadie.
4. **Dos etapas de datos (decidido).** Etapa 1 (para la beta): la misma forma de hoy, un documento por tienda, pero en D1 y con un número de versión, que arregla los guardados que se pisan. Etapa 2 (antes del registro abierto de enero): tablas por módulo.
5. **Fecha:** a 12–15 h por semana, con Diego en el ingreso con Google (PR 5), la beta puede arrancar entre el **16 y el 20 de noviembre**. Si Gabi lo hace sin ayuda, entre el **20 y el 27**.
6. **Ante la duda, las demos se protegen.** Si `TIENDLY_ENTORNO` falta o trae un valor raro, la app se comporta como producción: las demos no se editan y no hay ingreso de prueba (§7.1).
7. **Antes de invitar a la beta:** ingreso con Google con permisos por tienda, `tiendly.pe` activo (se compra a inicios de noviembre) y el repo en **privado** (hoy es público y tiene fotos y datos de Heather sin su permiso, §13).
8. **Beta = "Tienda fundadora"** hasta una fecha común, el **28 de febrero de 2027**; después, plan Free con el mismo link (§4.4). Gabi viaja del 3 al 18 de febrero y Diego cubre el soporte (§14).

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
| `config.entregas` | `ConfigEntregas` | Delivery por zona (`lima`, `callao`, `provincias`) con `costo` y `plazo` **guardados como texto**; envío gratis desde un monto, también texto; recojo con dirección y horario (0009). El panel ya exige que el costo sea un número ≥ 0, con céntimos permitidos (`configuracion/lib/reglas.ts`): un texto como "S/ 10" no se puede guardar. Si llegara a guardarse, el checkout esconde esa zona sin avisar (`checkout/lib/config.ts`). |
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

**Lo que cambia dentro del documento en la Etapa 1** (decisiones de §12):

| Campo | Hoy | Etapa 1 |
|---|---|---|
| `tienda.plan` | `"free" \| "pro"` | `"free" \| "beta_plus" \| "pro"`. Un valor desconocido se lee como `free` (§4.4). |
| `tienda.betaHasta` | No existe | `"2027-02-28"` en toda tienda fundadora (§4.4). |
| `tienda.fundadora` | No existe | `{ desde, aceptoMedicionEl }`: queda aunque la tienda pase a Free, para el precio de fundadora. |
| `tienda.ultimoIngresoEl` | No existe | Momento del último ingreso al panel (ISO), para medir uso con permiso. |
| `config.entregas.delivery.zonas[]` | `costo: string` | `cobro: "fijo" \| "coordinar"`, `costo?: number` (soles enteros, solo si es fijo), `revisar?: true` (§4.5). |
| `config.entregas.delivery.envioGratis.desde` | `string` | `number` (soles enteros). |

Estos cambios se aplican **al leer**, igual que la migración de 0032 (`migrarDatos`): el documento queda en la forma nueva la próxima vez que se guarda. La conversión del costo de envío está en §4.5.

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
| `tiendas` | `id`, `slug` (único), `nombre`, `plan` (`free`, `beta_plus`, `pro`), `beta_hasta`, `fundadora_desde`, `acepto_medicion_el`, `celular_ventas`, `celular_ingreso` (único, opcional), `nombre_ofertas`, `rubros` (JSON), `rubro_otro`, `apariencia` (JSON: tema, acento, logo, portada, bienvenida, Instagram, horario), `hechos` (JSON), `es_demo`, `ultimo_numero` (empieza en 1000), `version`, `creada_el`, `actualizada_el` | `ultimo_numero` reemplaza `pedidos.ultimo`. `celular_ingreso` existe solo para la bandera de #40. `beta_hasta` vale `2027-02-28` en toda tienda fundadora; `fundadora_desde` no se borra al pasar a Free (§4.4). |
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
| `pedidos` | `id`, `tienda_id`, `numero` (entero; se muestra como `#TL-1042`), `creado_el`, `cliente_nombre`, `cliente_celular`, `cliente_email`, `unidades`, `subtotal`, `descuento`, `envio`, `envio_por_coordinar` (sí/no), `total`, `cupon_codigo`, `pago_estado`, `pago_metodo`, `reserva_hasta`, `entrega_metodo`, `entrega_estado`, `distrito`, `direccion`, `referencia`, `recojo` (JSON, copia al comprar), `enviado_el`, `entregado_el`, `cancelado_el`, `cancelacion` (`tienda`, `reserva-vencida`), `nota`, `version` | Único (`tienda_id`, `numero`). `reserva_hasta` = `creado_el` + 24 h solo si el pago es pendiente y no es contra entrega. Un pedido cancelado no vuelve a otro estado (#31). |
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
| `config_entregas` | `tienda_id` (clave primaria), `delivery_activo`, `envio_gratis_activo`, `envio_gratis_desde`, `recojo_activo`, `recojo_direccion`, `recojo_distrito`, `recojo_horario`, `recojo_nota` | Una fila por tienda (0009). `envio_gratis_desde` en céntimos, múltiplo de 100 (soles enteros, §4.5). |
| `zonas_entrega` | `tienda_id`, `zona` (`lima`, `callao`, `provincias`), `activa`, `cobro` (`fijo`, `coordinar`), `costo`, `plazo`, `revisar` | Clave primaria (`tienda_id`, `zona`). `costo` en céntimos y múltiplo de 100 (`CHECK (costo % 100 = 0)`); vacío si `cobro = 'coordinar'`. `revisar` marca lo que la migración no pudo convertir sola (§4.5). |
| `solicitudes_afiliacion` | `id`, `tienda_id`, `numero`, `estado` (`revision`, `observada`, `aprobada`), `datos` (JSON), `negocio` (JSON), `enviada_el`, `respuesta` | Tiene DNI y CCI: solo la persona titular la lee. El borrador sigue en el navegador. |

#### Plan por tienda

- `tiendas.plan` acepta `free`, `beta_plus` y `pro`. Cómo funciona `beta_plus`, en §4.4.
- Los límites y las funciones por plan viven en el código, no en la base: cambiar un límite no pide migración.

#### Uso medido (solo con permiso)

| Tabla | Columnas clave | Reglas |
|---|---|---|
| `eventos_uso` | `id`, `tienda_id`, `tipo` (ingreso al panel, producto creado, pedido recibido…), `ocurrido_el` | Solo se escriben para tiendas con `acepto_medicion_el`. Sin datos de clientes: solo qué pasó y cuándo. |

En la Etapa 1 no hace falta esta tabla: lo esencial (productos, pedidos, cupones) se cuenta desde el documento de cada tienda, y basta sumar `tienda.ultimoIngresoEl`.

### 4.4 Plan "Tienda fundadora" (`beta_plus`)

**Qué es** (decisión 1 de §12): acceso anticipado a todo lo de Pro **a medida que exista**, ayuda directa, voz en lo que se construye y un precio de fundadora garantizado cuando exista el plan pago (sin monto todavía). A cambio, la tienda acepta dos conversaciones cortas y que se mida su uso.

**Una sola fecha para todas:** `beta_hasta = 2027-02-28` (día de Lima) en cada tienda fundadora. Cambiar la fecha para todas es un solo `UPDATE`.

**Cómo decide el código qué puede usar una tienda (sin romperse):**

- Nada en el código pregunta `plan === "pro"`. Pregunta por una **capacidad**: `puede(tienda, "cupones-sin-limite")`, `puede(tienda, "banner-portada")`… La lista de capacidades vive en un solo archivo, `frontend/src/lib/planes.ts`.
- Cada capacidad dice qué planes la tienen. `beta_plus` tiene **todas las de Pro que ya existen**. Una función Pro que todavía no se construyó simplemente no está en la lista: no hay nada que romper.
- Una capacidad desconocida responde `false`, y un plan desconocido se lee como `free`. Es la misma idea de §7.1: ante la duda, lo más restrictivo.
- Hoy el código pregunta por el plan en el límite de cupones (`limiteCupones`) y en el banner de portada de Pro (0030). Esas dos preguntas pasan a ser capacidades en el PR 3.

**Al llegar la fecha (1 de marzo de 2027 en Lima):**

1. **Al leer:** una tienda `beta_plus` con `beta_hasta` vencida se trata como `free`. Así funciona aunque el cron falle.
2. **Cron** (`tiendly-tareas`, el mismo de las reservas): guarda `plan = 'free'`. No toca el slug, el link, los productos, los pedidos ni `fundadora_desde`.
3. **Lo que pasa el límite de Free** (por ejemplo, más de 3 cupones en uso): no se borra nada. **Propuesta, por confirmar con Gabi:** los que pasan el límite quedan pausados, empezando por los más nuevos, y el aviso lo explica antes.

**Aviso, semanas antes:** desde el **25 de enero de 2027**, el panel de cada tienda fundadora muestra una franja neutra, como la de 0046. Además, Gabi manda un mensaje personal **antes de viajar** (el 3 de febrero). Texto propuesto: "Tu acceso de Tienda fundadora termina el 28 de febrero. Tu tienda, tu link y tus datos siguen igual." El aviso necesita la aprobación de Gabi y una decisión en `docs/decisiones/`.

**Permiso de medición:** se pide al invitar, con un texto corto y claro. Se guarda la fecha (`acepto_medicion_el`) y se explica en la página de Privacidad (§14).

### 4.5 Costo de envío: soles enteros o "A coordinar por WhatsApp"

**La regla** (decisión 2 de §12): cada zona activa tiene **o** un costo fijo en soles enteros (sin céntimos, 0 o más) **o** la opción "A coordinar por WhatsApp", sin monto. El envío gratis desde un monto también es un número entero.

**Carrito y checkout:**

| Caso | Qué se muestra y se cobra |
|---|---|
| Zona con costo fijo | Se suma el costo al total, como hoy. |
| Zona "A coordinar por WhatsApp" | "Envío por coordinar"; no se suma al total. Reutiliza `envioPorCoordinar`, que ya existe en `Totales` para las tiendas sin entregas. |
| Envío gratis desde un monto | Se compara con el mismo cálculo de hoy (`faltaEnvioGratis`), ahora contra un número. Aplica a las zonas con costo fijo. **Propuesta, por confirmar:** en una zona por coordinar no aplica, porque no hay un monto que regalar. |
| Cupón de envío gratis (0008) | Descuenta exactamente el costo numérico de la zona elegida. **Propuesta, por confirmar:** en una zona por coordinar no se puede usar, con el error "Este cupón no aplica a envíos por coordinar." |

`reglasCompra` (`checkout/lib/config.ts`) deja de convertir texto con `Number(...)` y ya no puede esconder una zona en silencio: una zona activa siempre tiene costo fijo o "coordinar".

**Conversión de lo guardado** (al leer en la Etapa 1, y en el script de §8.2):

| Valor guardado hoy | Queda | ¿Se marca para revisar? |
|---|---|---|
| Entero: `"10"`, `"10.00"`, `"10,00"`, `"0"` | Fijo, S/ 10 (o S/ 0) | No |
| Un solo número con "S/" o "soles": `"S/ 10"`, `"10 soles"` | Fijo, S/ 10 | No |
| Con céntimos: `"10.50"` | Fijo, redondeado al sol más cercano (S/ 11) | **Sí** |
| Vacío, varios números o texto: `"desde 8"`, `"8–15"`, `"según peso"` | "A coordinar por WhatsApp" | **Sí** |
| Envío gratis `desde` con céntimos (`"99.90"`) | Redondeado hacia arriba (S/ 100) | **Sí** |

- Una zona marcada muestra, en Configuración → Entregas, una ayuda junto a su costo: "Revisa el costo de envío de Provincias." La marca se borra al guardar.
- El script de §8.2 lista en su reporte cada zona marcada, por tienda.
- Hoy producción solo tiene las demos, así que no se espera ninguna marca. La regla existe por si aparece una tienda real antes de la mudanza.

**Pantalla:** Entregas suma, por zona, la elección "Costo fijo" / "A coordinar por WhatsApp", con los componentes de selección que ya existen (`selection/*`). Es un cambio visual: necesita el ok de Gabi, una decisión nueva en `docs/decisiones/` y capturas a 390 y 1440 (CLAUDE.md §6 y §7). Va en el PR 4b (§9).

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

- **Decisión 3 de §12:** #40 se cierra **sin borrar su rama** (`fix/seguridad-ingreso`). Su contenido (la bandera, la pantalla solo con Google y la decisión 0047) entra al PR 5, que hace Diego, con `git cherry-pick` (§15).
- **Hasta el PR 5, producción sigue con el ingreso por número simulado**, como hoy en `main`. La regla no cambia: **ninguna tienda real se invita antes del ingreso con Google con permisos por tienda.**
- Desde el PR 5, la bandera `NEXT_PUBLIC_INGRESO_CELULAR` queda apagada en producción y encendida en local y en las pruebas E2E.
- `celular_ingreso` (Etapa 2) o `ingreso_celular` (Etapa 1) conserva el índice de hoy. Con la bandera apagada, el servidor rechaza el ingreso por número, como en #40.
- Cuando el código de WhatsApp se envíe y verifique de verdad, el número se suma como **otra forma de ingresar a la misma persona** (en `account`), no como una tienda aparte. **Sin verificar** qué plugin de Better Auth sirve para eso.

### 5.4 Lo que hay que preparar en Google

- Un proyecto de Google Cloud con la cuenta de Tiendly y una credencial OAuth de tipo "aplicación web".
- **Direcciones de retorno exactas:** Google solo vuelve a URLs registradas, sin comodines. Se registran la de producción (`https://tiendly.pe/api/auth/callback/google`, decisión 4 de §12), la dirección técnica (`https://tiendly.<subdominio>.workers.dev/...`) mientras el dominio se activa, y la de local (`http://localhost:3100/...`).
- **Previews:** sus URLs cambian, así que Google no puede volver a ellas. En preview y local se usa un **ingreso de prueba** que solo existe cuando `TIENDLY_ENTORNO` vale exactamente `local` o `preview`. Si falta o es otro valor, el servidor lo rechaza (§7.1).
- **Pantalla de consentimiento:** con los permisos básicos (correo, nombre y foto), Google no debería pedir revisión; en modo "Testing" se pueden anotar los correos de la beta como cuentas de prueba. **Sin verificar**: confirmarlo en la consola al crear la credencial.
- La contraseña de la credencial (*client secret*) se guarda como **secreto** en Cloudflare: un valor cifrado que el Worker lee y que no va al repo.

---

## 6. Fotos en R2

- **Buckets** (un *bucket* es una carpeta raíz de R2): `tiendly-fotos-prod` y `tiendly-fotos-preview`. Local usa la emulación de R2 en la compu (§7).
- **Claves:** `productos/<tienda_id>/<uuid>.jpg`, igual que hoy en Blob.
- **Subida:** igual que hoy (la foto llega achicada a 1200 px desde el navegador, por la acción de guardar), pero `frontend/src/lib/datos/fotos.ts` escribe en el binding de R2.
- **Cómo se sirven, sin dominio todavía:** una ruta del propio Worker, `/fotos/<clave>`, lee de R2 y responde con caché larga. No hace falta dominio ni bucket público.
- **`next/image`:** al inicio, `images.unoptimized: true` en `frontend/next.config.ts` (las fotos ya llegan achicadas). Optimizar con Cloudflare Images pide un dominio en Cloudflare para el *loader*; el plan gratis permite 5000 transformaciones únicas al mes y, pasado eso, falla sin cobrar [13][6]. Con `tiendly.pe` en Cloudflare desde noviembre, se puede activar después de la beta, si hace falta.
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
  - Mientras se activa el dominio: `https://tiendly.<subdominio>.workers.dev` (solo para pruebas, nunca para links de tiendas reales).
  - Desde la beta: `https://tiendly.pe`.
- **Decisión 4 de §12:** `tiendly.pe` se compra **a inicios de noviembre**, antes de invitar a la beta, porque los links que la beta pegue en su bio de Instagram o en sus estados de WhatsApp son difíciles de cambiar después.
  - **Primero, revisar que esté libre** (**sin verificar**).
  - **Sin verificar:** si Cloudflare Registrar vende dominios `.pe`. Si no, se compra en un registrador `.pe` y se apuntan sus *nameservers* (los servidores que dicen dónde vive el dominio) a Cloudflare.
  - **Renovación automática encendida:** si el dominio vence, se caen todas las tiendas.
  - Si el dominio no está activo a tiempo, **se atrasan las invitaciones**; no se reparten links de `workers.dev`.

---

## 8. Mudanza desde Redis y Blob

### 8.1 Lo que hay que mudar hoy es casi nada

Tras la limpieza del 29-oct, producción tiene solo `production:tienda:muna` y `production:tienda:glow-labo` (demos). **Si la beta empieza ya en Cloudflare, no hay tiendas reales que mudar**: las demos se siembran desde `semillas.ts`. Por eso: **no invitar a ninguna tienda antes de la mudanza**.

### 8.2 Igual se escribe el script, por si acaso

`backend/scripts/migrar-desde-redis.ts` (se corre con `npx tsx`, que ejecuta TypeScript sin compilarlo antes):

1. Lee Redis con el token **de solo lectura** (`KV_REST_API_READ_ONLY_TOKEN`), recorriendo `production:tienda:*` y `production:ingreso:*`.
2. Guarda un respaldo JSON fuera del repo (`~/tiendly-respaldos/`, permisos 0600), como en la limpieza del 29-oct.
3. Pasa cada documento por `migrarDatos` (formato 0032, importado de `frontend/src/lib/datos/migrar.ts`), que en la Etapa 1 también convierte el plan y el costo de envío (§4.2 y §4.5), y le quita el prefijo de entorno.
4. Descarga cada foto de `*.public.blob.vercel-storage.com`, la sube a R2 y cambia la URL por `/fotos/<clave>`.
5. Escribe un archivo SQL y lo aplica con `wrangler d1 execute`, **primero en `tiendly-preview`**; solo con el ok de Gabi, en `tiendly-prod`.
6. Se puede correr dos veces sin duplicar (si la tienda existe, la reemplaza).
7. Imprime un reporte: tiendas migradas, fotos copiadas y **zonas de envío marcadas para revisar** (§4.5).

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
| 0 | Pasos sin PR (2–6 nov) | Aprobar este plan (#42); cerrar #22; **cerrar #40 sin borrar su rama**; revisar que `tiendly.pe` esté libre y **comprarlo**; **poner el repo en privado** (§13); activar Workers Paid. | 1–2 | Gabi |
| 1 | `chore/monorepo` | Mover todo a `frontend/` y crear `backend/` (§10). Sin cambios de código. Renombre del repo justo después (§10.4). | 2–3 | Gabi o agente |
| 2 | `chore/cloudflare-prueba` | **La prueba de riesgo:** la app actual en un Worker de prueba, sin datos (memoria). `frontend/wrangler.jsonc`, `frontend/open-next.config.ts`, `.dev.vars` en `.gitignore`. Mide CPU por visita y peso del Worker; prueba acciones de servidor, `revalidatePath`, fotos y `next/image`. Cambia `VERCEL_ENV` por `TIENDLY_ENTORNO` con la regla de §7.1 y sus pruebas. | 4–6 | Diego o agente |
| 3 | `feat/d1-etapa-1` | `backend/db/migraciones/0001_etapa_1.sql` (tablas de §4.2), `frontend/src/lib/datos/almacen.ts` sobre D1 con versión, D1 local, demos sembradas, arreglos del checkout de §4.2, plan `beta_plus` con capacidades y `betaHasta` (§4.4), `backend/README.md` con los comandos. | 6–7 | Agente, con revisión de Diego |
| 4 | `feat/fotos-r2` | `frontend/src/lib/datos/fotos.ts` sobre R2, ruta `/fotos/<clave>`, `frontend/next.config.ts` sin Blob. | 2–3 | Agente |
| 4b | `feat/envio-por-zona` | Costo en soles enteros o "A coordinar por WhatsApp", conversión al leer, carrito/checkout, envío gratis y cupón de envío (§4.5). Cambio visual: decisión nueva y capturas 390/1440. | 3–4 | Agente, con ok de Gabi |
| 5 | `feat/ingreso-google` | Better Auth + Google, `miembros`, `slugPanel()` desde la sesión, permisos en cada acción del panel, ingreso de prueba en local/preview y los commits de #40 (rama `fix/seguridad-ingreso`). | 7–9 | **Diego** (en paralelo con 3–4b) |
| 6 | Mudanza | Script de §8.2, bases y buckets de producción, `tiendly.pe` apuntando al Worker, Workers Builds conectado a `main`, cambio de §8.3. | 3–4 | Gabi + agente |
| — | **Beta: 5–10 tiendas fundadoras** | Invitaciones, solo con: PR 5 en producción, `tiendly.pe` activo, repo privado y permiso de medición en el mensaje de invitación. | — | Gabi |
| 7 | `feat/tareas-cron` | Worker `tiendly-tareas` en `backend/workers/tareas/`: reservas vencidas (§4.3) y fin de la beta (§4.4). | 2–3 | Agente |
| 8–12 | Etapa 2, un PR por módulo (decidido) | Tiendas y personas → catálogo → pedidos/stock/pagos → cupones → configuración y Afiliación. Cada uno con su migración y su script de paso desde la Etapa 1. **Antes del registro abierto de enero.** | 25–35 | Diego + agente |
| 13 | `feat/aviso-fundadoras` | Franja del 28-feb en el panel (§4.4), visible desde el 25-ene. | 2 | Agente, con ok de Gabi |

### 9.1 Calendario realista

- **Hasta la beta (pasos 0 a 6, con 4b):** unas 29–38 h, contando el envío por zona y el plan fundador.
- Con Diego en el PR 5, a Gabi le tocan unas 22–29 h: la beta arranca entre el **16 y el 20 de noviembre**.
- Si Gabi lo hace sin ayuda: entre el **20 y el 27 de noviembre**.
- El PR 7 (cron) puede ir después de las invitaciones: la regla de 24 h y el fin de la beta ya se cumplen al leer.

| Fecha | Qué |
|---|---|
| 2–6 nov | Paso 0 (dominio, repo privado, #40 cerrado sin borrar su rama), PR 1 y PR 2. |
| 9–20 nov | PRs 3, 4, 4b y 6; Diego, PR 5. |
| 16–27 nov | Invitaciones a 5–10 tiendas fundadoras. |
| Dic – 15 ene | Etapa 2 (PRs 8–12) y PR 7. |
| Enero 2027 | Registro abierto, sobre la Etapa 2. |
| 25 ene | Franja del 28-feb en el panel (PR 13). Lista "Antes del viaje" completa (§14). |
| Hasta el 2 feb | Gabi manda el mensaje personal a cada tienda fundadora. |
| 3–18 feb | Gabi en Perú; Diego cubre el soporte. |
| 28 feb | Revisión común: toda tienda fundadora pasa a Free el 1 de marzo, con el mismo link. |

### 9.2 Si la prueba del PR 2 falla

Si Next.js 16 no funciona en Workers por algo que no se arregla en un día, **la alternativa más chica** es:

- La app sigue en Vercel.
- D1 y R2 se usan a través de un Worker de API chico (`backend/api/`), al que las acciones de servidor llaman con un secreto compartido.
- Los datos quedan en Cloudflare igual; el hosting se muda cuando OpenNext lo permita.

Costo: un Worker y un secreto más. Ojo: si el proyecto de Vercel está en el plan Hobby, revisar si el uso comercial está permitido (**sin verificar**).

---

## 10. Reorganización del repo (PR 1)

### 10.1 Qué tiene que ser cierto antes

- **Ningún PR abierto**, incluido #42 (este plan): se integra o se cierra antes. Cada PR abierto quedaría con todas sus rutas viejas y su preview se rompería.
- **#22 cerrado** (ya está decidido que no se mergea) y su rama borrada, junto con `src/features/prototipo-ofertas`, si Gabi lo confirma.
- **#40 cerrado sin borrar su rama** (decisión 3 de §12), con un comentario que apunte al PR 5. Sus commits se traen a ese PR con `git cherry-pick` después de la mudanza; Git reconoce los archivos movidos. Son 4 archivos de código y la decisión 0047.
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
| Repo privado (paso 0, §13) | Las redirecciones siguen funcionando, pero los links a PRs y archivos piden iniciar sesión con acceso al repo. Diego necesita una invitación como colaborador. Workers Builds y Vercel necesitan permiso de su app de GitHub sobre el repo privado (**sin verificar** si lo piden de nuevo). |
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
| Dominio `tiendly.pe` | Aparte | Se compra a inicios de noviembre (decisión 4). No entra en el tope de base de datos. Precio y disponibilidad **sin verificar**. |

Cuándo mirar AWS: si una base pasa de unos 8 GB (el límite por base es 10 GB) o si D1 empieza a ser lento por atender una consulta a la vez. Para 5–10 tiendas, ninguna de las dos cosas es probable este año.

---

## 12. Decisiones tomadas (29-oct-2026)

| # | Decisión de Gabi | Dónde se aplica en este plan |
|---|---|---|
| 1 | **`beta_plus` = "Tienda fundadora".** Acceso anticipado a todo lo de Pro a medida que exista, ayuda directa, voz en lo que se construye y precio de fundadora garantizado cuando exista el plan pago (sin monto todavía). **Una fecha común de revisión para todas: 28-feb-2027** (`beta_hasta` igual en cada tienda). Al terminar, la tienda pasa a Free con su link intacto, con aviso semanas antes. A cambio: dos conversaciones cortas y permiso para medir el uso. Las funciones Pro llegan de a poco, y el plan no se rompe si una todavía no existe. | §4.2, §4.3, §4.4, §9 (PRs 3, 7 y 13), §13 y §14 |
| 2 | **Costo de envío por zona en soles enteros** (sin céntimos), o "A coordinar por WhatsApp" si la tienda no tiene tarifa fija. El envío gratis desde un monto y el cupón de envío gratis usan el número. | §2.2, §4.2, §4.3, §4.5, §8.2 y §9 (PR 4b) |
| 3 | **#40 se cierra sin borrar su rama.** Su contenido entra al PR 5 (ingreso con Google), que hace Diego. Hasta entonces, producción sigue con el ingreso por número simulado. Se mantiene la regla: ninguna tienda real se invita antes del ingreso con Google con permisos por tienda. | §5.3, §9 (pasos 0 y 5), §10.1 y §15 |
| 4 | **`tiendly.pe` se compra a inicios de noviembre**, antes de invitar a la beta, después de revisar que esté libre (**sin verificar**). | §5.4, §6, §7.2, §9, §11 y §14 |
| 5 | **Primero la Etapa 1** (un documento por tienda en D1 con número de versión); **las tablas de la Etapa 2, antes del registro abierto de enero.** | §4.1–§4.3 y §9 |

Queda por confirmar con Gabi (marcado como **propuesta** donde aparece):

- Qué pasa al pasar a Free con lo que excede el límite (§4.4).
- Si el envío gratis desde un monto y el cupón de envío gratis aplican a una zona "A coordinar" (§4.5).
- El texto del aviso del 28-feb (§4.4).

---

## 13. Riesgos

| Riesgo | Qué puede pasar | Qué hacemos |
|---|---|---|
| **El repo es público y tiene material de Heather sin su permiso** | Comprobado el 29-oct: `gaabrielavelasquez/tiendly-web` es **público**. Git guarda 25 archivos en `public/heather/` (logo y fotos de producto), el nombre de la marca, su Instagram (`src/features/mi-tienda/lib/config.ts`), sus semillas (`catalogo-heather.ts`, dos `semilla-heather.ts`, `heather()` en `semillas.ts`, con el nombre de pila de una persona) y la decisión 0030. `.vercelignore` los saca de Vercel, **no de GitHub**. Heather no dio su permiso. | 1) **Poner el repo en privado antes de invitar a ninguna tienda y antes de mandarle a Heather el mensaje de consentimiento** (paso 0 de §9). Privado no borra lo que ya se pudo copiar mientras fue público. 2) Después, Gabi decide si se quitan esos archivos del historial de Git. Eso es **reescribir el historial**: cambia los commits de todas las ramas, pide *force-push*, rompe los PRs abiertos, los worktrees y las copias locales, y no borra copias hechas afuera. **No se hace sin la aprobación explícita de Gabi.** |
| Producción con ingreso simulado hasta el PR 5 | Quien sepa el número de una tienda puede entrar a su panel (0046). | Ninguna tienda real antes del PR 5 (decisión 3). Las demos ya están protegidas (#41). |
| OpenNext o Next.js 16 fallan en Workers | No se puede mudar el hosting. | Se mide en el PR 2; si falla, la alternativa de §9.2. |
| CPU por visita alta | Visitas que fallan en el plan gratis. | Workers Paid desde el paso 0. |
| `VERCEL_ENV` ausente en Cloudflare | Demos editables en producción. | `TIENDLY_ENTORNO` con la regla a prueba de fallas (§7.1). |
| `tiendly.pe` no está libre o tarda | Links de la beta en una dirección temporal. | Revisar primero (**sin verificar**); si no está activo a tiempo, se atrasan las invitaciones (§7.2). |
| Un documento de tienda pasa de 2 MB | No se puede guardar esa tienda. | Vigilar el tamaño; la Etapa 2 llega antes del registro abierto. |
| Costos de envío con céntimos o texto | La conversión cambia lo que paga el cliente. | Se marcan para revisar y salen en el reporte (§4.5); hoy solo hay demos. |
| Función Pro que todavía no existe | Una pantalla que pregunta por el plan se rompe. | Capacidades en vez de `plan === "pro"`; lo desconocido responde "no" (§4.4). |
| Fin de la beta 10 días después del viaje | Las tiendas se enteran tarde o sin nadie que responda. | Franja desde el 25-ene y mensaje personal antes del 3-feb (§4.4 y §14). |
| Una sola persona conoce el sistema | Nadie puede arreglar una caída durante el viaje. | Diego con acceso propio, runbook y alertas (§14). |
| Datos personales (celulares, direcciones, DNI y CCI de Afiliación) | Exposición o mal uso. | Permisos por tienda (PR 5), Términos y Privacidad antes del viaje. **Sin verificar** qué exige la Ley 29733 de Protección de Datos Personales para este caso. |

---

## 14. Antes del viaje (3–18 feb 2027)

Gabi viaja a Perú y visita marcas en persona durante una semana. Diego cubre el soporte y ya tiene acceso al repo. Todo esto debe estar listo **hasta el 29 de enero**:

- [ ] **Diego es miembro de la cuenta de Cloudflare**, con una invitación a su propio correo. **Nunca se comparte la contraseña de la cuenta de Tiendly.** Con permisos para Workers, D1 y R2 (**sin verificar** el nombre exacto de cada rol).
- [ ] **Diego sigue teniendo acceso al repo** después de ponerlo en privado (colaborador).
- [ ] **Diego leyó este plan y `docs/traspaso.md`**, y practicó en preview una vuelta a la versión anterior del Worker.
- [ ] **Runbook** en `docs/runbook.md` (una guía de qué hacer, paso a paso, cuando algo falla) con las 5 fallas más probables:
  1. **La tienda o el panel no cargan después de un despliegue:** volver a la versión anterior del Worker (`wrangler rollback` o desde el panel de Cloudflare) y leer los registros.
  2. **Nadie puede ingresar con Google:** revisar el secreto y las direcciones de retorno en Google Cloud y `TIENDLY_URL_BASE`.
  3. **Las fotos no suben o no se ven:** revisar el binding de R2 y la ruta `/fotos/<clave>`.
  4. **Un pedido o un stock raro** (reserva que no se libera): revisar los registros del cron `tiendly-tareas`. La regla al leer sigue funcionando. No se edita la base a mano sin el ok de Gabi.
  5. **Datos borrados o dañados:** no tocar nada y avisar a Gabi. *Time Travel* reemplaza la base entera: solo con su ok, aunque sea por WhatsApp.
- [ ] **Alertas de errores a un correo compartido** que lean Gabi y Diego. **Sin verificar** qué notificaciones de errores de Workers ofrece Cloudflare; si no alcanzan, se usa un servicio de monitoreo gratuito.
- [ ] **Dominio activo**, con renovación automática y vencimiento después de marzo.
- [ ] **Términos y Privacidad publicados**, incluido el permiso de medición de uso.
- [ ] **Aviso del 28-feb:** franja visible desde el 25-ene y mensaje personal a cada tienda fundadora antes del 3-feb.
- [ ] **Durante el viaje, solo arreglos:** nada de funciones nuevas ni migraciones de base.

---

## 15. Para retomar

Para Diego o para quien siga después.

- **Estado al 29-oct-2026:** `main` en `e87804d` (#41, demos protegidas). Abiertos: #42 (este plan), #40 (se cierra sin borrar su rama) y #22 (no se mergea). Producción en Vercel con Upstash Redis y Blob, ingreso por número simulado, solo las demos MUÑA y Glow Labo.
- **Leer primero:** `AGENTS.md`, `CLAUDE.md`, `docs/traspaso.md` y, de este plan, §2 (qué hace el código hoy), §4 (datos), §7.1 (regla de entorno), §9 (orden) y §12 (decisiones).
- **Tu PR (5, ingreso con Google):** sale de `main` después de la mudanza. Los commits de #40 a traer con `git cherry-pick`, desde la rama `fix/seguridad-ingreso`: `67a5381`, `e3a6392` y `822f904` (saltar `c59b3a9`, que es un merge de `main`). Si alguno choca por las rutas movidas, aplicarlo sobre `frontend/`.
- **Reglas que no se negocian:**
  - Nada se mergea sin el ok de Gabi.
  - No se tocan datos de producción sin su ok.
  - No se invita a una tienda real sin el PR 5 en producción.
  - `TIENDLY_ENTORNO` falla cerrado (§7.1).
  - No se reescribe el historial de Git sin aprobación explícita (§13).
- **Lo que falta confirmar:** las propuestas de §12 y la lista "Sin verificar" de §16.

---

## 16. Fuentes

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
- Si el plan actual de Vercel permite uso comercial.
- Si `tiendly.pe` está libre, su precio y si Cloudflare Registrar vende `.pe`.
- Los nombres de los roles de miembro en Cloudflare y las alertas de errores de Workers.
- Si Workers Builds y Vercel piden permiso de nuevo al pasar el repo a privado.
- Qué exige la Ley 29733 para los datos de clientes y de Afiliación.
