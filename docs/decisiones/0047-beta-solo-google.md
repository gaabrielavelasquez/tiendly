# 0047 · Beta solo con Google

- **Fecha:** 29-oct-2026
- **Estado:** aceptada (Gabi). Se integra junto con el ingreso real con Google (trabajo de backend), no antes.

## Contexto

El código de WhatsApp del registro es simulado: quien sepa el número de una tienda puede ingresar a ella (ver 0046). Las demos ya están protegidas, pero cualquier tienda real quedaría expuesta. El plan de lanzamiento define que la beta entra solo con Google.

## Decisión

- `/registro` y la pantalla de ingreso muestran solo "Continuar con Google". El titular de ingreso dice "Con tu cuenta de Google."
- El flujo de WhatsApp sigue en el código detrás de `NEXT_PUBLIC_INGRESO_CELULAR=1` (apagado por defecto). Con la bandera apagada, el servidor también rechaza el ingreso por número.
- En móvil, sin los campos del número, el pie ("¿Ya tienes tienda?" y términos) queda junto al botón de Google en vez de bajar al fondo.
- En producción, el ingreso por número no se enciende hasta que el código se envíe y se verifique de verdad.

## Consecuencias

- Mientras Google no esté conectado, con la bandera apagada no se puede crear ni recuperar una tienda: por eso este cambio se integra junto con Google.
- Desarrollo y pruebas E2E del registro con número necesitan `NEXT_PUBLIC_INGRESO_CELULAR=1`.
