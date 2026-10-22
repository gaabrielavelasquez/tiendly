# Test con tiendas · Core Loop

Guía para una sesión de 30 a 40 minutos con una dueña o dueño de tienda real que vende por WhatsApp o Instagram. El objetivo es ver si puede armar su tienda y atender una venta sin ayuda.

## Antes de la sesión

- **Dónde correrlo:** en una laptop con `npm run build && npm start`, y abrir la app desde los celulares por la IP de la laptop (misma red Wi-Fi). Los datos viven en la memoria del servidor: en Vercel pueden perderse entre una pantalla y otra, porque cada instancia tiene su propia memoria.
- **Reiniciar el servidor antes de cada persona.** Arranca con Heather (tienda de demo); el registro la reemplaza por la tienda nueva.
- **Todo es simulado:** el código de WhatsApp no se envía (sirve cualquier código, menos `0000`) y no hay cobros reales. Una tienda nueva solo cobra por WhatsApp: tarjeta y Yape llegan con Cobros automáticos, que necesitan aprobación.
- **Dos celulares:** el de la persona (panel) y uno tuyo (cliente). Usa números ficticios para el cliente.
- **Una foto de producto** de la persona, en su celular, para la tarea 2.
- **Graba la pantalla** del celular de la persona, con su permiso.

Dile al empezar: "Estamos probando la app, no a ti. Si algo no se entiende, es culpa de la app. Piensa en voz alta." No le expliques las pantallas ni le muestres dónde tocar. Si se traba más de 2 minutos, anota dónde y ayuda a la persona a seguir.

## Tareas

### 1. Crea tu tienda

> "Imagina que acabas de descargar Tiendly. Crea la tienda de tu negocio."

Qué observar:
- Si entiende el código por WhatsApp o espera un mensaje real.
- Si el link que le propone (`tiendly.pe/…`) le parece suyo o quiere cambiarlo.
- Si elige más de un rubro cuando vende más de una cosa.
- Cuánto tarda desde la primera pantalla hasta "¡Tu tienda está lista!".

### 2. Sube un producto que vendes

> "Sube uno de tus productos, con su foto, su precio y las tallas o colores que tienes."

Qué observar:
- Si encuentra cómo empezar (Inicio › "Agrega tu primer producto" o la pestaña Productos).
- Si entiende colores × tallas como un solo producto con variantes, o intenta crear un producto por color.
- Dónde duda con el stock por variante.
- Si lee el aviso al guardar y si va a ver cómo quedó en su tienda.

### 3. Comparte tu tienda

> "Mándale el link de tu tienda a este número para que te compre." (el celular del cliente)

Qué observar:
- Si usa "Compartir por WhatsApp" o copia el link.
- Si abre su tienda para revisarla antes de mandarla.
- Qué le parece cómo se ve su tienda (pide que lo diga con sus palabras).

### 4. Atiende el pedido que te llega

Desde el celular del cliente, compra su producto con "Pedir por WhatsApp" y manda el mensaje. Luego dile:

> "Te llegó un pedido de un cliente. Atiéndelo como lo harías hoy."

Qué observar:
- Por dónde busca el pedido: WhatsApp, Inicio o Pedidos.
- Si entiende que el producto está reservado 24 horas y que, sin pago, se cancela solo.
- Si encuentra "Marcar como pagado" cuando el cliente le "paga" (dile que ya le yapearon).

### 5. Envía el pedido y revisa cómo te fue

> "Ya mandaste el pedido con el motorizado. Regístralo y dime cuánto vendiste hoy y cuánto stock te queda de ese producto."

Qué observar:
- Si encuentra "Marcar como enviado".
- Si va a Inicio para ver lo vendido y si entiende "Solo cuenta pedidos pagados".
- Si encuentra el stock que bajó (Productos) sin ayuda.

## Al terminar, pregunta

1. "¿Qué parte te costó más o te hizo dudar? ¿Por qué?"
2. "Hoy, ¿cómo llevas tus pedidos y tu stock? ¿Esto te reemplaza algo de eso o sería una cosa más?"
3. "Si mañana tu tienda estuviera lista con todos tus productos, ¿se la mandarías a tus clientes? ¿Qué le falta para que lo hagas?"

## Para anotar por persona

| Tarea | ¿Lo logró? (sí / con ayuda / no) | Tiempo | Dónde dudó | Cita textual |
|---|---|---|---|---|
| 1. Crear tienda | | | | |
| 2. Subir producto | | | | |
| 3. Compartir | | | | |
| 4. Atender pedido | | | | |
| 5. Enviar y revisar | | | | |
