# Brief · Inicio (`feat/inicio`)

Fuente: decisión **0012** (proyecto "IA on Product Design" → `tiendly/decisiones/0012-inicio-tareas-primero.md`) y Figma, página **Flujos** → **Módulo 8 · Panel · Inicio**.

| Pantalla | Nodo Figma (`zHR0uS37OATafFq7U4NEwr`) |
|---|---|
| I1 · Móvil con actividad | `256:5725` |
| I2 · Móvil, tienda nueva | `256:5906` |
| ID1 · Desktop con actividad | `257:5753` |
| ID2 · Desktop, tienda nueva | `257:5981` |

## Qué construir (ruta `/panel`, carpeta `src/features/inicio`)

1. **Hoy:** ventas del día (S/) y pedidos del día. Solo cuentan los pedidos pagados.
2. **Para atender hoy:** pedidos por enviar · reservas que vencen hoy · productos agotados. Cada fila lleva a la lista ya filtrada. Solo aparecen las filas con algo pendiente; si no hay nada, se muestra "Todo al día".
3. **Esta semana:** total, cantidad de pedidos, comparación con la semana pasada (flecha + texto, no solo color) y barras por día con hoy resaltado. En desktop, al pasar el mouse por una barra se ve el detalle.
4. **Compartir la tienda por WhatsApp** (`wa.me` con el link), siempre a mano.
5. **Tienda nueva:** 4 pasos para arrancar con barra de progreso y mensaje según el avance. Solo el siguiente paso pendiente lleva "Configurar →"; los demás, chevron. Al completar los 4, Inicio pasa a la vista con actividad.
6. **Desktop:** Hoy y Para atender hoy lado a lado; Esta semana a todo el ancho. En tienda nueva, los pasos a la izquierda y el link de la tienda a la derecha.

## Movimiento (pedido de Gabi)

- **Contador de ventas:** el número sube hasta el valor (Motion Primitives `sliding-number` o `animated-number`).
- **Barras de "Esta semana":** entran desde abajo (`scaleY` 0 → 1, origen abajo), escalonadas por día.
- **Tarjetas de "Para atender hoy":** entrada escalonada (fade + y).
- Duración y curva salen de `motionTokens` (150 ms ease-out); los escalonados pueden ser más largos.
- Todo respeta `useReducedMotion`.
- Motion Primitives se copia al proyecto, no se instala como paquete: `npx motion-primitives@latest add <componente>`, y va en `src/components/motion/`.

## Reglas que no se negocian

- **Tokens:** cero valores escritos a mano; `npm run check:tokens` tiene que pasar.
- **Colores:**
  - las barras van en `bg-chart`;
  - la barra de hoy va en cobalto (`bg-bar-today`, accent/base). *Cambiado el 16-oct-2026 por la decisión 0020; antes iba en `bg-indicator`.*;
  - el cobalto con degradado es solo para el botón primario.
- **Los 4 estados:** carga (ya existe `loading.tsx`), vacío, con datos y error.
- **Copy:** tuteo sin voseo, "cliente" y punto final en descripciones.
- **Datos:** simulados en `src/features/inicio/lib/mock.ts` hasta tener backend. Hay que poder alternar entre "con actividad" y "tienda nueva".
