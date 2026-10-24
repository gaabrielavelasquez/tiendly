# Mi tienda · datos reales y miniaturas · #34

Última ronda solicitada por Gabi. Código funcional `8ad9767`, preview verde:
https://tiendly-gwdmopb9g-gaabrielavelasquez-8525s-projects.vercel.app/panel/mi-tienda

Antes: preview del código `3a6e3ce`, capturas originales de la ronda previa de #34 (sin editar imágenes). Después: capturas nuevas del preview indicado arriba. Primero 390×844, después 1440×1000; comprobación adicional a 360×844. Las capturas completas conservan la posición inicial de la tab bar fija; al desplazarse permanece en el borde del viewport.

| Vista | Antes 390 | Antes 1440 | Después 390 | Después 1440 |
|---|---|---|---|---|
| Mi tienda | [390](before/mi-tienda-390.jpg) | [1440](before/mi-tienda-1440.jpg) | [390](after/mi-tienda-390.jpg) | [1440](after/mi-tienda-1440.jpg) |
| Vista previa propia | — | — | [390](after/preview-390.jpg) | [1440](after/preview-1440.jpg) |
| Vacío | — | — | [390](after/vacio-390.jpg) | [1440](after/vacio-1440.jpg) |
| Error | — | — | [390](after/error-390.jpg) | [1440](after/error-1440.jpg) |

MUÑA carga Editorial, Terracota, su portada real y «Piezas para usar mucho». Logo, Instagram y horario se muestran vacíos cuando no están guardados; no se inventa contenido. Miniaturas con portada y productos activos propios; si no hay productos, muestras según rubro con nota explícita, sin guardarlas. Ayudas únicas para logo/portada y sin contenedor gris en el ícono.

La identidad publicada vive ahora en el mismo documento de tienda del almacén existente: servidor → formulario/preview/vitrina. WhatsApp y ofertas se guardan junto con ella, en una sola escritura validada en servidor. Los borradores locales antiguos no pisan datos reales. Los documentos previos conservan la identidad pública mediante compatibilidad en lectura, sin reset ni escritura de migración. El tema/acento se aplica también a ficha y checkout; portada/logo, Instagram y horario se publican en la vitrina. Pro conserva su banner con la portada propia.

Validación local sin Redis, puerto 3205: Chrome y WebKit a 390/1440/360, tema/acento, logo/portada, bienvenida, Instagram y horario guardados/recargados y leídos desde otro contexto sin localStorage; imagen/formato/tamaño inválidos; borrado explícito de imágenes/textos; fallo de red y reintento; rechazo del servidor a configuración inválida. Tiendas vacías locales con rubro Hogar muestran taza/florero en las tres miniaturas; la vista completa conserva el estado vacío sin inventar productos. MUÑA local confirma publicación en catálogo/ficha/checkout y eliminación de portada sin recuperarla desde el valor original.

Vercel: solo lecturas y cambios temporales en el navegador, sin guardar datos del servidor. [Resultados](resultado-preview.json) de Chrome/WebKit a 390/1440/360, datos de MUÑA, miniaturas, ayudas únicas, preview, vacío/error y sin scroll horizontal. `check:tokens` y build local/Vercel pasan. Sin cambios de producción, reset de Redis, mensajes o cobros. #34 queda sin merge para revisión.
