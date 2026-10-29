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
- **Inicio:** `/panel` muestra la tienda con actividad. Se cambia con `?escenario=`: `al-dia` (sin pendientes: "Todo al día"), `nueva` (pasos para arrancar, el estado vacío) y `error`. La carga tarda 600 ms para ver el esqueleto.
- **Productos:** `/panel/productos` muestra el catálogo de Heather (8 modelos de calzado con fotos reales en `public/heather`, tallas 35–40). `?escenario=vacio` muestra el estado vacío y `?escenario=error` el error. El filtro va en `?estado=activos | bajo-stock | agotados | pausados`. Pausar (solo desktop, con Deshacer) y duplicar funcionan en memoria (se pierden al recargar). `?escenario=` solo funciona fuera de producción (decisión 0027).
- **Crear / editar producto:** `/panel/productos/nuevo` y `/panel/productos/[id]` (p1 a p13) usan el mismo formulario. Guardar valida y simula el guardado (no cambia la lista todavía). Las fotos elegidas se ven solo en este navegador.
- **Pedidos:** `/panel/pedidos` con 13 pedidos que coinciden con Inicio (hoy: 3 por enviar y 2 reservas que vencen esta noche). La hora de referencia es la misma de Inicio (15 oct, 6:30 p. m.), así la reserva de 24 h se ve funcionando: #TL-1038 se auto-cancela. Filtros en `?estado=para-atender | por-cobrar | por-enviar`; `?escenario=vacio | error`.
- **Detalle de pedido:** `/panel/pedidos/tl-1035` a `tl-1047`. Los ítems salen del catálogo y subtotal + envío = total de la lista. La acción principal cambia según el estado (pagar, enviar, recoger, entregar) y se puede deshacer; las notas se guardan en este navegador.
- **Vitrina:** `/heather` (tema Editorial, como el Figma) y la página de producto `/heather/[producto]` (p. ej. `/heather/balerinas-chloe`). Solo productos activos; los agotados al final. `?categoria=balerinas | tacos | botas | plataformas`. Agregar al carrito guarda en `localStorage` (`tiendly:carrito:heather`) y enciende el punto del carrito.
- **Checkout:** `/heather/carrito` → `/heather/checkout` → `/heather/pedido/TL-1048`. El carrito vive en `localStorage` (`tiendly:carrito:heather`). El pedido creado entra a Panel › Pedidos (almacén en memoria, `pedidos/lib/almacen.ts`, con la hora de la demo) y la confirmación lo lee de `tiendly:pedidos:heather`. Lo que ve el cliente al comprar sale de la configuración de la tienda (módulos 2 y 3). Pago **simulado**: tarjeta que termina en 0002 → rechazada; en 9995 → sin saldo; vencimiento pasado → vencida; código Yape `000000` → no válido. Cualquier otra tarjeta válida (p. ej. 4111 1111 1111 1111) se aprueba.
- **Configuración (módulo 2):** `/panel/configuracion` → Pagos y Entregas. Se guarda en memoria del servidor (`configuracion/lib/mock.ts`) y el checkout la lee al instante (`checkout/lib/config.ts → reglasCompra`). Escenarios: `?escenario=sin-pasarela | sin-entregas | error`.
- **Cupones (módulo 3):** `/panel/cupones`. Plan Free: hasta 3 en uso (activos y programados). Fecha de la demo: 15 oct 2026, así que `ENVIOGRATIS` está programado (1 nov) y `VERANO20`, vencido. El checkout los valida en el servidor y suma un uso al crear el pedido. Escenarios: `?escenario=vacio | limite | error`.
