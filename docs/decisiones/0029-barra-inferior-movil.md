# 0029 · Panel móvil: barra inferior en vez de menú hamburguesa

- **Fecha:** 16-oct-2026
- **Estado:** aceptada (Gabi). Vigente.
- **Nota:** no está en Figma. Las pantallas móviles aprobadas (I1, P1, PR1, Pagos, Cupones) usan menú hamburguesa; Gabi eligió la barra inferior al revisar el panel a 390 px.

## Contexto

En el celular, el menú hamburguesa esconde las secciones que la tienda usa todo el día (Pedidos y Productos): hay que abrirlo para cambiar de sección.

## Decisión

- Barra inferior fija en móvil con **Inicio · Pedidos · Productos · Mi tienda · Más**. "Más" abre una hoja con **Cupones y Configuración**.
- Activo en `text/primary` y negrita, sin cobalto (0019). Zona táctil de 56 px de alto.
- No se muestra en pantallas de detalle o edición (`/panel/pedidos/[id]`, `/panel/productos/[id]` y `nuevo`): tienen su propia barra de acciones abajo y "Volver" arriba.
- La barra superior móvil queda con el nombre de la tienda y la cuenta. Desde 1024 px manda la barra lateral, sin cambios.
- Sin tokens nuevos (congelamiento estético).

## Consecuencias

- `TabBar` en `components/panel/tab-bar.tsx`; los ítems salen de `ITEMS` de `panel-nav.tsx` (una sola lista para las dos navegaciones).
- Los avisos flotantes del panel suben a `bottom-20` en móvil para no taparse con la barra.
- Pendiente: llevar la barra al Figma (página Flujos).
