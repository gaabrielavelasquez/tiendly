import { bindings, defineConfig, defineWorker } from "cf/config";

// La publicación en modo API es explícita: sin la variable, el Worker conserva
// el runtime anterior. El origen debe ser el Worker de API aceptado para QA.
const apiUrl = process.env.TIENDLY_API_URL?.trim();

export default defineConfig({
  worker: defineWorker({
    name: "preview",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-11-08",
    compatibilityFlags: ["nodejs_compat"],
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
      UPLOADS: bindings.r2({ name: "tiendly-preview-images" }),
      DB: bindings.d1({ name: "tiendly-preview", id: "9fcfd54b-56a2-4cb9-af11-800e5191e93d" }),
      BETTER_AUTH_URL: bindings.text("https://preview.tiendly.workers.dev"),
      BETTER_AUTH_SECRET: bindings.secret(),
      GOOGLE_CLIENT_ID: bindings.secret(),
      GOOGLE_CLIENT_SECRET: bindings.secret(),
      TIENDLY_TIENDA_DEMO: bindings.text("muna"),
      TIENDLY_ENTORNO: bindings.text("preview"),
      ...(apiUrl ? { TIENDLY_API_URL: bindings.text(apiUrl), API: bindings.worker({ worker: "api-preview" }) } : {}),
    },
  }),
});
