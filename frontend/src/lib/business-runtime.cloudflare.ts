import "server-only";
import { env } from "cloudflare:workers";
import { createRuntime } from "@tiendly/backend/server";

export async function businessRuntime() {
  return createRuntime(env);
}
