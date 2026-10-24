# #27 · Medidas únicas y enlace a la tienda

- Preview: https://tiendly-iwau3gcyb-gaabrielavelasquez-8525s-projects.vercel.app
- Código: `bbecd23` (incluye main con #30 integrado).
- Capturas de Vercel en Chrome a 390 y 1440. Acceso autenticado mediante `vercel curl`, sin exportar variables ni credenciales. Las fotos se cargan antes de capturar.

Vistas: editor sin Talla, enlace deshabilitado al pausar, ficha sin selector, editor por talla con rango limpio, error de rango incompleto, guía de calzado y producto nuevo.

Las ediciones de campo y el estado pausado de las capturas son cambios sin guardar. El error de rango se muestra antes de llamar al servidor. No se escribe en producción.

Cartera Cher ilustra el caso sin Talla con medidas ficticias de la semilla. En local se probó también una prenda única: Chompa Bruma sin ninguna opción, medidas guardadas/recargadas y compra sin selector.

Validación local: Chrome/WebKit 360/390/1440, unidades y rangos, persistencia, copia independiente, null/guía heredada, pausa/activación, quitar medidas, nuevo producto, slug guardado y nueva pestaña. check:tokens y build local con Webpack pasan; build habitual en Vercel aprobado. Chrome y WebKit completaron también el preview final a 360/390/1440 sin scroll horizontal, con unidades abreviadas con punto y valores largos. La prueba de error conserva el borrador y evita el guardado.

Sin nuevos tokens ni dependencias. Sin reset de Redis, mensajes, pedidos ni cobros reales. #27 sigue abierto, pendiente de revisión de Gabi.
