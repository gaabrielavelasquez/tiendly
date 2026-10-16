# 🛠️ CLAUDE.md — Senior Frontend Developer Guidelines & AI Skills

Este archivo establece los estándares de programación, arquitectura técnica, referencias de diseño e instrucciones de ejecución para el desarrollo frontend del panel y las tiendas de **Tiendly**.

---

## 1. Principios de Desarrollo

1. **Strict Context Adherence:** Consulta siempre `DESIGN.md` antes de escribir o modificar componentes UI.
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
- **Selección:** chips, fichas, radios, tarjetas de opción e interruptores seleccionados usan `selection/*` (negro carbón `#1A1A1A` + texto blanco). El cobalto con degradado es exclusivo del botón primario (CTA).
- **Forma:** botones de `10px` (`radius/button`); chips y badges en pill compacto (`radius/chip`): chip de 32 px y badge de 24 px de alto visibles, con zona táctil de 44 px en los chips. Ante cualquier diferencia, manda `DESIGN.md`.