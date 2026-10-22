# Módulo 9 · Mi tienda

Implementación de la decisión 0003, texto aprobado compartido por Gabi el 16-oct-2026. Base: main; sin dependencias de los PR #3–#8.

- Free: Neutral, Editorial y Suave; acentos Del tema, Negro, Terracota, Rosa y Oliva. Se reutilizan los modos `data-theme` y `accent-option/*/fill` y `/contrast` existentes, sin cambiar tokens.
- Logo y portada (JPG, PNG o WebP, hasta 1 MB cada uno), bienvenida de 80 caracteres, Instagram, WhatsApp y horario opcionales.
- Pro: color, tipografías y dominio bloqueados. «Ver planes» abre un detalle real, sin inventar precios ni contratación. Las demás funciones Pro solo se enumeran en ese detalle, según la actualización de 0003.
- Vista previa en vivo con selector Celular/Computadora en desktop; pantalla completa y guardado fijo en móvil. Elegir acento modifica las variables del acento dentro de la vitrina, sin afectar el panel.
- Guardado simulado en localStorage (`tiendly:mi-tienda:heather`), solo en este navegador. Todavía no publica cambios en la vitrina ni sube imágenes a un servidor. Los productos de la vista previa son una muestra del catálogo Heather.
- Carga, datos, personalización vacía y error. Escenarios `?escenario=vacio|error` solo en desarrollo/previews.

Se mantiene el sistema visual vigente de main (0020), por pedido expreso de partir de esa rama y respetar el congelamiento estético. La implementación inicial se hizo desde la descripción aprobada de 0003. Después se revisó MT1 con contexto completo y captura de Figma; [revisión, correcciones y límites](revision-figma-mi-tienda.md).
