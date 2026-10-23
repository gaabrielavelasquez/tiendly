# Auditoría multirubro (decisión 0032)

- **Fecha:** 22-oct-2026
- **Estado:** aprobada por Gabi el 22-oct-2026, con las respuestas del final. PR 1 y PR 4 en curso; PR 3 espera su ok sobre una propuesta a 390 y 1440 px.
- **Alcance:** todo lo que hoy asume moda (color × talla, calzado, ejemplos de Heather) en el modelo de datos, el panel, la vitrina, la compra y los pedidos.

Esfuerzo: **S** (menos de medio día), **M** (1 a 2 días), **L** (3 días o más). Riesgo: qué se puede romper.

## Resumen

El corazón del problema es uno: `Variante = { color, talla, stock }`. De ahí salen la clave `color|talla` del stock, el carrito, la compra, los mensajes de WhatsApp, el formulario y los selectores de la vitrina. Las categorías son un tipo fijo de calzado (`balerinas | tacos | …`). Lo demás es copy y datos de ejemplo.

Lo bueno: los pedidos ya guardan la variante como texto (`ItemPedido.variante = "Plata · 36"`), así que los pedidos existentes no se migran. Y la clave nueva puede ser idéntica a la vieja (`"Plata|36"`), así que el stock vendido y reservado tampoco.

---

## 1. Modelo de datos

**Hoy.** `productos/types.ts`: `Variante = { color: string; talla: string; stock: number }`. Sin color o sin talla se usan los valores centinela `"Único"` y `"Única"`. `Categoria` es una unión fija de 7 tipos de calzado; `LABEL` (vitrina) y `CATEGORIAS` (formulario) la repiten. Las fotos van por color (`fotos: Record<color, string[]>`). El inventario (`inventario.ts`) y el carrito usan `{ id, color, talla }`.

**Propuesta.**

```ts
type TipoOpcion = "color" | "talla" | "otra";
type Opcion = { nombre: string; tipo: TipoOpcion; valores: string[] };    // hasta 3
type Variante = { valores: string[]; stock: number; precio?: number; sku?: string }; // valores en el orden de `opciones`
type Producto = { …; opciones: Opcion[]; variantes: Variante[]; categorias: string[]; fotos?: Record<string, string[]> };
```

- **Clave de variante:** `valores.join("|")`. Para un producto de Heather, `["Plata", "36"]` da `"Plata|36"`, la misma clave de hoy.
- **Sin opciones:** `opciones: []` y una sola variante con `valores: []`. Desaparecen "Único" y "Única".
- **Fotos:** por valor de la opción de tipo `color` (si no hay, una sola galería). Igual que hoy para Heather.
- **Categorías:** texto libre de cada tienda (`string[]`), guardado con la tienda. Ya no hay unión fija.
- **Precio y SKU por variante:** el formulario ya los pide pero el modelo no los guarda; se suman como opcionales.

**Esfuerzo:** M. **Riesgo:** alto, porque todo lo demás depende de esto. Se mitiga con la migración en lectura (ver §11) y con un adaptador `descripcionVariante(producto, valores)` que usan todas las pantallas.

## 2. Formulario de crear y editar producto

**Hoy.** `tarjeta-variantes.tsx`: chips de "Colores" con sugeridos de Heather (Burdeos, Vainilla, Choco, Camel…), "Tallas de ropa" (XS–XL) y "Tallas de calzado" (35–40, solo tallas de mujer). Descripción: "Elige los colores y tallas de este modelo. Sin tallas, se vende como talla única.". El acordeón móvil agrupa por color y dice "6 tallas". El SKU sugerido es `NOM-COL-TALLA`. Categorías: 4 chips de calzado fijos en `tarjetas-laterales.tsx`. Placeholder del nombre: "Ej. Vestido Chloé".

**Propuesta.**

- Sección **Opciones**: "¿Tiene opciones como color, talla o tamaño?" + "Agregar opción". Cada opción: nombre (sugeridos Color, Talla, Tono, Tamaño, Material, Aroma o uno propio) y sus valores en chips. Hasta 3.
- Sugerencias según los rubros de la tienda: Ropa → Talla XS–XXL; Calzado → Talla 35–45; Belleza → Tono; Hogar → Tamaño y Material. Solo sugerencias, nada viene marcado.
- Planilla y acordeón genéricos: agrupan por la primera opción ("Plata · 6 variantes · 16 unidades").
- Categorías: chips con las categorías que ya usa la tienda + "Nueva categoría".
- Placeholder del nombre rotando entre rubros o neutro ("Ej. Lámpara lunar impresa en 3D").

**Esfuerzo:** L. **Riesgo:** medio. Es la pantalla más compleja del panel (10 archivos en `components/form`); hay que mantener los 4 estados y el límite de 150 líneas por componente. Necesita capturas a 390 y 1440 y el ok de Gabi en el diseño de "Agregar opción".

## 3. Edición rápida de stock

**Hoy.** No existe en código. Figma tiene la hoja de stock (PR2, móvil) y el panel lateral (PRD2, desktop) "por color y talla"; la fila de la lista solo tiene Editar y Duplicar.

**Propuesta.** Construirla ya genérica: una fila por variante, agrupada por la primera opción, con solo la cantidad. Reutiliza el acordeón del formulario.

**Esfuerzo:** M. **Riesgo:** bajo (es nueva). Depende de §1.

## 4. Lista de productos y miniaturas

**Hoy.** `resumenVariantes` dice "2 colores · 3 tallas" y no cuenta "Única". `Miniatura` elige un ícono por categoría y todas son `Footprints` (huellas). Estado vacío: "Agrega tu primer modelo con sus colores y tallas.".

**Propuesta.** Resumen por opción ("3 tonos", "2 colores · 4 tallas", nada si no hay opciones). Ícono neutro (`Package`) sin foto. Vacío: "Agrega tu primer producto. Si tiene opciones como color, talla o tamaño, van en el mismo producto.".

**Esfuerzo:** S. **Riesgo:** bajo.

## 5. Vitrina: selectores y tabla de tallas

**Hoy.** `ficha-producto.tsx` maneja exactamente un color y una talla: `SelectorColor` (muestras con `HEX_COLOR`, un mapa fijo de 7 colores de Heather; otro color sale sin muestra) y `SelectorTalla` (botones + "Ver tabla de tallas" con `TALLAS_CM`, que solo tiene 35–40 en cm de pie; para S/M/L muestra "—"). Error: "Elige tu talla.". Mensaje de WhatsApp: "quiero X en Plata, talla 36". "Sobre el modelo" como título.

**Propuesta.**

- Un selector por opción: tipo `color` → muestras (con hex si la tienda lo cargó, si no, botones con el nombre); tipo `talla` u `otra` → botones. Agotadas deshabilitadas, igual que hoy.
- **Tabla de tallas solo si hay una opción de tipo `talla` y la tienda cargó su tabla.** Sin tabla cargada, no se muestra el link (hoy muestra "—"). Cargar la tabla queda para después (Mi tienda o el producto).
- Error: "Elige {opción en minúscula}." ("Elige un tono.", con artículo por opción).
- WhatsApp: "quiero X (Plata · 36)".
- "Sobre el modelo" → "Sobre el producto".

**Esfuerzo:** M. **Riesgo:** medio. Es lo que ve el cliente; Heather y Aurora tienen que verse igual que hoy (prueba visual antes y después).

## 6. Carrito

**Hoy.** `ItemCarrito = { id, color, talla, cantidad }` en `localStorage` (`tiendly:carrito:<slug>`). Línea: "Plata · Talla 36". Errores: "Se agotó esta talla. Quítala para seguir con tu compra." y "Quita las tallas agotadas para finalizar tu compra.".

**Propuesta.** `ItemCarrito = { id, variante: clave, cantidad }`. `leerCarrito` convierte los ítems viejos (`{ color, talla }` → `variante`) sin perder lo que el cliente tenía. Línea con `descripcionVariante`. Errores: "Se agotó. Quítalo para seguir con tu compra." y "Quita los productos agotados para finalizar tu compra.".

**Esfuerzo:** S. **Riesgo:** medio: un carrito viejo mal leído se vacía. Se cubre con el adaptador y una prueba con un carrito guardado a mano.

## 7. Compra (checkout)

**Hoy.** `checkout/lib`: stock por `color|talla`, "Solo quedan 2 de X en talla 36", "Se agotó X en talla 36", `variante: "${color} · ${talla}"` al crear el pedido, mensaje de WhatsApp "— Plata, talla 36". `desglose.tsx`: "Plata · Talla 36 · 1 unidad".

**Propuesta.** Todo por clave de variante y `descripcionVariante`: "Solo quedan 2 de X (Plata · 36)". Sin opciones, solo el nombre.

**Esfuerzo:** S. **Riesgo:** medio (toca el cálculo de stock disponible; pruebas del core loop: compra pagada, por WhatsApp, reserva vencida).

## 8. Pedidos

**Hoy.** `ItemPedido.variante` ya es texto libre. El detalle de demo de Heather (`detalle-mock.ts`) arma "color · talla" con su catálogo.

**Propuesta.** Nada en el modelo. El texto lo arma la compra (§7). Los pedidos viejos se siguen leyendo igual.

**Esfuerzo:** S. **Riesgo:** bajo.

## 9. Placeholders, copy y datos de demo

| Dónde | Hoy | Propuesta | Esf. |
|---|---|---|---|
| Inicio, paso 1 (tienda nueva) | "Con foto, precio y tallas ya se puede vender." | "Con foto y precio ya se puede vender." | S |
| Formulario, nombre | "Ej. Vestido Chloé" | Ejemplo de otro rubro | S |
| Formulario, descripción | "Cuenta de qué está hecho, cómo queda y cómo cuidarlo." | "Cuenta de qué está hecho, qué incluye y cómo usarlo." | S |
| Onboarding, nombre de tienda | "Ej. Heather" | Nombre de ejemplo neutro de otro rubro | S |
| Onboarding, mini tienda | "Nueva colección" | "Novedades" | S |
| Mi tienda, Pro | "Por ejemplo, heathercalzado.pe." | "Por ejemplo, tutienda.pe." | S |
| Mi tienda, bienvenida de ejemplo | "Zapatos que acompañan tu día, hechos para ti." | Solo para Heather; neutra para el resto | S |
| Registro, vista previa | Aurora Calzado | **Hecho en #20:** MUÑA, keyhaus y Glow Labo | M |
| Demo en Vercel | Aurora Calzado (solo calzado) | **Hecho en #20:** MUÑA reemplaza a Aurora (`/muna`); keyhaus y Glow Labo pueden sumarse como tiendas de verdad después | M |
| Heather (local) | Calzado de mujer | Se queda: es una tienda real de calzado | — |

**Riesgo:** bajo. Las fotos de las tiendas nuevas son el cuello de botella.

## 10. Rubros del onboarding

**Hoy.** `rubros.ts`: Moda, Calzado, Accesorios, Belleza, Repostería, Otro. Varios a la vez. Los usa también Afiliación (precarga). El tema ya no depende del rubro.

**Propuesta.** Lista más amplia, en orden alfabético para que ninguno parezca el principal: Accesorios, Belleza y cuidado personal, Calzado, Comida y repostería, Hogar y decoración, Impresión 3D y hecho a mano, Ropa, Segunda mano, Tecnología, Otro. Los `id` existentes no cambian (`moda` pasa a mostrarse como "Ropa"), así que las tiendas guardadas siguen válidas. Los rubros alimentan las sugerencias de opciones de §2.

- **Vapes:** Gabi los nombró. En Perú la venta tiene restricciones (al menos, a menores de edad). Propongo no listarlos como rubro hasta revisar qué exige la ley y si la pasarela de pagos los acepta; mientras tanto, entran por "Otro".

**Esfuerzo:** S. **Riesgo:** bajo (vapes: legal y de afiliación).

## 11. Migración de los datos existentes

Datos que hay hoy:

- **Redis (producción y preview):** la tienda de demo (MUÑA desde #20; Aurora queda retirada) y las tiendas creadas en pruebas, cada una en `<entorno>:tienda:<slug>`, con productos, inventario y pedidos.
- **Código:** Heather (local) y MUÑA se siembran desde `catalogo-heather.ts` y `semillas.ts`.
- **Navegador del cliente:** carrito en `localStorage`.

Plan, en este orden, sin cortar el servicio:

1. **Lector tolerante.** `migrarProducto(p)` en `lib/datos/tienda.ts`, al leer: si el producto tiene `opciones`, pasa igual; si no, arma `opciones` desde sus variantes viejas (`Color` si algún color no es "Único", `Talla` si alguna talla no es "Única") y `valores` en ese orden. Es idempotente y no escribe: la tienda se guarda migrada la próxima vez que cambie algo.
2. **Inventario.** `ItemStock { id, color, talla }` → `{ id, variante }`. Como `variante` es `"Plata|36"`, las claves internas son las mismas. Para productos con "Único/Única" se usa `claveLegado(p, color, talla)`, que traduce al valor nuevo (`""`, `"Plata"` o `"36"`). Las asignaciones viejas se leen con esa función.
3. **Carrito.** `leerCarrito` traduce `{ color, talla }` igual que el inventario.
4. **Categorías.** `"balerinas"` → `"Balerinas"` con el `LABEL` actual, una vez, al leer. Las tiendas nuevas escriben texto libre.
5. **Semillas.** `catalogo-heather.ts` y la de MUÑA (`semillas.ts`) pasan a escribir el formato nuevo directo.
6. **Pruebas antes del PR:** un JSON real de producción (exportado de Redis) pasado por `migrarProducto`, comparando stock disponible y textos de variante antes y después: tienen que ser idénticos. Más el recorrido del core loop en Heather y Aurora (compra pagada, por WhatsApp, reserva vencida, stock 20 → 18).
7. **Limpieza** (otro PR, cuando todas las tiendas se hayan guardado al menos una vez o con un script de una sola vez): quitar el lector viejo.

**Riesgo principal:** que una reserva vigente deje de descontar stock porque su clave cambió. Se cubre con el punto 2 y la prueba del punto 6.

## Orden propuesto (PRs)

1. **Modelo + migración + adaptadores** (§1, §11): sin cambios visibles. Heather y la tienda de demo se ven idénticas. **M**.
2. **Vitrina, carrito, compra** (§5–§8): genéricos, con capturas antes y después. **M**.
3. **Formulario de producto + lista** (§2, §4): necesita diseño aprobado de "Agregar opción". **L**.
4. **Copy, rubros y placeholders** (§9, §10): se puede adelantar, es independiente. **S**.
5. **Edición rápida de stock** (§3), ya genérica. **M**.
6. **Demos y vista previa del registro** con 3 rubros (§9), cuando lleguen las fotos. **M**.

## Respuestas de Gabi (22-oct-2026)

1. **Hasta 3 opciones** por producto.
2. **La tienda elige qué opción cambia las fotos.** Por defecto, la de color o la llamada "Tono", si existe (`opcionFotos` en el modelo; -1 = una sola galería).
3. **Tabla de tallas por producto**, con un atajo para reusar la de otro producto.
4. **Vapes en "Otro"** hasta revisar lo legal y las pasarelas de pago.
5. **PR 4 se adelanta.** PR 1 y PR 4 ya; PR 2 después de PR 1; PR 3 se combina con el pase de diseño de Productos (reglas 0031) y antes de programarlo se muestra una propuesta a 390 y 1440 px; PR 5 y PR 6 después (PR 6 espera las fotos).

## Para la migración al backend real

- **`duena`** (`TiendaSesion.duena`, `SesionPanel`, `useDuena`): no se renombra ahora porque está guardado en Redis. Al pasar al backend real, renombrarlo a un nombre sin género (p. ej. `nombreContacto`) en la misma migración de datos.
- **Lector del formato viejo** (`migrarProducto`, `migrarItemStock`, `claveLegado` y la traducción del carrito): se quita en esa misma migración, cuando todos los datos estén en el formato nuevo.
