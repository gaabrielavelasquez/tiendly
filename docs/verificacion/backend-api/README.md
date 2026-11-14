# Primer corte de API separada · aceptación local

Código funcional: `563d414`. [PR #57](https://github.com/gaabrielavelasquez/tiendly/pull/57), en borrador. Rama `feat/backend-api`, worktree Orca `backend-api`, desde `dev` `8f2906f`. [Alcance y comandos](../../backend/separacion-api.md).

## Resultado

PASS local con Next.js convencional en localhost:3220 y API Worker autónoma en 127.0.0.1:3221. El frontend solo recibe la URL de API; los secretos y D1/R2 están en el proceso backend. [Resumen de checks](checks.json) y [resultados de navegador](local/result.json).

- 19 tests de backend: regresión y frontera HTTP, titularidad, origen, ofertas calculadas en backend, conflictos atómicos, imágenes, callbacks, revocación y destino de despliegue QA.
- Tokens, tipos frontend/backend, build Next y vinext, cinco tests de entornos, cuatro tests de manifiesto y builds autónomos local/QA de la API en dry-run: PASS. Next/vinext se ejecutaron en secuencia, con el servidor propio detenido. Permanecen los avisos anteriores de sourcemaps/clasificación de vinext y el aviso del Node local 26.10 frente al mínimo declarado 26.12.
- Seis recorridos Chromium/WebKit a 390, 1440 y 360; 42 checkpoints sin scroll horizontal ni imágenes rotas. Tienda vacía, nombre largo, precio S/ 129,999.10, foto sintética subida a R2, guardado/recarga sin duplicado, fallo de red/reintento, edición concurrente, vitrina y salida. La cookie previa al logout recibe 401.
- Se revisaron 1 847 archivos de artefactos frontend/API; cero coincidencias con las credenciales privadas locales.

Las sesiones del harness son sintéticas firmadas en D1 emulado; no equivalen a Google real. La imagen gris es un fixture de canvas. Se limpiaron por ID los usuarios/tiendas/imágenes creados en los recorridos completos. Una lectura final del emulador no encontró usuarios ui-qa pendientes. Ningún recurso remoto recibió escrituras.

## Capturas

Capturas originales del navegador de desarrollo, sin edición de imágenes. Se inspeccionaron muestras representativas a 390/1440. La marca de Next en desarrollo no pertenece al diseño de la app.

| Vista | Chrome 390 | Chrome 1440 | WebKit 390 | WebKit 1440 |
|---|---|---|---|---|
| Tienda creada | [Ver](local/chromium-390-tienda-creada.png) | [Ver](local/chromium-1440-tienda-creada.png) | [Ver](local/webkit-390-tienda-creada.png) | [Ver](local/webkit-1440-tienda-creada.png) |
| Producto/foto guardados | [Ver](local/chromium-390-producto-guardado.png) | [Ver](local/chromium-1440-producto-guardado.png) | [Ver](local/webkit-390-producto-guardado.png) | [Ver](local/webkit-1440-producto-guardado.png) |
| Producto recargado | [Ver](local/chromium-390-producto-recargado.png) | [Ver](local/chromium-1440-producto-recargado.png) | [Ver](local/webkit-390-producto-recargado.png) | [Ver](local/webkit-1440-producto-recargado.png) |
| Error de red recuperable | [Ver](local/chromium-390-error-recuperable.png) | [Ver](local/chromium-1440-error-recuperable.png) | [Ver](local/webkit-390-error-recuperable.png) | [Ver](local/webkit-1440-error-recuperable.png) |
| Conflicto entre pestañas | [Ver](local/chromium-390-conflicto-de-version.png) | [Ver](local/chromium-1440-conflicto-de-version.png) | [Ver](local/webkit-390-conflicto-de-version.png) | [Ver](local/webkit-1440-conflicto-de-version.png) |
| Vitrina pública | [Ver](local/chromium-390-vitrina.png) | [Ver](local/chromium-1440-vitrina.png) | [Ver](local/webkit-390-vitrina.png) | [Ver](local/webkit-1440-vitrina.png) |
| Sesión cerrada | [Ver](local/chromium-390-sesion-cerrada.png) | [Ver](local/chromium-1440-sesion-cerrada.png) | [Ver](local/webkit-390-sesion-cerrada.png) | [Ver](local/webkit-1440-sesion-cerrada.png) |

## Pendiente antes de marcar listo

- Autorizar el callback local nuevo en el cliente Tiendly Preview y completar el ingreso Google real. La pareja de Google de pruebas está configurada privadamente en backend/.dev.vars y no se cambió el secreto de sesión local generado. No se publican valores.
- Publicar y aceptar el par de servicios en QA. Solo se compiló el Worker API; `api-preview` es un destino preparado, no un despliegue realizado. El frontend QA actual no se reemplazó y sus secretos no se movieron. Mantener el PR en borrador mientras falte esta aceptación.
- La medición Vercel requerida para el PR no acredita el modo API mientras no haya backend conectado allí. Las capturas de este informe son locales y no se presentan como evidencia remota.

Ventas/reservas/pedidos/checkout/cupones/ajustes editables/tareas y métricas siguen fuera de este primer corte. No se migraron ni borraron datos productivos. Pagos y comunicaciones continúan simulados. No se cambiaron estilos, tokens, DNS, configuración de Vercel ni el Worker QA existente. El preview automático de Vercel del PR compiló correctamente y conserva el runtime anterior; está protegido y esta sesión de CLI no tiene autenticación para medirlo. No hubo merge.

CI y Vercel del head `b87a73f`: verdes. La autorización Google real configurada devuelve 200 a través del proxy local, una cookie de estado y el callback exacto nuevo; no se completó el consentimiento/callback. Los dos procesos locales quedan disponibles en terminales Orca «Next UI 3220» y «API local 3221».
