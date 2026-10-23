# 0037 · Tabla de tallas por producto

- **Fecha:** 23-oct-2026
- **Estado:** propuesta (PR 4 de 4 de ofertas), pendiente del ok de Gabi.
- **Aplica:** 0032 (la tabla de tallas solo aparece si una opción es talla; es por producto, con un atajo para reusar la de otro) y el prototipo aprobado de 0034 (PR #22).

## Decisión

1. **La tabla es del producto** y se edita dentro de la opción Talla del formulario: "Sin tabla", "Crear una para este producto" o "Usar la de {otro producto}". Usar la de otro **copia** la tabla: cambiarla aquí no cambia allá.
2. **Filas:** las tallas de la opción (si se agrega una talla, su fila aparece vacía). **Columnas:** hasta 4 medidas con nombre editable. Sugeridas al crear: calzado (tallas con números) → "Largo del pie"; ropa → "Pecho", "Cintura" y "Largo".
3. **Celdas en cm**, como texto: un número o un rango ("86–90"). Vacío: no aplica (en la tienda, "—").
4. **Al guardar** se quitan las columnas vacías y las tallas que ya no están. Sin ninguna medida escrita, no se guarda tabla.
5. **En la tienda:** "Ver tabla de tallas" debajo de las tallas, solo si el producto tiene tabla. Se despliega en la misma página, con la talla elegida marcada. Sin tabla, no hay link (antes salía una tabla fija de calzado con "—" para S, M y L).
6. Heather conserva su tabla de calzado (largo del pie, 35–40) como tabla de cada modelo.
