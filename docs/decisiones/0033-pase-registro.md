# 0033 · Pase de diseño del registro (/registro)

- **Fecha:** 22-oct-2026
- **Estado:** propuesta, pendiente de la aprobación de Gabi. Los otros pasos del onboarding esperan su ok.
- **Aplica:** 0031 (de-layering) al paso O1 / OD1 de 0013 (registro con WhatsApp, 3 datos y directo al panel).

## Contexto

El registro tenía las mismas huellas "de plantilla" que Inicio antes de 0031: dos titulares que competían en desktop, halo azul de fondo en toda la página, beneficios con checks en círculos de vidrio y una vista previa hecha de cajas grises, destellos ✦ y avisos flotantes.

## Decisión

1. **Un solo titular en dos tonos**, como el saludo de Inicio: "Crea tu tienda gratis." (`text/primary`) + "Lista en 2 minutos." (`text/secondary`). Debajo, "Tu link para vender por WhatsApp e Instagram. Sin tarjeta.". Se quita el titular del panel de desktop.
2. **Celular:** "+51" es un prefijo fijo dentro del campo, separado por un divisor fino y en `text/primary` (`Field prefixFijo`), para que no se lea como placeholder. El placeholder solo muestra el número.
3. **Google:** el logo "G" oficial a todo color, a la izquierda de "Continuar con Google", en el botón secundario neutro (guías de marca de Google).
4. **Beneficios:** máximo 3, en texto plano, sin íconos.
5. **Vista previa real:** la tienda de demo Aurora Calzado con su portada y sus 4 modelos (fotos en `public/aurora`, WebP, 4:5 a 960 × 1200). El link usa el formato real (`urlTienda`, que lee `TIENDLY_URL_TIENDAS`).
   - **Desktop:** es la protagonista, a la izquierda, sobre `bg/sunken`; el formulario va directo sobre blanco, sin tarjeta.
   - **Móvil:** versión compacta (nombre, link y 4 modelos) **después** del formulario, para no empujarlo fuera de la pantalla.
6. **Halo:** ninguno de fondo. Solo el halo cálido (`bg-halo-hoy`) detrás de la vista previa en desktop.

## Consecuencias

- Sin tokens nuevos. `Field` suma la prop opcional `prefixFijo`; los demás campos con prefijo no cambian.
- Los pasos código, datos y lista siguen con el shell anterior (`OnboardingShell`) hasta su propio pase.
- Aurora comparte modelos y fotos con la vista previa (`src/lib/datos/aurora.ts`): lo que promete el registro es lo que se ve al abrir el link.
