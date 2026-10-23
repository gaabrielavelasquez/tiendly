# 0032 · Tiendly es multirubro y no tiene género

- **Fecha:** 22-oct-2026
- **Estado:** aceptada (Gabi). Vigente.
- **Actualiza:** 0004 (sigue siendo un producto con variantes, no un producto por variante; las variantes pasan a ser opciones genéricas) y el lenguaje de 0001–0009.

## Contexto

Tiendly nació con Heather, una marca de calzado, y el producto se armó alrededor de ella: el catálogo asume color × talla, la vitrina trae tabla de tallas, los ejemplos y fotos son de moda femenina, y parte de la documentación habla de "vendedora" o "emprendedora". Quien vende por WhatsApp e Instagram en Perú vende de todo: impresiones 3D, decoración, cosmética, skincare y maquillaje importados, ropa, accesorios, vapes, segunda mano. Un producto que se lee como "para mujeres que venden ropa" deja fuera a la mayoría.

## Decisión

1. **Multirubro.** Ningún rubro es el predeterminado. Moda es uno más.
2. **Sin género.** Tiendly no es una marca "para emprendedoras". En la interfaz y en la documentación se dice "la tienda", "quien vende" y "cliente". Nunca "vendedora", "emprendedora", ni adjetivos que marcan a la persona ("lista", "listo", "bienvenida"). Se reformula la frase en vez de usar "@", "x" o "e": "Te damos la bienvenida", no "Bienvenida".
   - "¡Tu tienda está lista!" sigue bien: "lista" concuerda con "tienda", no con la persona. Lo mismo "¡Listo!" como interjección.
3. **Variantes como opciones genéricas.** Un producto tiene hasta 3 opciones (color, talla, tono, tamaño, material, aroma, sabor u otra que escriba la tienda) y una variante es una combinación de valores con su stock. La tabla de tallas solo aparece cuando una opción es talla. Sigue valiendo 0004: un producto con variantes, no un producto por variante.
4. **Ejemplos de varios rubros.** Demos, placeholders, capturas y fotos muestran varias categorías, no solo productos asociados a mujeres.

## Consecuencias

- `CLAUDE.md` §2 y `DESIGN.md` §2 cambian la regla de catálogo y suman la regla de lenguaje sin género.
- Copy de la app y documentos 0001–0009 se limpian de "vendedora" y "emprendedora" (los 0001–0009 viven fuera del repo, en el proyecto "IA on Product Design").
- El modelo de datos, el formulario de producto, la vitrina, el carrito, la compra y los pedidos dejan de asumir color × talla. El plan, con esfuerzo, riesgo y migración de los datos de Heather, está en [`docs/auditoria-multirubro.md`](../auditoria-multirubro.md). No se programa hasta que Gabi lo apruebe.
- La vista previa del registro pasa de una sola tienda de calzado a tres tiendas de rubros distintos (el pase de registro queda como 0033).
