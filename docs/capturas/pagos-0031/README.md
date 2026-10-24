# Pagos, Cobros automáticos y Afiliación · #37

Antes Vercel main 4ab96fa: https://tiendly-ju9e56qi3-gaabrielavelasquez-8525s-projects.vercel.app.
Después de las pantallas (ca9c807): https://tiendly-aa54urq12-gaabrielavelasquez-8525s-projects.vercel.app.
Heather solo en cada despliegue para mostrar estados de ejemplo; sin cambiar variables del proyecto. Capturas originales, primero 390×844 y luego 1440×1000.

| Vista | Antes | Después |
|---|---|---|
| pagos | [390](before/pagos-390.jpg) · [1440](before/pagos-1440.jpg) | [390](after/pagos-390.jpg) · [1440](after/pagos-1440.jpg) |
| pagos-sin-activar | [390](before/pagos-sin-activar-390.jpg) · [1440](before/pagos-sin-activar-1440.jpg) | [390](after/pagos-sin-activar-390.jpg) · [1440](after/pagos-sin-activar-1440.jpg) |
| pagos-revision | [390](before/pagos-revision-390.jpg) · [1440](before/pagos-revision-1440.jpg) | [390](after/pagos-revision-390.jpg) · [1440](after/pagos-revision-1440.jpg) |
| pagos-error | [390](before/pagos-error-390.jpg) · [1440](before/pagos-error-1440.jpg) | [390](after/pagos-error-390.jpg) · [1440](after/pagos-error-1440.jpg) |
| cuenta-comisiones | [390](before/cuenta-comisiones-390.jpg) · [1440](before/cuenta-comisiones-1440.jpg) | [390](after/cuenta-comisiones-390.jpg) · [1440](after/cuenta-comisiones-1440.jpg) |
| inicio | [390](before/inicio-390.jpg) · [1440](before/inicio-1440.jpg) | [390](after/inicio-390.jpg) · [1440](after/inicio-1440.jpg) |
| revision | [390](before/revision-390.jpg) · [1440](before/revision-1440.jpg) | [390](after/revision-390.jpg) · [1440](after/revision-1440.jpg) |
| observada | [390](before/observada-390.jpg) · [1440](before/observada-1440.jpg) | [390](after/observada-390.jpg) · [1440](after/observada-1440.jpg) |
| aprobada | [390](before/aprobada-390.jpg) · [1440](before/aprobada-1440.jpg) | [390](after/aprobada-390.jpg) · [1440](after/aprobada-1440.jpg) |
| afiliacion-error | [390](before/afiliacion-error-390.jpg) · [1440](before/afiliacion-error-1440.jpg) | [390](after/afiliacion-error-390.jpg) · [1440](after/afiliacion-error-1440.jpg) |
| paso-1 | [390](before/paso-1-390.jpg) · [1440](before/paso-1-1440.jpg) | [390](after/paso-1-390.jpg) · [1440](after/paso-1-1440.jpg) |
| paso-2 | [390](before/paso-2-390.jpg) · [1440](before/paso-2-1440.jpg) | [390](after/paso-2-390.jpg) · [1440](after/paso-2-1440.jpg) |
| paso-3 | [390](before/paso-3-390.jpg) · [1440](before/paso-3-1440.jpg) | [390](after/paso-3-390.jpg) · [1440](after/paso-3-1440.jpg) |
| paso-4 | [390](before/paso-4-390.jpg) · [1440](before/paso-4-1440.jpg) | [390](after/paso-4-390.jpg) · [1440](after/paso-4-1440.jpg) |
| paso-5 | [390](before/paso-5-390.jpg) · [1440](before/paso-5-1440.jpg) | [390](after/paso-5-390.jpg) · [1440](after/paso-5-1440.jpg) |

Carga SSR antes de hidratar: [390](after/carga-390.jpg) · [1440](after/carga-1440.jpg). Las capturas completas conservan la barra fija en su posición del viewport inicial; padding y zona segura permiten ver el final al desplazar. Foco programático en el título de cada paso, controles con foco visible. Pagos/afiliación sin datos corresponde a Sin activar/Antes de empezar; no se inventan métodos o solicitudes.

Chrome/WebKit local: RUC no habido bloquea Continuar; RUC válido simulado, cuatro pasos, representante/CCI, términos y solicitud enviada. Switches encendidos con check, sin scroll. Vercel: escenarios con sesión ficticia en navegador para pasos y solicitud, sin consultar/enviar acciones del servidor. Chrome 390/1440 y WebKit 390/1440/360, sin scroll. Cuenta/comisiones conserva 0.30 (tiene céntimos); no se añade .00. Mocks de bancos/SUNAT/pasarela, sin mensajes o cobros reales. Reglas 0007 sin cambios. Tokens/build local/Vercel pasan. Sin merge.
