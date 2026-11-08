import "server-only";

/** Next/Vercel remains available during migration. Cloudflare supplies the implementation via Vite. */
export async function businessRuntime(): Promise<ReturnType<typeof import("@tiendly/backend/server").createRuntime>> {
  throw new Error("Cloudflare bindings are required");
}
