# Auth y onboarding — evidencia inicial de #33

Los ajustes vigentes de código/datos/logro y halos están en la [ronda siguiente](../auth-ajustes/README.md). Esta galería conserva la evidencia inicial.

Antes: preview Vercel de #32, código `78d905b`, equivalente funcional de main `c0f4682`.
https://tiendly-auginlbq2-gaabrielavelasquez-8525s-projects.vercel.app/registro

Después: preview Vercel de `5d60b6a`.
https://tiendly-ni5lpwjr2-gaabrielavelasquez-8525s-projects.vercel.app/registro

Capturas reales del navegador a 390×844 y 1440×1000, página completa; sin editar las imágenes. Movimiento reducido para capturar el primer ejemplo de forma estable. La rotación de tres tiendas y la navegación manual se conservan.

| Pantalla | Antes 390 | Antes 1440 | Después 390 | Después 1440 |
|---|---|---|---|---|
| Registro | [390](before/registro-390.jpg) | [1440](before/registro-1440.jpg) | [390](after/registro-390.jpg) | [1440](after/registro-1440.jpg) |
| Ingreso | [390](before/ingreso-390.jpg) | [1440](before/ingreso-1440.jpg) | [390](after/ingreso-390.jpg) | [1440](after/ingreso-1440.jpg) |
| Código | [390](before/codigo-390.jpg) | [1440](before/codigo-1440.jpg) | [390](after/codigo-390.jpg) | [1440](after/codigo-1440.jpg) |
| Código incorrecto | [390](before/codigo-error-390.jpg) | [1440](before/codigo-error-1440.jpg) | [390](after/codigo-error-390.jpg) | [1440](after/codigo-error-1440.jpg) |
| Datos de la tienda | [390](before/datos-390.jpg) | [1440](before/datos-1440.jpg) | [390](after/datos-390.jpg) | [1440](after/datos-1440.jpg) |
| Tienda creada | [390](before/creada-390.jpg) | [1440](before/creada-1440.jpg) | [390](after/creada-390.jpg) | [1440](after/creada-1440.jpg) |
| Cerrar sesión | [390](before/salir-390.jpg) | [1440](before/salir-1440.jpg) | [390](after/salir-390.jpg) | [1440](after/salir-1440.jpg) |

Estados adicionales: [código vencido 390](after/codigo-vencido-390.jpg), [1440](after/codigo-vencido-1440.jpg); [Otro 390](after/datos-otro-390.jpg), [1440](after/datos-otro-1440.jpg); [error al revisar link 390](after/datos-error-link-390.jpg), [1440](after/datos-error-link-1440.jpg); [error al crear 390](after/datos-error-crear-390.jpg), [1440](after/datos-error-crear-1440.jpg); [campos decimales 390](after/precios-390.jpg), [1440](after/precios-1440.jpg).

El código vencido no existía antes; no se inventa una captura anterior. Se usa estado de sesión con teléfono ficticio 900000000 y Casa Nube para mostrar datos/creada, sin guardar tiendas en Vercel. La creación real, persistencia de Otro y preview propio se probaron en memoria local. Los errores de red se provocan bloqueando solicitudes; los campos decimales del preview se editan sin guardar. No se escribe ni reinicia Redis.

Compra decimal completa comprobada localmente: producto 90.99, precio antes 119.10, carrito y checkout con céntimos, pedido ficticio más envío 105.99 en Pedidos/Inicio. Reglas puras comprueban decimales, entradas inválidas, cupones y redondeo entero en ofertas en lote.

Chrome y WebKit pasan también el recorrido del preview a 360×844, 390×844 y 1440×1000: ingreso, código incorrecto/vencido, reenvío, datos/Otro, tienda propia, foco seguro, cierre y cookie borrada; sin scroll horizontal. [Resultados](resultado-preview.json).

WhatsApp y el ingreso siguen siendo simulados; Google no tiene backend conectado. Este PR queda sin merge para revisión de Gabi.
