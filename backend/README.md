# Backend de Tiendly

El plan vigente está en [`docs/plan-backend.md`](../docs/plan-backend.md). La migración usará un paquete de backend organizado por dominio y SQL preparado sobre D1. Las migraciones ordenadas irán en `db/migrations/`; R2 guardará las imágenes y un Worker independiente ejecutará las tareas programadas.

La aplicación existente todavía usa Redis/Blob o memoria: la migración no está terminada. La prueba remota desechable de atomicidad D1 pasó; no sustituye las pruebas del checkout sobre el esquema final.

## Traspaso del backend anterior

El [cierre de la-bodega](../docs/backend/traspaso-la-bodega.md) documenta el reemplazo de cada módulo, el avance en ramas todavía fuera de `main`, el respaldo y la baja remota pendiente. Los [criterios conservados](../docs/backend/requisitos-conservados.md) permiten seguir el trabajo sin consultar el clon anterior. Este cierre documental no incorpora la implementación ni acredita el core loop migrado.
