# Backend de Tiendly

El plan vigente está en [`docs/plan-backend.md`](../docs/plan-backend.md). La migración usará un paquete de backend organizado por dominio y SQL preparado sobre D1. Las migraciones ordenadas irán en `db/migrations/`; R2 guardará las imágenes y un Worker independiente ejecutará las tareas programadas.

La aplicación existente todavía usa Redis/Blob o memoria: la migración no está terminada. La prueba remota de atomicidad de D1 debe pasar antes de implementar checkout.
