# 0042 · Configuración y Mi tienda aplican 0031

- **Fecha:** 24-oct-2026.
- **Estado:** solicitado por Gabi; un PR desde main f296d21, sin autorización de merge.
- **Alcance:** Configuración, Métodos de pago, Entregas y Mi tienda. Conserva las reglas implementadas de 0003, 0007 y 0009.

## Presentación

Títulos fuera de los contenedores, un contenedor sereno por lista con divisores finos, 40/48 de separación, titulares Outfit Medium e íconos neutros sin círculos de fondo. Estados de carga, vacío, datos y error con reintento. El interruptor compartido agrega un Check dentro del pomo al estar encendido, además de aria-checked; selección carbón intacta.

## Entregas y pagos

Delivery activo sin zonas muestra «Elige al menos una zona.» de inmediato y deshabilita Guardar; la validación del servidor ya existente sigue rechazándolo. Al comprar, tu cliente verá siempre contiene el preview o una explicación de lo que falta, también con ambos métodos inactivos. Al menos un método, tarifas por zona, envío gratis desde un monto, recojo y validaciones de campos se conservan.

Pagos conserva guardado inmediato, rollback al fallar, último método protegido, WhatsApp editado solo en Mi tienda y solicitud/estado de cobros automáticos. El formulario se ocupa mientras guarda y permite reintento después de un fallo de red. Afiliación conserva su ruta y sus pasos, sin rediseñar ese módulo.

## Mi tienda

Conserva temas/acento, carga de imágenes, bienvenida, contacto, nombre de ofertas, opciones Free/Pro y bloqueo de Pro pendiente, preview en vivo y aviso al salir sin guardar. Ajuste solicitado antes del merge: identidad leída del documento real de la tienda y publicada en una sola escritura del almacén existente junto con contacto/ofertas. Tema, acento, logo, portada, bienvenida, Instagram y horario comparten fuente entre panel y vitrina; los borradores antiguos de localStorage no pisan lo publicado. Compatibilidad en lectura con las tiendas de ejemplo (MUÑA Editorial/Terracota, portada y titular propios), sin reset ni escritura de migración. Una tienda nueva sigue Neutral y vacía.

Las miniaturas usan portada/logo y productos publicados de la tienda; sin catálogo, muestras por rubro identificadas como tales, nunca guardadas. Ayudas de imagen unificadas (formato/orientación y límite de 1 MB), íconos sin contenedor gris.

La barra móvil de guardar aparece con cambios pendientes y reemplaza a la tab bar; al guardar se recupera la navegación y el aviso queda visible. Preview sin productos o portada explica qué falta en lugar de inventar productos o importes.

## Referencias y validación

0003/0007/0009 viven en el proyecto externo IA on Product Design y no están completos en el repo (docs/estado-core-loop.md). Google Drive no encontró Tiendly. Se preserva el comportamiento de main y las reglas documentadas en código; no se reinterpretan comisiones, planes, métodos o entrega.

Tokens/build, pruebas funcionales locales en worktree/3205 y capturas Vercel antes/después a 390 y 1440; Chrome/WebKit sin scroll horizontal a 360/390 y con datos/URL largos. Guardados solo en memoria local. Detenerse con el PR abierto para revisión de Gabi.
