# Google OAuth · Tiendly

Cliente de tipo **Aplicación web**. Añadir en Google Cloud → Credenciales → URI de redirección autorizados:

| Entorno | URI |
|---|---|
| Desarrollo local (Worker, puerto 3215) | `http://localhost:3215/api/auth/callback/google` |
| Preview previsto | `https://tiendly-preview.dmalvaradog26.workers.dev/api/auth/callback/google` |
| Producción prevista, si se confirma tiendly.pe | `https://tiendly.pe/api/auth/callback/google` |

El subdominio Workers de la cuenta se comprobó por lectura de la API de Cloudflare el 8-nov-2026. El Worker de aplicación todavía no se ha desplegado: la dirección de preview es la prevista por `frontend/cloudflare.config.ts`, no una prueba de que el login remoto ya esté disponible. El dominio de producción debe confirmarse antes del corte.

`BETTER_AUTH_URL` debe coincidir exactamente con el origen de cada entorno, sin `/api/auth/callback/google` ni barra final. Para local: `http://localhost:3215`. El puerto 3100 sigue reservado al servidor de Gabi y no es el runtime OAuth de esta migración.

En local se usa `frontend/.dev.vars`, a partir de `.dev.vars.example`. Configurar allí `BETTER_AUTH_URL`, `BETTER_AUTH_SECRET` (aleatorio, 32 caracteres o más), `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET`. En Cloudflare van como secretos del entorno correspondiente. No añadir el secreto al código ni al repo.

Referencia: https://better-auth.com/docs/authentication/google
