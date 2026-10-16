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

## Datos simulados (hasta tener backend)

- **Onboarding:** cualquier código de 4 dígitos pasa; `0000` muestra el error. Los links `tienda`, `moda`, `zapatos`, `belleza`, `tiendly` y `admin` figuran como ocupados, para probar la sugerencia. El estado se guarda en `sessionStorage`.
