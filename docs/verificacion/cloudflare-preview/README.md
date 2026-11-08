# Primer preview en Cloudflare · 8-nov-2026

Informe histórico del primer despliegue, que usaba memoria temporal. La siguiente integración conecta [D1 y R2 del preview](../d1-r2-preview/README.md); ese informe describe el estado actual.

Publicado con autorización de Diego en la cuenta **Tiendly**, desde `dev` (`08d896f`), en la rama `chore/cloudflare-first-preview`.

- App: https://tiendly-preview.tiendly.workers.dev
- Vitrina: https://tiendly-preview.tiendly.workers.dev/muna
- Panel: https://tiendly-preview.tiendly.workers.dev/panel/productos
- Versión de Worker verificada: `ea2967a9-0b38-4e8a-963b-24f697fb3ac5`.
- Publicación: `npx wrangler`, perfil `tiendly`, cuenta `59f2586c7dd8a0467d1f9e444129e03a`.

## Alcance y datos

Este es el primer despliegue de la base de #47, ya integrada en `dev`. No integra las ramas funcionales de identidad, catálogo y onboarding/D1; no promueve cambios a `main` ni modifica Vercel, DNS o producción.

MUÑA es la demo. Los datos usan memoria temporal de cada instancia: pueden perderse y los guardados pueden no verse entre peticiones atendidas por instancias distintas. No usarlo para tiendas o pedidos reales. No se cargaron credenciales de Redis, Blob o Google, ni bindings D1/R2. El único binding es ASSETS.

Al cerrar la revisión, R2 ya admite listar buckets y la cuenta está vacía. Su activación no conecta automáticamente el almacenamiento a esta app. La persistencia y las subidas a R2 quedan para la siguiente integración.

`TIENDLY_ENTORNO=preview` y `TIENDLY_TIENDA_DEMO=muna`. Se conserva temporalmente `VERCEL_ENV=preview` porque la base todavía consulta esa variable para herramientas y datos de demo. No se presenta esto como la migración completa de entornos propuesta en el plan.

## Publicación reproducible

Desde un worktree aislado, en `frontend/`:

```sh
npm ci --include-workspace-root
npm run build
npm run typecheck
npm run deploy:cloudflare-preview
```

La base vinext genera Build Output para `cf`; Wrangler rechaza publicar ese formato directamente para evitar leer una configuración distinta. `scripts/prepare-wrangler-preview.mjs` copia el artefacto ya compilado a `.wrangler/preview/` y genera su manifiesto de Wrangler. No se cambia el compilador ni se mantienen dos configuraciones fuente de la app.

El puente exige el nombre `tiendly-preview`, MUÑA y exactamente los bindings de texto/ASSETS de esta prueba. Si aparecen secretos, D1, R2 u otros bindings, falla antes de publicar: esa integración requiere revisar la configuración de despliegue. Los artefactos quedan ignorados por Git.

El build excluye `heather` y `mi-tienda` y verifica su ausencia. La entrada del preview devuelve 404 para esas rutas antes del streaming; sin esa protección el runtime devuelve una página vacía con 200. El resto de respuestas conserva cuerpo, estado y cookies, y lleva `X-Robots-Tag: noindex, nofollow, noarchive`.

## Verificación

- Tokens, build Next, build vinext, tipos y `git diff --check`: PASS.
- Wrangler dry-run: PASS. Artefacto final: 2919.07 KiB; gzip 802.72 KiB; arranque informado: 15 ms.
- Dos pruebas de la entrada de despliegue: conservación de cuerpo/estado/cookies y rechazo 404 de rutas privadas.
- [42 comprobaciones publicadas](browser-preview.json): Chromium y WebKit, primero 390, después 1440 y 360 px; vitrina, ficha, carrito, Productos, Mi tienda, Pedidos y Registro. HTTP 200, sin errores JS, recursos fallidos, imágenes rotas ni scroll horizontal. Las imágenes diferidas del carrusel se cargan explícitamente antes de verificar su decodificación.
- [Interacciones](interacciones.json): agregar Cartera Noche, recargar carrito, abrir la cuenta y cerrar sesión; cookie sintética eliminada y regreso a Registro, en ambos motores. WebKit registró cancelaciones de prefetch al salir del panel; el cierre y sus cookies sí se verificaron. No se crearon pedidos ni se enviaron mensajes.
- Remoto: `/heather` y `/heather/logo-heather-wordmark.png` devuelven 404; `/muna/botin-saya` redirige 308 a `/muna/botin-otono`; MUÑA devuelve el encabezado noindex.

### Capturas del preview

| Vista | Chromium 390 | Chromium 1440 | WebKit 390 | WebKit 1440 |
|---|---|---|---|---|
| MUÑA | [Móvil](chromium-390-muna.jpg) | [Escritorio](chromium-1440-muna.jpg) | [Móvil](webkit-390-muna.jpg) | [Escritorio](webkit-1440-muna.jpg) |
| Productos | [Móvil](chromium-390-panel-productos.jpg) | [Escritorio](chromium-1440-panel-productos.jpg) | [Móvil](webkit-390-panel-productos.jpg) | [Escritorio](webkit-1440-panel-productos.jpg) |
| Registro | [Móvil](chromium-390-registro.jpg) | [Escritorio](chromium-1440-registro.jpg) | [Móvil](webkit-390-registro.jpg) | [Escritorio](webkit-1440-registro.jpg) |

## Pendiente y simulado

Persistencia D1, fotos R2, Google real, guardados concurrentes y aceptación completa del flujo de venta. Las pruebas locales de las ramas funcionales no equivalen a aceptación de este preview. OTP, pagos, SUNAT, bancos, envíos y comunicaciones siguen simulados; Google no está conectado. No se solicitaron ni publicaron mensajes, cobros o confirmaciones reales. No se verificaron aquí todos los escenarios de carga/error de cada módulo ni se generó un preview adicional en Vercel: la evidencia de este cambio de hosting corresponde a Cloudflare.

El despliegue automático desde `dev`, los recursos de producción y el corte de dominio quedan pendientes. Ningún merge está autorizado por la publicación de esta prueba.
