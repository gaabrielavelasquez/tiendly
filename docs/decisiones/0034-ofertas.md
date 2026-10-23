# 0034 · Ofertas: precio antes, fechas y "Poner en oferta" en lote

- **Fecha:** 23-oct-2026
- **Estado:** aceptada (Gabi). El diseño de pantallas espera su ok sobre la propuesta (PR 3 de la auditoría multirubro).
- **Actualiza:** 0027 (la selección masiva deja de ser solo de desktop) y amplía el "precio de comparación" que 0027 mantuvo.

## Contexto

Quien vende por WhatsApp e Instagram arma ofertas todo el tiempo: fin de mes, Cyber, liquidación de una talla o un color. Hoy el producto tiene un "precio de comparación" opcional, pero no se puede programar, la tienda no muestra dónde están las ofertas y no hay forma de poner varios productos en oferta a la vez, menos en el celular, que es donde se trabaja.

## Decisión

1. **Precio antes (Plan Free).** Opcional en cada producto. Si es mayor que el precio, la tienda muestra el precio antes tachado, el precio nuevo y una etiqueta con el descuento ("−26 %").
2. **Fechas opcionales:** inicio (para programar) y fin. Se calculan al mostrar la página, con la hora de Lima. Sin cuenta regresiva: como mucho, "Hasta el domingo 27". El último día, "Termina hoy" como texto de color (`feedback/warning`, regla de urgencia de 0031).
   - Antes del inicio y después del fin, el producto se vende a su **precio antes** (el normal), sin tachado ni etiqueta.
3. **Sección "Ofertas"** automática en la tienda, solo si hay productos en oferta en ese momento.
4. **Cupón sobre el precio de oferta.** La oferta es **por producto**, no por variante: todas las variantes comparten el precio de oferta.
5. **Panel › Productos:**
   - Filtro **"En oferta"** (activas y programadas).
   - **Poner en oferta en lote**, en desktop y en móvil: descuento en % o precio fijo, más fechas opcionales.
   - **Móvil, modo selección:** sin casillas por defecto. "Seleccionar" (o mantener presionado un producto) las muestra; una barra fija abajo muestra "Poner en oferta (3)" y "Cancelar" sale del modo. Actualiza 0027 ("Selección masiva y Exportar: solo en desktop"): la selección y "Poner en oferta" pasan a móvil; Exportar sigue solo en desktop.

## Consecuencias

- Modelo: `precioAntes` (ya existe) + `oferta?: { desde?: string; hasta?: string }` (días AAAA-MM-DD de Lima). Una sola función decide el precio vigente (`precioVigente(producto, hoy)`) y la usan la vitrina, el carrito, la compra y los pedidos.
- El total de la compra se recalcula en el servidor con el precio vigente (como hoy): una oferta que termina mientras alguien compra no se cobra.
- La etiqueta de descuento usa el `Badge` existente (`tone="selected"`: carbón, o el color de selección del tema). Sin tokens nuevos.
- El diseño de las pantallas (formulario con "Agregar opción", lista con modo selección y la tienda) se propone en un prototipo navegable antes de programarlo.
