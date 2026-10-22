# 0028 · Portada partida, productos nuevos activos, stock en la compra y números #TL-

- **Fecha:** 16-oct-2026
- **Estado:** aceptada (Gabi). Vigente.
- **Ajusta:** 0027 (portada Free y estado inicial de producto nuevo).

## Contexto

Al revisar la limpieza (0027) y el módulo 1 (Checkout y Carrito) quedaron cuatro temas abiertos: la foto de portada, cómo arranca un producto nuevo, qué pasa con el stock al comprar y el formato del número de pedido.

## Decisión

1. **Portada Free partida:** a la izquierda la modelo con los zapatos puestos y a la derecha solo los zapatos. Cada foto ocupa la mitad del ancho, así las fotos de ~950 px alcanzan. Titular y CTA van **debajo** de las fotos. El texto sobre la foto sigue siendo el "banner de alto impacto" Pro (V1.1).
2. **Producto nuevo activo:** se publica al guardar y se puede pausar. Si le falta foto, precio o stock, se guarda **pausado** y se le dice a la persona qué falta.
3. **Stock en la compra (0010):**
   - Pagado en la tienda (tarjeta o Yape): el stock baja al pagar.
   - Pedido por WhatsApp: el stock queda **reservado 24 h**. Si la reserva vence, se libera; al marcarlo como pagado, baja.
   - Una talla con stock 0 se ve agotada en la vitrina.
4. **Números de pedido `#TL-`** en todo el producto (Figma y 0010).
5. **Cadena de PRs:** se mantiene (#3 → #4 → #5). Gabi mergea en orden y, después de cada merge, la rama siguiente se rebasa sobre `main`.

## Consecuencias

- `Portada` muestra dos fotos lado a lado; `PortadaPro` no cambia.
- El formulario de producto arranca en Activo y avisa al guardar pausado.
- Inventario simulado por pedido (`productos/lib/inventario.ts`): cada pedido de la vitrina descuenta o reserva stock según su estado; las reservas vencidas no cuentan.
- Los pedidos de la demo pasan de `#T-1035…1047` a `#TL-1035…1047`, y sus rutas, de `/panel/pedidos/t-…` a `/panel/pedidos/tl-…`.
