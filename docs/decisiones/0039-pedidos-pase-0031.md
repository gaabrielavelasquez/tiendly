# 0039 · Pedidos adopta las reglas de 0031

- **Fecha:** 24-oct-2026.
- **Estado:** aprobada por Gabi para integrar #31 tras las correcciones y el preview verde.
- **Aplica:** 0031 en lista y detalle de Pedidos. Conserva 0010, 0028, 0029 y 0032.

## Alcance

- Lista: filtros y búsqueda fuera del contenedor; un contenedor con divisores por lista (cada grupo por día sigue siendo plegable en móvil), título de grupo fuera, filas completas como enlace y atajo independiente de WhatsApp. Exportación permanece solo en desktop.
- Detalle: encabezados externos con `Seccion`, separación de 40/48 px, iconos neutros sin círculos, progreso en carbón/gris, reserva como texto de advertencia y montos tabulares de peso normal. Solo el total del detalle usa SemiBold; moneda atenuada y montos en soles enteros.
- El pago existente se presenta en su propia sección, con método, estado y plazo. Las acciones manuales siguen en la cabecera desktop y en la barra fija móvil, respetando la zona segura.
- Carga, vacío y error adoptan la misma estructura. El pedido inexistente conserva la salida a la lista. Si una foto no carga, se muestra el icono neutro existente en su espacio.

## Lo que se conserva

Sin etapas ni filtros nuevos. Se conserva la confirmación manual, entrega/recojo, reserva de 24 h, auto-cancelación y stock. La revisión del 24-oct hace la cancelación irreversible; las demás acciones conservan Deshacer. WhatsApp sigue siendo un enlace `wa.me` con aviso prellenado: nada se envía automáticamente. Las notas siguen siendo locales al navegador.

## Verificación y límites

- Los escenarios de carga (`?escenario=carga`) y error del detalle (`?escenario=error`) amplían la herramienta de prueba ya existente; se ignoran en producción.
- Previews aislados con la demo Heather, sin publicar sus fotos excluidas por `.vercelignore`. Los contactos de los fixtures pasan a números ficticios `900000…` y correos `example.com`. Los datos de tiendas reales no cambian.
- Sin nuevos tokens, dependencias ni cambios en producción. La evidencia y los pasos de revisión están en el PR y en `docs/traspaso.md`.

## Correcciones pedidas por Gabi · 24-oct-2026

- Soles enteros en toda la lista y el detalle, con el mismo formateador de la tienda. Sin .00; moneda atenuada, cifras tabulares. El importe cancelado aplica atenuado y tachado a moneda y cifra.
- Historial: el paso actual tiene punto lleno en indicator/fill y aria-current=step; los hechos muestran check y los futuros quedan atenuados. El plazo solo se muestra en Pago, con el formato de Inicio y la hora de Lima: "Vence hoy, a la 1:11 p. m." o "Vence mañana, a las …". La lista conserva el texto corto.
- Orden móvil del DOM: cabecera, Productos, Pago, Cliente, Historial, Entrega, Notas. Desktop mantiene dos columnas sin duplicar secciones. Skeleton con el mismo orden.
- Cancelar pedido conserva su texto completo en móvil. Confirma con el diálogo nativo existente; cerrar, Escape o Conservar pedido no cancelan. La cancelación confirmada es irreversible: no ofrece Deshacer y no puede reactivarse en el estado ni en el almacén. Las demás acciones conservan Deshacer. Este punto actualiza el comportamiento anterior de cancelación.
- Fotos: icono neutro desde el SSR; la imagen solo se hace visible tras cargar, así tampoco aparece rota mientras se hidrata. La reserva de espacio se mantiene.
- Mayor espacio inferior en detalle y lista; botones móviles pueden ajustar su alto si el texto ocupa varias líneas. Comprobar a 390×844 el final de Notas y la última fila sobre la barra correspondiente; la tab bar no aparece en el detalle.

## Corrección permanente de pago y accesibilidad · 24-oct-2026

- Aviso de Deshacer durante aproximadamente 8 segundos de lectura efectiva. Hover y foco pausan de forma independiente el tiempo restante; al salir se reanuda. Se conserva Deshacer de la confirmación manual de pago.
- Pago de un pedido pagado ofrece "Marcar como no pagado", también después de que termine el aviso. La hoja enfoca "Conservar pago" y requiere confirmar. No ejecuta reembolsos. Advierte si ya fue enviado, entregado o recogido; la entrega no retrocede.
- La corrección vuelve a pendiente y aplica 0010 con el vencimiento original, sin regalar otras 24 horas. Si ya venció, se cancela en el momento de la corrección y se libera el stock. Contra entrega sigue sin vencimiento. Un pedido entregado que queda pendiente admite registrar su pago después.
- Cada corrección agrega un registro ISO al detalle, guardado con el pedido y visible en Historial como "Pago desmarcado por ti a las …" ("a la" para la 1). Se conserva al volver a pagar y tras recargar. Las acciones registran la hora de ejecución, no la hora de apertura de la página. En enviado con pago pendiente hay un único paso actual: el pago.
- La hoja de cancelación enfoca inicialmente "Conservar pedido", manteniendo Escape, cierre y confirmación irreversible.

Gabi autoriza el merge de #31 con preview verde y verificación de producción. #27 sigue pendiente de revisión, sin merge.
