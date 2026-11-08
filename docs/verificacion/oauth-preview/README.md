# Dominio y OAuth del preview · 8-nov-2026

La app de pruebas se publica en **https://preview.tiendly.workers.dev**, Worker `preview`, artefacto `4e566e5c-255e-4645-af55-ebb74e31acda` (la versión activa tras cargar secretos está en `resources.json`). El cambio fue solicitado por Diego; no publica `main` ni habilita producción.

## Recursos y credenciales

Se conserva la misma D1 `tiendly-preview` (`9fcfd54b-56a2-4cb9-af11-800e5191e93d`), con `0001_auth.sql`, `0002_stores.sql` y `0003_catalog.sql`, y el bucket privado `tiendly-preview-images`. No se ejecutan migraciones ni se importan datos. [Lectura independiente de recursos](resources.json).

`BETTER_AUTH_URL` coincide con el origen nuevo. El Worker tiene `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` como secretos cifrados. Su manifiesto no publica valores secretos. El secreto de sesión se generó exclusivamente para el Worker nuevo; los despliegues siguientes lo conservan. El archivo privado temporal usado al desplegar fue eliminado. Los JSON originales del usuario no se modifican ni se agregan al repo.

Preview y producción usan clientes OAuth separados. Configuración exacta y procedimiento: [Google OAuth](../../configuracion/google-oauth.md). La selección del JSON debe corresponder al cliente de preview; el primer archivo encontrado pertenecía a otro cliente que el mostrado en la consola y la prueba devolvió `redirect_uri_mismatch`. Se cargó luego el JSON exclusivo de «Tiendly Preview», con origen y callback coincidentes, y Google acepta la solicitud. Una lectura posterior de D1 confirma una cuenta Google, una sesión activa y operaciones autenticadas de creación de tienda y producto; el ingreso real ya está verificado.

El Worker anterior `tiendly-preview` permanece publicado con su configuración previa y su secreto de sesión, sin Google. Las dos credenciales Google cargadas allí durante la comprobación inicial se retiraron al publicar el nuevo Worker. No se borraron Workers, bases, buckets ni datos existentes.

## Verificación del dominio nuevo

- Tokens, build Next, build vinext, tipos de frontend/backend: PASS.
- 14 tests locales del backend D1/R2: PASS.
- Tres pruebas del manifiesto Wrangler, preservación de cookies y exclusión de fotos privadas: PASS.
- [18 comprobaciones de navegador](browser.json): Chromium y WebKit, primero 390, luego 1440 y 360 px, en Registro, MUÑA y Productos. HTTP 200, sin errores JavaScript, recursos HTTP fallidos, imágenes rotas ni scroll horizontal.
- APIs de tienda/catálogo sin sesión y catálogo con cookie de slug inventada: 401. Sesión ausente: `null`. Heather e imagen inexistente: 404.
- [Inicio de OAuth](authorization.json): HTTP 200, cliente coincidente con el JSON de preview, callback `https://preview.tiendly.workers.dev/api/auth/callback/google` y scopes `email profile openid`. Google acepta la solicitud y muestra su [pantalla de ingreso](google-authorization.jpg), sin `redirect_uri_mismatch`. Esta automatización se detiene en Google. El regreso real se acredita por separado en [session.json](session.json): una cuenta Google y una sesión activa persistida en D1, junto con una tienda y un producto creados mediante operaciones autenticadas. No se guardan emails, IDs de usuario, tokens ni cookies en la evidencia.

Las pruebas de persistencia de tienda/producto/R2 anteriores están en [D1/R2](../d1-r2-preview/README.md). La cuenta real creó una tienda y un producto durante esta sesión; no se generaron fixtures de catálogo ni pedidos. [Lectura del catálogo](persisted-images.json): todavía no hay fotos de producto en R2.

[Prueba remota de R2](r2-smoke.json): una imagen sintética temporal se subió con Wrangler al bucket de preview y se leyó sin cookie desde el Worker nuevo. HTTP 200, PNG decodificado de 2 × 2, `nosniff` y caché inmutable. El objeto temporal fue eliminado. Esta prueba comprueba almacenamiento y lectura del binding; no representa una subida desde el formulario de la cuenta real. MUÑA sigue siendo una demo con datos y fotos estáticos.

## Capturas publicadas

| Vista | Chromium 390 | Chromium 1440 | WebKit 390 | WebKit 1440 |
|---|---|---|---|---|
| Registro | [Ver](chromium-390-registro.jpg) | [Ver](chromium-1440-registro.jpg) | [Ver](webkit-390-registro.jpg) | [Ver](webkit-1440-registro.jpg) |
| MUÑA | [Ver](chromium-390-muna.jpg) | [Ver](chromium-1440-muna.jpg) | [Ver](webkit-390-muna.jpg) | [Ver](webkit-1440-muna.jpg) |
| Productos | [Ver](chromium-390-panel-productos.jpg) | [Ver](chromium-1440-panel-productos.jpg) | [Ver](webkit-390-panel-productos.jpg) | [Ver](webkit-1440-panel-productos.jpg) |

## Pendiente y simulado

OAuth de preview aceptado por Google y sesión real verificada en D1. La lectura posterior también confirma tienda/producto persistidos; falta que la cuenta suba su primera foto de producto. Producción y su dominio siguen sin publicar. Ventas/reservas/cupones, guardados de configuración y tareas no están migrados. Pagos, SUNAT, bancos, envíos y comunicaciones siguen simulados. No se enviaron mensajes ni cobros.

PR [#53](https://github.com/gaabrielavelasquez/tiendly/pull/53) hacia `dev`. No hay merge autorizado.
