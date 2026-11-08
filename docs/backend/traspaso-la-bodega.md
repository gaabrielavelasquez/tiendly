# Cierre del traspaso de la-bodega

Fecha de revisión: 8-nov-2026. Este documento permite continuar el backend desde Tiendly sin conservar un clon de `la-bodega` dentro del proyecto. Cierra la dependencia documental; la migración funcional y la baja de infraestructura remota siguen abiertas.

## Fuentes y alcance

- Origen histórico: `triple0-labs/la-bodega`, commit `fbeeecc31a3ab9df83b25d068c7c9fd387fb9598`. Su `main` remoto coincide con el clon revisado; no había cambios locales ni archivos sin seguimiento.
- Tiendly integrado: `main`, commit `e63505001226544c6c056ddfafddd4ebb19d4b00`. `backend/` contiene la estructura inicial.
- Avance de implementación: `76adead` (`chore/cloudflare-foundation`), `91c6d58` (`feat/identity-stores`) y `c00ae43` (`feat/catalog`). Son ramas locales apiladas, todavía fuera de `main` al revisar.
- Integración en curso: rama `feat/onboarding-d1`, worktree `/Users/diego/sandbox/tiendly/.worktrees/cloudflare`, sobre `c00ae43`, con integración resguardada en `823d1a2` después de la exploración inicial. Esos cambios no forman parte de este cierre documental.
- Las reglas vigentes siguen en [CLAUDE.md](../../CLAUDE.md), [DESIGN.md](../../frontend/DESIGN.md), las [decisiones](../decisiones/README.md) y el [plan de backend](../plan-backend.md). La actualización del 8-nov del plan está en la rama de implementación; el cuerpo histórico del 29-oct todavía describe otra secuencia.

El código de Tiendly no importa `@labodega/*`, no declara ese workspace ni necesita el clon para construir. El backend nuevo reemplaza responsabilidades; no es un traslado literal de paquetes Postgres.

## Estado por módulo

Las rutas de implementación de esta tabla corresponden a las ramas indicadas arriba, no al `main` de este PR. «Implementado» no significa integrado a la app ni desplegado.

| Origen | Destino en Tiendly | Estado y trabajo restante |
|---|---|---|
| `packages/shared-kernel`, `packages/contracts` | `backend/src/{identity,stores,catalog}` y exports `@tiendly/backend/{rules,server,auth}` | Reemplazo parcial con reglas, errores y contratos junto al módulo. No trasladar todas las abstracciones del monorepo anterior. Faltan contratos de ventas. |
| `packages/identity-access`, rutas de auth | `backend/src/identity`, `/api/auth/*` | Better Auth con Google y sesión D1 implementados. Pruebas de sesión/revocación y URL OAuth; falta ingreso real completo en navegador. |
| `packages/store-management` | `backend/src/stores`, `/api/business/stores` | Crear, consultar tienda propia y renombrar con versión; membresía/configuración inicial atómicas. Branding y otros cambios del panel pendientes. |
| `packages/catalog` | `backend/src/catalog`, `/api/business/catalog` | Catálogo relacional con opciones, variantes, céntimos, ofertas, galerías y medidas. Falta aceptación desde formularios y coordinar stock con ventas. |
| Storage MinIO/S3 | `backend/src/catalog/adapters/r2-images.ts`, `/api/business/images`, `/images/*` | R2 local probado con permisos y validación de archivos. Bucket y aceptación remotos pendientes. |
| `packages/sales` | Futuro `backend/src/sales` | En el origen solo hay agregado de pedido, puerto y repositorio en memoria; no un checkout productivo que baste copiar. Implementar pedidos, reservas, pagos simulados, entrega, historial e idempotencia con las reglas de Tiendly. |
| Capacidades y flags | Reglas de `stores` y configuración de entorno | Free/Pro/fundadora implementados parcialmente. Fin de fundadora y aplicación completa de límites pendientes. No incorporar Unleash ni el plan Esencial. |
| `packages/db` / migración Postgres | `backend/db/migrations/0001_auth.sql`, `0002_stores.sql`, `0003_catalog.sql` | D1 relacional desde el inicio en la rama nueva. Migraciones aplicadas solo a D1 desechable; faltan ventas/promociones y mutaciones de configuración. |
| `apps/api` / Fastify | Handlers y acciones del frontend + comandos de backend | No se conserva un servidor de API separado. Contratos del origen no son endpoints disponibles de Tiendly. |
| `apps/web` | `frontend/` existente | Se conserva la app de Tiendly y su diseño. Puentes de onboarding, catálogo y lecturas D1 en curso, sin commit. |
| `apps/worker`, pg-boss, outbox | Futuras tareas en `backend/workers/tareas/` | El worker del origen inicia pg-boss, pero no registra handlers de negocio. Cron, reintentos y efectos externos siguen pendientes; la tecnología de colas futuras no se decide en este cierre. |
| Sin equivalente completo en el origen | Futuros módulos `promotions` y `settings` | Cupones, configuración, Afiliación y Mi tienda conservan acciones anteriores. Hay lectura inicial D1 de configuración en cambios sin commit, no comandos completos. |
| Docker, Coolify, GHCR y workflows antiguos | Runtime Cloudflare en evaluación | Se conservan como historial. No copiar CI/CD ni dar por retirado el servicio anterior. Ver cierre operativo más abajo. |

## Diferencias que no deben reintroducirse

Esta tabla registra la dirección ya documentada en Tiendly y en la actualización del plan de la rama de implementación. No aprueba funciones nuevas ni modifica reglas de producto.

| Tema | Propuesta histórica de la-bodega | Dirección de Tiendly |
|---|---|---|
| Persistencia | Postgres + Drizzle. | D1 relacional desde el inicio en el avance del 8-nov; sin etapa JSON ni importación Redis/Blob en ese alcance. |
| Runtime | Tres servicios Node/Docker (`web`, `api`, `worker`) en Coolify. | App en Cloudflare; experimento vinext, comandos en un paquete de backend y tareas separadas cuando corresponda. Falta aceptación y aprobación del corte. |
| Acceso | Email, contraseña y JWT RS256 propios. | Google/Better Auth con sesiones persistidas y titularidad; ingreso simulado solo en pruebas explícitas. |
| Tienda pública | Tenant obligatorio desde `Host` y wildcard. | Se conservan las rutas por slug de Tiendly; el servidor resuelve la tienda. Un slug o ID público no concede permiso para editarla. |
| Stock | Sin reserva al crear; descontar al pagar. | Reserva de 24 horas por WhatsApp, excepción contra entrega y asignaciones de stock según las reglas actuales. La escritura final debe ser atómica. |
| Pedido | Estados centrados en subida/revisión de voucher. | Estados de pago y entrega propios de Tiendly; cancelación irreversible. No reemplazarlos por el agregado anterior. |
| Catálogo | Un stock y una imagen por producto. | Opciones genéricas, variantes, galerías, ofertas y tabla de medidas por producto. |
| Dinero | Value object `Money`. | Céntimos enteros en el dominio/D1 y traducción al borde del frontend; conservar hasta dos decimales y el formato vigente. |
| Planes | Free, Esencial y Pro con precios históricos. | Free, Pro y Tienda fundadora según el plan vigente; no heredar precios ni permisos de pagos del origen. |
| Pagos y notificaciones | Transferencia/vouchers, Mercado Pago y emails reales previstos. | Pagos, bancos, SUNAT y envíos siguen simulados. No activar proveedores ni mensajes como parte de la migración. |
| Consulta de compras | Email + número y enlaces firmados de 30 días. | El plan nuevo exige token de acceso al comprobante; no adoptar el lookup por datos previsibles ni el vencimiento histórico sin una decisión de producto. |
| Herramientas y workflow | pnpm/Turbo, Vitest/Testcontainers, squash. | Herramientas del repo; backend nuevo usa `node:test` y Miniflare. Sigue el workflow de Tiendly, sin merge sin aprobación de Gabi ni force-push. |

## Inventario documental completo

Las 26 fuentes de `la-bodega/docs/` quedan inventariadas con SHA-256 en [la-bodega-inventario.json](la-bodega-inventario.json). Todas las rutas de esta tabla son relativas a `docs/` del repo histórico. El bundle externo conserva el contenido original y su historial; no se requiere abrirlo para seguir las tareas actuales.

| Documento de origen | Disposición en Tiendly |
|---|---|
| `README.md` | Sustituido por este mapa y las entradas del repo. |
| `00-indice/developer_onboarding.md` | Arranque anterior archivado. Usar README del repo y backend; completar comandos Cloudflare al integrar. |
| `00-indice/glossary.md` | Conceptos de tienda, titularidad, dominio y tenant recogidos en este cierre y los criterios conservados. Terminología de producto según CLAUDE/DESIGN. |
| `01-producto/requerimientos.md` | RF/RNF clasificados en [requisitos conservados](requisitos-conservados.md); planes/precios y funcionalidades del origen no se convierten en compromisos. |
| `01-producto/casos_de_uso.md` | Onboarding, catálogo, compra y pedidos se rigen por los flujos de Tiendly. Vouchers, Mis Compras y emails quedan como antecedentes fuera del alcance actual. |
| `01-producto/roadmap.md` | Sustituido por el estado por módulo y próximos pasos de este documento; la expansión permanece como antecedente. |
| `02-dominio/modelo_de_dominio.md` | Conservar separación de responsabilidades, snapshots, aislamiento e invariantes; descartar estados/stock incompatibles. Ver criterios conservados. |
| `02-dominio/modelo_de_datos_tecnico.md` | Esquema Postgres archivado; D1 SQL es la fuente del esquema nuevo. Auditoría e idempotencia siguen pendientes donde no estén implementadas. |
| `03-arquitectura/arquitectura_tecnica.md` | Modularidad conservada; topología y workflow reemplazados según tabla de diferencias. |
| `03-arquitectura/shared_kernel.md` | Conservar límites entre dominio/adaptadores y contratos explícitos. No copiar jerarquías, bus de eventos o paquetes por obligación. |
| `04-bounded-contexts/modulo_identity_access.md` | Reemplazado por `identity`; no portar contraseñas/JWT/verificación por email propios. |
| `04-bounded-contexts/modulo_store_management.md` | Reemplazo parcial por `stores`; personalización y ciclo completo de planes pendientes. |
| `04-bounded-contexts/modulo_catalog.md` | Reemplazo por `catalog` adaptado a variantes y reglas actuales; falta aceptación UI. |
| `04-bounded-contexts/modulo_sales.md` | Invariantes útiles rescatadas; implementar `sales` conforme al flujo de Tiendly. |
| `05-cross-cutting/autenticacion_y_sesiones.md` | Seguridad de sesión conservada como criterio; implementación delegada a Better Auth. |
| `05-cross-cutting/multitenancy.md` | Aislamiento conservado; resolución por sesión/slug adaptada, sin imponer `Host` o claims JWT. |
| `05-cross-cutting/feature_flags_y_capacidades.md` | Separación capacidad/flag conservada; Unleash, planes y política de enlaces anteriores archivados. |
| `05-cross-cutting/jobs_outbox_y_webhooks.md` | Conservar idempotencia, trazabilidad y efectos posteriores al commit como criterios futuros. pg-boss y outbox no se declaran implementados. |
| `06-infra-y-calidad/docker_y_entornos.md` | Infraestructura anterior archivada; separación de entornos, respaldo y recuperación conservados. |
| `06-infra-y-calidad/stack_y_versiones.md` | Baseline anterior archivado. Manifiestos y lockfile de Tiendly fijan dependencias. |
| `06-infra-y-calidad/testing.md` | Conservar pruebas de dominio, persistencia, aislamiento y flujos; herramientas y comprobaciones según Tiendly. |
| `06-infra-y-calidad/observability.md` | Criterios de logs, correlación y métricas conservados. Proveedor, umbrales, retención y responsables siguen abiertos. |
| `07-decisiones-y-operacion/adrs/README.md` | Plantilla/backlog histórico archivados. Las decisiones actuales se registran en `docs/decisiones/`. |
| `07-decisiones-y-operacion/runbooks/deployment.md` | Comandos anteriores archivados. Conservar compatibilidad de migraciones y rollback, con procedimiento Cloudflare todavía pendiente. |
| `07-decisiones-y-operacion/runbooks/error_recovery.md` | Recuperación controlada y trazabilidad recogidas en criterios conservados; no ejecutar scripts Postgres/colas sobre D1. |
| `07-decisiones-y-operacion/api-contracts/openapi.yaml` | Contrato inicial histórico archivado; no publicarlo como API de Tiendly. El contrato actual está en handlers y comandos implementados. |

## Cierre operativo y respaldo

- Comprobación remota del 8-nov: `main` de ambos repos coincide con las referencias indicadas. `la-bodega` no está archivado en GitHub; no tiene PRs abiertos en la consulta realizada.
- GitHub registra un [despliegue QA](https://github.com/triple0-labs/la-bodega/actions/runs/26637696955) del 29-may-2026, deployment `4862262511`, con estado `success`. El campo de URL de entorno está vacío. Esto no prueba que Coolify esté sano, inactivo o sin datos: el workflow tolera algunos fallos de migración/webhook como advertencias.
- Los workflows `CI`, `Build, publish and deploy` y `Redeploy environment` siguen activos; existen entornos `qa` y `prod`. No se consultaron valores de secretos ni se ejecutó ningún workflow.
- El usuario confirmó el 8-nov que desconoce el estado de los servicios y pidió dejar la baja remota pendiente. No se apagaron servicios, borraron bases/buckets/imágenes, revocaron credenciales ni archivaron repos remotos.
- No se encontraron procesos con archivos abiertos dentro del clon al preparar el retiro. La eliminación de una carpeta local no detiene ni retira servicios remotos.
- Respaldo fuera del proyecto: `/Users/diego/tiendly-respaldos/la-bodega-20261108/la-bodega.bundle`, historial completo de las cinco referencias locales, verificado con `git bundle verify` y restauración independiente. SHA-256: `2146a387dc68fc2881b7864a8d14bb11736842d090130db79ad337cfba8ed3ea`.
- El clon original se conserva en `/Users/diego/tiendly-respaldos/la-bodega-20261108/checkout` al retirarlo de Tiendly. El bundle y el checkout son respaldos, no fuentes de reglas vigentes.

Para consultar el historial sin volver a anidar repos dentro de Tiendly:

```bash
git clone /Users/diego/tiendly-respaldos/la-bodega-20261108/la-bodega.bundle /private/tmp/la-bodega-consulta
git -C /private/tmp/la-bodega-consulta checkout fbeeecc31a3ab9df83b25d068c7c9fd387fb9598
```

La baja remota requiere inventariar recursos de Coolify/VPS, dominios, Postgres, MinIO, GHCR y dependencias; comprobar datos y restauración; y acordar el retiro de servicios y automatizaciones. Ese trabajo no bloquea retirar el clon local y no está completado por este PR.

## Próximos pasos del backend

1. Terminar y verificar la integración en `feat/onboarding-d1`. El resguardo posterior ya transmite versiones desde formularios y acciones en lote; falta aceptación completa de catálogo. Los builds/tipos y 12 tests locales pasan en esa rama. La creación de `dev` y el PR #46 preparan el workflow; este PR documental apunta a `dev` y sigue sin merge.
2. Verificar Google real → crear tienda → producto/foto → recarga → vitrina en el runtime Cloudflare. R2 remoto y persistencia entre sesiones todavía requieren aceptación.
3. Implementar `sales` y `promotions`: checkout idempotente, stock/reservas, contador, cupones e historial atómicos sobre el esquema final. La prueba remota de plataforma no sustituye estas pruebas de negocio.
4. Migrar comandos de configuración, Mi tienda y Afiliación; actualmente `mutarTienda` rechaza escrituras con bindings D1. La lectura provisional devuelve pedidos, inventario y cupones vacíos; eso no acredita su migración.
5. Completar tareas, operación, aceptación local/preview y requisitos de beta. Mantener simulados pagos y comunicaciones; fijar corte solo después de aceptación y aprobación de Gabi.

Verificación realizada durante la exploración: 11 tests de backend y `typecheck` del backend pasan sobre el worktree de implementación. Existe evidencia remota de D1 para identidad/tiendas/catálogo en esa rama. No se repitieron pruebas remotas, OAuth real, R2 remoto ni aceptación E2E en este cierre. No se desplegó la migración Cloudflare ni se hizo merge.
