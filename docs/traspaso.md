# Estado y traspaso · Tiendly

Punto de entrada para saber dónde quedó el trabajo. Última actualización: **16-nov-2026**. Este documento se sobrescribe cuando cambia el estado; el detalle de cada sesión vive en la descripción de su PR y en el historial de git.

## Dónde está todo

| Pieza | Dónde |
|---|---|
| App (panel, vitrina, checkout) | `frontend/`. Los comandos `npm` se corren ahí. |
| Reglas, API, D1/R2 y scripts | `backend/`. Ver [`backend/README.md`](../backend/README.md). |
| Entornos y publicación | [`docs/configuracion/entornos.md`](configuracion/entornos.md). |
| Decisiones de producto y diseño | [`docs/decisiones/`](decisiones/README.md). |
| Plan de backend vigente | [`docs/plan-backend.md`](plan-backend.md). |
| Índice de `docs/` | [`docs/README.md`](README.md). |

## Estado actual

- **Ramas:** `dev` es la rama de integración (`dbb5026`, con #58–#60 integrados; #61 en revisión). `main` sigue en `e635050`; la migración a Cloudflare no se publicó en producción.
- **QA:** `https://preview.tiendly.workers.dev` (Worker `preview`) y `https://api-preview.tiendly.workers.dev` (Worker `api-preview`), con D1/R2 exclusivos de pruebas. El preview consume la API por HTTP con `TIENDLY_API_URL` y un service binding `API`.
- **Backend:** identidad, tiendas, catálogo e imágenes corren sobre D1/R2 con Better Auth y Google. La API separada es el primer corte de la migración; el runtime anterior se conserva sin `TIENDLY_API_URL`.
- **Comercio:** ventas/pedidos, stock y reservas, checkout, cupones, guardados de configuración/Mi tienda y tareas **siguen sin migrar**. Pagos, SUNAT, bancos, envíos y comunicaciones siguen simulados.
- **Producción:** `https://tiendly-web-sigma.vercel.app` desde `main`, con Redis/Blob. Intacta: sin cambios de datos, DNS ni despliegues.

## Pendientes, en orden

1. **Cerrar la aceptación remota del par QA:** repetir el ingreso Google real en `preview` (el `BETTER_AUTH_SECRET` nuevo invalidó las sesiones anteriores). `verify:qa` ya pasa en lectura.
2. **Definir el origen fijo del par de servicios** antes de usar dominios efímeros, y publicar el frontend de forma independiente.
3. **Completar la migración de comercio**, un módulo por PR con su migración: ventas/pedidos → stock/reservas → checkout → cupones → configuración/Mi tienda → tareas. El orden y las condiciones están en [`docs/plan-backend.md`](plan-backend.md). La revisión de arquitectura del 16-nov (#61) ya dejó puesta la base: geografía única en contracts, decisión 0047 (envío gratis antes del cupón) y `coupon` opcional en `CheckoutInput`. Durante la migración conviene saldar la deuda que quedó señalada: paginación de pedidos y caché del snapshot público, limpieza de reservas vencidas, puertos para `D1Orders`/`D1Settings`, capa `dominio/` en el frontend y retirada del triple-runtime en las server actions.
4. **Aceptación del core loop desplegado** y, solo con aprobación de Gabi, el corte de producción.
5. **Protecciones de GitHub** para `main` y `dev`: siguen pendientes de una cuenta administradora ([configuración](configuracion/github-protecciones.md)).
6. **Backlog de producto:** precio y SKU por variante ([`docs/backlog.md`](backlog.md)).

## Límites y riesgos vigentes

- **Nada se mergea sin la aprobación de Gabi.** Merge commit, sin squash ni force-push.
- **Producción no se toca** sin aprobación específica: ni Redis/Blob, ni DNS, ni migraciones, ni el Worker.
- **Datos de QA y producción están separados.** No copies secretos de producción al frontend, a QA ni a GitHub.
- **Los previews guardan en D1 de QA**, pero los flujos que guardan se prueban en un solo proceso local para evitar confundir instancias.
- **El 3100 es el servidor de Gabi.** Trabaja en un worktree y en otro puerto; no cierres procesos ajenos.
- **El traspaso del backend anterior** ([cierre de la-bodega](backend/traspaso-la-bodega.md)) sigue abierto solo en la baja remota del repo histórico.

## Sesiones recientes

- **16-nov:** revisión de arquitectura (SOLID, mantenibilidad, escalabilidad) aplicada en #61: geografía única en contracts con prueba, decisión 0047, hardening de errores/relojes en el backend, índices de listado (26 tests en verde). Pendiente su revisión.
- **15-nov:** par QA en modo API publicado y verificado en lectura; ingreso Google real aceptado en local (19 tests de backend). Detalle en el registro histórico.
- **13-nov:** topología local/QA/producción y publicación QA con `npm run release:qa`.
- **8-nov:** Cloudflare foundation, identidad/tiendas, catálogo/R2 y D1/R2 del preview.
