# 0036 · El carrito es un drawer

- **Fecha:** 23-oct-2026
- **Estado:** pedida por Gabi en la revisión del PR #26.
- **Actualiza:** 0007 (el carrito era una página, paso 1 de 2 de la compra) y el punto 2 de 0035 (la hoja "Agregado al carrito" se reemplaza por el drawer).

## Decisión

1. **Al agregar al carrito se abre el drawer del carrito**, sin hoja intermedia. El ícono del carrito de la cabecera abre el mismo drawer.
2. **Tablet y desktop (≥ 768 px):** panel de 420 px que entra desde la derecha, con la tienda visible detrás de un velo suave. **Celular:** pantalla completa que sube desde abajo, con "X" para cerrar.
3. **Contenido:**
   - Lo recién agregado se resalta 2 s con un fondo suave.
   - Todas las líneas en UN contenedor con divisores (0031): foto, nombre, variante ("Plata · Talla M"), precio con su oferta (normal tachado, 0034), cantidad y "Quitar".
   - "Quitar" deja "Quitaste X. Deshacer." en el mismo lugar de la lista.
   - Cupón solo si la tienda tiene alguno activo hoy (o si ya hay uno aplicado). Avance al envío gratis solo si la tienda lo ofrece.
   - Pie fijo: subtotal, "Finalizar compra" (CTA) y "Seguir comprando".
4. **Se mantienen** el botón "✓ Agregado" (1,5 s, sin volver a sumar) y el salto del ícono del carrito.
5. **Cierre y accesibilidad:** X, Escape o tocar el velo. El foco entra al drawer, no sale con Tab y vuelve al botón (o al ícono) al cerrar. Con "reducir movimiento", aparece con un fundido, sin deslizar. Los primeros 400 ms el drawer no recibe toques: el segundo toque de un doble toque en "Agregar" lo cerraría.
6. **/carrito sigue como página** para links directos, con el mismo contenido (desktop: pie en un resumen fijo a la derecha; celular: pie fijo abajo). En /carrito y en la compra el ícono de la cabecera es un link, no abre el drawer. La compra (checkout) no cambia.

## Consecuencias

- El drawer vive en el layout de la tienda (`ProveedorCarrito`), que carga el catálogo de compra una vez.
- El catálogo de compra guarda el precio normal de los productos con oferta activa (`precioAntes`) y si la tienda tiene cupones activos (`hayCupones`).
