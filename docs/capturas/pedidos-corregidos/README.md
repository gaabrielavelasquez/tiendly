# Pedidos · correcciones de revisión de #31

Fuente: https://tiendly-2xu5w1h1h-gaabrielavelasquez-8525s-projects.vercel.app/panel/pedidos

Código `b5a3143`, 24-oct-2026. Preview Vercel READY, build habitual Turbopack y check:tokens aprobados. Demo Heather aislada para este despliegue, sin variables de proyecto ni producción. Fotos de Heather excluidas; el icono neutro es el resultado esperado.

Capturas de la respuesta real de Vercel mediante `vercel curl` autenticado y un proxy de solo lectura que conserva HTML/JS/CSS sin cambios. No se modifican datos para generar las imágenes.

| Evidencia | 390 px | 1440 px |
|---|---|---|
| Lista | [Completa](lista-390.jpg) | [Completa](lista-1440.jpg) |
| Detalle pagado | [Viewport 390×844](detalle-viewport-390.jpg) | [Completa](detalle-1440.jpg) |
| Reserva y plazo único | [Viewport 390×844](reserva-viewport-390.jpg) | [Completa](reserva-1440.jpg) |
| Paso actual del historial | [Viewport 390×844](historial-viewport-390.jpg) | [Detalle](detalle-1440.jpg) |
| Cancelar con confirmación | [Diálogo](confirmar-cancelacion-390.jpg) | [Diálogo](confirmar-cancelacion-1440.jpg) |
| Contra entrega | [Completa](contra-entrega-390.jpg) | [Completa](contra-entrega-1440.jpg) |
| Recojo | [Completa](recojo-390.jpg) | [Completa](recojo-1440.jpg) |
| Cancelado | [Completa](cancelado-390.jpg) | [Completa](cancelado-1440.jpg) |

## Contenido y barras a 390×844

- [Final de Notas y acciones fijas](reserva-final-viewport-390.jpg): Notas termina en y≈676 y la barra empieza en y=779. Quedan ≈103 px libres. Barra dentro del viewport, hasta y=844.
- [Última fila y tab bar](lista-final-viewport-390.jpg): la última fila termina en y≈740 y la tab bar empieza en y=787. Quedan ≈47 px libres. Incluye el importe cancelado atenuado y tachado.
- El detalle no monta tab bar. Contra entrega puede aumentar la altura de las acciones; también queda libre la última sección.
- Las capturas `*-viewport-390.jpg` son de viewport real, sin ampliar su alto. En capturas de página completa, el navegador ubica la barra fija en la posición del viewport original; para comprobar superposiciones se usan las de viewport.

[Mediciones completas Chrome/WebKit](mediciones-viewport.json), también a 360×844. Ambos motores pasan sin scroll horizontal a 360/390 y a 1440×1000. Se verifica la geometría tras llegar al final; no solo el tamaño total del documento.

## Verificación funcional

Lista, reserva, pagado, contra entrega, recojo, cancelado, vacío, error y pedido inexistente. Orden móvil de las seis secciones; soles enteros; cancelados tachados y atenuados; paso actual único con punto lleno, hechos con check y futuros atenuados; vencimiento único en Pago; fotos sin imagen rota; diálogo y Conservar pedido sin mutación.

En local aislado sin Redis: Escape no cancela, confirmar cancela sin Deshacer y el estado cancelado no admite reactivación. Deshacer del pago sigue funcionando. Comprobaciones puras de reserva de 24 h, excepción contra entrega y formatos hoy/mañana, la/las en Lima. Build local y check:tokens aprobados; sin tokens ni dependencias nuevas.

Los cuatro estados se conservan; el skeleton del detalle sigue el orden móvil nuevo. [Comparación original y estados de carga/vacío/error](../pedidos-0031/README.md). Las capturas de esa carpeta documentan el pase inicial; las de esta carpeta reemplazan su resultado visual para las ocho correcciones actuales.

Sin merge ni mensajes, cobros o datos de producción. Pendiente de revisión de Gabi.
