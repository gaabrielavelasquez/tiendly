# #27 · ajustes finales

Preview Vercel, código `1834d47`: https://tiendly-14ble200s-gaabrielavelasquez-8525s-projects.vercel.app/panel/productos/m6

Build habitual y check:tokens verdes. Capturas de viewport 390×844 y 1440×1000, servidas desde Vercel sin modificar las respuestas mediante el acceso oficial de `vercel curl`.

| Vista | 390 | 1440 |
|---|---|---|
| Ayuda bajo el nombre de opción | [Captura](ayuda-opcion-390.jpg) | [Captura](ayuda-opcion-1440.jpg) |
| Destino sin Talla | [Captura](destino-medidas-390.jpg) | [Captura](destino-medidas-1440.jpg) |
| Destino dentro de Talla | [Captura](destino-con-talla-390.jpg) | [Captura](destino-con-talla-1440.jpg) |
| Título público Medidas | [Captura](ficha-medidas-390.jpg) | [Captura](ficha-medidas-1440.jpg) |

Chrome y WebKit a 360/390/1440: los cuatro nombres pedidos muestran la ayuda, normalizando mayúsculas/espacios; Tamaño solo no la muestra. La ayuda describe el campo y el enlace desplaza al editor único, con y sin Talla. La ficha conserva el plegado y muestra Medidas como texto y nombre accesible de la tabla. Sin scroll horizontal. Solo cambios sin guardar en el navegador para mostrar la ayuda; sin datos de prueba de producción ni reset.

Build local en worktree y tokens aprobados. [Evidencia de las tres ampliaciones anteriores](../pr-27-tras-main/README.md). Gabi autorizó el merge con preview verde.
