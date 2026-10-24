# 0038 · MUÑA: catálogo y miniaturas de color

- **Fecha:** 24-oct-2026.
- **Estado:** solicitado por Gabi para la actualización del catálogo MUÑA.

## Decisión

1. MUÑA mantiene el tema Editorial y usa el acento Terracota existente, también en la vista previa del registro.
2. La ficha muestra las opciones de color con la primera foto de cada galería. Las opciones sin stock se ven tachadas con una cruz y no se pueden seleccionar. Sin fotos, se conserva el selector anterior.
3. Botín Otoño combina Color (Camel en gamuza o Vino en cuero) y Talla. Cambiar de color cambia su galería. Guantes Malbec y Slingback Brillo se suman al catálogo; Cartera Cher tiene una segunda foto.
4. Nombres solicitados por Gabi: Cartera Cher (fashion-3 + bolso-detalle), Cartera Noche (fashion-7), Slingback Brillo, Botín Otoño, Chompa Bruma, Falda Lluvia, Conjunto Arena y Guantes Malbec. Las URLs se derivan de esos nombres; las siete URLs anteriores redirigen permanentemente (308), solo en MUÑA. Los IDs de producto se mantienen para conservar los carritos existentes.
5. Se conservan la oferta de Falda Lluvia y las tablas de tallas existentes. No cambian los tokens.

## Consecuencias

- Fotos de catálogo optimizadas a WebP; originales locales en `fotos-originales/muna/` (ignorados por Git).
- Tras el merge aprobado por Gabi, queda pendiente reiniciar únicamente `production:tienda:muna` en Redis para cargar la nueva semilla. No se ejecuta como parte del PR.
