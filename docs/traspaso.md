# Estado vigente · Gitflow y preview · 9-nov-2026

Este bloque y [docs/gitflow.md](gitflow.md) describen el estado actual. Los registros que siguen son históricos: sus ramas temporales, pendientes y autorizaciones corresponden a la fecha de cada entrada.

- [#53](https://github.com/gaabrielavelasquez/tiendly/pull/53) integrado en `dev` con merge commit `01ab186`, tras autorización de Diego. Infraestructura/identidad/tiendas/catálogo/onboarding/D1/R2 ya llegaron a `dev` por #47/#52. `main` permanece en `e635050`.
- Preview vigente: https://preview.tiendly.workers.dev, Worker `preview`, Google exclusivo de pruebas, D1 `tiendly-preview` y R2 `tiendly-preview-images`. OAuth real y persistencia de tienda/producto están verificados. [Evidencia de OAuth](verificacion/oauth-preview/README.md); [aceptación D1/R2](verificacion/d1-r2-preview/README.md).
- Auditoría pública del 9-nov: 48 cargas Chrome/WebKit a 390/1440/360 sin overflow ni errores JS, seis recorridos de carrito, APIs protegidas e inicio OAuth correctos. Lectura D1: tres migraciones, cuenta Google/sesión activa y tienda/producto, sin infracciones de claves foráneas ni escrituras. No se repitieron ingreso real ni guardados autenticados. [Resumen](verificacion/gitflow-20261109.json).
- Los dos worktrees restantes de `/private/tmp` se movieron completos a `.worktrees/cloudflare-preview-legacy` y `.worktrees/cloudflare-storage-legacy`. HEAD, estado limpio y hashes de configuración/runtime se conservaron. Bundle y manifiestos privados en `.backend-rescue/worktree-move-20261109/`; no se borraron ramas ni archivos.
- Checkout principal en `dev` actualizado, sin cambio de rama ni builds. Este pase documental usa `chore/gitflow-cleanup`, worktree Orca persistente en `/Users/diego/orca/workspaces/tiendly/gitflow-cleanup`, desde `origin/dev` actualizado. `.devflow.json` fija `dev`; Orca usa `origin/dev` como base local y muestra worktrees externos.
- CI pasa en `dev` y #53. El despliegue Cloudflare continúa manual; no se publican Workers ni se ejecutan migraciones por un merge. Protecciones `main`/`dev` pendientes de administración: [ajustes concretos](configuracion/github-protecciones.md). La cuenta del agente solo tiene escritura.
- Siguiente módulo: automatización aislada del preview; después, ventas/pedidos/stock/reservas/checkout/cupones, guardados de configuración/Mi tienda y tareas, cada uno con PR hacia `dev`. El core loop de Cloudflare todavía no está completo. Pagos, SUNAT, bancos, envíos y comunicaciones siguen simulados; no hubo cambios productivos.
- La aprobación de merge de #53 no autoriza integrar el PR documental nuevo ni otros PRs.

---

# Historial de sesiones anteriores

# Dominio y Google del preview · 8-nov-2026

- Rama `chore/oauth-preview` desde `dev` (`41bea81`), worktree `.worktrees/oauth-preview`. Nuevo Worker `preview`: https://preview.tiendly.workers.dev. D1 `tiendly-preview` y R2 `tiendly-preview-images` conservados; no se ejecutaron migraciones ni se publicaron recursos de producción.
- Preview y producción usan clientes Google separados. Credenciales del JSON de «Tiendly Preview» cargadas solo como secretos del Worker nuevo, sin cambiar su secreto de sesión ni publicar valores. El archivo privado temporal del primer despliegue se eliminó. El Worker anterior conserva su app sin Google.
- Google acepta la autorización con el cliente/callback correctos. La lectura remota de D1 confirma una cuenta Google, una sesión activa, una tienda y un producto persistidos: ingreso real y operaciones autenticadas verificados. Evidencia agregada sin datos personales. La primera prueba falló porque el JSON inicial pertenecía a otro cliente.
- Tokens, builds Next/vinext, tipos frontend/backend, 14 tests de backend y 3 pruebas del manifiesto pasan. 18 comprobaciones desplegadas Chrome/WebKit a 390/1440/360 sin overflow, imágenes rotas ni errores JS. R2 remoto pasa subida CLI/lectura pública/decodificación de una imagen sintética; se eliminó únicamente ese objeto. El producto real todavía no tiene fotos en R2. [Informe y capturas](verificacion/oauth-preview/README.md).
- PR #53 hacia `dev`, sin merge autorizado. Producción, ventas/reservas/cupones, guardados de configuración y tareas siguen pendientes; pagos y comunicaciones continúan simulados.

---

# Aceptación local después de #45/#46 · 8-nov-2026

- `dev` confirmado en `b8f6f38`; ramas #47–#50 sincronizadas mediante merge commits sin reescritura. La CI completa pasa ahora también en infraestructura, identidad, catálogo e integración. No se integraron esos PRs a `dev`.
- Infraestructura ajusta CI a la etapa donde backend aún no tiene scripts. Identidad y los módulos siguientes sí ejecutan sus tipos y pruebas.
- Se corrigieron fotos rotas en catálogo/R2: vinext sirve directamente las imágenes que ya redujo el navegador; Next/Vercel conserva su optimizador. Configuración compartida validada con `satisfies NextConfig`, sin casts.
- Seis flujos completos locales de formulario en Chrome/WebKit a 360/390/1440 pasan con D1/R2, imágenes decodificadas, guardado/edición/recarga, error de red/reintento y rechazo de versiones desactualizadas. Evidencia, capturas y procedimiento en [d1-local](verificacion/d1-local/README.md). La sesión de esta aceptación es sintética, no OAuth real.
- Los 12 tests de backend, tipos, tokens y builds Next/vinext pasan. OAuth real y aceptación desplegada siguen pendientes. El Worker local del agente queda disponible en `http://localhost:3215/registro` para la prueba de Google solicitada al usuario; no tocar el puerto 3100.
- Pagos y comunicaciones siguen simulados. No hubo nuevos despliegues Cloudflare ni cambios remotos de base, secretos o datos productivos.

---

# Resguardo e integración Gitflow · 8-nov-2026

- El trabajo antes sin commit se guardó en `823d1a2` sobre `feat/onboarding-d1`. El worktree vive ahora en `.worktrees/cloudflare` dentro del proyecto; el checkout principal sigue en `main` y conserva su modificación previa de `AGENTS.md`.
- `dev` se creó desde `main` (`e635050`). El workflow y CI se proponen en #46, sin merge. Se publican PRs apilados de infraestructura → identidad/tiendas → catálogo/R2 → integración; el mapa definitivo está en `docs/gitflow.md` del PR #46. No hacer merge sin aprobación de Gabi.
- Los formularios ya envían versiones al guardar, pausar, ofertar y deshacer; la aceptación de navegador todavía está pendiente. `relationalStore` compone catálogo y configuración inicial, pero devuelve pedidos/inventario/cupones vacíos. `mutarTienda` rechaza operaciones aún no migradas.
- Se corrigieron dos bloqueos de compilación: `typecheck` regenera tipos de Next tras vinext y la constante OFERTAS usada por el cliente quedó separada del módulo que consulta D1. No cambian diseño ni tokens.
- Verificación local después del traslado: 12/12 tests de backend, tipos de frontend/backend, tokens, build Next habitual y build vinext pasan. También pasa `typecheck` después de vinext; se verifica exclusión de assets Heather/mi-tienda. Evidencia resumida en `docs/verificacion/gitflow-20261108.json`. Persisten avisos de sourcemaps y clasificación de rutas del experimento vinext.
- Falta Google real, R2 remoto, aceptación de formularios/persistencia/vitrina en preview, ventas/reservas/cupones, comandos de configuración y tareas. No hubo deploy de app, migraciones remotas ni cambios de datos de producción. Pagos y comunicaciones siguen simulados.

---

# Catálogo/R2 y callbacks OAuth · 8-nov-2026

- Rama `feat/catalog`, sobre `feat/identity-stores` (`91c6d58`), en `/private/tmp/tiendly-cloudflare`. Sin cambios en main ni en el servidor de Gabi.
- Callbacks exactos y configuración en `docs/configuracion/google-oauth.md`. Subdominio Workers de la cuenta comprobado por API: `dmalvaradog26`. Preview previsto `https://tiendly-preview.dmalvaradog26.workers.dev`, todavía sin deploy de app. El usuario confirmó que ya configuró el cliente OAuth; secretos aún no incorporados al runtime por esta sesión.
- Catálogo: dominio puro, comandos, D1 relacional, API de lista/creación/actualización y mapeo de los tipos españoles del frontend. Migración `0003_catalog.sql` aplicada solo en la D1 desechable. Se preservan claves, céntimos, galerías y tablas de medidas; variantes retiradas conservan fila.
- R2: upload con titularidad/origen, límite 5 MB y JPEG/PNG/WebP verificados por firma/MIME; ruta de imagen del mismo origen sin dependencia de OAuth. Prueba local R2, sin bucket remoto/deploy.
- Once tests locales pasan. Prueba remota de catálogo pasa concurrencia, rollback, aislamiento y semántica; datos sintéticos eliminados al finalizar. Evidencia en `docs/verificacion/cloudflare/catalog-remote.json`.
- **Integración todavía parcial:** los formularios/páginas antiguos no llaman a estos endpoints. Falta conectar Google/onboarding y componer lecturas D1 de panel/vitrina. Ventas/asignaciones de stock, promociones, configuración editable y tareas siguen pendientes. No presentar el core loop como migrado ni desplegarlo todavía.

---

# Identidad y tiendas · 8-nov-2026 · en curso

- Base guardada en `chore/cloudflare-foundation` (`76adead`). Continuación `feat/identity-stores` en `/private/tmp/tiendly-cloudflare`; rama principal y servidor de Gabi intactos. Sin merge/deploy de app.
- Implementados backend `identity` y `stores`, migraciones `0001_auth.sql`/`0002_stores.sql`, sesiones Better Auth nativas D1, API de tienda propia/crear/renombrar, configuración inicial vacía y escrituras atómicas/versionadas. Ver `backend/README.md`.
- Cinco pruebas locales pasan: políticas, autorización real con sesión Better Auth, carreras, rollback y reinicio. Las migraciones y comandos reales también pasan en D1 remoto desechable: `docs/verificacion/cloudflare/stores-remote.json`. El probe elimina su tienda/usuario sintéticos.
- El usuario está creando Google OAuth. Callback local `http://localhost:3215/api/auth/callback/google`. Secretos sin configurar; los endpoints compilados responden 503 de forma segura. La navegación Google real queda pendiente.
- El panel ya no confía en la cookie de slug salvo `TIENDLY_ENTORNO=local|preview` + `TIENDLY_TEST_LOGIN=true`. Entorno ausente/inválido restringe como producción. El ingreso por teléfono simulado queda bloqueado fuera de esas pruebas. El nuevo API no escribe documentos Redis.
- **Integración todavía parcial:** el botón Google y la creación del onboarding aún no llaman al API nuevo. Falta catálogo/R2 y componer los DTOs de la tienda D1 para panel/vitrina antes de conectar ese formulario. Catálogo/ventas/cupones/configuración editable siguen pendientes. No presentar este trabajo como core loop migrado.
- Builds Next/vinext se ejecutan **secuencialmente**: ambos generan tipos en `.next`; en paralelo se pisan. El error de tipos al ejecutarlos juntos se resolvió repitiendo Next por separado.

# Continuación tras #45 y #46 · 8-nov-2026

- `dev` en `b8f6f38` contiene ambos PRs con merge commit. Se sincronizan las ramas funcionales conservando su historial, sin integrar los PRs #47–#50 a `dev`.
- La CI ya forma parte de la base de integración. La aceptación y los pendientes funcionales de cada PR siguen vigentes; main y producción permanecen intactos.

---

# Avance Cloudflare · 8-nov-2026

- Worktree `/private/tmp/tiendly-cloudflare`, rama `chore/cloudflare-foundation`. Next.js build, tokens y TypeScript pasan. Vinext build pasa y verifica exclusión de Heather/mi-tienda; Chrome/WebKit locales cubren MUÑA, Productos y Registro en 360/390/1440; faltan acciones y aceptación completa en preview desplegado.
- **Prueba D1 remota PASS:** última unidad, último cupón, versión desactualizada, ediciones concurrentes y rollback de pedido/asignación/redención/contador/historial. Evidencia en `docs/verificacion/cloudflare/d1-remote.json`, confirmada mediante lectura SQL remota independiente. La condición de plataforma se supera; aún hacen falta pruebas sobre el esquema final.
- Base desechable `tiendly-atomicity-probe-20261108`; código e instrucciones en `backend/probes/d1/`. No desplegar ese Worker como app. No contiene datos de clientes.
- El usuario confirmó que aún no existe cliente OAuth de Google ni origen previsto del preview. Son requisitos pendientes para verificar el ingreso real. No se transfirieron secretos.
- Migración de negocio pendiente: identidad, tablas en `backend/db/migrations/`, R2, checkout, promociones, configuración, tareas y aceptación. No hubo deploy de aplicación, merge ni cambios de datos existentes.

---

# Migración Cloudflare · trabajo en curso, 8-nov-2026

- Worktree `/private/tmp/tiendly-cloudflare`, rama `chore/cloudflare-foundation`, desde `main` e635050. Servidor de Gabi intacto.
- Workspace npm y experimento vinext: `vinext check` informa 94 % y el build termina, pero el output incluye imágenes sin permiso de `public/heather` y `public/mi-tienda`. **No desplegar** hasta excluir y verificar; `.vercelignore` no protege Cloudflare. Faltan pruebas de flujos, cookies, revalidación, uploads y navegador.
- Wrangler autenticado; creada base vacía `tiendly-atomicity-probe-20261108` (ID `6180e7fb-4501-4702-a5b0-f284b6e90faa`) para la prueba. La prueba aún no se ejecutó; eliminar la base al terminar. No se tocó producción.
- Pendiente: prueba remota de lotes, concurrencia y rollback; identidad, tablas, R2, checkout y tareas. `cf` y Wrangler mantienen sesiones separadas; Node local no satisface el engine de `cf`.

# Cierre documental de la-bodega · 8-nov-2026

- El [mapa de traspaso](backend/traspaso-la-bodega.md) y los [criterios conservados](backend/requisitos-conservados.md) permiten continuar desde Tiendly sin un clon anidado. Incluyen inventario de las 26 fuentes, diferencias deliberadas y estado por módulo.
- Retiro local con bundle verificable y clon original guardados fuera del proyecto en `/Users/diego/tiendly-respaldos/la-bodega-20261108/`. El remoto de GitHub sigue intacto. **Baja remota pendiente**, por indicación del usuario: existen workflows activos y un despliegue QA histórico; no se conoce el estado de Coolify/VPS ni de sus datos.
- El trabajo funcional permanece en `/Users/diego/sandbox/tiendly/.worktrees/cloudflare`, `feat/onboarding-d1`, con cambios sin commit sobre `c00ae43`. No se modificó ese worktree. No presentar identidad/tiendas/catálogo como core loop completo ni incorporar versiones parciales a producción.
- Próximo trabajo: terminar integración y versiones desde formularios; verificar Google/R2 remotos; implementar ventas/reservas/cupones y comandos de configuración; completar tareas y aceptación. Pagos/comunicaciones siguen simulados. Este cierre no despliega la migración Cloudflare ni hace merge, y no toca datos de producción.
- Validación del cierre: 26/26 documentos clasificados y cotejados por SHA-256 contra restauración independiente del bundle; enlaces locales y `git diff --check` pasan. `npm run check:tokens` y `npm run build -- --webpack` pasan en el worktree aparte. El build habitual con Turbopack falla por el permiso del puerto interno (`EPERM`), incluso al reintentar fuera del sandbox. Sin cambios de código/UI ni capturas nuevas; no se modificó el servidor principal.

---

# Traspaso · 29-oct-2026

## D1 y R2 conectados al preview · 8-nov-2026

Diego autorizó continuar con almacenamiento real de pruebas. La rama `feat/cloudflare-preview-storage` sale de `origin/feat/catalog` (`bd6bc97`, con #50 integrado) y reutiliza el despliegue de #51 mediante cherry-pick. No se integra la pila en `dev` o `main` ni se cambia el checkout principal.

Cuenta Tiendly: Worker `tiendly-preview`, D1 `tiendly-preview` (`9fcfd54b-56a2-4cb9-af11-800e5191e93d`) y bucket privado `tiendly-preview-images`. Aplicadas las tres migraciones de autenticación, tiendas y catálogo. Worker publicado en https://tiendly-preview.tiendly.workers.dev, versión `5d3c1503-9e75-4c79-8451-a354b27b7712`. Los recursos de producción, Redis/Blob, Vercel y DNS siguen intactos.

PASS: tokens, builds Next/vinext, tipos frontend/backend, 14 tests de backend y tres pruebas del manifiesto. Seis recorridos remotos Chromium/WebKit a 390/1440/360 verifican tienda, catálogo vacío, foto R2, guardados, recargas, reintento y conflictos entre pestañas; 36 checkpoints sin overflow. Acceso remoto: cookie de slug falsa 401, origen ajeno/ausente 403, imagen inválida 400 y sesión revocada 401. [Evidencia y capturas](verificacion/d1-r2-preview/README.md).

Google real sigue pendiente. Las sesiones sintéticas se crean solo desde el harness administrativo y se limpian por ID; no hay ingreso de prueba público ni Google ficticio. `BETTER_AUTH_SECRET` se generó privadamente y se guardó cifrado en el Worker. No se crean pedidos ni se envían mensajes/cobros. Faltan ventas/reservas/cupones, comandos de configuración y tareas; las escrituras no migradas se rechazan, sin recurrir a documentos en memoria. La autorización de este preview no autoriza merges ni corte de producción.

## Primer despliegue de pruebas en Cloudflare · 8-nov-2026

Diego autorizó publicar el primer preview en la cuenta Tiendly. Desde `dev` (`08d896f`, base #47), rama `chore/cloudflare-first-preview`, worktree aislado `/private/tmp/tiendly-cloudflare-preview`. App publicada en https://tiendly-preview.tiendly.workers.dev, demo `/muna` y panel `/panel/productos`; versión `ea2967a9-0b38-4e8a-963b-24f697fb3ac5`.

Publicación reproducible con `npm run deploy:cloudflare-preview`, dentro de `frontend/`, mediante `npx wrangler --profile tiendly`. La entrada conserva respuestas/cookies, bloquea las rutas privadas antes de streaming y marca el preview noindex. No incluye las fotos de Heather ni `mi-tienda`. No se cambió la rama principal, el servidor de Gabi, Vercel, DNS, Redis ni producción, ni se integraron ramas funcionales de backend.

PASS: tokens, build Next, build vinext, tipos, dos pruebas de entrada, 42 revisiones remotas Chromium/WebKit 390/1440/360 sin overflow ni imágenes rotas. Carrito y cierre de cookie probados con sesión sintética; WebKit registra prefetched requests cancelados al salir. [Evidencia y capturas](verificacion/cloudflare-preview/README.md).

Límites: memoria temporal por instancia, sin persistencia D1/R2 ni Google real. OTP/pagos/SUNAT/bancos/envíos siguen simulados; sin mensajes o cobros. R2 ya permite consultas pero no tiene buckets. Sigue pendiente integrar persistencia/fotos, automatizar despliegues de `dev` y completar aceptación funcional; ningún merge o corte de producción está autorizado.

Para el agente que sigue (Codex) y para Gabi. Antes de tocar código, lee [`AGENTS.md`](../AGENTS.md), [`CLAUDE.md`](../CLAUDE.md), [`frontend/DESIGN.md`](../frontend/DESIGN.md) y las decisiones de [`docs/decisiones/`](decisiones/README.md).

**Estructura (PR 1, monorepo):** la app vive en `frontend/` y los comandos `npm` se corren ahí; `backend/` guarda la base de datos, los Workers y los scripts. En los registros con fecha de este documento, las rutas `src/…`, `public/…`, `next.config.ts` y `DESIGN.md` son anteriores a ese cambio: hoy van con `frontend/` adelante.

**Regla que no cambia:** nada se mergea sin el ok de Gabi.

**Último cierre de sesión:** #35 checkout, #36 Cupones, #37 Pagos/Afiliación y #38 recuperación de ingreso quedan abiertos, sin merges. E2E completo en Vercel a 390 PASS con Redis de desarrollo autorizado solo en la preview temporal. Evidencia final en [e2e-ingreso](capturas/e2e-ingreso/README.md); ver el cierre al final antes de seguir tareas históricas de este documento.


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
| **#22** · Prototipo de ofertas | `proto/productos-ofertas` | **No mergear.** Ya está implementado (#24 a #27). Cerrarlo y borrar la rama cuando Gabi diga. | Verde |

Integrados: #24 a #39. El 29-oct, con ok de Gabi: #39 (fecha de creación y traspaso), #38 (ingreso), #36 (Cupones 0031) y #37 (Pagos y Afiliación 0031), en ese orden, cada uno con preview verde, tokens y build.

## Próximas tareas, en orden

1. **Gabi envía su lista de revisión** tras los merges del 29-oct. No empezar otra tarea antes.
2. **Onboarding 2–4**, después de esa revisión.
3. **Antes de la beta: base de datos separada para desarrollo y previews** (ver Riesgos). No se cambió todavía.
4. **Antes de invitar a cualquier tienda real: ingreso solo con Google.** Está en el PR #40, abierto y sin merge: se integra junto con el ingreso real con Google (trabajo de backend).

Pendiente sin fecha: precio y SKU por variante (`docs/backlog.md`); renombrar el campo `duena` cuando llegue el backend; #22 ya está cerrado; `src/features/prototipo-ofertas` solo existe en su rama (`proto/productos-ofertas`).

## Riesgos conocidos

- **El código de WhatsApp es simulado: quien sepa el número de una tienda puede ingresar a ella.** Por eso el ingreso por número tiene que estar apagado en producción (solo Google) antes de invitar a cualquier tienda real (decisión 0046, PR #40).
  - Las demos (MUÑA, Glow Labo, Heather) ya no aceptan ingreso por número en ningún entorno, y en producción su panel no guarda cambios y muestra el aviso de modo demo.
- **MUÑA: actualización del catálogo en producción (#29).**
  - Los datos viven en Upstash Redis (`production:tienda:muna`) y, antes del cierre del #29, contenían tres productos sin la oferta de la falda. El resultado del reset autorizado y su verificación se registra en la descripción del #29.
  - Gabi autorizó reiniciar únicamente esa clave después del merge del #29. Consultar el resultado y el respaldo en el registro final del PR antes de repetir un reset; las demás tiendas quedan fuera.
  - Glow Labo no tiene este problema.
- **Desarrollo local y cualquier preview con credenciales escriben en la base Redis de producción.** Las variables `KV_*` están en los entornos Production y Development de Vercel (no en Preview), y apuntan a la misma base de Upstash; solo el prefijo de la clave separa los entornos (`production:`, `preview:`, `local:`). Un local con `vercel env pull` o un preview al que se le pasen credenciales (como el E2E temporal del #38) crea claves reales en esa base, y un error en el prefijo podría pisar tiendas de producción. Los previews normales guardan en memoria.
  - **Antes de la beta**, desarrollo y previews deben usar una base aparte (otra base de Upstash con sus propias variables en los entornos Preview y Development de Vercel). No se cambió todavía.
  - Mientras tanto: no crear tiendas de prueba en producción sin anotarlas aquí, y nunca borrar ni reiniciar claves `production:` sin el ok de Gabi.
- Para probar flujos que guardan, usa un solo proceso local **en un `git worktree` aparte**, dentro de `frontend/`: `npm run build` y después `TIENDLY_TIENDA_DEMO=muna npx next start -p 3200`.
  - **El puerto 3100 es el servidor de desarrollo de Gabi** (`cd frontend && TIENDLY_TIENDA_DEMO=muna PORT=3100 npx next dev`, en la carpeta principal): no lo cierres ni hagas build en esa carpeta.
  - Antes de levantar algo, revisa el puerto con `lsof -ti tcp:<puerto>`, y al terminar cierra solo el proceso que levantaste: `pkill` no siempre lo cierra.
  - En local, sin la variable, la demo es Heather.
- **El preview de una rama aparece recién al abrir el PR.** Los previews están protegidos: para Playwright, usa respuestas autenticadas mediante el comando oficial `vercel curl` y un proxy de solo lectura. No exportes variables de entorno ni credenciales.
- **iPhone:** los campos con texto de menos de 16 px hacen zoom al tocarlos. En el panel, los campos usan `text-body`.
- **`.next/types` viejo** rompe el build después de borrar páginas: `rm -rf frontend/.next/types`.
- **#23 quedó reemplazado por #29; #19 se cerró por reemplazo en #30.**
- **Una tienda que no existe responde 200, no 404:** se ve la página de «no encontrada», pero el código HTTP es 200 (comprobado el 29-oct con `/heather-pe` y un slug inventado). Revisar antes de la beta.

## Limpieza de Redis · 29-oct-2026

- Con el ok de Gabi se respaldaron y borraron 13 claves: las tiendas de prueba `production:tienda:heather-pe`, `casa-nube`, `miconejito` y `prueba-registro-33-5135991`, y todas las claves `preview:` (incluida `preview:tienda:aurora`).
- Respaldo: `~/tiendly-respaldos/redis-produccion-20261029.json`, permisos 0600, fuera del repo y sin credenciales.
- Quedan solo `production:tienda:muna` y `production:tienda:glow-labo`, sin tocar. `/muna` y `/glow-labo` responden con su catálogo; `/heather-pe` muestra «no encontrada».
- Desde ahora las tiendas nuevas guardan `tienda.creadaEl` (ISO) al crearse en el onboarding. Las anteriores y las de ejemplo no lo tienen.

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


## Cierre aprobado de #34 y checkout · 24-oct-2026

- Gabi autorizó merge de #34 tras la fila móvil de temas. Código 13cd61d, preview verde pzzr83s06. Aproximadamente 2,5 tarjetas visibles en móvil, tres columnas desktop, nombres/precios sin truncado y botones sin salto. Chrome/WebKit a 390/1440/360: scroll del carrusel, selección del último tema y sin scroll de página. Tokens/build pasan; evidencia en docs/capturas/mi-tienda-temas-movil/.
- Integrar con merge commit y confirmar /panel/mi-tienda en producción a 390 solo lectura. No guardar personalización ni reiniciar Redis.
- Después, única tarea autorizada: checkout y ambas confirmaciones, reglas 0031, montos con céntimos solo cuando existen, conservar 0007/0008/0009. Nuevo worktree/rama desde main actualizado; MUÑA y Glow Labo, antes/después Vercel 390/1440, sin merge del nuevo PR.

- #34 integrado con autorización y preview final verde, merge commit 4ab96fa836353fc9059f04451ae64aa62d71977f, head 119c434. Producción READY (f0jqf4ips); /panel/mi-tienda confirmada en Chrome/WebKit a 390×844: MUÑA Editorial/Terracota, portada/bienvenida y carrusel móvil, sin scroll. Solo lectura, sin guardar datos de producción. Evidencia local /private/tmp/tiendly-pr34-produccion/.
- Nueva tarea única en feat/checkout-diseno-0031, worktree /private/tmp/tiendly-checkout-diseno, desde main 4ab96fa. No se cambia checkout principal ni se toca el servidor 3100. Antes Vercel capturado desde pzzr83s06 (checkout funcional idéntico a ese main) a 390/1440 para MUÑA y Glow Labo; carrito/pedidos ficticios solo en navegador y número simulado en respuesta, sin acciones del servidor. Decisión 0043. No mergear este nuevo PR.


## Cierre del pase de checkout · PR #35 · 24-oct-2026

- PR único [#35](https://github.com/gaabrielavelasquez/tiendly-web/pull/35), feat/checkout-diseno-0031 desde main 4ab96fa, worktree /private/tmp/tiendly-checkout-diseno. Código de las pantallas b804d74; preview verde https://tiendly-4mla7vpg9-gaabrielavelasquez-8525s-projects.vercel.app. Un último ajuste conserva la tipografía anterior del encabezado del carrito (paso 1); checkout/confirmaciones quedan iguales a las capturas.
- Checkout: títulos externos, opciones como filas con divisores, pasos neutros carbón, confirmación inmediata/reserva sin badges, resumen mobile plegable y desktop sticky. Moneda/céntimos atenuados, cifras tabulares/Regular y total SemiBold; formatoSoles existente sin .00. Cupones disponibles en el resumen móvil/desktop con tratamiento neutro; carrito conserva su estilo. Reintento de cupón/número/pedido ante fallo de red y controles bloqueados durante envío.
- Confirmado/Registrado: título en dos tonos sin género, icono neutro sin círculo, detalle de pedido con divisores y reserva como texto. Acción principal fija móvil con zona segura y espacio al final; PDF y WhatsApp conservados. Estados de carga, vacío y error/reintento. Reglas, totales y acciones del servidor de compra no cambian (0007/0008/0009); sin tokens o dependencias nuevos.
- Galería antes/después Vercel a 390/1440 de MUÑA y Glow Labo en docs/capturas/checkout-0031/README.md; seis vistas por tema y estados carga/vacío/error. Capturas inspeccionadas sin edición. Fotos y acentos reales; progreso/selección en carbón dentro de checkout, CTA mantiene Terracota o Suave. Pies de viewport a 390 muestran contenido final visible sobre la barra fija.
- Chrome/WebKit locales pasan a 390/1440/360: doce compras reales simuladas entre ambos temas, tarjeta rechazada/éxito, Yape inválido/éxito y WhatsApp con 24 h exactas, cupones porcentaje/monto/envío, Lima/Callao/provincias, céntimos, errores de red/reintento, PDF y barras sin superposición. Recojo gratuito probado en ambos; tienda nueva sin zonas mantiene coordinación solo por WhatsApp. Confirmación corrupta/error y reintento. Resultados en resultado-local.json. Todas las escrituras solo en memoria local sin Redis; ventana de WhatsApp ficticia, sin mensajes.
- Chrome/WebKit Vercel pasan ambos temas a 390/1440 y WebKit también 360; sin scroll horizontal, seis vistas por tema. Chrome local cubre también 360. Carrito/confirmación y cupón inválido son fixtures del navegador; número simulado en respuesta por el harness. Cero acciones del servidor de prueba en Vercel y cero escrituras de producción. El error del boundary es real con sesión corrupta; las cargas se capturan antes de hidratar. Proveedor de pagos y confirmaciones por WhatsApp siguen simulados.
- #34 sí integrado y producción confirmada según registro anterior. **#35 no tiene aprobación de merge: actualizar descripción/capturas, dejar listo y detenerse para revisión de Gabi.** No iniciar otra tarea.

- Cierre final: tokens y build final pasan. Nombres largos y S/ 129,999.10 comprobados en MUÑA y Glow Labo a 390/1440/360, sin scroll. Servidor de pruebas 3206 cerrado tras verificar PID 20007 y carpeta; 3100 de Gabi sigue activo (PID 77610). Último commit adjunta 78 capturas Vercel, resultados y traspaso, y conserva el encabezado anterior del carrito; no cambia las pantallas de checkout/confirmación capturadas. **#35 queda listo, abierto y sin merge. Detenerse para revisión de Gabi.**

## Pases posteriores al checkout y E2E · 24-oct-2026

- #35 sigue abierto, sin merge. Se completaron en orden los pases [#36 Cupones](https://github.com/gaabrielavelasquez/tiendly-web/pull/36) y [#37 Pagos/Afiliación](https://github.com/gaabrielavelasquez/tiendly-web/pull/37), cada uno desde main 4ab96fa, sin merges. Tokens/build pasan, previews verdes, antes/después Vercel 390/1440, Chrome/WebKit 360/390 sin scroll, cuatro estados y reglas de negocio conservadas. Evidencia y decisiones 0044/0045 en sus propias ramas.
- Corrección final independiente en fix/flujo-completo-ingreso: el ingreso no recuperaba la cookie de la tienda tras cerrar sesión. Ahora usa el número de registro independiente del contacto de ventas, índice por entorno y compatibilidad con tiendas sin índice; error visible para número desconocido y red, sin caer en demo. Acceso/OTP siguen simulados.
- E2E completo **local** a 390 pasa con código ensamblado temporalmente de #35/#36/#37/corrección: registro, producto/opciones/oferta decimal, cupón, ambas compras por 92.79, Pedidos/Inicio, pagar/enviar, logout/login y recuperación de ambos pedidos. No se enviaron mensajes ni cobros; activación de cobros por fixture en servidor local. Prueba adicional con número de registro diferente del WhatsApp de ventas pasa. Evidencia: docs/capturas/e2e-ingreso/.
- E2E **en preview todavía pendiente**: el producto creado devuelve 404 en otra instancia porque los previews no tienen Redis (riesgo ya documentado). Se intentó habilitar solo el despliegue temporal con credenciales de desarrollo y namespace preview. La revisión automática rechazó el envío de secretos a Vercel sin aprobación explícita; autorización solicitada a Gabi y pendiente. No se ejecutó el despliegue con secretos ni se cambiaron variables del proyecto. No presentar el PASS local como PASS de preview.
- Siguiente paso tras autorización: desplegar combinación temporal con persistencia preview, repetir TODO a 390 y actualizar PR final/evidencia. Sin autorización, mantener ese bloqueo explícito. No modificar production ni repetir resets de MUÑA. Ningún PR de esta sesión está autorizado para merge.

- Actualización de autorización: Gabi respondió «Sí, solo en ese preview temporal». Se desplegó 792c840 en tiendly-l5sbiihvq con Redis de desarrollo, exclusivamente para ese despliegue y namespace preview. No se cambiaron variables del proyecto. Se eliminó el archivo privado temporal de credenciales tras desplegar. El E2E completo se está repitiendo allí; no declarar PASS antes del resultado.
- Servidores propios 3210/3211 cerrados después de verificar PID 45916/47011 y sus carpetas. Servidor de Gabi 3100 confirmado activo con PID 77610.


### Cierre final del E2E en Vercel · PR #38

- **PASS completo en preview a 390 × 844**, sin sustitución del backend: registro, tienda e2e-tienda-83972309, producto/opciones/oferta, cupón, tarjeta y WhatsApp a 92.79 cada uno, Pedidos/Inicio, pago manual/envío persistidos, logout/login y recuperación de ambos pedidos. Redis solo en la preview temporal autorizada l5sbiihvq, namespace preview; nunca production.
- La falta de persistencia del primer intento quedó superada tras autorización explícita de Gabi. No queda pendiente el E2E de preview. Archivo temporal de credenciales eliminado; variables del proyecto intactas. Conservar el despliegue solo temporalmente para revisión, no promoverlo a producción.
- Fallo de aplicación corregido en [#38](https://github.com/gaabrielavelasquez/tiendly-web/pull/38): ingreso tras logout caía en MUÑA sin cookie. La corrección recupera la tienda; números de registro/ventas separados, errores de red/desconocido y reintento comprobados. OTP/pagos/afiliación continúan simulados y no se enviaron mensajes/cobros.
- Informe, resultados, once checkpoints remotos y comparación antes/después Vercel 390/1440 en docs/capturas/e2e-ingreso/. Chrome/WebKit comparados a 360/390/1440 sin scroll; tokens/build local y Vercel verdes. Fuente 38e219f; la evidencia posterior no cambia código.
- #36 y #37 siguen listos para revisar, sin merge. #38 pasa de borrador a revisión al adjuntar este resultado. #35 continúa abierto. Ningún merge autorizado en esta sesión. **Detenerse y esperar la revisión de Gabi; no iniciar otras tareas.**

## Pase A · Cupones · PR #36

- Nueva rama feat/cupones-diseno-0031 desde main 4ab96fa, worktree /private/tmp/tiendly-cupones-diseno. Sin tocar checkout principal ni 3100. Lista/contenedores/divisores, títulos externos, formularios, límite Free y eliminación con hoja nativa/foco Conservar. Switch con check y dinero sin .00 existentes. Reglas 0008 y acciones de servidor conservadas. Error de red/copia con reintento, no deja controles ocupados.
- Tokens/build pasan. Chrome/WebKit locales: monto 30,90, guardar/recargar, eliminar/error/reintento/foco y límite Free 3 por servidor; pausa libera lugar. Solo memoria local 3207 sin Redis. Vercel antes ju9e56qi3 y después 7409w0n62, ambas con demo Heather solo en el despliegue, sin cambiar el proyecto. Antes/después 390/1440 en docs/capturas/cupones-0031/. WebKit también 360 sin scroll. Carga de Next con retraso solo dev/preview; sin acciones de guardado en Vercel.
- #35 y #36 quedan abiertos, sin merge. Gabi autorizó continuar inmediatamente con B, Pagos/Cobros/Afiliación, en otro PR desde main; luego E2E en preview y correcciones en un último PR. Nada tiene autorización de merge.

## Pase B · PR #37 · Pagos/Cobros/Afiliación

- Rama independiente feat/cobros-afiliacion-diseno desde main 4ab96fa; worktree /private/tmp/tiendly-cobros-diseno. Pase 0031 a métodos, comisiones, inicio, cuatro pasos, enviada/revisión/observada/aprobada y error. Sin tocar reglas 0007, último método, solicitud/CCI/RUC, términos o borradores. Switches existentes con check, dinero sin .00 y titulares externos, iconos sin cajas, progreso carbón y barra móvil segura.
- Código ca9c807, preview aa54urq12 verde con Heather solo por despliegue; antes ju9e56qi3, ambos sin cambiar variables del proyecto. Capturas 390/1440 en docs/capturas/pagos-0031/. Estados vacíos/carga/error/datos y pasos; se siembra solo borrador ficticio de navegador para capturar, sin acciones del servidor en Vercel. Último ajuste de HojaModal aplica titular 0031 a las hojas; pantallas principales coinciden con las capturas.
- Chrome/WebKit locales en 3208: no habido bloqueado, consulta válida, cuatro pasos, CCI, aceptación y envío simulado. Nada externo, solo memoria sin Redis. Tokens/build pasan, servidor 3208 cerrado tras verificar PID 32967. 3100 intacto.
- #35, #36 y #37 permanecen sin merge. Continúa prueba E2E autorizada a 390 en una preview temporal que combina sus cambios sin integrarlos a main; registrar fallas y corregirlas en un último PR desde main.

- Verificación final Safari Vercel de B completada a 390/1440/360, todos los pasos y estados sin scroll; resultado en after/resultado-webkit.json. La siembra de borradores espera la hidratación para que el harness no los reemplace. Se continúa con E2E real en preview, sin merge.
