# 0039 · Pedidos adopta las reglas de 0031

- **Fecha:** 24-oct-2026.
- **Estado:** implementación solicitada por Gabi; propuesta visual pendiente de su revisión en PR. Sin autorización de merge.
- **Aplica:** 0031 en lista y detalle de Pedidos. Conserva 0010, 0028, 0029 y 0032.

## Alcance

- Lista: filtros y búsqueda fuera del contenedor; un contenedor con divisores por lista (cada grupo por día sigue siendo plegable en móvil), título de grupo fuera, filas completas como enlace y atajo independiente de WhatsApp. Exportación permanece solo en desktop.
- Detalle: encabezados externos con `Seccion`, separación de 40/48 px, iconos neutros sin círculos, progreso en carbón/gris, reserva como texto de advertencia y montos tabulares de peso normal. Solo el total del detalle usa SemiBold; moneda y decimales quedan atenuados.
- El pago existente se presenta en su propia sección, con método, estado y plazo. Las acciones manuales siguen en la cabecera desktop y en la barra fija móvil, respetando la zona segura.
- Carga, vacío y error adoptan la misma estructura. El pedido inexistente conserva la salida a la lista. Si una foto no carga, se muestra el icono neutro existente en su espacio.

## Lo que se conserva

Sin etapas, filtros ni funciones nuevas. No se cambia la lógica de confirmación manual, entrega/recojo, cancelación, deshacer, reserva de 24 h, auto-cancelación o stock. WhatsApp sigue siendo un enlace `wa.me` con aviso prellenado: nada se envía automáticamente. Las notas siguen siendo locales al navegador.

## Verificación y límites

- Los escenarios de carga (`?escenario=carga`) y error del detalle (`?escenario=error`) amplían la herramienta de prueba ya existente; se ignoran en producción.
- Previews aislados con la demo Heather, sin publicar sus fotos excluidas por `.vercelignore`. Los contactos de los fixtures pasan a números ficticios `900000…` y correos `example.com`. Los datos de tiendas reales no cambian.
- Sin nuevos tokens, dependencias ni cambios en producción. La evidencia y los pasos de revisión están en el PR y en `docs/traspaso.md`.
