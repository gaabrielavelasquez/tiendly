# 0034 · Ofertas: precio antes, fechas y "Poner en oferta" en lote

- **Fecha:** 23-oct-2026 (ronda 2 del prototipo, el mismo día).
- **Estado:** aceptada (Gabi). Las pantallas siguen en propuesta (PR #22, prototipo), pendientes de su ok antes de programarlas.
- **Actualiza:** 0027 (la selección masiva deja de ser solo de desktop) y amplía el "precio de comparación" que 0027 mantuvo.

## Contexto

Quien vende por WhatsApp e Instagram arma ofertas todo el tiempo: fin de mes, Cyber, liquidación de una talla o un color. Hoy el producto tiene un "precio de comparación" opcional, pero no se puede programar, la tienda no muestra dónde están las ofertas y no hay forma de poner varios productos en oferta a la vez, menos en el celular, que es donde se trabaja.

## Decisión

1. **Precio antes (Plan Free).** Opcional en cada producto. Si es mayor que el precio, la tienda muestra el precio antes tachado, el precio nuevo y una etiqueta con el descuento ("−26 %").
   - "Precio antes" es el precio **normal** y "Precio", el de oferta. Antes del inicio y después del fin se cobra el normal, sin tachado ni etiqueta.
   - La etiqueta usa el color de **selección del tema** (carbón en Neutral y Editorial; el de Suave en Suave), no rojo.
   - **Soles enteros:** los campos de precio no llevan decimales ni "0.00"; vacíos, con un ejemplo ("Ej.: 89"). En lote, el precio de oferta se redondea al sol.
   - **Accesibilidad:** el precio tachado lleva texto oculto ("Precio anterior: S/ 89") y la etiqueta, "Descuento de 22 %".
2. **Fechas opcionales:** inicio (para programar) y fin, calculadas con la hora de Lima al mostrar. **Las fechas solo se ven en el panel**, nunca en la tienda (ni en la tarjeta, ni en el producto, ni en la sección). En el panel: "Hasta el domingo 25.", "Termina hoy." (texto de color, regla de urgencia de 0031) y "Terminó el 20 de octubre.".
   - Ayudas: "Si lo dejas vacío, empieza hoy." y "Si lo dejas vacío, dura hasta que borres el precio antes." (igual en el formulario y en la hoja de lote).
   - Una oferta **programada** lleva el badge "Programada"; una **terminada** no se borra sola: queda "Terminó el …" y se vende al precio normal.
3. **Sección de ofertas en la tienda,** automática y solo si hay productos en oferta ese día. Su **nombre se edita en Mi tienda** (Plan Free): "Ofertas" por defecto, sugerencias SALE, Cyber Wow, Liquidación y Fin de temporada, o un texto propio (hasta 20 caracteres). Aparece también como **link en el menú** de la tienda, primero, junto a las categorías.
4. **Cupón sobre el precio de oferta.** La oferta es **por producto**, no por variante. La página de producto no explica el cupón: se ve en el carrito.
5. **Panel › Productos:**
   - Filtro **"En oferta"**: activas y programadas.
   - En lote, en desktop y en móvil: **Poner en oferta** (descuento en % o precio fijo, fechas opcionales), **Quitar oferta** y Pausar, con "Deshacer".
   - **Móvil, modo selección:** sin casillas por defecto. "Seleccionar" (o mantener presionado un producto) las muestra. Barra fija abajo con la acción principal **"Poner en oferta (3)"** y **"Más"** (Pausar, Quitar oferta). **Una sola salida: "Cancelar"**, arriba, donde estaba "Seleccionar". Actualiza 0027 ("Selección masiva y Exportar: solo en desktop"): Exportar sigue solo en desktop.

## Pantallas (propuesta, PR #22)

- **Formulario de producto:** "Guardar producto" fijo abajo en móvil, siempre visible (por encima de la barra de pestañas). "Agregar opción" ofrece Color, Talla, Tamaño, Tono, Aroma, Material u "Otra". Fotos: "Si las fotos cambian por color, las asignas en Opciones.". Stock en desktop como planilla (opción 1 en filas, opción 2 en columnas); una variante en 0 dice "Agotada".

## Consecuencias

- Modelo: `precioAntes` (ya existe) + `oferta?: { desde?: string; hasta?: string }` (días AAAA-MM-DD de Lima). Una sola función decide el precio vigente (`precioVigente(producto, hoy)`) y la usan la vitrina, el carrito, la compra y los pedidos. Las páginas de la tienda son dinámicas: el estado de la oferta se calcula al pedir la página.
- El total de la compra se recalcula en el servidor con el precio vigente (como hoy): una oferta que termina mientras alguien compra no se cobra.
- Mi tienda suma `nombreOfertas` (texto, opcional) a la configuración de la tienda.
- Sin tokens nuevos: la etiqueta usa el `Badge` existente (`tone="selected"`) y "Programada", el neutro.
- La barra de pestañas del panel se oculta en crear y editar producto (hoy tapa la barra de guardar en móvil).
