# Plan de backend · Tiendly

Plan vigente al **15-nov-2026**. El plan base del 29-oct-2026, con su contexto, costos, calendario y decisiones de esa fecha, se conserva en [`docs/historia/plan-backend-2026-10-29.md`](historia/plan-backend-2026-10-29.md). Si algo difiere, manda este documento.

## Arquitectura acordada

- **D1 relacional desde el inicio.** No hay etapa de documentos JSON ni importación de Redis/Blob. Las migraciones SQL ordenadas viven en `backend/db/migrations/`.
- **Un paquete de backend** (`backend/`) con `identity`, `stores`, `catalog`, `sales`, `promotions` y `settings`, separados en dominio, aplicación y adaptadores. Las reglas puras se exportan por `@tiendly/backend/rules`.
- **API separada.** `backend/src/runtime/api.ts` es la entrada autónoma del Worker. Solo el backend recibe D1/R2 y los secretos de Google/Better Auth. `packages/contracts` contiene los tipos públicos.
- **Frontend por HTTP.** Next consume la API con `frontend/src/lib/api-client.ts` cuando existe `TIENDLY_API_URL`; sin esa variable se conserva el runtime anterior durante la migración. En QA se usa un service binding `API` porque Cloudflare rechaza el fetch público entre Workers de la misma zona.
- **Imágenes en R2** (`UPLOADS`), servidas desde `/images/<store-id>/<uuid>.<ext>`.
- **Ingreso con Google** mediante Better Auth y D1. La autorización depende de la titularidad de la tienda, nunca de la cookie de slug.

## Estado de la migración

| Bloque | Estado |
|---|---|
| Identidad y sesiones (Better Auth, D1, Google) | Implementado y aceptado en local; falta repetir el ingreso en QA. |
| Tiendas y capacidades (Free, Pro, fundadora) | Implementado. |
| Catálogo, opciones, variantes y ofertas | Implementado con D1 y versiones esperadas. |
| Imágenes y lectura pública por slug | Implementado con R2. |
| API separada y contratos | Primer corte integrado en `dev` (#57). |
| Ventas/pedidos, stock y reservas | Pendiente. |
| Checkout y comprobantes | Pendiente. |
| Cupones | Pendiente. |
| Configuración y Mi tienda editables | Pendiente. |
| Tareas programadas y métricas | Pendiente. |

## Orden de trabajo

1. **Ventas/pedidos y stock/reservas** con asignaciones por variante y versiones esperadas.
2. **Checkout** con reserva de número idempotente y token de acceso al comprobante.
3. **Cupones** con límites de plan.
4. **Configuración/Mi tienda** con guardado transaccional.
5. **Tareas** (reservas vencidas, fin de fundadora) en un Worker aparte con cron.
6. **Aceptación del core loop desplegado** y corte de producción con aprobación de Gabi.

Antes de implementar checkout, comprobar en una D1 remota desechable la atomicidad y los conflictos de stock, cupones y versión. Se conservan los visuales, los envíos y las simulaciones actuales; el rediseño de envíos y los banners quedan fuera. La fecha de corte se fija después de la aceptación y producción requiere aprobación específica.

## Reglas que no se negocian

- Nada se mergea sin el ok de Gabi.
- No se tocan datos, DNS ni recursos de producción sin su ok.
- No se importan datos de Redis/Blob; las tiendas nuevas viven en D1 y las operaciones antiguas no se escriben en dos lugares.
- `TIENDLY_ENTORNO` falla cerrado: si falta o es desconocido, la app se comporta como producción.
- Los pagos, SUNAT, bancos, envíos y comunicaciones siguen simulados.

## Referencias

- Alcance de la API separada: [`docs/backend/separacion-api.md`](backend/separacion-api.md).
- Criterios heredados del backend anterior: [`docs/backend/requisitos-conservados.md`](backend/requisitos-conservados.md).
- Cierre del traspaso de `la-bodega`: [`docs/backend/traspaso-la-bodega.md`](backend/traspaso-la-bodega.md).
- Entornos y publicación: [`docs/configuracion/entornos.md`](configuracion/entornos.md).
- Implementación, comandos y pruebas: [`backend/README.md`](../backend/README.md).
