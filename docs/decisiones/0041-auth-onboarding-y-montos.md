# 0041 · Acceso y onboarding completos; céntimos cuando existen

- **Fecha:** 24-oct-2026.
- **Estado:** solicitado por Gabi, un PR desde main después de integrar #32. Sin autorización de merge.
- **Aplica:** 0031/0033 a registro, ingreso, código y errores, datos, tienda creada y confirmación de cierre. Actualiza los soles enteros de 0039 con una regla global de decimales condicionales.

## Acceso y onboarding

- Un solo shell del registro, titulares en dos tonos y beneficios en texto plano. Tres ejemplos rotatorios y «Así se verá tu tienda.» en todos los pasos previos a crearla; ingreso incluido. Se respeta reducir movimiento y pausa por puntero/foco.
- Se retiran los componentes anteriores de marca, mini tienda ficticia y destellos. Sin el titular anterior, cajas grises ficticias, chips flotantes, checks en círculos, halos de fondo ni dominio escrito a mano. Fotos reales de los ejemplos, con carga anticipada.
- Las URL se generan con la base real de `urlTienda`, también al revisar o sugerir el slug. Revisión con carga, vacío y error/reintento; una falla de conexión no afirma que esté libre.
- Código incorrecto y vencido comparten el diseño. La verificación sigue simulada: 0000 no coincide, los demás códigos de cuatro dígitos pasan. Vigencia simulada de cinco minutos, reenviar renueva el código; sin mensajes reales ni autenticación nueva.
- Datos conserva los chips. Otro muestra «¿Qué vendes?», de 2 a 80 caracteres, validado al crear y guardado con los rubros. Ocultarlo no pierde el borrador.
- Tienda creada muestra nombre, link retornado y estado vacío de la tienda propia, en Neutral. No inventa productos ni muestra una tienda de ejemplo como si fuera suya.
- Cierre de sesión conserva confirmación, foco seguro, error/reintento y limpieza de cookie/borrador. Titular en dos tonos; no cambia el resto de hojas.

## Montos y precios

- Formateador compartido: `S/ 712`, `S/ 179.10`, `S/ 90.99`; nunca .00. Dos decimales cuando existen céntimos, también en etiquetas accesibles, mensajes y CSV. Inicio conserva animación y cifras tabulares; moneda/decimales atenuados. Pedidos conserva tachado en cancelados.
- Precio y Precio antes aceptan punto o coma y hasta dos decimales, sin convertir 90.99 en 9099. Enteros como caso común: placeholder «Ej.: 89». Editar/guardar conserva los céntimos; el servidor rechaza entradas con más de dos.
- Totales y descuentos porcentuales del carrito se calculan a céntimos, sin residuos binarios. Oferta en lote conserva redondeo al sol entero por defecto. El porcentaje del badge continúa entero.
- Sin tokens o dependencias nuevos ni reset/escritura de prueba en Redis de producción. Los flujos que guardan se prueban con un proceso local aislado.

## Revisión

Antes/después desde Vercel a 390 y 1440, Chrome/WebKit sin scroll horizontal a 360/390, cuatro estados, datos largos, precios decimales y enteros. Tokens y build verdes. Detenerse con el PR abierto para revisión de Gabi.
