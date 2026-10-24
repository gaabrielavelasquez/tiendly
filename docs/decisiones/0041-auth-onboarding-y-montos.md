# 0041 · Acceso y onboarding completos; céntimos cuando existen

- **Fecha:** 24-oct-2026.
- **Estado:** aprobada por Gabi e integrada en #33 el 24-oct-2026 (`f296d21`), con halo cálido final.
- **Aplica:** 0031/0033 a registro, ingreso, código y errores, datos, tienda creada y confirmación de cierre. Actualiza los soles enteros de 0039 con una regla global de decimales condicionales.

## Acceso y onboarding

- Un shell compartido con presentación por paso y titulares en dos tonos. Registro/ingreso conservan tres ejemplos rotatorios y beneficios en texto plano. Código oculta vista y beneficios en móvil y mantiene Verificar al pie; desktop conserva la vista lateral, sin beneficios. Datos usa la tienda propia en vivo, con muestras según los rubros (0013), compacta bajo el botón en móvil y sin beneficios. Se respeta reducir movimiento y pausa por puntero/foco.
- Se retiran los componentes anteriores de marca, mini tienda ficticia y destellos. Sin el titular anterior, cajas grises ficticias, chips flotantes, checks en círculos, halos de fondo ni dominio escrito a mano. Fotos reales de los ejemplos, con carga anticipada.
- Las URL se generan con la base real de `urlTienda`, también al revisar o sugerir el slug. Revisión con carga, vacío y error/reintento; una falla de conexión no afirma que esté libre.
- Código incorrecto y vencido comparten el diseño. La verificación sigue simulada: 0000 no coincide, los demás códigos de cuatro dígitos pasan. Vigencia simulada de cinco minutos, reenviar renueva el código; sin mensajes reales ni autenticación nueva.
- Datos conserva los chips. Otro muestra «¿Qué vendes?», de 2 a 80 caracteres, validado al crear y guardado con los rubros. Ocultarlo no pierde el borrador.
- Tienda creada centra la vista propia como protagonista, reutilizando el mismo componente de Datos: nombre, link retornado y las mismas muestras por rubro en Neutral, con la nota «Productos de muestra». Halo centrado `bg-halo-logro` (glow-sky/glow-warm) que envuelve la tarjeta con presencia visible y entrada suave con movimiento reducido; sin destellos ni beneficios. Primario «Agregar mi primer producto» al formulario nuevo; secundario «Ir a mi panel»; copiar link con éxito/error y compartir por WhatsApp mediante wa.me sin número ni envío automático. Las muestras de Datos y Tienda creada son solo visuales y no se guardan como catálogo.
- Registro desktop recupera el halo detrás de la vista rotatoria (0033), nunca como fondo. Link libre usa Check fino y texto en feedback/success, sin caja ni círculo.
- Cierre de sesión conserva confirmación, foco seguro, error/reintento y limpieza de cookie/borrador. Titular en dos tonos; no cambia el resto de hojas.

## Montos y precios

- Formateador compartido: `S/ 712`, `S/ 179.10`, `S/ 90.99`; nunca .00. Dos decimales cuando existen céntimos, también en etiquetas accesibles, mensajes y CSV. Inicio conserva animación y cifras tabulares; moneda/decimales atenuados. Pedidos conserva tachado en cancelados.
- Precio y Precio antes aceptan punto o coma y hasta dos decimales, sin convertir 90.99 en 9099. Enteros como caso común: placeholder «Ej.: 89». Editar/guardar conserva los céntimos; el servidor rechaza entradas con más de dos.
- Totales y descuentos porcentuales del carrito se calculan a céntimos, sin residuos binarios. Oferta en lote conserva redondeo al sol entero por defecto. El porcentaje del badge continúa entero.
- Sin tokens o dependencias nuevos ni reset/escritura de prueba en Redis de producción. Los flujos que guardan se prueban con un proceso local aislado.

## Revisión

Antes/después desde Vercel a 390 y 1440, Chrome/WebKit sin scroll horizontal a 360/390, cuatro estados, datos largos, precios decimales y enteros. Tokens y build verdes. Detenerse con el PR abierto para revisión de Gabi.
