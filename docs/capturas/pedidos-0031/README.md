# Pedidos · pase 0031

- Antes, código de main `3298c2b`: https://tiendly-k2q13flil-gaabrielavelasquez-8525s-projects.vercel.app/panel/pedidos
- Después, código `fadc778`: https://tiendly-774d7ttio-gaabrielavelasquez-8525s-projects.vercel.app/panel/pedidos
- Capturas en Chrome a 390 y 1440. Las dos son previews aisladas con la demo Heather; no se cambió ninguna variable del proyecto o de producción.

`before/` y `after/`: lista, detalle pagado, reserva, vacío y error. `after/` también muestra carga de lista/detalle, detalle inexistente y error del detalle.

Acceso mediante `vercel curl`, sin exportar credenciales. Las capturas de carga se obtienen durante la respuesta progresiva real de Vercel a través de un proxy local de solo lectura; no se modifica el HTML. El proxy no admite escrituras. Se precargan las fuentes y se captura sin esperar nuevamente a ellas, para que la resolución de datos no oculte el skeleton.

Las fotos de Heather se excluyen del despliegue por `.vercelignore`; no se publicaron. Antes aparecen imágenes ausentes; después se conserva el espacio con el icono neutro. Los contactos de los nuevos fixtures son ficticios (900000… y example.com). Las tiendas y pedidos de producción no cambian.

## Validación

- `check:tokens` y build local con Webpack aprobados. Build habitual con Turbopack aprobado en Vercel.
- Chrome y WebKit: once rutas a 360/390/1440 sin scroll horizontal. Filtros, búsqueda, cuatro estados de entrega/pago, barra fija móvil y enlaces `wa.me` comprobados sin abrir WhatsApp.
- Local, sin Redis: confirmar pago manualmente, deshacer, cancelar, guardar notas y recargar; exportar CSV y abrir el detalle tocando la fila de desktop.
- Comprobación independiente de 0010: límite exacto de 24 h, auto-cancelación, excepción contra entrega, entrega/recojo y avisos `wa.me` por estado. La lógica y sus hooks no cambian.
- Textos largos y precios altos inyectados solo en el navegador local después de la hidratación, sin persistirlos: nombre del cliente/producto, URL real de preview, número de pedido largo y S/ 987,654.00. Sin scroll horizontal en 360/390/1440, Chrome y WebKit.
- Carga real visible en Chrome; WebKit puede agrupar el stream y pasar directamente al dato, pero conserva los fallbacks SSR de ambas vistas.

Pagos, bancos, entregas y contactos siguen simulados. No se enviaron mensajes, pedidos ni cobros. Sin merge: espera revisión de Gabi.
