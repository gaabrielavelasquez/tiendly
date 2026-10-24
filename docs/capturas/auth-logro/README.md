# Último ajuste de Tienda creada · #33

Antes: Vercel, código funcional 6eea253 (head d59874d solo añade evidencia/documentación). Capturas originales sin edición de imagen.
https://tiendly-qnzrju0m5-gaabrielavelasquez-8525s-projects.vercel.app/registro

Después: Vercel, código 67963b1.
https://tiendly-ca14p3ri7-gaabrielavelasquez-8525s-projects.vercel.app/registro

| Vista | Antes | Después |
|---|---|---|
| 390×844 | [Ver](before/creada-390.jpg) | [Ver](after/creada-390.jpg) |
| 1440×1000 | [Ver](before/creada-1440.jpg) | [Ver](after/creada-1440.jpg) |

Mismo componente TiendaDatosPreview en Datos y Tienda creada, con nombre, link y productos por rubro, y nota Productos de muestra. El link confirmado abre la tienda en una pestaña nueva. Las muestras no se guardan en catálogo.

Halo bg-halo-logro centrado geométricamente en la tarjeta, con capas glow-sky/glow-warm y desvanecido CSS en cuatro bordes. Sin valores de color nuevos, blur, destellos o cambios al halo del registro/Inicio. Se mantiene reducir movimiento.

Continuidad visual: [Datos hogar 390](after/datos-hogar-390.jpg) → [Tienda creada 390](after/creada-390.jpg), [Datos hogar 1440](after/datos-hogar-1440.jpg) → [Tienda creada 1440](after/creada-1440.jpg); [Datos multirrubro 390](after/datos-multi-390.jpg) → [Creada 390](after/creada-multi-390.jpg), [Datos multirrubro 1440](after/datos-multi-1440.jpg) → [Creada 1440](after/creada-multi-1440.jpg).

Estado de sesión ficticio Casa Nube y teléfono 900000000; sin crear tiendas ni productos en el preview, sin tocar Redis. Se conservan las cuatro acciones y el flujo de creación ya verificado en memoria local. WhatsApp/código/ingreso siguen simulados; no se envían mensajes.

Chrome/WebKit en Vercel pasan 390×844, 1440×1000 y 360×844: se comparan nombres/precios/fotos de las muestras en Datos y Tienda creada para hogar y selección múltiple, enlace confirmado, nota, centro exacto del halo respecto de la tarjeta, máscara CSS, nombres/URL largos y ausencia de scroll horizontal. [Resultados](resultado-preview.json). [Safari 390](after/creada-webkit-390.jpg) · [Safari 1440](after/creada-webkit-1440.jpg). Se conservan y comprueban copiar, wa.me sin abrir y navegación al formulario.

Tokens y build local/Vercel pasan. Sin merge; revisión de Gabi pendiente.
