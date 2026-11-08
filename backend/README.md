# Backend de Tiendly

Un paquete por ahora, con módulos de negocio y dependencias construidas explícitamente en el runtime. Las reglas puras se exportan por `@tiendly/backend/rules`; los adaptadores y comandos, por `/server`; Better Auth, por `/auth`. Ninguna regla de dominio depende de Next.js, cookies o bindings.

## Implementado

- `identity`: sesión de Better Auth con Google y D1 nativo, actor, autorización y entorno restrictivo por defecto. El ingreso de prueba solo se permite con `TIENDLY_ENTORNO=local|preview` y `TIENDLY_TEST_LOGIN=true`. El plugin privilegiado `testUtils` existe únicamente en los tests.
- `stores`: crear una tienda por titular, obtener su tienda y cambiar su nombre con versión esperada. Tienda, membresía y configuración inicial se guardan en un solo lote. No se activa una pasarela ni se inventan tarifas. Las restricciones de D1 resuelven carreras de titularidad, slug y versión.
- Capacidades: Free, Pro y Tienda fundadora; vencimiento por fecha calendario de Lima y rechazo de capacidades/planes desconocidos. La inscripción y tarea programada de fin de fundadora siguen pendientes.
- HTTP: `/api/auth/*` monta Better Auth; `/api/business/stores` admite GET (tienda propia), POST (crear) y PATCH (`id`, `version`, `name`). Los comandos exigen sesión real; las mutaciones también origen permitido. Las respuestas privadas no se cachean.

Las migraciones ordenadas están en `db/migrations/`. `0001_auth.sql` sale del dialecto D1 de Better Auth 1.7.18; `0002_stores.sql` define tablas relacionales de tiendas, membresías y configuración inicial. Solo se aplicaron en la base desechable de pruebas, nunca en producción.

## Verificación

Desde la raíz: `npm run test --workspace=@tiendly/backend` y `npm run typecheck`. Los tests usan D1 local real de Miniflare, sesiones de Better Auth y persistencia tras reinicio. La prueba remota de comandos está en `probes/stores/` y su evidencia en `docs/verificacion/cloudflare/stores-remote.json`. La de atomicidad de plataforma está en `probes/d1/`.

## Runtime y pendientes

El Worker de la app declara D1 y cuatro valores privados: `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`. Para desarrollo, ver `frontend/.dev.vars.example`; no subir `.dev.vars`. La URL base es un origen exacto y su callback es `/api/auth/callback/google`. Deben aplicarse las migraciones en la base propia del entorno antes de usar la app; no usar la base del probe para desplegar la aplicación.

En Next/Vercel los nuevos endpoints responden 503 porque todavía no hay un adaptador de bindings para ese runtime. En Cloudflare también responden 503 mientras falte configuración. Ningún error concede acceso por cookie de slug. El cierre de sesión revoca la sesión persistida y elimina sus cookies.

El onboarding visual aún no llama al nuevo API ni inicia OAuth. Catálogo, ventas, cupones y configuración editable todavía usan los módulos anteriores; no pueden considerarse migrados. El panel antiguo queda restringido por sesión/titularidad, salvo pruebas explícitas. No hay importación Redis/Blob ni compatibilidad de escritura de una tienda nueva D1 con esos documentos. Completar el mapeo de DTOs y las consultas de catálogo antes de conectar la creación desde el formulario.

El siguiente módulo es `catalog`: variantes/opciones/ofertas/galerías/medidas, SQL por tenant y almacenamiento R2. Luego siguen checkout, comandos de pedidos, promociones, configuración y tareas. El plan vigente está en [`docs/plan-backend.md`](../docs/plan-backend.md).
