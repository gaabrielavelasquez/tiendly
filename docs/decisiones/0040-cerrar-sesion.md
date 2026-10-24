# 0040 · Cerrar sesión desde la cuenta

- **Fecha:** 24-oct-2026.
- **Estado:** aprobado e integrado en #32 (`c0f4682`); el pase visual completo continúa en 0041.
- **Aplica:** menú del círculo con inicial en todas las cabeceras del panel; conserva 0031 y 0032.

## Comportamiento

- El círculo abre un menú con Configuración (mismo destino anterior) y Cerrar sesión. Disclosure nativo accesible por teclado; clic fuera o Escape cierra el menú.
- Cerrar sesión abre la hoja/modal nativo existente. Foco inicial en Seguir en la tienda; esa acción, Cerrar y Escape no modifican la sesión.
- Sí, cerrar sesión elimina en el servidor la cookie HttpOnly `tiendly_tienda` con el mismo path. Elimina solo el borrador `tiendly:onboarding` de esta pestaña y vuelve a `/registro` con navegación completa, para evitar la caché del router de la sesión anterior.
- No borra la tienda ni sus productos, pedidos o configuración. No limpia carritos ni el resto del almacenamiento del navegador. No escribe en Redis.
- Mientras espera, muestra Cerrando sesión…, deshabilita las acciones y evita cerrar con Escape. Si falla, conserva el recuerdo de tienda y el borrador, muestra error y permite reintentar.
- La sesión actual sigue siendo simulada, basada en la tienda recordada. Esto no añade un sistema de autenticación ni cambia el acceso de demo del panel.

## Revisión

Mobile-first 390×844 y desktop 1440; comprobar 360/390 sin scroll horizontal, Chrome y WebKit. Tokens y build, confirmación segura, carga/error/reintento, cookie eliminada, primer paso del registro después de recargar y conservación de datos ajenos. Capturas desde Vercel en el PR.

Detenerse tras actualizar el PR para revisión de Gabi. El pase de diseño de onboarding 2–4 queda después de esta revisión.
