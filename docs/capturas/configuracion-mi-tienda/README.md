# Configuración y Mi tienda · #34

**Última corrección de Mi tienda:** [datos reales, guardado compartido y miniaturas propias](../mi-tienda-datos-reales/README.md). Esa ronda reemplaza las capturas y el comportamiento de apariencia descritos abajo; el resto de esta galería documenta el pase inicial.

Antes: Vercel de main funcional tras #33, código 993dfa9 (equivalente a main f296d21 para estas pantallas).
https://tiendly-dchpib2zy-gaabrielavelasquez-8525s-projects.vercel.app/panel/configuracion

Después: preview Vercel del código 3a6e3ce.
https://tiendly-e452gb7qz-gaabrielavelasquez-8525s-projects.vercel.app/panel/configuracion

Primero 390×844, después 1440×1000. Capturas de navegador desde Vercel, sin edición de imágenes. Las vistas completas conservan las barras fijas a su posición del viewport inicial; las capturas adicionales del pie comprueban el contenido al llegar al final.

| Pantalla | Antes 390 | Antes 1440 | Después 390 | Después 1440 |
|---|---|---|---|---|
| Configuración | [390](before/configuracion-390.jpg) | [1440](before/configuracion-1440.jpg) | [390](after/configuracion-390.jpg) | [1440](after/configuracion-1440.jpg) |
| Métodos de pago | [390](before/pagos-390.jpg) | [1440](before/pagos-1440.jpg) | [390](after/pagos-390.jpg) | [1440](after/pagos-1440.jpg) |
| Entregas | [390](before/entregas-390.jpg) | [1440](before/entregas-1440.jpg) | [390](after/entregas-390.jpg) | [1440](after/entregas-1440.jpg) |
| Entregas: sin métodos | [390](before/entregas-vacio-390.jpg) | [1440](before/entregas-vacio-1440.jpg) | [390](after/entregas-vacio-390.jpg) | [1440](after/entregas-vacio-1440.jpg) |
| Mi tienda | [390](before/mi-tienda-390.jpg) | [1440](before/mi-tienda-1440.jpg) | [390](after/mi-tienda-390.jpg) | [1440](after/mi-tienda-1440.jpg) |
| Mi tienda: inicio vacío | [390](before/mi-tienda-vacio-390.jpg) | [1440](before/mi-tienda-vacio-1440.jpg) | [390](after/mi-tienda-vacio-390.jpg) | [1440](after/mi-tienda-vacio-1440.jpg) |
| Mi tienda: error | [390](before/mi-tienda-error-390.jpg) | [1440](before/mi-tienda-error-1440.jpg) | [390](after/mi-tienda-error-390.jpg) | [1440](after/mi-tienda-error-1440.jpg) |

Estados y acciones:

- [Delivery sin zonas 390](after/entregas-error-zonas-390.jpg) · [1440](after/entregas-error-zonas-1440.jpg): error inmediato, Guardar deshabilitado y explicación del preview, sin prometer envío gratis.
- [Pie de Entregas 390](after/entregas-final-390.jpg) · [1440](after/entregas-final-1440.jpg): última sección visible sobre la acción fija.
- [Vista en vivo 390](after/mi-tienda-preview-390.jpg) · [1440](after/mi-tienda-preview-1440.jpg): modal móvil y simulación de computadora en desktop.
- [Barra de guardar 390](after/mi-tienda-guardado-390.jpg) · [1440](after/mi-tienda-guardado-1440.jpg): cambios pendientes y navegación sin superposición.
- [Carga 390](after/mi-tienda-carga-390.jpg) · [1440](after/mi-tienda-carga-1440.jpg): estado SSR antes de hidratar, con JavaScript retenido temporalmente para capturarlo.
- [Error Configuración 390](after/configuracion-error-390.jpg) · [1440](after/configuracion-error-1440.jpg), [pagos en revisión 390](after/pagos-revision-390.jpg) · [1440](after/pagos-revision-1440.jpg).

Chrome y WebKit pasan en Vercel a 390×844, 1440×1000 y 360×844, sin scroll horizontal: [resultados](resultado-preview.json). Se comprueban checks de los interruptores, Delivery sin zonas, preview informativo, pie visible sobre la acción fija, modal/preview desktop y guardado de apariencia solo en navegador con regreso de la tab bar.

En Vercel se consultan escenarios de prueba y se modifica solo localStorage del navegador para el preview de apariencia. No se guardan pagos/entregas/contacto/ofertas del servidor ni se crean datos de prueba allí.

En un proceso local con memoria, puerto 3205: guardado y recarga de entregas, campos obligatorios, último método de cobro, guardado inmediato y rollback al fallar/reintento, tema/acento/contacto/ofertas, preview móvil/desktop, imagen guardada/recargada, corrupto/error de almacenamiento con reintento y protección al salir. Tienda ficticia vacía con nombre largo: el preview explica la falta de productos y no muestra importes inventados.

0003/0007/0009 se conservan según las reglas documentadas e implementadas en main. Apariencia sigue guardada por navegador; WhatsApp y ofertas conservan el guardado existente del servidor. Cobros, aprobación y opciones Pro siguen simulados. Sin nuevos tokens, dependencias o persistencia.

#33 ya está integrado y el registro completo se confirmó en producción con una tienda aislada autorizada, sin productos/mensajes. Este PR #34 no modifica producción ni Redis y queda sin merge para revisión de Gabi.
