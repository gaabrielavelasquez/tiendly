import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "tiendly-preview",
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
      DB: bindings.d1({ name: "tiendly-preview" }),
      BETTER_AUTH_URL: bindings.secret(),
      BETTER_AUTH_SECRET: bindings.secret(),
      GOOGLE_CLIENT_ID: bindings.secret(),
      GOOGLE_CLIENT_SECRET: bindings.secret(),
      TIENDLY_TIENDA_DEMO: bindings.text("muna"),
      TIENDLY_ENTORNO: bindings.text("preview"),
    },
  }),
});
