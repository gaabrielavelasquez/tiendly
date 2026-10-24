# Ajustes de #33 — código, vista propia y logro

La celebración vigente está en el [último ajuste](../auth-logro/README.md), con las muestras compartidas y el halo envolvente. Esta galería conserva la ronda anterior.

Antes: capturas Vercel de la ronda anterior de #33, código funcional 5d60b6a (head c6abd3f sin cambios funcionales). Copiadas sin editar imágenes desde auth-onboarding/after/.
https://tiendly-ni5lpwjr2-gaabrielavelasquez-8525s-projects.vercel.app/registro

Después: preview verde de 6eea253.
https://tiendly-qnzrju0m5-gaabrielavelasquez-8525s-projects.vercel.app/registro

390×844 primero; después 1440×1000. Capturas reales de página completa desde Vercel, sin edición de imagen; movimiento reducido. Los halos usan bg-halo-hoy, sin blur ni tokens nuevos, solo detrás de la protagonista.

| Pantalla | Antes 390 | Antes 1440 | Después 390 | Después 1440 |
|---|---|---|---|---|
| Registro | [390](before/registro-390.jpg) | [1440](before/registro-1440.jpg) | [390](after/registro-390.jpg) | [1440](after/registro-1440.jpg) |
| Código | [390](before/codigo-390.jpg) | [1440](before/codigo-1440.jpg) | [390](after/codigo-390.jpg) | [1440](after/codigo-1440.jpg) |
| Código incorrecto | [390](before/codigo-error-390.jpg) | [1440](before/codigo-error-1440.jpg) | [390](after/codigo-error-390.jpg) | [1440](after/codigo-error-1440.jpg) |
| Código vencido | [390](before/codigo-vencido-390.jpg) | [1440](before/codigo-vencido-1440.jpg) | [390](after/codigo-vencido-390.jpg) | [1440](after/codigo-vencido-1440.jpg) |
| Datos: hogar | [390](before/datos-390.jpg) | [1440](before/datos-1440.jpg) | [390](after/datos-390.jpg) | [1440](after/datos-1440.jpg) |
| Datos: Otro | [390](before/datos-otro-390.jpg) | [1440](before/datos-otro-1440.jpg) | [390](after/datos-otro-390.jpg) | [1440](after/datos-otro-1440.jpg) |
| Tienda creada | [390](before/creada-390.jpg) | [1440](before/creada-1440.jpg) | [390](after/creada-390.jpg) | [1440](after/creada-1440.jpg) |

[Repostería 390](after/datos-reposteria-390.jpg) · [1440](after/datos-reposteria-1440.jpg): el rubro cambia los productos sin cambiar el tema Neutral. Hogar, repostería, tecnología, selección múltiple y Otro comprobados. Las muestras son solo visuales y no se guardan en catálogo.

[Link copiado 390](after/creada-copiado-390.jpg) · [1440](after/creada-copiado-1440.jpg). [Error de copia 390](after/creada-error-copia-390.jpg) · [1440](after/creada-error-copia-1440.jpg). Éxito y error del portapapeles se simulan para comprobar ambos mensajes. wa.me se inspecciona sin abrir ni enviar mensajes.

Se siembra estado en la sesión del navegador con Casa Nube y teléfono ficticio 900000000 para capturar datos/creada; no se crean tiendas en Vercel. Creación real probada en memoria local: Otro conservado, slug retornado usado y catálogo vacío sin productos de muestra. Las dos rutas finales abren el formulario de producto y el panel. WhatsApp/código siguen simulados y Google sin backend conectado.

Chrome y WebKit locales y en Vercel pasan 390×844, 1440×1000 y 360×844, con nombres y URL largos, sin scroll horizontal. Código normal/incorrecto/vencido y reenvío, botón al pie, vista propia en vivo, varios rubros, posición centrada del logro, éxito/error de copia y las dos rutas finales. [Resultados del preview](resultado-preview.json). Tokens y build local/Vercel verdes.

Sin merge ni cambios de producción. Gabi revisa #33 antes de integrar.
