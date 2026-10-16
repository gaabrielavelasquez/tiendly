# 0013 · Addendum: tema Neutral para toda tienda nueva

- **Fecha:** 16-oct-2026
- **Estado:** aceptada (Gabi)
- **Reemplaza:** la regla de 0013 "el tema por defecto sale del rubro" (Moda, Calzado y Accesorios → Editorial; Belleza y Repostería → Suave; Otro → Neutral).

## Decisión

Toda tienda nueva arranca con el tema **Neutral**. La persona puede cambiar a Editorial o Suave, o personalizarlo, cuando quiera desde **Mi tienda**.

"¿Qué vendes?" pasa a ser de **selección múltiple** y ya no define el tema.

## Por qué

- Con selección múltiple (por ejemplo, Moda y Belleza) no hay un solo tema que elegir, y cualquier regla de desempate sería arbitraria.
- Elegir el tema sin avisar le quita control a la persona. Arrancar en Neutral y decirlo claro es transparente y le deja la decisión.

## Copy

- Título de la celebración (O4 / OD4): **"¡Tu tienda está lista!"**. "¡Tu tienda ya existe!" sonaba a error de nombre repetido.
- Mensaje: **"Le pusimos el tema Neutral para empezar. Podrás cambiarlo o personalizarlo cuando quieras desde Mi tienda."**
- Ayuda de "¿Qué vendes?": **"Elige todas las que apliquen."**

## En código

- `src/features/onboarding/lib/rubros.ts`: `TEMA_INICIAL`, `EXPLICACION_TEMA` y `alternarRubro`. Se elimina `temaDe`.
- El estado del onboarding guarda `rubros: RubroId[]`, que reemplaza a `rubro`.

> Copia este addendum en el proyecto "IA on Product Design" → `tiendly/decisiones/`, junto a 0013.
