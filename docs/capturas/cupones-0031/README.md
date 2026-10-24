# Cupones · #36

Antes Vercel main 4ab96fa: https://tiendly-ju9e56qi3-gaabrielavelasquez-8525s-projects.vercel.app.
Después Vercel 959ee34: https://tiendly-7409w0n62-gaabrielavelasquez-8525s-projects.vercel.app.
Ambas previews usan Heather solo en ese despliegue para mostrar sus cinco cupones, sin cambiar variables del proyecto. Capturas originales, primero 390×844 y luego 1440×1000.

| Pantalla | Antes | Después |
|---|---|---|
| Lista | [390](before/lista-390.jpg) · [1440](before/lista-1440.jpg) | [390](after/lista-390.jpg) · [1440](after/lista-1440.jpg) |
| Crear | [390](before/crear-390.jpg) · [1440](before/crear-1440.jpg) | [390](after/crear-390.jpg) · [1440](after/crear-1440.jpg) |
| Editar | [390](before/editar-390.jpg) · [1440](before/editar-1440.jpg) | [390](after/editar-390.jpg) · [1440](after/editar-1440.jpg) |
| Límite Free | [390](before/limite-390.jpg) · [1440](before/limite-1440.jpg) | [390](after/limite-390.jpg) · [1440](after/limite-1440.jpg) |
| Eliminar | [390](before/eliminar-390.jpg) · [1440](before/eliminar-1440.jpg) | [390](after/eliminar-390.jpg) · [1440](after/eliminar-1440.jpg) |
| Vacío | [390](before/vacio-390.jpg) · [1440](before/vacio-1440.jpg) | [390](after/vacio-390.jpg) · [1440](after/vacio-1440.jpg) |
| Error | [390](before/error-390.jpg) · [1440](before/error-1440.jpg) | [390](after/error-390.jpg) · [1440](after/error-1440.jpg) |
| Validación | [390](before/validacion-390.jpg) · [1440](before/validacion-1440.jpg) | [390](after/validacion-390.jpg) · [1440](after/validacion-1440.jpg) |

Carga: [390](after/carga-390.jpg) · [1440](after/carga-1440.jpg). Capturas completas conservan la posición inicial de la barra fija; el padding permite llegar al final por encima de ella. La barra de pestañas se oculta en formulario/lista con acción fija.

Chrome/WebKit locales: crear con 30,90 y preview/guardado 30.90, eliminar con foco seguro, error de red y reintento; límite Free de tres validado por servidor, y pausar libera un lugar. Chrome/WebKit Vercel: lista, vacío, límite, error, crear/validación, editar y confirmación a 390/1440; WebKit también 360 sin scroll. Switch encendido con check. Ninguna acción de guardado en Vercel. Solo memoria local en 3207, sin Redis. Tokens y build pasan; sin merge.
