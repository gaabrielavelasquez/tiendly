# Primer corte de API separada · aceptación local

Código funcional: `563d414`. [PR #57](https://github.com/gaabrielavelasquez/tiendly/pull/57), integrado en `dev` con merge commit `acf79e7`. Rama `feat/backend-api`, worktree Orca `backend-api`, desde `dev` `8f2906f`. [Alcance y comandos](../../backend/separacion-api.md).

## Resultado

PASS local con Next.js convencional en localhost:3220 y API Worker autónoma en 127.0.0.1:3221. El frontend solo recibe la URL de API; los secretos y D1/R2 están en el proceso backend. [Resumen de checks](checks.json) y [resultados de navegador](local/result.json).

- 19 tests de backend: regresión y frontera HTTP, titularidad, origen, ofertas calculadas en backend, conflictos atómicos, imágenes, callbacks, revocación y destino de despliegue QA.
- Tokens, tipos frontend/backend, build Next y vinext, cinco tests de entornos, cuatro tests de manifiesto y builds autónomos local/QA de la API en dry-run: PASS. Next/vinext se ejecutaron en secuencia, con el servidor propio detenido. Permanecen los avisos anteriores de sourcemaps/clasificación de vinext y el aviso del Node local 26.10 frente al mínimo declarado 26.12.
- Seis recorridos Chromium/WebKit a 390, 1440 y 360; 42 checkpoints sin scroll horizontal ni imágenes rotas. Tienda vacía, nombre largo, precio S/ 129,999.10, foto sintética subida a R2, guardado/recarga sin duplicado, fallo de red/reintento, edición concurrente, vitrina y salida. La cookie previa al logout recibe 401.
- Se revisaron 1 847 archivos de artefactos frontend/API; cero coincidencias con las credenciales privadas locales.

Las sesiones del harness originales son sintéticas firmadas en D1 emulado; no equivalían a Google real. La imagen gris es un fixture de canvas. Se limpiaron por ID los usuarios/tiendas/imágenes creados en los recorridos completos. Una lectura final del emulador no encontró usuarios ui-qa pendientes. Ningún recurso remoto recibió escrituras.

## Ingreso Google real · 15-nov-2026

Diego registró el origen `http://localhost:3220` y el callback `http://localhost:3220/api/auth/callback/google` en el cliente **Tiendly Preview** (`292177294857-u1ag…`). El cliente **Tiendly Prod** no se modificó. El runtime local siguió usando la pareja de preview que ya tenía en `.dev.vars`; no se generaron credenciales nuevas.

Ingreso real completado en `http://localhost:3220/registro` con la API en `127.0.0.1:3221`:

- Cuenta nueva con proveedor `google` y una sola sesión, creada el `2026-11-15 20:53:58 UTC` y con vencimiento el `2026-11-22`.
- El onboarding creó la tienda `Panch` (`panch`, versión 1) a través de la API separada: la identidad real escribe en D1.
- `GET /api/business/snapshot` con la cookie de esa sesión: **200**. `POST /api/auth/sign-out`: **200**. La misma cookie vuelve a responder **401** y la tabla `session` queda en 0.
- `GET /api/public/stores/panch`: **200** con la tienda y sus productos.
- 19 tests de backend siguen pasando. CI del head `3110ed5` en verde.

Detalle en [google-local-20261115.json](google-local-20261115.json). La prueba de revocación eliminó la sesión local; hay que volver a ingresar para continuar en el 3220. No hubo escrituras remotas, migraciones ni despliegues.

## Par QA en modo API · 15-nov-2026

La API y el frontend ya se publican por separado en Cloudflare, sin migraciones y sin tocar el Worker anterior ni los datos existentes.

- `api-preview` desplegado en https://api-preview.tiendly.workers.dev (versión `127dcf37`, revisión `44f381e`) con la D1/R2 de QA. Los secretos se cargaron desde la pareja privada del cliente **Tiendly Preview**; el secreto de sesión es nuevo y no se publicó.
- `preview` publicado en modo API (versión `2fd21f83`, revisión `0d1db3f`) con `TIENDLY_API_URL`. El modo es opt-in por variable de entorno: sin ella, el Worker conserva el runtime anterior. No se activó en producción.
- **Cloudflare bloquea el fetch público entre Workers de la misma zona** (error 1042). El primer intento devolvía 500 en las páginas: el subrequest nunca llegaba a `api-preview`. Se resolvió con un **service binding** `API` y una entrada que lo expone al runtime; `api-client` lo usa cuando existe y cae a `fetch` normal en local.
- `verify:qa`: `/registro` 200, `/muna` 200, `/api/auth/get-session` 200, `/api/business/stores` y `/api/business/catalog` 401, rutas privadas 404. La tienda real `panchi-house` responde 200 con su contenido a través del proxy, y `/api/public/stores/panchi-house` 200.
- Rollback de código: `npx wrangler rollback --profile tiendly --config .wrangler/preview/wrangler.json` hacia la versión `e82b6aca` (runtime anterior). No revierte datos.

Límites: las sesiones del runtime anterior en QA quedan invalidadas por el secreto nuevo, así que hay que repetir el ingreso Google en el preview para aceptarlo de punta a punta. No se ejecutaron migraciones remotas ni se tocó producción, datos productivos o DNS.

## Capturas

Capturas originales del navegador de desarrollo, sin edición de imágenes. Se inspeccionaron muestras representativas a 390/1440. La marca de Next en desarrollo no pertenece al diseño de la app.

| Vista | Chrome 390 | Chrome 1440 | WebKit 390 | WebKit 1440 |
|---|---|---|---|---|
| Tienda creada | [Ver](local/chromium-390-tienda-creada.png) | [Ver](local/chromium-1440-tienda-creada.png) | [Ver](local/webkit-390-tienda-creada.png) | [Ver](local/webkit-1440-tienda-creada.png) |
| Producto/foto guardados | [Ver](local/chromium-390-producto-guardado.png) | [Ver](local/chromium-1440-producto-guardado.png) | [Ver](local/webkit-390-producto-guardado.png) | [Ver](local/webkit-1440-producto-guardado.png) |
| Producto recargado | [Ver](local/chromium-390-producto-recargado.png) | [Ver](local/chromium-1440-producto-recargado.png) | [Ver](local/webkit-390-producto-recargado.png) | [Ver](local/webkit-1440-producto-recargado.png) |
| Error de red recuperable | [Ver](local/chromium-390-error-recuperable.png) | [Ver](local/chromium-1440-error-recuperable.png) | [Ver](local/webkit-390-error-recuperable.png) | [Ver](local/webkit-1440-error-recuperable.png) |
| Conflicto entre pestañas | [Ver](local/chromium-390-conflicto-de-version.png) | [Ver](local/chromium-1440-conflicto-de-version.png) | [Ver](local/webkit-390-conflicto-de-version.png) | [Ver](local/webkit-1440-conflicto-de-version.png) |
| Vitrina pública | [Ver](local/chromium-390-vitrina.png) | [Ver](local/chromium-1440-vitrina.png) | [Ver](local/webkit-390-vitrina.png) | [Ver](local/webkit-1440-vitrina.png) |
| Sesión cerrada | [Ver](local/chromium-390-sesion-cerrada.png) | [Ver](local/chromium-1440-sesion-cerrada.png) | [Ver](local/webkit-390-sesion-cerrada.png) | [Ver](local/webkit-1440-sesion-cerrada.png) |

## Pendiente antes de marcar listo

- ~~Autorizar el callback local nuevo en el cliente Tiendly Preview y completar el ingreso Google real.~~ **Hecho el 15-nov-2026**: origen y callback `localhost:3220` autorizados, ingreso real, snapshot autenticado y revocación verificados. Ver [Ingreso Google real](#ingreso-google-real--15-nov-2026).
- ~~Publicar y aceptar el par de servicios en QA.~~ **Publicado el 15-nov-2026**: `api-preview` y `preview` en modo API con service binding. Falta repetir el ingreso Google real sobre QA para cerrar la aceptación remota. Ver [`docs/traspaso.md`](../../traspaso.md).
- La medición Vercel requerida para el PR no acredita el modo API mientras no haya backend conectado allí. Las capturas de este informe son locales y no se presentan como evidencia remota.

Ventas/reservas/pedidos/checkout/cupones/ajustes editables/tareas y métricas siguen fuera de este primer corte. No se migraron ni borraron datos productivos. Pagos y comunicaciones continúan simulados. No se cambiaron estilos, tokens, DNS, configuración de Vercel ni el Worker QA existente. El preview automático de Vercel del PR compiló correctamente y conserva el runtime anterior; está protegido y esta sesión de CLI no tiene autenticación para medirlo. Integrado en `dev` con el merge commit `acf79e7`.

CI y Vercel del head `b87a73f`: verdes. En esa corrida, la autorización Google real devolvió 200 a través del proxy local, una cookie de estado y el callback exacto nuevo, pero aún no se había completado el consentimiento; la aceptación posterior está en [Ingreso Google real](#ingreso-google-real--15-nov-2026). Los dos procesos locales quedan disponibles en terminales Orca «Next UI 3220» y «API local 3221».
