# 0046 · Demos protegidas y beta solo con Google

- **Fecha:** 29-oct-2026
- **Estado:** propuesta (Gabi), en revisión.

## Contexto

Mientras no hay backend, el código de WhatsApp del registro es simulado: cualquier código de 4 dígitos (salvo 0000) se acepta. Con el ingreso de #38, quien sepa el número de una tienda puede entrar a su panel. Los números de las demos son públicos (MUÑA, Glow Labo, Heather). Además, en producción el panel sin sesión abre la demo (MUÑA) y hasta ahora se podía guardar en ella.

## Decisión

- **Las demos no se editan en producción.** MUÑA, Glow Labo y Heather se pueden mirar desde el panel sin sesión, pero cualquier guardado del panel se rechaza en el servidor, aunque se ponga la cookie a mano. En local y en los previews se siguen pudiendo editar, porque sirven para probar.
- **Nadie ingresa a una demo con su número**, en ningún entorno.
- **Beta solo con Google.** `/registro` y la pantalla de ingreso muestran solo "Continuar con Google". El flujo de WhatsApp sigue en el código detrás de `NEXT_PUBLIC_INGRESO_CELULAR=1` (apagado por defecto). Con la bandera apagada, el servidor también rechaza el ingreso por número.
- Antes de invitar a cualquier tienda real, el ingreso por número debe seguir apagado en producción hasta que el código de WhatsApp se envíe y se verifique de verdad.

## Consecuencias

- Con la bandera apagada no se puede crear ni recuperar una tienda hasta conectar Google (hoy el botón no tiene backend).
- Desarrollo y pruebas E2E del registro con número necesitan `NEXT_PUBLIC_INGRESO_CELULAR=1` en el entorno.
- En el panel de la demo en producción, guardar muestra el error genérico de cada pantalla ("No pudimos guardar…"). Un aviso propio de "modo demo" sería un cambio visual aparte.
