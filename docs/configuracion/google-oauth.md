# Google OAuth · Tiendly

## Entornos y direcciones

La cuenta de Cloudflare tiene el subdominio `tiendly`. Los Workers usan `<nombre-del-worker>.tiendly.workers.dev`: `tiendly.workers.dev` es el subdominio de la cuenta y no una dirección asignable directamente a la app. Ver [Cloudflare](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/).

La preview usa el Worker `preview`, con origen `https://preview.tiendly.workers.dev`. Conserva la D1 `tiendly-preview` y el bucket privado `tiendly-preview-images`. Cambiar el nombre del Worker no renombra ni migra los datos. El despliegue anterior `tiendly-preview.tiendly.workers.dev` queda como referencia histórica hasta retirar su acceso de forma explícita.

Producción todavía no se publica en Cloudflare. Un Worker llamado `tiendly` tendría la dirección `https://tiendly.tiendly.workers.dev`; el nombre definitivo y el corte de `main` quedan pendientes. No registrar `https://tiendly.workers.dev` como si fuera una app desplegada.

## Cliente de Google

Usar **dos clientes OAuth de tipo Aplicación web**, uno para preview y otro para producción, cada uno con sus propias credenciales. El cliente de preview solo autoriza preview y, opcionalmente, desarrollo local; el de producción solo autoriza su dominio definitivo. Nunca cargar el JSON de producción en el Worker de preview.

En Google Cloud → Google Auth Platform → Clientes, editar el cliente de **preview** y guardar:

| Entorno | Origen autorizado de JavaScript | URI de redirección autorizada |
|---|---|---|
| Preview | `https://preview.tiendly.workers.dev` | `https://preview.tiendly.workers.dev/api/auth/callback/google` |
| Local (opcional, Worker en 3215) | `http://localhost:3215` | `http://localhost:3215/api/auth/callback/google` |

Los orígenes no llevan rutas ni barra final. Los callbacks deben coincidir exactamente con el origen activo y `/api/auth/callback/google`; registrar solo un origen JavaScript no sustituye el callback. Al cambiar la dirección se actualizan ambos campos en Google y `BETTER_AUTH_URL` en el runtime. Si Google muestra `redirect_uri_mismatch`, comparar el ID del cliente mostrado en la consola con el del JSON usado por el runtime y comprobar el callback guardado. Un JSON puede omitir las listas de URLs y no confirma su configuración remota. Google indica que los cambios pueden tardar entre cinco minutos y unas horas en aplicarse ([referencia](https://support.google.com/cloud/answer/15549257?hl=en)).

Si la pantalla de consentimiento sigue en pruebas, agregar las cuentas que probarán el ingreso como usuarios de prueba. El flujo solicita únicamente los permisos de identidad de Google usados por Better Auth. No solicita acceso a Gmail o Drive.

## Credenciales y sesión

`BETTER_AUTH_URL` es el origen exacto, sin `/api/auth/callback/google` ni barra final. `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_ID` y `GOOGLE_CLIENT_SECRET` son secretos del Worker de preview. Los valores del JSON descargado se cargan mediante Wrangler sin imprimirlos ni copiarlos al repo. El secreto de sesión se genera para el Worker nuevo; no se regenera en cada despliegue ni se modifica el del Worker anterior.

En local se usa `frontend/.dev.vars`, a partir de `.dev.vars.example`, con un secreto de sesión propio. El puerto 3100 sigue reservado al servidor de Gabi. No se copian credenciales de producción.

La configuración declara los nombres de los secretos, pero no sus valores. Los despliegues posteriores conservan los secretos existentes. No se habilitan contraseñas, ingreso por número, cookie de slug ni accesos de QA públicos. Para aceptar OAuth debe verificarse el recorrido real hasta una sesión D1; llegar a la pantalla de Google no acredita el callback.

Estado y evidencia: [OAuth en preview](../verificacion/oauth-preview/README.md). Los informes anteriores de D1/R2 conservan sus orígenes y resultados históricos.

Referencias: [Better Auth: Google](https://better-auth.com/docs/authentication/google), [OAuth para aplicaciones web de Google](https://developers.google.com/identity/protocols/oauth2/web-server).
