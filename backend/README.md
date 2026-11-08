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

La rama de integración conecta el botón Google, la creación de tienda, los formularios de catálogo y las lecturas D1. Esa conexión todavía requiere aceptación completa de navegador. Ventas, cupones y configuración editable siguen usando módulos anteriores; no pueden considerarse migrados. El panel antiguo queda restringido por sesión/titularidad, salvo pruebas explícitas. No hay importación Redis/Blob ni compatibilidad de escritura de una tienda nueva D1 con esos documentos. Completar el mapeo de DTOs y las consultas de catálogo antes de conectar la creación desde el formulario.

Catálogo y R2 tienen comandos implementados y la integración está en curso. Siguen checkout, comandos de pedidos, promociones, configuración y tareas. El plan vigente está en [`docs/plan-backend.md`](../docs/plan-backend.md).

## Catálogo y R2 · siguiente rama `feat/catalog`

`catalog` ya tiene reglas puras, comandos y un adaptador relacional D1. La migración `0003_catalog.sql` guarda productos, opciones, variantes y galerías por tienda. Las variantes retiradas conservan su fila; no se borran las claves que podrían referenciar asignaciones de ventas. Una versión esperada protege el agregado completo, incluidos los cambios de sus tablas hijas. Se conservan los IDs, las claves `valor|valor`, el cálculo del slug, el orden de opciones/galerías, los grupos vacíos y los tres modos de tabla de medidas.

`GET/POST/PUT /api/business/catalog` permite listar, crear y actualizar el catálogo propio. El cuerpo de escritura lleva `product` con los nombres ingleses del dominio; PUT agrega `id` y `version`. La tienda y el ID nuevo se asignan en el servidor, no desde el cuerpo. `frontend/src/lib/catalog-mapping.ts` traduce los tipos existentes y los céntimos en ese borde.

`POST /api/business/images` acepta bytes JPEG, PNG o WebP, hasta 5 MB, con sesión, titularidad y origen permitido. El servidor verifica cabeceras mágicas y MIME; conserva el achicado de imágenes existente del cliente. El binding R2 es `UPLOADS`. Devuelve `/images/<store-id>/<uuid>.<ext>`, servido sin dependencia de OAuth y con MIME, `nosniff` y caché inmutable. No hay servicio pago de transformaciones. El bucket del preview aún no fue creado ni desplegado: la prueba R2 realizada es local.

Doce tests locales verifican identidad/tiendas/catálogo/R2, ediciones en lote y sesiones reales; la prueba remota de catálogo está en `probes/catalog/` y `docs/verificacion/cloudflare/catalog-remote.json`. La integración de páginas/formularios y lecturas panel/vitrina está en esta rama; falta aceptarla con OAuth real y almacenamiento remoto. Las demos se conservan como semillas de ejemplo. Ventas/promociones/configuración/tareas siguen pendientes. La escritura de stock deberá validarse contra asignaciones cuando llegue ventas; no desplegar el core loop antes de esa integración.
