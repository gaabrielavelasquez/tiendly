# Revisión de Mi tienda contra Figma

Fecha: 16-oct-2026. Referencia: archivo `zHR0uS37OATafFq7U4NEwr`, Flujos.

## Alcance verificado

Se obtuvo el contexto completo y la captura de **MT1 · Mi tienda · Personalizar**, nodo [260:5829](https://www.figma.com/design/zHR0uS37OATafFq7U4NEwr?node-id=260-5829). La página Flujos también permitió identificar MT2 y MTD1, pero sus consultas posteriores devolvieron «sin acceso de edición», incluso después de comprobar la cuenta conectada y reintentar una consulta individual.

## Correcciones aplicadas desde MT1

- Tema y Color de acento son secciones separadas. Las miniaturas muestran nombre, foto de la propia tienda, precio y botón; usan `data-theme` con los modos existentes.
- «Ver vista previa» se encuentra debajo de los temas en móvil; el pie fijo contiene «Guardar cambios».
- Identidad agrupa filas compactas de logo y portada, con ayuda y bienvenida de hasta 80 caracteres. La bienvenida aparece debajo del logo en la vista previa, según la ayuda del campo.
- Contacto y atención utiliza contenedores de color semántico para los iconos decorativos de Instagram, WhatsApp y horario.
- «Más opciones con Pro» muestra ayuda, candado y badge PRO por función; «Ver planes» mantiene un detalle real y usa el botón primario del sistema.
- La anotación de Guardar exige preguntar al salir con cambios. Ahora los enlaces del panel abren confirmación con Seguir editando, Guardar y salir o Descartar y salir; los errores de validación o almacenamiento impiden afirmar que se guardó. Se mantiene la advertencia nativa al recargar/cerrar.

## Congelamiento estético y límites

No se modifican `design/tokens.json`, estilos globales, componentes compartidos ni archivos de tokens generados. Se mantiene la selección en carbón, el sistema tipográfico del repo y sus iconos Lucide; los SVG de Figma que representan controles dinámicos no sustituyen el sistema de componentes. Las fotos del contexto figuran como `unknown`; se conservan las imágenes locales del catálogo de Heather y las imágenes elegidas por la persona usuaria.

La barra compartida del panel se conserva como en main. El guardado sigue simulado en este navegador, por eso no se afirma que los cambios se publiquen en un servidor.

## Validación y pendiente

Chrome a 390 y 1440: secciones MT1, 15 combinaciones tema/acento con contraste ≥4.5:1, navegación con Seguir/Guardar/Descartar, validación que impide salir, persistencia, vista previa móvil, planes y error; sin desbordes ni errores JavaScript. Capturas actualizadas en `docs/capturas/mi-tienda/`, incluida `salir-390.png`.

El registro del servidor mostró una advertencia de hidratación de `tabindex` en el `Pressable` compartido al emular «reducir movimiento». Ese componente no cambió respecto de main; queda registrado fuera del alcance de esta revisión. «Sin errores JavaScript» se refiere a las excepciones no controladas detectadas por `pageerror`, no a una consola sin advertencias.

**Pendiente:** comparación visual directa de MT2 (260:6086) y MTD1 (261:5943), bloqueada por el conector de Figma. Las verificaciones funcionales y de navegador de esas vistas no equivalen a confirmar su coincidencia visual con Figma.
