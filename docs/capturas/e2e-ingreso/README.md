# Ingreso y E2E · 24-oct-2026

**Sin merges.** Cupones está en [#36](https://github.com/gaabrielavelasquez/tiendly-web/pull/36), Pagos/Afiliación en [#37](https://github.com/gaabrielavelasquez/tiendly-web/pull/37); checkout sigue en [#35](https://github.com/gaabrielavelasquez/tiendly-web/pull/35).

## Fallo corregido

Tras Cerrar sesión, ingresar con el código simulado solo navegaba a /panel: no buscaba la tienda ni reponía la cookie HttpOnly. Se reproducía en Vercel: terminaba en MUÑA, sin cookie. Ahora el servidor recupera la tienda y recuerda la sesión antes de recargar el panel. Un número desconocido o un fallo de red mantiene el formulario y permite reintentar.

El número de ingreso se conserva por separado del WhatsApp de ventas, que puede cambiar. El índice y los documentos se separan por entorno. Para tiendas antiguas sin índice se busca el número de ventas, sin elegir arbitrariamente entre coincidencias múltiples. No hay migración masiva ni escrituras de datos de producción durante estas pruebas. El acceso por código sigue siendo **simulado**, no autenticación real.

## E2E completo en Vercel a 390 × 844: PASS

Preview integrado temporal: https://tiendly-l5sbiihvq-gaabrielavelasquez-8525s-projects.vercel.app (792c840). Combina solo para pruebas #35, #36, #37 y la corrección de ingreso. Ninguna PR se mergeó ni se apiló sobre otra. [Resultado remoto](preview-completo/resultado.json).

Se creó la tienda sintética **e2e-tienda-83972309**, con teléfono ficticio. Todas las creaciones y acciones de compra/Pedidos usaron el servidor real del preview, sin sustituirlo por respuestas ficticias.

1. Registro → tienda nueva Hogar.
2. Producto con foto, Tamaño Pequeño/Grande, diez unidades por variante; oferta S/ 90.99, antes S/ 119.10.
3. Cupón E2E10 (10 %) y delivery Lima a S/ 10.90.
4. Dos compras por la interfaz: tarjeta de prueba y WhatsApp. Comprobación exacta de producto 90.99, descuento 9.10, envío 10.90 y total 92.79, con método correcto en ambas compras.
5. Ambos pedidos visibles en Pedidos; Inicio muestra S/ 92.79 y un pedido por enviar.
6. Pedido de WhatsApp marcado pagado y enviado; estado conservado tras recargar.
7. Cerrar sesión elimina cookie; ingresar recupera la misma tienda y ambos pedidos. Inicio ya suma S/ 185.58 y dos pedidos pagados.

Para habilitar la ruta de tarjeta se invocó la acción existente guardarPagos con una cuenta ficticia **solo en el servidor de prueba**: la aprobación de afiliación es un mock. Los demás pasos usan la interfaz real y acciones de servidor. No se enviaron mensajes ni cobros. Cada checkpoint verifica ausencia de scroll horizontal.

### Evidencia remota

| Paso | Captura a 390 |
|---|---|
| Tienda creada | [Ver](preview-completo/01-tienda-creada.jpg) |
| Producto con opciones y oferta | [Ver](preview-completo/02-producto-opciones-oferta.jpg) |
| Cupón | [Ver](preview-completo/03-cupon-creado.jpg) |
| Entrega | [Ver](preview-completo/04-entrega-guardada.jpg) |
| Compra con tarjeta | [Ver](preview-completo/06-compra-tarjeta.jpg) |
| Compra por WhatsApp | [Ver](preview-completo/07-compra-whatsapp.jpg) |
| Ambos pedidos | [Ver](preview-completo/08-pedidos-visibles.jpg) |
| Inicio | [Ver](preview-completo/09-inicio-con-pedidos.jpg) |
| Pago manual y envío | [Ver](preview-completo/10-pagado-y-enviado.jpg) |
| Logout | [Ver](preview-completo/11-logout.jpg) |
| Reingreso a la misma tienda | [Ver](preview-completo/12-login.jpg) |

### Persistencia del preview y autorización

El primer intento sin Redis en j6tvajdlo creó tienda/producto/cupón/entrega, pero la ficha devolvió 404: cada instancia conservaba una memoria distinta. [Interrupción inicial](preview-interrumpido/resultado.json), ya superada.

La revisión automática rechazó inicialmente habilitar las credenciales Redis de desarrollo sin aprobación explícita. Gabi respondió: «Sí, solo en ese preview temporal». Se desplegó el ensamblado de pruebas con KV_REST_API_URL/KV_REST_API_TOKEN **solo en l5sbiihvq**, sin cambiar variables del proyecto ni otras previews. Datos bajo claves preview; no se modificaron datos production. El archivo privado temporal de credenciales se eliminó tras desplegar. La repetición completa con persistencia pasa. El despliegue se conserva temporalmente para revisar la evidencia; no promoverlo a producción.

## Validación local adicional

El mismo E2E completo pasa a 390 × 844 en un solo proceso local aislado en 3211, sin Redis. [Resultado local](local-completo/resultado.json) y [capturas](local-completo/). Son evidencia adicional, identificada como local.

[Prueba independiente](local-ingreso/resultado.json): número de registro distinto del WhatsApp de ventas, rechazo del contacto público como ingreso y recuperación correcta. [Código/red/reintento](local-ingreso/red-reintento.json): 0000 rechazado, fallo de red visible sin cookie y reintento exitoso. Servidores propios 3210/3211 cerrados; 3100 intacto.

## Comparación de ingreso desde Vercel

Antes: preview combinado j6tvajdlo. Después: https://tiendly-8okb09q2l-gaabrielavelasquez-8525s-projects.vercel.app (38e219f). Se prueba un número ficticio sin tienda: antes termina en la demo; después permanece en el código con un error claro. Capturas a 390/1440, revisión de overflow 360/390.

| Ancho | Antes | Después |
|---|---|---|
| 390 | [Antes](before/chromium-390.jpg) | [Después](after/chromium-390.jpg) |
| 1440 | [Antes](before/chromium-1440.jpg) | [Después](after/chromium-1440.jpg) |

Chrome y WebKit pasan la comparación de ingreso a 390/1440/360 sin scroll. También pasan código incorrecto, fallo de red y reintento local: [resultado](local-ingreso/red-reintento.json).

Tokens y build local con Webpack pasan; build habitual de Vercel verde. Producción, datos existentes y servidor principal 3100 quedan intactos.
