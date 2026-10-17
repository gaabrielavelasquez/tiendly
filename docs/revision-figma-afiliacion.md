# Revisión estructural pendiente · Afiliación

Fecha: 16-oct-2026. Referencia: archivo `zHR0uS37OATafFq7U4NEwr`, Flujos, módulo 4.

La consulta de metadatos de Flujos permitió inventariar los frames A1–A7, AD2–AD5 y los estados AD1–AD7b. Los intentos de obtener contexto completo y capturas de Afiliación devolvieron «sin acceso de edición». No se considera terminada la revisión visual ni se modifican las pantallas usando solo metadatos.

## Diferencias estructurales detectadas

| Pantalla aprobada | Diferencia de la implementación actual |
|---|---|
| A2 · Tu negocio (106:59) | Faltan Nombre de tu tienda, Rubro y Dirección fiscal editable. Actualmente se muestran razón social y dirección del resultado simulado. |
| A3 · Representante legal (106:111) | Falta Cargo. Ya existen nombre, DNI, celular y correo. |
| A4 · Cuenta bancaria (106:160) | Falta Tipo de cuenta. Ya existen CCI, banco detectado y titular visible. |
| A5 · Revisa y envía (106:203) | El resumen debe incorporar cargo y tipo de cuenta después de implementar esos campos. Los importes de comisión del mock de Figma no se trasladan al producto: 0007 dice que todavía no se confirmaron con el proveedor. |
| A6 · Solicitud enviada (106:259) | Figma incluye seguimiento de tres etapas y «Volver al panel» en esa misma pantalla. Actualmente el seguimiento vive en la pantalla posterior de estado. Se debe revisar con su captura antes de ajustar. |
| A7 · Pagos en revisión (106:301) | Figma muestra el método WhatsApp activo junto a los cobros en proceso. Integrar con el hub/métodos del PR #7; main todavía no contiene ese módulo. |

## Ya comprobado funcionalmente

Cuatro pasos, validaciones de RUC/representante/CCI, ayuda, salida con borrador, términos, envío simulado, solicitud congelada, corrección directa del CCI, estados móvil/desktop y recuperación ante fallos. Estas pruebas no sustituyen la revisión contra las capturas aprobadas.

## Siguiente paso

Restablecer lectura de contexto y capturas, revisar campos y resúmenes, completar las diferencias anteriores y volver a verificar en navegador a 390 y 1440. Mantener tokens, mocks, datos ficticios y la restricción de no enviar mensajes ni confirmaciones.
