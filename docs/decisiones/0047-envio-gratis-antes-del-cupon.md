# 0047 · El envío gratis por monto se cuenta antes del cupón

- **Fecha:** 16-nov-2026
- **Estado:** en revisión, sin merge.

## Contexto

El umbral de envío gratis (0009) se aplicaba sobre bases distintas en cada lado. El backend lo calcula con el subtotal de productos antes de cualquier descuento: `backend/src/orders/application/orders.ts` arma el subtotal y se lo pasa a `shippingFor` en `backend/src/orders/domain/order.ts`, y `backend/test/orders.test.ts` fija ese orden con una prueba. El carrito del frontend, en cambio, lo contaba después de restar el cupón. Hoy el backend todavía ignora los cupones, así que la diferencia no se ve; al migrar los cupones a la API, las dos reglas chocarían y la migración decidiría por nosotros.

## Decisión

- **El umbral mide el valor de la compra en productos: se compara contra el subtotal antes del cupón**, tanto en el carrito como en la API. Un cupón de descuento no acerca el envío gratis.
- Solo un cupón de tipo envío concede el envío gratis, y se rechaza si el subtotal ya llega al umbral por sí solo.
- El backend manda: ya calcula así y tiene una prueba que lo fija.

## Consecuencias

- El backend no cambia. El carrito se alinea en esta misma serie de cambios: el chequeo de `calcularTotales` y la barra de avance al envío gratis usan el subtotal de productos.
- Cuando los cupones lleguen al backend, el descuento se aplica después de decidir el envío, sin cambiar esta regla.
- `usarEnCarrito` ya recibía el subtotal antes del cupón para la compra mínima y para saber si el envío gratis ya cubría el pedido: sigue igual.
