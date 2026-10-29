# Backend de Tiendly

Aquí vive lo que corre del lado del servidor fuera de la app Next.js: la base de datos, las tareas programadas y los scripts. Todavía no hay código: el plan completo está en [`docs/plan-backend.md`](../docs/plan-backend.md).

| Carpeta | Qué va | Cuándo llega |
|---|---|---|
| `db/migraciones/` | Archivos SQL numerados que crean y cambian las tablas de D1 (la base de datos de Cloudflare). Se aplican una sola vez y en orden. | PR 3 (Etapa 1) |
| `workers/tareas/` | El Worker `tiendly-tareas`: un programa de Cloudflare que corre cada 15 minutos y cierra las reservas vencidas y el fin de la beta. | PR 7 |
| `scripts/` | Scripts de una sola vez, como la mudanza desde Redis y Blob o el respaldo semanal. | PR 6 |

Las consultas a la base de datos que usa la app viven en `frontend/src/lib/datos/`, porque corren dentro de la app (ver §3.1.1 del plan).
