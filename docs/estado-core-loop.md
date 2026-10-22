# Estado del Core Loop · Figma vs. código

- **Fecha:** 16-oct-2026
- **Figma:** `zHR0uS37OATafFq7U4NEwr`, página **Flujos** (`1:65`), módulos 1–10 (todos marcados 🟢 aprobados).
- **Código:** rama `chore/rules` (incluye productos, pedidos y vitrina; PR #3).
- **Decisiones:** 0007–0012 viven en el proyecto "IA on Product Design" y **no están en el repo**, así que no se pudieron leer completas. Se usaron las referencias que hay en el código (0010 reservas de 24 h, 0011 productos, 0012 Inicio con tareas primero, 0013 temas) y `docs/decisiones/` (addendum 0013, 0020–0026).
- Según 0026, Figma manda en **flujos y estructura**; lo visual (colores, radios, sombras) no se compara aquí.

## Resumen

| Estado | Módulos |
|---|---|
| Hecho | 1 Checkout y Carrito (pago simulado) · 8 Inicio · 10 Onboarding |
| Parcial | 5 Home y Producto · 6 Pedidos · 7 Productos |
| Falta | 2 Métodos de pago y Entregas · 3 Cupones · 4 Afiliación · 9 Mi tienda |

El Core Loop **no se puede cerrar todavía**: ya se puede comprar (módulo 1), pero sin Métodos de pago y Entregas (módulo 2) la tienda no puede configurar cómo cobra ni cómo envía; hoy eso vive en `checkout/lib/config.ts`.

## Por módulo

| # | Módulo | Pantallas en Figma (móvil · desktop) | Ruta en código | Estado | Qué falta |
|---|---|---|---|---|---|
| 1 | Checkout y Carrito | **Móvil:** flujo 1 Carrito, 2 Checkout (inicio, entrega, tarjeta, Yape, WhatsApp), 3a/3b Confirmación; estados C0–C5, K0–K5, E1–E3; variantes 3a-R/3a-C/3b-R/3b-C. **Desktop:** D1, D2, D5a/D5b; estados D1-S, D1-C1–C3c. | `/[tienda]/carrito`, `/[tienda]/checkout` y `/[tienda]/pedido/[numero]` | **Hecho** (pago simulado) | El cobro real llega con Afiliación (módulo 4). Los pedidos llegan a Panel › Pedidos por un almacén simulado en memoria (se borra al reiniciar el servidor). "Descargar resumen (PDF)" usa imprimir → guardar como PDF. |
| 2 | Métodos de pago y Entregas | **Móvil:** Métodos de pago (sin pasarela, pagos activos) + E1–E7; Entregas (configurado, primera vez, guardado, errores, regla de al menos una). **Desktop:** los mismos + DE1–DE6. | Ninguna (`features/pagos` y `features/entregas` vacías). `/panel/configuracion` da 404. | **Falta** | Todo. Ojo: Figma no tiene un ítem "Configuración" propio; hay que definir dónde viven Pagos y Entregas en el menú. |
| 3 | Cupones | **Móvil:** lista vacía, lista, crear, errores, creado, límite Plan Free, eliminar. **Desktop:** las mismas 7. | Ninguna (`features/cupones` vacía). `/panel/cupones` está en el menú y da 404. | **Falta** | Todo. |
| 4 | Afiliación (cobros automáticos) | **Móvil:** A1–A7 + estados A1b–A7b. **Desktop:** AD1–AD5 + estados AD1b–AD7b. | Ninguna (`features/afiliacion` vacía). | **Falta** | Todo (RUC con SUNAT, representante, CCI, revisión, solicitud en revisión u observada). |
| 5 | Home y Producto (vitrina) | **Home:** móvil 390 y desktop 1440. **Producto:** móvil, desktop y tabla de tallas en cada uno. | `/[tienda]` (catálogo) y `/[tienda]/[producto]` | **Parcial** | **Home:** barra de anuncio ("Envío en Lima S/ 15 · llega el mismo día"); ícono de búsqueda en la cabecera (logo y menú ya siguen Figma, 0027); nav desktop Zapatos · Sobre Heather · Envíos y cambios · Contacto; badge "MÁS VENDIDO"; búsqueda; botón flotante de WhatsApp; secciones "Sobre Heather" y "¿Tienes alguna duda?"; pie con Envíos · Cambios · Contacto. **Producto:** la tabla de tallas es un desplegable y en Figma es una pantalla o modal propio. |
| 6 | Pedidos | **Móvil:** P1 lista, P2–P6 detalle por estado, P4 hoja "en camino", P7 pagado con Deshacer. **Desktop:** PD1 lista, PD2–PD3 detalle en panel lateral. | `/panel/pedidos` y `/panel/pedidos/[id]` | **Parcial** | Pestañas de Figma: Pendientes · Por enviar · En camino · Finalizados (el código usa Todos · Para atender · Por cobrar · Vencen hoy · Por enviar). Estados "Por preparar → Listo → En camino → Entregado" y "Listo para recoger" (el código tiene por enviar → enviado → entregado). Hoja "Marcar como en camino" con empresa de envío, código de seguimiento y mensaje por WhatsApp. "Restablecer reserva" en cancelados. Deshacer al marcar como pagado. Aviso "Venció la reserva… Liberamos el stock". Detalle en **panel lateral** en desktop (el código abre una página aparte). Número `#TL-` (el código usa `#T-`). |
| 7 | Productos | **Móvil:** PR1 lista, PR2 hoja de stock, PR3 nuevo producto, PR4 precios por variante y a pedido. **Desktop:** PRD1 lista, PRD2 panel lateral de stock, PRD3 nuevo producto en 2 columnas. | `/panel/productos`, `/panel/productos/nuevo` y `/panel/productos/[id]` | **Parcial** | Estados de Figma: Activo · Agotado · **Pausado** · **A pedido** (el código: activo · borrador · archivado; filtros Todos · Activos · Bajo stock · Agotados). Producto **a pedido** con "Listo en N días". **Hoja / panel de stock** por color y talla. Precio único con **excepciones** por variante (el código pide precio por cada variante). Tallas marcadas antes de cargar stock ("Continuar con el stock"). Columna "Visible" en desktop. |
| 8 | Inicio | **Móvil:** I1 con actividad, I2 tienda nueva. **Desktop:** ID1, ID2. | `/panel` | **Hecho** | Nada de estructura. Tiene extras (ver abajo). |
| 9 | Mi tienda | **Móvil:** MT1 personalizar, MT2 vista previa. **Desktop:** MTD1 con vista previa en vivo. | Ninguna (`features/mi-tienda` vacía). `/panel/mi-tienda` está en el menú y da 404. | **Falta** | Todo: tema, color de acento, logo, portada, texto de bienvenida, contacto, horario y bloque Pro. |
| 10 | Onboarding | **Móvil:** O1–O4. **Desktop:** OD1–OD4. | `/registro` | **Hecho** | Nada. El cambio a rubros múltiples y tema Neutral está registrado (addendum 0013). |

## En el código, pero no en Figma ni en una decisión

**Resuelto en [0027](decisiones/0027-limpieza-core-loop.md)** (16-oct-2026): se quitaron la campana, el atajo ⌘K y el ticket promedio; el resto se quedó o se ajustó como dice la decisión. La lista queda como registro.

### Panel (todos los módulos)
1. **Campana de avisos** con punto spark y su link a `/panel/avisos` (da 404). Figma no tiene avisos.
2. **Avatar / zona de cuenta** arriba a la derecha, con link a `/panel/configuracion` (da 404).
3. **Búsqueda con ⌘K / Ctrl+K** (`use-atajo-busqueda.ts`) en Productos y Pedidos. Figma tiene el buscador, no el atajo.
4. **Menú lateral colapsable** que se recuerda. Figma lo muestra en DE4 (Métodos de pago), pero no hay decisión.
5. **Ítem "Configuración"** en el menú. Figma lo muestra, pero no tiene pantallas.

### Inicio
6. **Ticket promedio** dentro de la tarjeta Hoy (vidrio).
7. **Botón "Nuevo producto"** en la cabecera de Inicio (ID1 solo tiene "Compartir mi tienda por WhatsApp").
8. **Botones "Ver detalle"** en "Para atender hoy" (Figma usa chevron).
9. **Íconos por tipo** en "Para atender hoy" (Figma usa puntos de color).
10. **Barra de progreso lineal** por segmentos en tienda nueva.

### Productos
11. **Selección masiva** con casillas y barra de acciones.
12. **Acciones por fila:** Editar, Duplicar, Archivar (con Deshacer).
13. **Estado "Borrador" y "Archivado"** y el filtro **"Bajo stock"** (Figma: Pausado y A pedido).
14. **SKU** por variante y **"Precio de comparación"** (precio tachado).
15. **Editor de descripción con formato** (Figma: texto simple).
16. **Tarjeta "Organización"** con categorías (Balerinas, Tacos, Botas, Plataformas). Figma no tiene categorías en el formulario.

### Pedidos
17. **Botón "Exportar".**
18. **Tarjeta "Historial"** (línea de tiempo) en el detalle.
19. **Tarjeta "Notas"** privadas en el detalle.
20. **Correo del cliente** en el detalle.
21. **Contra entrega** como método de pago, con "Marcar como entregado y cobrado".
22. **Filtro "Vencen hoy"** (reservas); coincide con el número de Inicio, pero las pestañas no son las de Figma.

### Vitrina
23. **Portada con texto encima y CTA** ("Otoño · Invierno 2026", "Nueva colección", "Explorar colección"). En Figma la foto va sola y el titular debajo, sin botón. Además, DESIGN.md §5 lista la portada con overlay como función **Pro**.
24. **Categorías Balerinas · Tacos · Botas · Plataformas** y 8 productos (Figma: Ballerinas · Tacón · Botines y 5 productos).
25. **Pills de categoría fijas** al hacer scroll.
26. **Cabecera con logo a la izquierda** en móvil (Figma: centrado, con menú y búsqueda).
27. **Punto spark en el carrito.**

### Otros
28. **Página `/kit`** (vitrina de componentes para desarrollo).
29. **Escenarios simulados** con `?escenario=` (vacío, error, etc.) para probar estados.

## Siguiente paso sugerido

Para cerrar el Core Loop, en este orden: **1 Checkout y Carrito** → **2 Métodos de pago y Entregas** → completar **6 Pedidos** (estados y hoja "en camino") y **7 Productos** (stock, a pedido, pausado). Cupones, Afiliación y Mi tienda pueden ir después.
