# 0037 · Tabla de tallas por producto

- **Fecha:** 23-oct-2026
- **Estado:** aprobada por Gabi para integrar #27 con preview verde.
- **Aplica:** 0032 (la tabla de tallas solo aparece si una opción es talla; es por producto, con un atajo para reusar la de otro) y el prototipo aprobado de 0034 (PR #22).

## Decisión

1. **La tabla es del producto** y se edita dentro de la opción Talla del formulario: "Sin tabla", "Crear una para este producto" o "Usar la de {otro producto}". Usar la de otro **copia** la tabla: cambiarla aquí no cambia allá.
2. **Filas:** las tallas de la opción (si se agrega una talla, su fila aparece vacía). **Columnas:** hasta 4 medidas con nombre editable. Sugeridas al crear: calzado (tallas con números) → "Largo del pie"; ropa → "Pecho", "Cintura" y "Largo".
3. **Celdas en cm**, como texto: un número o un rango ("86–90"). Vacío: no aplica (en la tienda, "—").
4. **Al guardar** se quitan las columnas vacías y las tallas que ya no están. Sin ninguna medida escrita, no se guarda tabla.
5. **En la tienda:** "Ver tabla de tallas" debajo de las tallas, solo si el producto tiene tabla. Se despliega en la misma página, con la talla elegida marcada. Sin tabla, no hay link (antes salía una tabla fija de calzado con "—" para S, M y L).
6. Heather conserva su tabla de calzado (largo del pie, 35–40) como tabla de cada modelo.

## Actualización con main tras #29 · 24-oct-2026

- #29 ya aporta la guía de largo del pie de la vitrina, cerrada al entrar y en dos columnas. Este PR sigue aportando el editor, medidas por producto, copia independiente, rangos y eliminación explícita de la tabla.
- Se conservan los nombres, las ocho fichas, las fotos por color, Terracota y la oferta de MUÑA de #29. La guía de calzado mantiene la presentación aprobada; otras tablas muestran una columna por medida.
- Compatibilidad sin reset ni escritura en Redis: si un documento antiguo no tiene `tablaTallas`, se sigue leyendo la guía heredada de calzado. `tablaTallas: null` representa la elección explícita "Sin tabla" y no recupera esa guía al volver a abrir el producto. Los productos nuevos sin tabla también guardan null.
- Producción queda intacta. Las tablas propias nuevas de la semilla no se inyectan en documentos guardados: se configuran y guardan desde el panel después de revisar y aprobar el PR.

## Ampliación solicitada por Gabi · 24-oct-2026

- Números o rangos (30, 86–90); se quitan unidades como cm o mm al escribir, desenfocar y guardar. No se convierten escalas. Coma decimal y guiones se normalizan; un rango incompleto impide guardar y muestra ayuda, sin perder el borrador.
- Sin opción Talla aparece una sección **Medidas**, con el mismo editor y copia independiente. Sus valores viven en una fila interna de clave vacía; no crea una talla, opción o variante. Al guardar se conservan las medidas únicas; "Sin medidas" las quita. En la ficha se muestra **Medidas de la prenda**, cerrada al entrar, en una tabla Medida / Valor (cm), sin selector.
- Las unidades se indican en los encabezados de las tablas públicas; los valores no repiten cm. La guía de calzado sigue cerrada y con dos columnas. Los documentos antiguos y null conservan la compatibilidad del apartado anterior.
- La cabecera del editor añade **Ver en la tienda**, en pestaña nueva. Usa la URL de la versión guardada, que se actualiza al guardar un nombre nuevo o al crear. Pausado: enlace deshabilitado con "Activa y guarda el producto para verlo."; nuevo sin guardar: "Guarda el producto para verlo.". Activar sin guardar no abre una ficha todavía inexistente.
- Ejemplo de medidas únicas en la semilla de Cartera Cher (Alto, Ancho, Profundidad): datos ficticios para revisar el editor y la ficha sin Talla. No cambia las ocho referencias, sus opciones, variantes, precios u ofertas, ni inyecta datos en documentos guardados. No reiniciar Redis.
- #30 integrado con autorización expresa de Gabi. **#27 no tiene autorización de merge** y queda pendiente de revisión con nuevas capturas.


## Ajustes finales autorizados · 24-oct-2026

- Opciones llamadas Medidas, Medida, Dimensiones o Tamaño en cm muestran debajo del nombre la ayuda "¿Quieres poner las medidas del producto? Usa la sección Medidas.". El enlace lleva al mismo editor de medidas, también cuando está dentro de Talla. No cambia ni bloquea la opción escrita.
- La ficha pública usa "Medidas", sin restringirse a prendas. Conserva el plegado y los valores/unidades.
- Gabi autoriza integrar #27 con preview verde y comprobar /muna/cartera-cher en producción a 390. No se reinicia Redis ni se inyectan medidas en los productos ya guardados.
