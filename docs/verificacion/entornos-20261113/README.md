# Desarrollo local y publicación QA · 13-nov-2026

Rama `chore/environment-setup`, desde `dev` `01ab186`, worktree Orca `environment-setup`. Topología acordada: desarrollo local, QA alojado y producción. [Procedimiento](../../configuracion/entornos.md).

## Desarrollo local: PASS

`npm run dev:cloudflare` prepara variables privadas, genera un secreto local estable y arranca Vite/workerd en 3215. Aplica las tres migraciones pendientes solo al D1 emulado. Un segundo arranque conserva secreto y esquema. Lectura del explorer: binding DB con ID local ficticio, bucket `tiendly-local-images`, sin conexión a los recursos QA.

[Seis recorridos completos](local/result.json), Chromium y WebKit a 390/1440/360, 36 checkpoints sin overflow ni imágenes rotas. Creación de tienda, catálogo vacío, producto con nombre largo/precio alto/céntimos/foto sintética, guardado posterior sin duplicado, recarga, error de red/reintento, conflicto entre pestañas y vitrina pública. Las sesiones son sintéticas firmadas sobre D1 local; sus tiendas, usuarios e imágenes se limpian por ID al terminar. No se enviaron mensajes ni cobros.

Se corrigió una incompatibilidad real de React dev con el stub `console.createTask` de workerd mediante un flag exclusivo del servidor local. El harness espera hidratación de Vite y confirmación conjunta de precio/versión; no se desactiva el overlay ni se cambian componentes o estilos.

| Vista | Chromium 390 | WebKit 1440 |
|---|---|---|
| Tienda creada | [Ver](local/chromium-390-tienda-creada.png) | [Ver](local/webkit-1440-tienda-creada.png) |
| Producto/foto | [Ver](local/chromium-390-producto-guardado.png) | [Ver](local/webkit-1440-producto-guardado.png) |
| Error recuperable | [Ver](local/chromium-390-error-recuperable.png) | [Ver](local/webkit-1440-error-recuperable.png) |
| Conflicto | [Ver](local/chromium-390-conflicto-de-version.png) | [Ver](local/webkit-1440-conflicto-de-version.png) |
| Vitrina | [Ver](local/chromium-390-vitrina.png) | [Ver](local/webkit-1440-vitrina.png) |

Capturas inspeccionadas sin edición. La imagen gris es un fixture de canvas, no una foto real.

## Google local: callback pendiente

Se encontró privadamente el JSON del cliente que coincide con el usado por QA; solo su pareja Google se añadió a `.dev.vars`, con permiso 0600 y conservando el secreto de sesión propio. No se copian credenciales productivas ni valores a la evidencia.

[Inicio OAuth](oauth-local.json): 200 y callback exacto `http://localhost:3215/api/auth/callback/google`; Google devuelve `redirect_uri_mismatch`. Se solicitó añadir ese URI al cliente Tiendly Preview sin quitar el callback QA. No se declara ingreso local real completado.

## Publicación QA

Publicado con `npm run release:qa` y el perfil Wrangler local `tiendly`, sin crear API tokens. Código funcional `de9fc3ab8628efea3f41714ac4468393d78dd924`; versión `e82b6aca-8aee-49f3-ae95-d5399680b2e6`. El job alojado queda desactivado salvo activación explícita de `QA_AUTO_DEPLOY` y credencial separada. El QA no se publica por abrir un PR.

PASS: tokens, tipos frontend/backend, build Next/Turbopack, build vinext, 14 tests backend, cinco tests de entornos y cuatro del manifiesto. Se revisaron 929 archivos del artefacto: ninguno contiene los valores de las credenciales locales. Los avisos previos de sourcemaps/clasificación de vinext permanecen; no se cambian dependencias ni lockfile. Node local 26.10.0 es anterior al mínimo declarado 26.12.0, pero estos checks pasan; CI usa Node 26 del runner.

Health publicado: 200, SHA coincidente, artefacto limpio, entorno preview, esquema D1, R2 y configuración OAuth correctos. Smoke: Registro/MUÑA 200, sesión null, APIs de negocio 401, rutas privadas 404 y noindex. Esas comprobaciones son de solo lectura. Para cotejar el cliente Google se inició OAuth en QA: puede crear estado transitorio de autorización; no se crearon cuentas, tiendas, productos ni pedidos en QA.

[18 comprobaciones públicas QA](qa/browser.json): Chromium/WebKit a 390/1440/360, Registro, MUÑA y Productos demo sin sesión; 200, sin overflow, imágenes rotas ni errores JS. Las imágenes diferidas de los carruseles se cargan explícitamente antes de verificar decodificación. Capturas inspeccionadas sin edición.

| Vista QA | Chromium 390 | WebKit 1440 |
|---|---|---|
| Registro | [Ver](qa/chromium-390-registro.jpg) | [Ver](qa/webkit-1440-registro.jpg) |
| MUÑA | [Ver](qa/chromium-390-muna.jpg) | [Ver](qa/webkit-1440-muna.jpg) |
| Productos demo | [Ver](qa/chromium-390-productos.jpg) | [Ver](qa/webkit-1440-productos.jpg) |

[PR #56](https://github.com/gaabrielavelasquez/tiendly/pull/56), borrador por el callback/ingreso Google local pendiente. La evidencia nueva no repite las escrituras autenticadas remotas: se conserva la [aceptación D1/R2 previa](../d1-r2-preview/README.md). La última subida de evidencia/documentación no cambia el código funcional desplegado.

Desarrollo local queda corriendo en el worktree `environment-setup`, terminal Orca «Local dev · 3215», con migraciones al día. Se detuvo el proceso propio antes de los builds y se volvió a arrancar después. No se cambió la rama ni se ejecutaron builds en el checkout principal o el worktree histórico del chat.

## Alcance y pendientes

No hay cambios visuales. Producción continúa en Vercel; no se cambian DNS, recursos ni datos productivos. No se ejecutan migraciones remotas. Ventas/reservas/checkout/cupones/configuración/tareas siguen pendientes; pagos, SUNAT, bancos, envíos y comunicaciones siguen simulados. La aceptación local no acredita esos módulos ni OAuth real.
