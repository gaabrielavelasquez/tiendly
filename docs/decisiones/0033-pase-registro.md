# 0033 · Pase de diseño del registro (/registro)

- **Fecha:** 22-oct-2026
- **Estado:** aceptada (Gabi), en producción con #20 y #21. Los otros pasos del onboarding esperan su propio pase.
- **Aplica:** 0031 (de-layering) al paso O1 / OD1 de 0013 (registro con WhatsApp, 3 datos y directo al panel).

## Contexto

El registro tenía las mismas huellas "de plantilla" que Inicio antes de 0031: dos titulares que competían en desktop, halo azul de fondo en toda la página, beneficios con checks en círculos de vidrio y una vista previa hecha de cajas grises, destellos ✦ y avisos flotantes.

## Decisión

1. **Un solo titular en dos tonos**, como el saludo de Inicio: "Crea tu tienda gratis." (`text/primary`) + "Lista en 2 minutos." (`text/secondary`). Debajo, "Tu link para vender por WhatsApp e Instagram. Sin tarjeta.". Se quita el titular del panel de desktop.
2. **Celular:** "+51" es un prefijo fijo dentro del campo, separado por un divisor fino y en `text/primary` (`Field prefixFijo`), para que no se lea como placeholder. El placeholder solo muestra el número.
3. **Google:** el logo "G" oficial a todo color, a la izquierda de "Continuar con Google", en el botón secundario neutro (guías de marca de Google).
4. **Beneficios:** máximo 3, en texto plano, sin íconos. El tercero, multirubro: "Tus productos con sus opciones, en un solo link.".
5. **Vista previa: tres tiendas de ejemplo de rubros distintos** (decisión 0032), que se turnan cada 5 s con un fundido suave. Rótulo visible: "Así se verá tu tienda.". Cada una con su tema y sus productos (nombres y precios inventados, fotos reales de Unsplash y Pexels):
   - **MUÑA**, moda, tema Editorial. Portada: la cartera; 3 productos (botín, chompa y falda).
   - **keyhaus**, teclados mecánicos y setup, tema Neutral.
   - **Glow Labo**, skincare y maquillaje, tema Suave. Portada: el sérum sobre la piedra. Tonos tierra: sin fotos rosadas.
   - Fotos en `public/tiendas-ejemplo` (WebP; portada 16:9 a 1280 × 720, productos 4:5 a 480 × 600). Los originales quedan fuera del repo (`fotos-originales/`, ignorada por git).
   - Los links usan el formato real (`urlTienda`, que lee `TIENDLY_URL_TIENDAS`).
   - **Movimiento:** con "reducir movimiento" queda fija en la primera. La rotación se pausa con el puntero o el foco encima, y se detiene al elegir una tienda con sus puntos (WCAG 2.2.2).
   - **Desktop:** es la protagonista, a la izquierda, sobre `bg/sunken`; el formulario va directo sobre blanco, sin tarjeta. Los beneficios van en `text/primary` a tamaño de cuerpo, para que se lean.
   - **Desktop, alto:** el ancho de la vista previa depende del alto de la pantalla (`min(32rem, 100dvh − 126 × espaciado)`), así la vista previa y los 3 beneficios entran sin scroll en 1440 × 900.
   - **Móvil:** versión compacta (nombre, link y 4 productos) **después** del formulario, para no empujarlo fuera de la pantalla.
6. **Halo:** ninguno de fondo. Solo el halo cálido (`bg-halo-hoy`) detrás de la vista previa en desktop.

## Consecuencias

- Sin tokens nuevos. `Field` suma la prop opcional `prefixFijo`; los demás campos con prefijo no cambian.
- Los pasos código, datos y lista siguen con el shell anterior (`OnboardingShell`) hasta su propio pase.
- Las tiendas de ejemplo viven en `src/lib/datos/tiendas-ejemplo.ts`; no son tiendas reales del almacén.
- Se retiran las fotos de Aurora generadas con IA (`public/aurora`).
- **MUÑA reemplaza a Aurora como tienda de demo pública** (`/muna`, con su portada, productos, tema Editorial y descripciones). `/aurora` da 404 aunque siga guardada en Redis (`RETIRADAS` en `semillas.ts`); la clave `production:tienda:aurora` se puede borrar después del merge. Los slugs `muna`, `keyhaus`, `glow-labo` y `aurora` quedan reservados.
