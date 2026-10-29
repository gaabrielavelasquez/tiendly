# 0046 · Demos protegidas en producción

- **Fecha:** 29-oct-2026
- **Estado:** aceptada (Gabi). Vigente.

## Contexto

Mientras no hay backend, el código de WhatsApp del registro es simulado: se acepta cualquier código de 4 dígitos (salvo 0000). Con el ingreso de #38, quien sepa el número de una tienda puede entrar a su panel. Los números de las demos son públicos (MUÑA, Glow Labo, Heather). Además, en producción el panel sin sesión abre la demo (MUÑA) y hasta ahora se podía guardar en ella.

## Decisión

- **Las demos no se editan en producción.** MUÑA, Glow Labo y Heather se pueden recorrer desde el panel sin sesión, pero el servidor rechaza cualquier guardado del panel, aunque se ponga la cookie a mano. En local y en los previews se siguen editando, porque sirven para probar.
- **Aviso de modo demo:** mientras se mira una demo en producción, el panel muestra una franja neutra arriba: "Esta es una tienda de ejemplo: puedes explorar, pero los cambios no se guardan." Sin color de alerta: es información, no un error.
- **Nadie ingresa a una demo con su número**, en ningún entorno.
- **Antes de invitar a cualquier tienda real, el ingreso por número se apaga en producción** (solo Google) hasta que el código de WhatsApp se envíe y se verifique de verdad. Ese cambio va en un PR aparte, que se integra junto con el ingreso real con Google.

## Consecuencias

- Al guardar en la demo, cada pantalla muestra su error genérico ("No pudimos guardar…"); el aviso de arriba explica por qué.
- Las compras desde la vitrina de una demo siguen creando pedidos en ella: es la vitrina, no el panel.
