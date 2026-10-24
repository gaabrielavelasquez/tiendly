# 0037 · MUÑA: catálogo y miniaturas de color

- **Fecha:** 24-oct-2026.
- **Estado:** solicitado por Gabi para la actualización del catálogo MUÑA.

## Decisión

1. MUÑA mantiene el tema Editorial y usa el acento Terracota existente, también en la vista previa del registro.
2. La ficha muestra las opciones de color con la primera foto de cada galería. Las opciones sin stock se ven tachadas con una cruz y no se pueden seleccionar. Sin fotos, se conserva el selector anterior.
3. Botín Saya combina Color (Camel en gamuza o Vino en cuero) y Talla. Cambiar de color cambia su galería. Guantes Killa y Slingback Inti se suman al catálogo; Cartera Wari tiene una segunda foto.
4. Se conservan la oferta de Falda Lluvia y las tablas de tallas existentes. No cambian los tokens.

## Consecuencias

- Fotos de catálogo optimizadas a WebP; originales locales en `fotos-originales/muna/` (ignorados por Git).
- Tras el merge aprobado por Gabi, queda pendiente reiniciar únicamente `production:tienda:muna` en Redis para cargar la nueva semilla. No se ejecuta como parte del PR.
