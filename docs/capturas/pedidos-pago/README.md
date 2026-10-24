# Pedidos · corrección permanente del pago

Preview real Vercel, código `a4a305c`: https://tiendly-idl65syg4-gaabrielavelasquez-8525s-projects.vercel.app/panel/pedidos

Heather aislado solo para ese despliegue. Build habitual Turbopack y tokens aprobados. Capturas de viewport a 390×844 y 1440×1000, con acceso oficial de Vercel, sin alterar HTML/JS/CSS.

| Vista | 390 | 1440 |
|---|---|---|
| Corregir pago | [Hoja](corregir-pago-390.jpg) | [Modal](corregir-pago-1440.jpg) |
| Advertencia si fue enviado | [Hoja](advertencia-enviado-390.jpg) | [Modal](advertencia-enviado-1440.jpg) |
| Reserva original vencida | [Hoja](reserva-vencida-390.jpg) | [Modal](reserva-vencida-1440.jpg) |
| Cancelación con foco seguro | [Conservar pedido](cancelar-foco-seguro-390.jpg) | [Conservar pedido](cancelar-foco-seguro-1440.jpg) |
| Registro de corrección | [Historial](historial-correccion-390.jpg) | [Historial](historial-correccion-1440.jpg) |

Chrome y WebKit a 360×844, 390×844 y 1440×1000: foco inicial en Conservar pedido/pago, Escape y Conservar sin cambios, hojas de corrección, advertencia de envío/entrega y reserva original vencida, sin scroll horizontal. El registro del historial se capturó tras confirmar sobre el fixture ficticio TL-1044: no es un pedido persistido de la tienda; la acción de servidor ignora estos fixtures. La petición POST se limitó a ese pedido ficticio del preview. Sin producción ni mensajes.

Validación local sin Redis: pedido ficticio creado mediante el contrato del checkout, corregido en la interfaz y recargado. Persisten pago pendiente y registro; volver a pagar conserva el registro. Límite exacto de 24 h, contra entrega, envío sin retroceso y pago posterior a entrega comprobados con funciones puras.

Aviso de Deshacer: reloj controlado en Chrome y WebKit confirma que sigue visible a los 7 segundos, permanece con 10 segundos de hover y 10 de foco, y expira al completar aproximadamente 8 segundos efectivos. Hover y foco se controlan por separado. Deshacer del pago se conserva.

[Comparación original y cuatro estados](../pedidos-0031/README.md). [Ocho correcciones previas y geometría de barras a 390×844](../pedidos-corregidos/README.md). Estas capturas agregan la revisión final del pago y foco. #31 autorizado para merge solo con preview verde; #27 queda abierto para revisión.
