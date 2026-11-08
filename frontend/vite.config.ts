import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  resolve: { alias: { "@/lib/business-runtime": new URL("./src/lib/business-runtime.cloudflare.ts", import.meta.url).pathname } },
  publicDir: ".cloudflare-public",
  plugins: [
    vinext(),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
});
