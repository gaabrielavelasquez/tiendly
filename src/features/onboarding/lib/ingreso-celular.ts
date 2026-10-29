// Beta: solo "Continuar con Google". El ingreso con WhatsApp sigue en el código, pero apagado: mientras el código
// sea simulado, quien sepa el número de una tienda podría entrar a ella. Se enciende con NEXT_PUBLIC_INGRESO_CELULAR=1
// (desarrollo y pruebas) y se deja encendido en producción solo cuando el código se envíe y verifique de verdad.
export const ingresoCelularActivo = process.env.NEXT_PUBLIC_INGRESO_CELULAR === "1";
