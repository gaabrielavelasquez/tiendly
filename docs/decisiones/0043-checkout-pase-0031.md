# 0043 · Checkout y confirmaciones adoptan 0031

- Fecha: 24-oct-2026.
- Estado: solicitado por Gabi; un PR desde main 4ab96fa. Sin merge autorizado.
- Alcance: Finalizar compra, Pedido confirmado y Pedido registrado. MUÑA (Editorial/Terracota) y Glow Labo (Suave).

## Presentación

Títulos fuera de contenedores, listas con divisores finos, separación 40/48 y encabezados/pasos neutros. Selección/progreso carbón. Las opciones usan filas en un contenedor, con radio accesible y toda la fila táctil. Confirmación inmediata y reserva como texto, sin badges/cajas de color. La tipografía/acento/radios de la tienda permanecen en su tema.

Montos Regular/tabulares, moneda y céntimos atenuados, SemiBold solo en total. Reutiliza el formato existente: S/ 712, S/ 179.10, nunca .00. Resumen plegable móvil, resumen sticky desktop; acción principal fija con zona segura en móvil y espacio suficiente al final. Confirmaciones con título en dos tonos, icono neutro sin círculo, detalle con divisores y PDF/WhatsApp existentes.

## Comportamiento conservado

0007: pago inmediato con tarjeta o Yape (simulado), o registro por WhatsApp con reserva de 24 h; no se envían mensajes automáticamente. Se conservan validación de tarjeta/Yape, falta de stock, creación en almacén y copia local de confirmación.

0008: cupón validado y recalculado por servidor, descuento y envío gratis existentes. Mismo control neutral disponible en el resumen móvil/desktop de checkout y sin cambiar su uso en carrito. Errores de red liberan Aplicar para reintentar.

0009: delivery por distrito/zona, precio/plazo, envío gratis desde monto, recojo o coordinación según configuración. Reglas, cálculo y acciones del servidor sin cambios. Durante envío se bloquean cambios y doble clic; fallo de red vuelve al formulario para reintentar. Error al preparar número tiene reintento.

Las decisiones originales 0007/0008/0009 están fuera del repo (docs/estado-core-loop.md); se conservan las reglas implementadas y referencias existentes, sin reinterpretarlas. Cuatro estados de carga, vacío, datos y error/reintento.

## Validación

Worktree aislado, puerto 3206 sin Redis. Capturas antes/después Vercel 390/1440 en ambos temas y comprobación 360/390 sin scroll. Checkout de pago real simulado solo en memoria local y fixtures de confirmación solo en navegador en Vercel, sin mensajes/cobros/datos de producción.
