# D1 y R2 del preview · 8-nov-2026

Integración autorizada por Diego para el entorno de pruebas de la cuenta Tiendly. No migra datos de Redis/Blob ni cambia Vercel, DNS o producción.

## Recursos conectados

| Recurso | Nombre o valor |
|---|---|
| Worker | `tiendly-preview` |
| Origen | https://tiendly-preview.tiendly.workers.dev |
| D1 | `tiendly-preview` |
| ID de D1 | `9fcfd54b-56a2-4cb9-af11-800e5191e93d` |
| Binding D1 | `DB` |
| R2 | `tiendly-preview-images`, privado |
| Binding R2 | `UPLOADS` |
| Ubicación solicitada | ENAM para ambos recursos. |
| Versión publicada | `5d3c1503-9e75-4c79-8451-a354b27b7712` |

Se aplicaron `0001_auth.sql`, `0002_stores.sql` y `0003_catalog.sql` con Wrangler. Una consulta independiente de D1 confirma sus registros; no hay migraciones pendientes. No se reutilizan las bases desechables de los probes anteriores. D1 tiene replicación de lecturas desactivada.

La [comprobación final de limpieza](cleanup.json) confirma cero usuarios, sesiones, tiendas, productos y guardas de escritura; sin infracciones de claves foráneas. Wrangler informa cero objetos y 0 B en el bucket tras eliminar las fotos sintéticas. El esquema y los bindings permanecen conectados.

Se reutiliza la implementación de identidad, tiendas, catálogo y onboarding de la pila #48–#50, disponible en `feat/catalog` después del merge #50. El primer despliegue #51 aporta el puente de Build Output a Wrangler. Esta rama combina esas bases para aceptación remota; no las integra en `dev` ni `main`.

## Configuración y acceso

`frontend/cloudflare.config.ts` fija el ID de D1 y los nombres del preview. `prepare-wrangler-preview.mjs` exige exactamente esos recursos, la cuenta Tiendly y el origen publicado. Genera el manifiesto en `.wrangler/preview/`, sin incluir valores secretos. CI compila ese manifiesto y ejecuta sus tres pruebas sin acceder a recursos remotos.

El secreto de sesión se generó con entropía criptográfica, en un archivo temporal privado, y se subió cifrado con `wrangler deploy --secrets-file`. Su valor no se imprime ni forma parte del repo. Los despliegues normales conservan el secreto existente.

El archivo temporal del secreto se eliminó al terminar las pruebas. El secreto permanece únicamente en la configuración privada del Worker.

Google todavía no está configurado. Se admite que falte la pareja completa de credenciales, sin habilitar correo/contraseña, ingreso simulado ni endpoints de prueba. Una pareja parcial, un secreto de sesión ausente o un origen inválido se rechazan. La cookie de slug no autentica a nadie. La UI conserva el botón de Google con su error recuperable; no se presenta como ingreso operativo.

Las sesiones sintéticas de QA se insertan directamente en esta D1 y se firman fuera de la app, con un usuario exclusivo por recorrido. No hay una puerta de entrada pública de QA. Los usuarios usan `example.invalid`, el teléfono ficticio `900000000` y fotos generadas con canvas. La limpieza elimina únicamente los IDs y objetos creados por cada recorrido.

## Comandos

Desde `frontend/` en un worktree aislado:

```sh
npm ci --include-workspace-root
npm run build
npm run typecheck
npm run build:vinext
npm run prepare:wrangler-preview
npm run migrate:cloudflare-preview
npx wrangler deploy --profile tiendly --config .wrangler/preview/wrangler.json
```

La primera publicación agregó `BETTER_AUTH_SECRET` mediante un archivo privado temporal. No regenerarlo en cada despliegue: invalidaría sesiones. No pasar credenciales de producción. El bucket no necesita acceso público: `/images/<store-id>/<uuid>.<ext>` sirve las fotos mediante el Worker.

El harness remoto está limitado al origen, la cuenta y la base indicados arriba. Requiere acceso administrativo de Wrangler al preview y un archivo privado temporal que contenga el secreto de sesión correspondiente; rechaza otros destinos. No imprime ni guarda tokens o cookies en la evidencia:

```sh
PLAYWRIGHT_MODULE=/ruta/privada/playwright/index.mjs node scripts/verify-d1-preview.mjs /private/tmp/archivo-privado-de-sesion.json
```

## Verificación

Tokens, build Next, build vinext, tipos frontend/backend y 14 tests de backend pasan. Las tres pruebas del manifiesto verifican preservación de respuestas/cookies, exclusión de rutas privadas y recursos exclusivos de preview sin publicar secretos.

La aceptación remota se registra en [result.json](result.json). Cada recorrido cubre creación de tienda desde el formulario, catálogo vacío, producto con nombre largo/precio alto/foto sintética, segundo guardado sin duplicados, recarga, fallo de red recuperable, conflicto entre pestañas y vitrina con imagen R2 decodificada. El harness espera confirmación del API de catálogo antes de comparar versiones; las lecturas independientes de D1 distinguen un guardado pendiente de una inconsistencia real.

**PASS:** seis recorridos completos, Chromium y WebKit, primero 390, después 1440 y 360 px. Los 36 checkpoints no presentan imágenes rotas ni scroll horizontal. Las fotos se leyeron también sin cookie desde el endpoint público del Worker. No se verificó OAuth ni el flujo de pedidos y pagos. La evidencia es del preview Cloudflare; no sustituye la aceptación completa de todos los módulos ni agrega una ronda de capturas en Vercel.

[Acceso remoto](access.json): sin sesión o con cookie de slug falsa, 401; cambios con origen ajeno o ausente, 403; imagen con MIME PNG y bytes inválidos, 400; Google sin configurar, 404 sin redirección externa; sesión revocada, 401. El test de acceso no sube fotos válidas ni crea pedidos.

### Capturas de la app publicada

| Estado | Chromium 390 | Chromium 1440 | WebKit 390 | WebKit 1440 |
|---|---|---|---|---|
| Tienda creada | [Ver](chromium-390-tienda-creada.jpg) | [Ver](chromium-1440-tienda-creada.jpg) | [Ver](webkit-390-tienda-creada.jpg) | [Ver](webkit-1440-tienda-creada.jpg) |
| Producto guardado | [Ver](chromium-390-producto-guardado.jpg) | [Ver](chromium-1440-producto-guardado.jpg) | [Ver](webkit-390-producto-guardado.jpg) | [Ver](webkit-1440-producto-guardado.jpg) |
| Producto recargado | [Ver](chromium-390-producto-recargado.jpg) | [Ver](chromium-1440-producto-recargado.jpg) | [Ver](webkit-390-producto-recargado.jpg) | [Ver](webkit-1440-producto-recargado.jpg) |
| Error recuperable | [Ver](chromium-390-error-recuperable.jpg) | [Ver](chromium-1440-error-recuperable.jpg) | [Ver](webkit-390-error-recuperable.jpg) | [Ver](webkit-1440-error-recuperable.jpg) |
| Conflicto de versión | [Ver](chromium-390-conflicto-de-version.jpg) | [Ver](chromium-1440-conflicto-de-version.jpg) | [Ver](webkit-390-conflicto-de-version.jpg) | [Ver](webkit-1440-conflicto-de-version.jpg) |
| Vitrina | [Ver](chromium-390-vitrina.jpg) | [Ver](chromium-1440-vitrina.jpg) | [Ver](webkit-390-vitrina.jpg) | [Ver](webkit-1440-vitrina.jpg) |

## Pendiente y simulado

Google real y su callback, ventas/reservas/cupones, comandos de configuración y tareas programadas. La vitrina de tiendas D1 lee catálogo y configuración iniciales; las operaciones todavía no migradas se rechazan en lugar de escribir documentos en memoria. MUÑA y las otras muestras siguen siendo demos de ejemplo, no tiendas importadas.

OTP, pagos, SUNAT, bancos, envíos y comunicaciones siguen simulados. No se crean pedidos ni se envían mensajes o cobros. Las pruebas de sesión sintética no validan OAuth. No se habilitan recursos de producción ni despliegues automáticos desde `dev`; ningún merge está autorizado por este despliegue.
