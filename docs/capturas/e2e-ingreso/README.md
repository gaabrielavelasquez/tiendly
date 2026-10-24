# Ingreso y E2E · 24-oct-2026

**Sin merges.** Cupones está en [#36](https://github.com/gaabrielavelasquez/tiendly-web/pull/36), Pagos/Afiliación en [#37](https://github.com/gaabrielavelasquez/tiendly-web/pull/37); checkout sigue en [#35](https://github.com/gaabrielavelasquez/tiendly-web/pull/35).

## Fallo corregido

Tras Cerrar sesión, ingresar con el código simulado solo navegaba a /panel: no buscaba la tienda ni reponía la cookie HttpOnly. Se reproducía en Vercel: terminaba en MUÑA, sin cookie. Ahora el servidor recupera la tienda y recuerda la sesión antes de recargar el panel. Un número desconocido o un fallo de red mantiene el formulario y permite reintentar.

El número de ingreso se conserva por separado del WhatsApp de ventas, que puede cambiar. El índice y los documentos se separan por entorno. Para tiendas antiguas sin índice se busca el número de ventas, sin elegir arbitrariamente entre coincidencias múltiples. No hay migración masiva ni escrituras de datos de producción durante estas pruebas. El acceso por código sigue siendo **simulado**, no autenticación real.

## E2E completo a 390 × 844: local

Se ensamblaron temporalmente los cambios de #35, #36, #37 y esta corrección en un worktree desde main; ninguna rama se integró a otra PR. Servidor local en 3211, sin Redis, un solo proceso. [Resultado](local-completo/resultado.json).

1. Registro con teléfono ficticio → tienda nueva Hogar.
2. Producto con foto, Tamaño Pequeño/Grande, diez unidades por variante; oferta S/ 90.99, antes S/ 119.10.
3. Cupón E2E10 (10 %) y delivery Lima a S/ 10.90.
4. Dos compras por la interfaz: tarjeta de prueba y WhatsApp. Comprobación exacta de producto 90.99, descuento 9.10, envío 10.90 y total 92.79, con método correcto.
5. Ambos pedidos visibles en Pedidos; Inicio muestra la venta pagada y el pendiente de envío.
6. Pedido de WhatsApp marcado pagado y enviado; estado conservado tras recargar.
7. Cerrar sesión elimina cookie; ingresar recupera la misma tienda y ambos pedidos.

Para habilitar la ruta de tarjeta se invocó la acción existente guardarPagos con una cuenta ficticia **solo en el servidor de prueba**: la aprobación de afiliación es un mock. Los demás pasos usan la interfaz real y acciones de servidor. No se enviaron mensajes ni cobros. Cada checkpoint verifica ausencia de scroll horizontal.

[Capturas locales del flujo](local-completo/) y [prueba independiente de ingreso](local-ingreso/resultado.json): número de registro distinto del de ventas, rechazo del contacto público como ingreso y recuperación correcta. Estas capturas se identifican como locales; no sustituyen las de Vercel.

## E2E en Vercel: pendiente por persistencia

Preview temporal combinado: https://tiendly-j6tvajdlo-gaabrielavelasquez-8525s-projects.vercel.app (5d9dc76, antes de esta corrección). Registro, creación de tienda/producto, cupón y entrega se ejecutaron en servidor remoto. La ficha del producto devolvió 404: los previews no tienen Redis y cada instancia conserva una memoria distinta. [Resultado de interrupción](preview-interrumpido/resultado.json).

El E2E **completo en preview no está aprobado como PASS**. No se reemplaza por mocks del backend ni por el resultado local. La revisión automática rechazó habilitar, solo en el despliegue temporal, las credenciales Redis de desarrollo existentes: falta aprobación explícita para enviar secretos a Vercel. Se solicitó esa autorización a Gabi. Ninguna credencial se subió ni se adjuntó; no se cambiaron variables del proyecto.

Pendiente: autorización, despliegue temporal con namespace preview, repetir de registro a reingreso a 390 y adjuntar resultado completo. No tocar claves production ni aprobar/mergear PRs.

## Comparación de ingreso desde Vercel

Antes: preview combinado j6tvajdlo. Después: https://tiendly-8okb09q2l-gaabrielavelasquez-8525s-projects.vercel.app (38e219f). Se prueba un número ficticio sin tienda: antes termina en la demo; después permanece en el código con un error claro. Capturas a 390/1440, revisión de overflow 360/390.

| Ancho | Antes | Después |
|---|---|---|
| 390 | [Antes](before/chromium-390.jpg) | [Después](after/chromium-390.jpg) |
| 1440 | [Antes](before/chromium-1440.jpg) | [Después](after/chromium-1440.jpg) |

Chrome y WebKit pasan la comparación de ingreso a 390/1440/360 sin scroll. También pasan código incorrecto, fallo de red y reintento local: [resultado](local-ingreso/red-reintento.json).

Tokens y build local con Webpack pasan; build habitual de Vercel verde. Producción, datos existentes y servidor principal 3100 quedan intactos.
