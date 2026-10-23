# Prototipo: Productos y ofertas (PR 3 + decisión 0034)

**No es la implementación.** Es la propuesta navegable para que Gabi apruebe el diseño antes de programarlo.

- Rutas (solo en local y en previews de Vercel; en producción dan 404): `/prototipo` (índice), `/panel/prototipo/producto?ejemplo=zapatilla|serum|vela`, `/panel/prototipo/productos`, `/prototipo/tienda` y `/prototipo/tienda/serum-calma`.
- Datos de ejemplo en memoria (no se guardan). Fechas relativas a hoy en Lima.
- Al implementar: las reglas de `lib/oferta.ts` pasan a `features/productos/lib`, los componentes se rehacen sobre los reales y se borran esta carpeta y las rutas `prototipo`.
