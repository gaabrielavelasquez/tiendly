# Aceptación de formularios D1/R2 en Worker local

8-nov-2026. La rama `feat/onboarding-d1` incorpora `dev` después de los merges #45/#46. Esta evidencia corresponde al Worker compilado con vinext, D1 y R2 locales. No acredita OAuth Google real, recursos remotos ni el core loop de compras.

## Resultado

`result.json`: seis recorridos completos, Chrome y WebKit en 390, 1440 y 360 px. Se verifica creación de tienda desde el formulario, catálogo inicialmente vacío, producto con nombre largo/precio alto/foto sintética, segundo guardado sin duplicación, recarga con precio y stock persistidos, error de red con reintento y conflicto de versiones entre pestañas. El rechazo conserva lo escrito y no pisa el precio nuevo. La vitrina muestra el mismo producto y su imagen decodificada.

Los 36 checkpoints locales no tienen scroll horizontal. Las capturas se toman en 390 y 1440; no sustituyen las medidas exigidas en preview de Vercel. No hay prueba de carga ni aceptación completa de los cuatro estados de todas las vistas.

Se detectó una imagen rota pese al HTTP 200 de R2: vinext la enviaba al optimizador. `vite.config.ts` usa ahora la configuración existente con `images.unoptimized=true` solo en Cloudflare. Next/Vercel conserva su optimización. El navegador ya reduce las fotos a 1200 px; no se habilitan transformaciones pagas.

Las imágenes grises son fixtures creados con canvas; no son fotos de una tienda real. Las sesiones se insertan y firman únicamente en el D1 local, sin habilitar endpoints de prueba ni `testUtils` en la app. El harness limpia sus usuarios, tiendas e imágenes por ID; las cuentas usan `example.invalid` y el número ficticio `900000000`. No se enviaron mensajes ni cobros.

## Repetir

Desde `frontend/`, en un worktree aislado, con las variables locales de Better Auth configuradas privadamente:

```sh
npm run build:vinext
npm run start:vinext -- --host localhost --port 3215
```

En otra terminal, también desde `frontend/`:

```sh
python3 ../backend/scripts/migrate-local.py --origin http://localhost:3215
npm install --prefix /private/tmp/tiendly-browser-tests playwright@1.61.0
PLAYWRIGHT_MODULE=/private/tmp/tiendly-browser-tests/node_modules/playwright/index.mjs node scripts/verify-d1-local.mjs
```

El script rechaza orígenes remotos y exige que `.dev.vars` coincida con el origen local. No imprimir ni publicar ese archivo. Los navegadores de Playwright deben estar instalados. Por defecto usa el bucket local `tiendly-preview-images`; si se renombra, establecer `TIENDLY_QA_BUCKET`.

## Capturas

| Estado | Chrome 390 | Chrome 1440 | WebKit 390 | WebKit 1440 |
|---|---|---|---|---|
| Tienda creada | [Ver](chromium-390-tienda-creada.png) | [Ver](chromium-1440-tienda-creada.png) | [Ver](webkit-390-tienda-creada.png) | [Ver](webkit-1440-tienda-creada.png) |
| Producto guardado | [Ver](chromium-390-producto-guardado.png) | [Ver](chromium-1440-producto-guardado.png) | [Ver](webkit-390-producto-guardado.png) | [Ver](webkit-1440-producto-guardado.png) |
| Producto recargado | [Ver](chromium-390-producto-recargado.png) | [Ver](chromium-1440-producto-recargado.png) | [Ver](webkit-390-producto-recargado.png) | [Ver](webkit-1440-producto-recargado.png) |
| Error recuperable | [Ver](chromium-390-error-recuperable.png) | [Ver](chromium-1440-error-recuperable.png) | [Ver](webkit-390-error-recuperable.png) | [Ver](webkit-1440-error-recuperable.png) |
| Conflicto de versión | [Ver](chromium-390-conflicto-de-version.png) | [Ver](chromium-1440-conflicto-de-version.png) | [Ver](webkit-390-conflicto-de-version.png) | [Ver](webkit-1440-conflicto-de-version.png) |
| Vitrina | [Ver](chromium-390-vitrina.png) | [Ver](chromium-1440-vitrina.png) | [Ver](webkit-390-vitrina.png) | [Ver](webkit-1440-vitrina.png) |

Pendiente: Google real, recursos R2/D1 del preview y aceptación desplegada; ventas/reservas/cupones, comandos de configuración y tareas. Mantener #50 como borrador y no publicar la migración en producción.
