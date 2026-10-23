# 0035 · Ficha en tablet y "Agregado al carrito"

- **Fecha:** 23-oct-2026
- **Estado:** pedida por Gabi en la revisión del PR #26 (probado en iPad y celular).

## Decisión

1. **Ficha de producto en dos columnas desde 768 px** (foto a la izquierda, compra a la derecha), como en desktop. En el celular la foto va a todo el ancho, con un alto máximo del 60 % de la pantalla visible (`svh`; con 70 %, en un iPhone el precio quedaba justo bajo el pliegue cuando hay badge de stock), para que el nombre y el precio asomen sin hacer scroll.
2. **Al agregar al carrito:**
   - El botón cambia 1,5 s a "✓ Agregado" y no suma de nuevo en ese momento (evita el doble toque).
   - El ícono del carrito de la cabecera da un salto corto, una vez. Con "reducir movimiento", no se mueve.
   - Se abre una hoja desde abajo en el celular (panel chico arriba a la derecha en desktop y tablet) con la foto, el nombre, la variante ("Plata · Talla M") y el precio, más "Ver carrito" (CTA) y "Seguir comprando".
   - Se quita el texto verde "Agregado al carrito." debajo de los botones.
3. **Foto del BB cream de Glow Labo:** se reemplaza por una sin marca legible (tonos tierra). Las fotos de ejemplo no muestran marcas reales.
