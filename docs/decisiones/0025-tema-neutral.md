# 0025 · Tema Neutral: Outfit y radios de 6–8 px

- **Fecha:** 16-oct-2026
- **Estado:** aceptada (Gabi). Vigente.
- **Commit:** `b895000`.

## Contexto

Por el [addendum a 0013](0013-addendum-tema-neutral.md), toda tienda nueva arranca en Neutral, así que es el tema que más clientes van a ver. Sus titulares en Bricolage Grotesque Bold y sus radios no conversaban con el panel calibrado.

## Decisión

- Titulares en **Outfit SemiBold** (antes Bricolage Grotesque Bold).
- Fotos y tarjetas de 8 px; chips y botones de 6 px.
- Acento y selección en negro carbón: la UI se aparta y la foto manda.
- El crédito "Hecho con Tiendly" va atenuado en el pie.

## Consecuencias

- Solo cambia el modo `neutral` de los tokens.
- Heather usa el tema **Editorial** (referencia de Figma), no Neutral: `layout.tsx` de `[tienda]` elige el tema.
