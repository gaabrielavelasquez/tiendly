# Cerrar sesión · #32

Preview Vercel del código `78d905b`: https://tiendly-auginlbq2-gaabrielavelasquez-8525s-projects.vercel.app/panel/pedidos

Rama `feat/cerrar-sesion`, desde main `03902bb` (merge aprobado de #27). Build local con Webpack, tokens y build habitual Turbopack de Vercel aprobados. Sin dependencias ni tokens nuevos.

| Estado | 390×844 | 1440×1000 |
|---|---|---|
| Menú de cuenta | [Captura](menu-390.jpg) | [Captura](menu-1440.jpg) |
| Confirmación con opción segura | [Captura](confirmacion-390.jpg) | [Captura](confirmacion-1440.jpg) |
| Cerrando sesión | [Captura](carga-390.jpg) | [Captura](carga-1440.jpg) |
| Error y reintento | [Captura](error-390.jpg) | [Captura](error-1440.jpg) |
| Primer paso después del cierre | [Captura](registro-390.jpg) | [Captura](registro-1440.jpg) |

Las imágenes son de viewport real, desde las respuestas de Vercel. Acceso oficial mediante vercel curl; proxy que conserva HTML/JS/CSS y Set-Cookie. GET del preview y POST limitado a /panel/pedidos para ejecutar únicamente la acción de cierre de cookie. El navegador de prueba recuerda Glow Labo con una cookie ficticia; no se crean tiendas ni se modifican productos, pedidos, pagos o Redis.

Chrome y WebKit, local y preview, a 360×844, 390×844 y 1440×1000:

- Menú nativo, Configuración conserva su enlace; clic fuera y Escape cierran el menú.
- Seguir en la tienda recibe el foco inicial. Escape, Cerrar y Conservar no eliminan el recuerdo de tienda.
- En carga se deshabilitan las acciones y Escape no cierra. La falla de red se simula abortando esa petición en el navegador de prueba; muestra error y permite reintentar, con cookie y borrador intactos.
- Confirmar elimina la cookie HttpOnly mediante la API del servidor y borra el borrador del onboarding en esta pestaña. Vuelve a /registro y conserva el primer paso después de recargar.
- Otra cookie, otras claves de almacenamiento y el carrito ficticio permanecen intactos. Sin scroll horizontal, también con la URL larga del preview.

No se cambia el acceso de demo ni se añade autenticación real: se cierra el recuerdo de tienda de la sesión simulada existente. Sin merge de #32. Onboarding 2–4 queda para después de la revisión de Gabi.
