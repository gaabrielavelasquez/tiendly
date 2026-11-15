# Features

Una carpeta por módulo aprobado en Figma. Cada una tiene `components/` (UI de menos de 150 líneas), `hooks/` (lógica de negocio) y `types.ts`.

| Carpeta | Módulo en Figma | Decisión |
|---|---|---|
| `checkout/` | 1 · Checkout y Carrito | 0007, 0008 |
| `pagos/` y `entregas/` | 2 · Métodos de pago y Entregas | 0007, 0009 |
| `cupones/` | 3 · Cupones | 0008 |
| `afiliacion/` | 4 · Afiliación | 0007 |
| `vitrina/` | 5 · Home y Producto | 0002, 0004, 0006 |
| `pedidos/` | 6 · Pedidos (reserva de 24 h con auto-cancelación) | 0010 |
| `productos/` | 7 · Productos | 0011 |
| `inicio/` | 8 · Inicio | 0012 |
| `mi-tienda/` | 9 · Mi tienda | 0003 |
| `onboarding/` | 10 · Onboarding | 0013 |

Toda vista lleva sus 4 estados: carga (`Skeleton`), vacío (`EmptyState`), con datos y error (CLAUDE.md §5).

## Datos de demo

- **Cada tienda guarda sus datos** (productos, pedidos, cupones, configuración, ajustes) en `src/lib/datos/tienda`. Con el runtime Cloudflare eso es D1. Lo que se guarda en el panel se ve en la vitrina, en el checkout y sobrevive a la recarga.
- **Los escenarios `?escenario=`** (vacío, error, estados de pago/entrega, tienda nueva) existen solo en desarrollo y previews; en producción se ignoran. Los valores válidos están en el `leerEscenario` de cada feature.
- **Sigue simulado:** el código de WhatsApp del onboarding (`0000` falla), los pagos, SUNAT, bancos, envíos y las comunicaciones. No se envían mensajes, cobros ni pedidos reales.
- **En el navegador** viven el carrito (`tiendly:carrito:<slug>`), el pedido de la confirmación (`tiendly:pedidos:<slug>`), las notas del detalle y los borradores de formularios. No son la fuente de verdad de la tienda.
- **Demo:** local usa Heather; en Vercel y QA, MUÑA. `TIENDLY_TIENDA_DEMO` permite fijar otra semilla.
