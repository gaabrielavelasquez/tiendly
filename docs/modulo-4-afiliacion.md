# Módulo 4 · Afiliación

Implementa la decisión 0007 compartida por Gabi el 16-oct-2026, sobre main. Sin cambios de tokens, estilos globales o componentes compartidos. Figma inicialmente rechazó el acceso; referencia funcional: descripción aprobada de A1–A7 y AD1–AD7b.

## Flujo

`/panel/configuracion` → `/panel/configuracion/afiliacion`: antes de empezar → negocio → representante → cuenta → revisión → enviada → estado. Stepper de cuatro pasos; hoja móvil y modal desktop para ayuda, salida, términos y detalle. Borrador por pestaña en sessionStorage. Salir desde enlaces internos, breadcrumb o Volver del paso 1 pide confirmación; mientras se envía, navegación y controles bloqueados.

- RUC: 11 dígitos; vacío, incompleto, consulta en curso, no encontrado, no habido, activo/habido. RUC 10 autocompleta el nombre; datos editables.
- Representante: nombre, DNI de 8 dígitos, celular de 9 empezando en 9, correo y sugerencias de dominios.
- Cuenta: CCI de 20 dígitos y banco detectado; discordancia con el banco elegido; titular siempre visible.
- Revisar: editar cada sección vuelve directamente a revisión; comisiones sin inventar importes, términos obligatorios; envío bloqueado hasta aceptar, y mensaje de no cerrar durante el envío.
- Estado: solicitud congelada con fecha estimada; detalle; observada con corrección directa del CCI y reenvío conservando el número de solicitud.

## Simulación y límites

No existe proveedor SUNAT, banco ni pasarela integrado. Las server actions simulan consulta y envío, vuelven a validar todos los campos y no envían mensajes ni confirmaciones. No utilizar datos reales.

- `20456789012`: negocio ficticio; `10456789012`: persona ficticia.
- `20000000000`: no encontrado; `20123456789`: no habido.
- CCI de demo BCP: `00212345678901234567`; Interbank: prefijo `003`; BBVA: `011`. La detección por prefijo no acredita que exista una cuenta ni comprueba titularidad.
- Estados demo: `?escenario=vacio|revision|observada|aprobada|error`, solo desarrollo/previews. Fecha estimada de demo: 10 días hábiles, sin feriados; no representa un SLA contratado.
- Comisiones y condiciones definitivas pendientes de proveedor. Los términos explican el alcance de la demostración.
- «Escribir a Tiendly» solo se habilita con `TIENDLY_SUPPORT_WHATSAPP`, número internacional sin símbolos. Por pedido de Gabi no se incluye el número de quien vende. No se inicia WhatsApp ni se envía ningún mensaje automáticamente.
- Solicitud y borrador solo en esta pestaña: no son compartidos entre dispositivos, no hay verificación real ni aprobación real.

## Integración con PR #7

main aún no contiene Configuración/Pagos. Este PR agrega una entrada mínima de Configuración para que el flujo sea accesible desde el menú. Al integrar #7, conservar su hub completo y enlazar «Solicitar cobros automáticos» a `/panel/configuracion/afiliacion`. El adaptador de estado compartido con los métodos de pago llegará con el backend; esta demo no activa métodos en el checkout.

## Validación

- `npm run check:tokens`, `npm run typecheck`, `npm run build -- --webpack`.
- Chrome/Playwright a 390 y 1440: flujo completo, errores de RUC/representante/CCI, edición desde resumen, términos, envío, persistencia, solicitud congelada, corrección directa del CCI conservando el número, salir y retomar. Sin desbordes, errores JS ni solicitudes a SUNAT o WhatsApp.
- Fallo de consulta: conserva los datos y permite reintentar. Borrador corrupto: recupera el inicio. Almacenamiento lleno: muestra error dentro del modal e impide salir afirmando que guardó.
- Modales desktop de 560 px; formulario de 640 px; estado de 720 px alineado a la izquierda.
- Capturas: [índice del flujo y estados](capturas/afiliacion/README.md).
