# Criterios conservados del backend anterior

Fecha: 8-nov-2026. Este resumen rescata requisitos útiles de `la-bodega` sin requerir su clon. Es un mapa de aceptación y pendientes, no una ampliación del alcance de producto ni una afirmación de implementación.

La procedencia y disposición de todas las fuentes están en [el cierre del traspaso](traspaso-la-bodega.md). Ante diferencias, rigen CLAUDE.md, DESIGN.md, las decisiones de Tiendly y la dirección actual del plan de backend. Las rutas de código que siguen se refieren al avance `c00ae43` y su integración en curso, todavía fuera de `main`.

## Criterios técnicos y evidencia necesaria

| Criterio conservado y adaptado | Evidencia actual / aceptación pendiente |
|---|---|
| **Aislamiento por tienda.** Resolver permiso desde sesión y titularidad en el panel. Consultas, escrituras, objetos y futuras tareas deben mantener el ID de tienda; un ID del navegador no concede autoridad. | Pruebas D1 de identidad/tiendas/catálogo rechazan recursos ajenos. Extenderlas a pedidos, cupones, configuración, tareas y comprobantes cuando existan. La vitrina conserva resolución pública por slug. |
| **Sesiones verificadas.** Revocar al salir, rechazar sesiones inválidas y mutaciones desde orígenes no permitidos; un fallo de configuración no permite el acceso simulado. | Better Auth/D1 y pruebas de sesión, origen, revocación y cookie de slug implementadas. Google real y aceptación del onboarding pendientes. No construir otro sistema JWT. |
| **Dinero exacto y snapshots.** Céntimos enteros en persistencia; total recalculado en servidor. Cada línea de pedido conserva producto, variante, precio y foto de la compra aunque cambie el catálogo. | Mapeo de céntimos probado en catálogo. Falta `sales`: verificar snapshot, oferta/fecha de Lima, entrega, descuento y total sin confiar en el navegador. |
| **Stock y pedido atómicos.** Ningún camino vende más disponibilidad ni aplica dos veces una asignación. Seguir reservas de Tiendly; una edición manual de stock debe considerar asignaciones. | Prueba remota desechable de plataforma pasa concurrencia/rollback. Falta repetir contra esquema y comandos finales: última unidad, reserva vencida, contra entrega, pago y cancelación. |
| **Guardados concurrentes.** La versión esperada protege el agregado y sus filas hijas; un conflicto no borra cambios ajenos ni deja una operación a medias. | Casos locales/remotos de tiendas/catálogo. Falta propagar y actualizar versiones desde todos los formularios y acciones en lote. |
| **Reintentos idempotentes.** Un intento de compra repetido devuelve su mismo resultado/número; no duplica pedido, reserva, redención ni historial. | Previsto en la actualización del plan; no implementado por un test genérico de D1. Verificar timeout después del commit y reenvío del mismo intento. |
| **Acciones de pedido explícitas.** Pagar, enviar o cancelar cambian solo lo autorizado y dejan historia. No aceptar del cliente un pedido entero con sus totales como fuente de verdad. | `sincronizarPedido` todavía pertenece al camino anterior. Sustituirlo al implementar ventas; probar transiciones inválidas y cancelación irreversible. |
| **Capacidades separadas de flags.** Un flag operativo no concede una capacidad que el plan no permite; el vencimiento de fundadora y un downgrade no borran historia. | Free/Pro/fundadora y fecha de Lima probados parcialmente. Faltan aplicación integral de límites y tarea de vencimiento. Unleash y precios/plan Esencial no se heredan. |
| **Archivos por tienda.** Validar tamaño, MIME y firma; almacenar con namespace de tienda. Imágenes del catálogo pueden ser públicas; un comprobante con datos personales requiere autorización propia. | R2 de imágenes probado localmente. Falta aceptación remota y acceso al comprobante mediante token según el plan. Los vouchers del origen no crean un módulo nuevo. |
| **Efectos externos después de confirmar datos.** Si en el futuro se activan emails o pagos reales, conservar entrega recuperable, deduplicación y reintentos sin repetir el cambio de negocio. | No hay relay/cola/outbox funcional en la migración. Decidir mecanismo Cloudflare al incorporar esos efectos; mantener todo simulado en este alcance. |
| **Webhooks futuros seguros.** Validar autenticidad y tienda, deduplicar por proveedor/evento, conservar recepción recuperable y no confirmar dos veces. | Criterio para una integración posterior, sin proveedor ni webhook real habilitados. El OpenAPI histórico no acredita su existencia. |
| **Trazabilidad sin secretos.** Correlacionar operaciones por entorno, solicitud, tienda, actor/recurso y resultado; las acciones sensibles necesitan auditoría persistida. Evitar tokens y datos personales en logs. | Falta verificar/instrumentar cobertura en todos los módulos. Stack de métricas/logs, retención, umbrales y responsables siguen sin cerrar. No copiar una tabla de auditoría y declararlo resuelto. |
| **Operación recuperable.** Entornos separados, respaldo verificable y restauración ensayada. Antes de revertir una app, comprobar compatibilidad del esquema; no repetir jobs ni editar datos sin contexto y registro. | Faltan procedimiento final de despliegue/rollback y prueba de recuperación de datos de la app. El bundle del código anterior no es un respaldo de Postgres, MinIO ni D1. Datos de producción y restauraciones siguen sujetos al permiso de Gabi. |
| **Pruebas sobre el runtime real.** Reglas puras, persistencia/migraciones, reinicio, aislamiento, carreras/rollback y flujos de usuario. | Miniflare y pruebas D1 remotas parciales disponibles en las ramas nuevas. Falta aceptación completa en preview, Chrome/WebKit, cuatro estados y tamaños/datos exigidos por el workflow de Tiendly. |

No se define aquí un porcentaje de cobertura ni se obliga a replicar cada test del origen. Cada implementación verifica sus invariantes y riesgos con las herramientas vigentes del repo.

## Disposición de requisitos funcionales históricos

Los identificadores pertenecen a `01-producto/requerimientos.md` del origen. «Conservar» significa preservar la responsabilidad en Tiendly, con sus propias reglas; no certificar una funcionalidad terminada.

| RF de origen | Disposición |
|---|---|
| RF-01: tienda propia. | Conservar identidad/link; usar slug actual. Wildcard y dominio propio no se exigen para cerrar la migración. |
| RF-02: onboarding simple. | Conservar objetivo; flujo y copy actuales, sin introducir como compromiso nuevo el umbral de diez minutos. |
| RF-03–04: temas y personalización. | Conservar mediante DESIGN.md: Neutral, Editorial y Suave; no importar Minimalista/Vibrante ni tokens antiguos. |
| RF-05, RF-15: catálogo e inventario. | Conservar y adaptar a variantes/opciones/stock actuales. Precio/SKU por variante siguen en el backlog propio. |
| RF-06, RF-09, RF-12: transferencia, vouchers y alertas. | Antecedentes fuera del alcance actual. No añadir subida/revisión de vouchers ni notificaciones reales por copia documental. |
| RF-07, RF-18: emails automáticos/con marca. | Antecedentes para evaluar cuando haya comunicaciones reales; sin compromiso ni proveedor heredados. |
| RF-08: Mis Compras. | No portar lookup email+número. Conservar protección del acceso al comprobante según el plan nuevo. Una vista adicional requiere definición propia. |
| RF-10–11, RF-13: estados y gestión de pedidos. | Conservar panel y pago manual con estados de pago/entrega de Tiendly; no adoptar estados de voucher. |
| RF-14: descuento de stock al confirmar. | Reemplazar por reservas/asignaciones actuales y transición atómica; no eliminar la reserva al crear. |
| RF-16–17: Yape/Mercado Pago real. | Mantener simulación actual. Proveedor, comisiones y habilitación se decidirán antes de integrar pagos reales. |
| RF-19–22: dominio propio, analytics, CSV y quitar marca. | Antecedentes; solo vale el alcance Pro y backlog propios de Tiendly. No heredar precios ni declarar construido lo que figure en el origen. |
| RF-23–24: Culqi y PagoEfectivo. | Roadmap histórico sin compromiso de integración. |

## Disposición de requisitos no funcionales históricos

| RNF de origen | Disposición |
|---|---|
| RNF-01, RNF-06: mobile-first y onboarding. | Conservar experiencia y workflow de Tiendly; sin imponer tres pasos históricos. |
| RNF-02: wildcard. | Sustituir por rutas por slug actuales; subdominios requieren definición propia. |
| RNF-03, RNF-07–08: stack y servicios separados. | Sustituir Postgres/Docker/topología por implementación Cloudflare; no mantener infraestructura antigua para cumplir estos requisitos. |
| RNF-04: PEN. | Conservar soles, céntimos y formato vigente. |
| RNF-05: comisiones de Mercado Pago. | Antecedente fuera del alcance simulado; no fijar condiciones comerciales del proveedor. |
| RNF-09: object storage. | Conservar responsabilidad de archivos y aislamiento mediante R2; vouchers siguen fuera de alcance. |
| RNF-10: asincronía. | Conservar separación de efectos externos cuando existan. Cron y reintentos de Tiendly pendientes; no heredar pg-boss. |
| RNF-11: flags. | Conservar separación entre capacidades y controles operativos, sin proveedor obligatorio. |
| RNF-12: observabilidad y auditoría. | Conservar como pendientes explícitos según criterios anteriores. |
| RNF-13: idempotencia. | Conservar para checkout y futuras integraciones; exigir evidencia sobre comandos finales. |
