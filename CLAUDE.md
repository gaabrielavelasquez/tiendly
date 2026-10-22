# 🛠️ CLAUDE.md — Senior Frontend Developer Guidelines & AI Skills

Este archivo establece los estándares de programación, arquitectura técnica, referencias de diseño e instrucciones de ejecución para el desarrollo frontend del panel y las tiendas de **Tiendly**.

---

## 1. Principios de Desarrollo

1. **Strict Context Adherence:** Consulta siempre `DESIGN.md` antes de escribir o modificar componentes UI.
   - **Fuente de verdad (decisión 0026):** las reglas visuales viven en `DESIGN.md`, `design/tokens.json` y el código. Figma es la referencia de flujos y de estructura de pantallas, no de valores visuales. Las decisiones se registran en `docs/decisiones/`.
2. **Cero Hardcoding:** Prohibido escribir colores hexadecimales o valores directos de `padding`/`margin` en los componentes. Utiliza únicamente las clases de Tailwind configuradas con los tokens semánticos del Azul Cobalto Eléctrico, degradados sutiles y bordes suavizados.
3. **Modularidad & Archivos Pequeños:** Cada componente debe ser una función autocontenida de menos de 150 líneas. Separa la lógica de negocio en custom hooks.
4. **Mobile-First & Performance:** Todo diseño se construye priorizando la vista de 390px antes de escalar a vistas desktop.

---

## 2. Reglas de Negocio & Micro-copy Inmutables

- **Neutralidad de género:** Usa siempre la palabra **"cliente"**.
- **Micro-copy:** Todos los helper texts, descripciones e instrucciones deben terminar obligatoriamente con punto (`.`).
- **Estructura de catálogo:** 1 modelo = 1 producto con variantes de colorway y talla.
- **Reservas de pago:** Regla de 24 horas con auto-cancelación en Pedidos.

---

## 3. Toolkit Visual & UI Design Skills (Librerías de Referencia)

Claude utilizará los siguientes principios y bibliotecas de UI/Motion para evitar diseños genéricos ("vibecoding") y ofrecer acabados de nivel elite D2C/Millennial:

1. **Superdesign & Design Taste:**
   - [Superdesign](https://github.com/superdesigndev/superdesign) & [Design Taste](https://github.com/madebymustafa/design-taste): Aplicación de contraste tipográfico agresivo, jerarquía clara en tarjetas y paletas refinadas.
2. **Better Design & Canvas UI:**
   - [Better Design](https://github.com/marvkr/better-design) & [Canvas UI](https://github.com/DavidHDev/canvas-ui): Componentes interactivos limpios, maquetación de micro-dashboards y contenedores con elevaciones sutiles.
3. **Paper Shaders & Hyperiux:**
   - [Paper Shaders](https://github.com/paper-design/shaders) & [Hyperiux Components](https://github.com/Hyperiux-Immersive/Hyperiux): Efectos de luz difuminados, halos celestes en fondos y degradados suaves tipo Luma en banners y headers.
4. **UI Layouts, Motion Primitives & Cursify:**
   - [UI Layouts](https://github.com/ui-layouts/ui-layouts), [Motion Primitives](https://github.com/ibelick/motion-primitives) & [Cursify](https://github.com/ui-layouts/cursify): Micro-animaciones fluidas con Framer Motion (`150ms ease-out`), feedback háptico/active scale en botones (`active:scale-[0.98]`) y transiciones dinámicas de cursor/foco.

---

## 4. Stack Técnico Recomendado

- **Framework:** Next.js (App Router) / React Native.
- **Styling:** Tailwind CSS + CSS Variables con Tokens de `DESIGN.md`.
- **Componentes Base:** Radix UI / Shadcn UI + Motion Primitives.
- **Iconografía:** Lucide Icons.

---

## 5. Definición de Componentes & Estado

- **Estados Obligatorios:** Todo módulo o vista debe incluir:
  1. Estado de Carga (Skeletons pulidos).
  2. Estado Vacío (Empty State accesible con ilustración o mensaje directo).
  3. Estado con Datos.
  4. Estado de Error.
- **Feedback Háptico / Visual:** Botones con transición `150ms ease-out` y escala al presionar (`active:scale-[0.98]`).
- **Cobalto y selección:** el degradado cobalto va **solo** en el botón primario (CTA) y en **una** tarjeta protagonista por pantalla, como máximo (hoy: la tarjeta "Hoy" de Inicio, con su degradado corto de 0031). La barra del período actual en los gráficos va en cobalto sólido, aprobada por Gabi. Todo lo demás sigue `selection/*` (chips, fichas, radios, tarjetas de opción, interruptores: negro carbón `#1A1A1A` + texto blanco) e `indicator/*` (progreso, pasos, línea de tiempo: negro carbón). Links y botón Fantasma en `accent/text`.
- **Forma (decisiones 0024 y 0031):** tarjetas de `8px` con borde casi invisible (`border/card`) y sombra nítida (`elevation/card`); botones, campos, chips y badges de `6px`, 40 px de alto en botones y campos (chip de 28 px y badge de 24 px visibles, zona táctil de 44 px). Lienzo `#F8F8F6`. Ante cualquier diferencia, manda `DESIGN.md`.
- **De-layering (decisión 0031, ver `DESIGN.md` §3 y §4):**
  - Saludo en dos tonos (primario + secundario, mismo tamaño), sin emoji.
  - Títulos de sección fuera de los contenedores; cada lista en UN contenedor con divisores finos; jerarquía por espacio y tipografía, no por cajas.
  - Íconos finos, gris neutro, sin contenedores circulares; el color solo para lo que pide atención.
  - Urgencia y plazos como texto de color (sin píldora); píldoras y badges solo para estados donde hacen falta.
  - Filas de acción: toda la fila es el link (mín. 44 px), chevron simple, sin botones circulares.
  - Dinero: Regular o Medium, cifras tabulares, "S/" y decimales atenuados; SemiBold solo en totales. Deltas: solo la cifra en verde o rojo.
  - Tarjeta protagonista: máximo una por pantalla, cobalto con degradado corto y profundidad en capas; sin sombra de color difuminada ni grano.
  - Halos: solo detrás de la protagonista o en momentos de logro; nunca como fondo de página.
  - Gráficos: barras sólidas, pasados en gris medio, actual en cobalto, sin riel para lo que no llega.

---

## 6. Congelamiento estético (Aesthetic freeze)

Vigente hasta completar el Core Loop (onboarding → productos → vitrina → pedidos → carrito y compra). El Core Loop se completó (PR #12) y el congelamiento se levantó **solo** para el pase de diseño 0031, ya cerrado: sus reglas viven en `DESIGN.md`. Lo de abajo sigue valiendo para cualquier cambio visual nuevo.

- **No se cambian** tokens de color, radios, sombras, tipografía ni espacios, ni en `design/tokens.json` ni con clases nuevas que los imiten.
- Las pantallas nuevas **reutilizan solo** los componentes de `src/components/` y los tokens existentes. Si algo no se puede armar con ellos, se pregunta antes de crear uno nuevo.
- Cualquier cambio visual necesita la **aprobación explícita de Gabi** y se registra como decisión en `docs/decisiones/`.

---

## 7. Workflow

1. **Una rama por módulo**, creada desde `main` (`feat/<módulo>`; `chore/<tema>` para lo que no es pantalla).
2. **Mobile-first:** primero a 390 px, después a 1440 px.
3. **Cuatro estados en cada vista:** carga, vacío, con datos y error.
4. **Antes de abrir el PR:** `npm run check:tokens` y `npm run build`, los dos sin errores.
5. **Revisar las pantallas en el navegador** a 390 px y a 1440 px.
6. **Abrir un PR con capturas** de cada pantalla en los dos tamaños.
7. **Nunca hacer merge sin la aprobación de Gabi.**
