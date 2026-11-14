# Backend HTTP separado · primer corte

## Alcance aprobado por Diego

Un repo y dos aplicaciones publicables por separado. Gabi mantiene componentes, pantallas, copy y visuales conforme a DESIGN.md; Diego mantiene reglas, autorización, persistencia, API e infraestructura. Este primer corte conecta identidad, tiendas, catálogo, imágenes y lectura de vitrina. No completa ventas, reservas, checkout, promociones, ajustes editables, tareas ni instrumentación de métricas.

`backend/src/runtime/api.ts` es la entrada autónoma del Worker. Solo el backend recibe D1/R2 y los secretos Google/Better Auth. `packages/contracts` contiene tipos públicos sin dependencias de runtime. Next consume HTTP con `frontend/src/lib/api-client.ts`; los Server Actions adaptan formularios y mensajes, sin acceso directo a D1 en el camino API. Las ofertas en lote se calculan y validan en el backend.

La conexión es explícita mediante `TIENDLY_API_URL`, una variable privada del servidor Next con un origen exacto y sin barra final. Al configurarla, una caída de API da error; no se guardan cambios en memoria ni en Redis como fallback. Sin ella se conserva el runtime anterior durante la migración. Todavía hay imports y módulos anteriores en frontend: este corte no acredita la separación completa ni retira vinext.

## Desarrollo local

Desde `frontend/`, en dos terminales del mismo worktree:

```sh
npm --prefix ../backend run dev:api
npm run dev:api
```

La API usa 127.0.0.1:3221 y Next localhost:3220. El primer comando comprueba su puerto, crea un secreto privado exclusivo en `backend/.dev.vars`, aplica las tres migraciones existentes solo al emulador propio y arranca Wrangler local. D1/R2 viven en `backend/.wrangler/state/`; no se usan recursos remotos. Los puertos 3100 y 3215 existentes no se modifican.

El frontend no necesita credenciales de Cloudflare ni de base de datos. Para apuntarlo a una API QA estable, definir `TIENDLY_API_URL` en su entorno del servidor. El origen público configurado en Better Auth debe coincidir exactamente con el frontend elegido; cambiar esa variable frontend no autoriza un origen nuevo. Para trabajar visualmente sin API se conserva `npm run dev` con las demos y escenarios existentes. Una galería completa de fixtures sin servidor es trabajo posterior.

Para Google local, configurar únicamente la pareja del cliente Tiendly Preview en `backend/.dev.vars`, conservando el secreto local generado. Autorizar `http://localhost:3220/api/auth/callback/google` además de los callbacks existentes. Ningún ingreso simulado se habilita en el Worker. Los tests crean sesiones sintéticas únicamente mediante harness externo o testUtils en tests; no hay endpoint público de acceso de prueba.

## Contrato y responsabilidades

| Ruta | Responsabilidad |
|---|---|
| `/api/auth/*` | Better Auth, Google, sesión y revocación. |
| `/api/business/stores` | Tienda propia, creación y cambio de nombre versionado. |
| `/api/business/snapshot` | Identidad/configuración/catálogo privado de la tienda propia, o null si no tiene tienda. |
| `/api/business/catalog` | Listar, crear y editar con versión esperada. |
| `/api/business/catalog/commands` | Duplicar pausado/sin stock; estados; ofertas; quitar oferta y deshacer, atómicos y versionados. |
| `/api/business/images` | Subir JPEG/PNG/WebP con sesión, titularidad, origen, firma y límite de 5 MB. |
| `/api/public/stores/:slug` | Identidad pública y productos activos. Sin SKU privado, consentimiento ni fechas de fundadora. |
| `/images/:store/:file` | Leer una imagen pública sin depender de la configuración OAuth. |
| `/health` | Comprobación de lectura del esquema de tiendas; no acredita Google, R2 ni el core loop completo. |

Importes del contrato en céntimos enteros. Errores estables: 400 invalid, 401 unauthorized, 403 forbidden, 404 not_found, 409 conflict y 503 unavailable. Privado y auth con no-store. Requests browser mantienen `/api/*` del frontend y se reenvían sin seguir redirects. Se conservan todas las cabeceras Set-Cookie; se retiran longitud/codificación del cuerpo ya descomprimido por fetch. SSR remite la cookie de esa solicitud; no hay caché compartida de sesiones. El backend verifica sesión, pertenencia y origen por sí mismo.

## Publicación independiente y revisión

`npm --prefix ../backend run build:api` compila sin desplegar y sin compilar Next. CI ejecuta esa comprobación además de tipos/tests. `wrangler.preview.jsonc` prepara solo el Worker nuevo `api-preview`, con D1/R2 de QA existentes y el origen frontend estable actual. No crea ni migra recursos, ni modifica el Worker frontend.

Una vez aceptada la configuración QA y cargados sus secretos por el responsable:

```sh
npm --prefix ../backend run deploy:api:qa
```

El script exige commit limpio, cuenta/Worker/bindings exactos de QA, verifica tipos/tests/build y publica solo la API. El frontend debe activarse y publicarse por separado con `TIENDLY_API_URL=https://api-preview.tiendly.workers.dev`. No activar el modo API en producción: faltan los módulos de comercio. Las credenciales Google y la clave de sesión permanecen en el backend; para conservar sesiones existentes al cambiar de runtime hay que preparar la continuidad de esa clave antes del cambio. El comando no mueve secretos del Worker anterior.

Un cambio de UI compatible solo despliega frontend. Un cambio compatible de backend solo despliega API. Cambios de contrato requieren compatibilidad hacia atrás: desplegar primero soporte backend y después consumidores; retirar campos solo tras migrarlos. Las migraciones remotas son un paso específico, separado del despliegue. Un rollback de código no revierte datos ni esquema.

No se despliega automáticamente por abrir PR o hacer merge. Mantener ramas por módulo hacia dev y aprobación de Gabi para merges. Las protecciones de ramas y la aplicación obligatoria de revisión por propietario siguen siendo configuración administrativa pendiente.

## Siguientes cortes

1. Aceptación real de Google tras autorizar el callback local y del par de servicios en QA.
2. Publicación frontend independiente y previews autenticados: mantener un origen QA fijo al principio; los dominios efímeros requieren diseño explícito de OAuth/cookies.
3. Completar ventas/reservas/pedidos/checkout/cupones/ajustes/tareas en la API y retirar el acceso interno anterior por módulo.
4. Retirar el runtime/backend anterior del frontend cuando todos los consumidores estén migrados.
5. Definir eventos y métricas con Gabi; backend emite los hechos de negocio confirmados y un dashboard permite consultarlos sin SQL ni cambios de código.
