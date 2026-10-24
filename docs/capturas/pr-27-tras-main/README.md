# #27 actualizado después de #31

Preview Vercel: https://tiendly-csokdlogy-gaabrielavelasquez-8525s-projects.vercel.app/panel/productos/m6

Código `2e60539`, merge desde main `b6cf172` (#31 autorizado e integrado). #30 ya estaba integrado. El único conflicto fue docs/traspaso.md, conservando el registro completo de ambos trabajos. Sin cambios adicionales de código de producto ni tokens.

Capturas 390×844 y 1440×1000 de la respuesta real Vercel, mediante acceso oficial de `vercel curl` y proxy GET que no modifica HTML/JS/CSS. Los archivos completos permiten revisar las tablas y cabeceras; las capturas de producción son de viewport real.

| Revisión pendiente de Gabi | 390 | 1440 |
|---|---|---|
| Medidas sin Talla y enlace activo | [Editor](editor-sin-talla-390.jpg) | [Editor](editor-sin-talla-1440.jpg) |
| Producto pausado y nota del enlace | [Editor](editor-pausado-390.jpg) | [Editor](editor-pausado-1440.jpg) |
| Medidas de la prenda, sin selector | [Ficha](ficha-sin-talla-390.jpg) | [Ficha](ficha-sin-talla-1440.jpg) |
| Rango sin unidades | [Tabla](editor-por-talla-390.jpg) | [Tabla](editor-por-talla-1440.jpg) |
| Rango incompleto: error sin guardar | [Error](editor-error-390.jpg) | [Error](editor-error-1440.jpg) |
| Calzado: dos columnas | [Guía](guia-calzado-390.jpg) | [Guía](guia-calzado-1440.jpg) |
| Producto nuevo: enlace deshabilitado | [Editor](editor-nuevo-390.jpg) | [Editor](editor-nuevo-1440.jpg) |

Validación local tras integrar main: tokens y build con Webpack aprobados. Chrome/WebKit a 360/390/1440: números/rangos y limpieza de unidades, medidas sin Talla, enlace activo/pausado/nuevo, error de rango, calzado y ausencia de scroll horizontal. Guardado/recarga y cambio de slug comprobados en memoria local sin Redis. El build habitual Vercel con Turbopack y tokens pasa.

## Confirmación de producción del #31

Fuente: https://tiendly-web-sigma.vercel.app/panel/pedidos, despliegue READY del merge `b6cf172754bd727147bac54c771ec9bdd9de1f2a`.

[Chrome a 390×844](pedidos-produccion-chrome-390.jpg), [WebKit a 390×844](pedidos-produccion-webkit-390.jpg), [resultados](pedidos-produccion.json). Respuesta 200, MUÑA sin pedidos, vacío correcto y tab bar visible. Sin scroll horizontal. Solo lecturas GET; no se crean pedidos ni se modifica Redis de producción.

#27 queda abierto y sin merge, pendiente de revisión de Gabi. No se inicia otra tarea. Servidores de pruebas propios cerrados; 3100 y checkout principal intactos.
