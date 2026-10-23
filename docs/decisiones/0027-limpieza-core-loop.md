# 0027 · Limpieza del Core Loop: qué se queda, qué se va y qué se ajusta

- **Fecha:** 16-oct-2026
- **Estado:** aceptada (Gabi). Vigente.
- **Origen:** la lista "Para decidir" de `docs/estado-core-loop.md`.

## Contexto

El código tenía piezas que no estaban en Figma ni en ninguna decisión, y dos inconsistencias con las reglas.

## Decisión

**Inconsistencias**
- El paso actual de "Tienda nueva" usa el estilo de selección carbón (`selection/*`), no el fondo cobalto suave. La regla del cobalto (0026) vale en todo el producto.
- Portada de la vitrina: las tiendas **Free** usan la versión de Figma (solo foto y, debajo, titular). La portada con overlay y CTA es **Pro (V1.1)**: el componente `PortadaPro` se guarda, pero no se usa en Free.

**Se quita:** campana de avisos, atajo ⌘K / Ctrl+K y ticket promedio.

**Se queda:** avatar → Configuración; "Nuevo producto" en la cabecera de Inicio; íconos (no puntos) en "Para atender hoy"; barra de progreso por segmentos; Duplicar; filtro "Bajo stock"; precio de comparación; categorías (opcionales); historial y notas del pedido; filtro "Vencen hoy"; pills de categoría fijas; datos simulados; `/kit` y `?escenario=` (ocultos en producción); contra entrega.

**Se ajusta**
- Filas de "Para atender hoy": toda la fila es el link, con chevron (Figma), sin "Ver detalle".
- Estado del producto: un solo interruptor **Activo / Pausado** (0011). Se eliminan Borrador, Archivado y la acción Archivar.
- SKU: opcional, dentro de "Más opciones" (plegado).
- Descripción: texto simple, sin editor con formato.
- Selección masiva y Exportar: solo en desktop. *Actualizado por 0034: la selección y "Poner en oferta" llegan a móvil (modo selección); Exportar sigue solo en desktop.*
- Correo del cliente en el detalle del pedido: solo si existe.
- Logo de la vitrina: como en Figma (móvil al centro con menú a la izquierda; desktop a la izquierda).
- Configuración contiene **Pagos, Entregas y Cuenta**.

## Consecuencias

- `Producto.estado` pasa a `"activo" | "pausado"`; la acción masiva es "Pausar" (con Deshacer). Se suma el filtro "Pausados".
- `tiendaActual.plan` (`"free" | "pro"`) decide qué portada se muestra.
- `herramientasDev` (`src/lib/entorno.ts`): `/kit` y `?escenario=` se ven en local y en previews de Vercel, no en producción.
- El módulo 2 (Pagos y Entregas) se construye dentro de `/panel/configuracion`.
