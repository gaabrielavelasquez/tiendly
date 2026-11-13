import { defineConfig } from "vite";
import vinext from "vinext";
import nextConfig from "./next.config";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig(({ command, isPreview }) => ({
  resolve: { alias: { "@/lib/store-storage": new URL("./src/lib/store-storage.cloudflare.ts", import.meta.url).pathname, "@/lib/image-storage": new URL("./src/lib/image-storage.cloudflare.ts", import.meta.url).pathname, "@/lib/business-runtime": new URL("./src/lib/business-runtime.cloudflare.ts", import.meta.url).pathname } },
  publicDir: ".cloudflare-public",
  plugins: [
    // The browser already resizes uploads; dynamic R2 routes bypass paid image transforms.
    vinext({ nextConfig: { ...nextConfig, images: { ...nextConfig.images, unoptimized: true } } }),
    cloudflare({
      remoteBindings: false,
      // El build conserva QA. Solo vite dev cambia a recursos emulados propios.
      config: (config) => command === "serve" && !isPreview ? {
        ...config,
        worker: {
          ...config.worker,
          name: "tiendly-local",
          // React dev detecta createTask, pero el stub node:console de workerd lanza error.
          compatibilityFlags: [...(config.worker.compatibilityFlags ?? []), "disable_nodejs_console_module"],
          env: {
            ...config.worker.env,
            DB: { type: "d1", name: "tiendly-local", id: "00000000-0000-4000-8000-000000000001", dev: { remote: false } },
            UPLOADS: { type: "r2", name: "tiendly-local-images", dev: { remote: false } },
            TIENDLY_ENTORNO: { type: "text", value: "local" },
            BETTER_AUTH_URL: { type: "text", value: "http://localhost:3215" },
          },
        },
      } : config,
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
}));
