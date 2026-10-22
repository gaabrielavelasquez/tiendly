# 0030 · Heather es la tienda de demo Pro

- **Fecha:** 16-oct-2026
- **Estado:** aceptada (Gabi). Vigente.
- **Ajusta:** 0028 (la portada partida queda para las tiendas Free).

## Contexto

A Gabi le gustó más la portada con el texto encima de la foto ("Otoño · Invierno 2026", "Nueva colección" y el botón). Según 0027 y 0028 esa portada es una función Pro (V1.1, "banner de alto impacto").

## Decisión

- **Heather pasa a ser la tienda de demo del Plan Pro** (`tiendaActual.plan = "pro"`): muestra la portada con texto encima (`PortadaPro`).
- Las tiendas Free siguen con la portada partida de 0028 (foto con zapatos puestos | solo zapatos, titular y CTA debajo).
- **Más adelante se arma una tienda de demo Free** para mostrar ese plan completo.

## Consecuencias

- El plan manda en todo lo que distingue a Free de Pro, no solo en la portada. Hoy: cupones ilimitados en Pro y hasta 3 en uso en Free (módulo 3).
- La vista Free de Cupones (límite de 3) se sigue viendo con `?escenario=limite` hasta que exista la tienda Free.
