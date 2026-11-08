import { defineConfig } from "vite";
import vinext from "vinext";
import nextConfig from "./next.config";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  resolve: { alias: { "@/lib/image-storage": new URL("./src/lib/image-storage.cloudflare.ts", import.meta.url).pathname, "@/lib/business-runtime": new URL("./src/lib/business-runtime.cloudflare.ts", import.meta.url).pathname } },
  publicDir: ".cloudflare-public",
  plugins: [
    // The browser already resizes uploads; dynamic R2 routes bypass paid image transforms.
    vinext({ nextConfig: { ...nextConfig, images: { ...nextConfig.images, unoptimized: true } } }),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
});
