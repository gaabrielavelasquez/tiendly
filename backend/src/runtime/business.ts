import type { D1Database } from "@cloudflare/workers-types";
import { createAuth, authenticatedActor, type AuthConfiguration } from "../identity/adapters/better-auth.ts";
import { environment, type Actor } from "../identity/domain/access.ts";
import { D1Stores } from "../stores/adapters/d1-stores.ts";
import type { StoreDependencies } from "../stores/application/stores.ts";

export type BusinessRuntime = { stores: StoreDependencies; actor: (headers: Headers) => Promise<Actor | null>; origin: string };
export type Bindings = {
  DB: D1Database;
  TIENDLY_ENTORNO?: string;
  BETTER_AUTH_URL?: string;
  BETTER_AUTH_SECRET?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
};
export function authConfiguration(bindings: Bindings): AuthConfiguration {
  if (!bindings.BETTER_AUTH_URL || !bindings.BETTER_AUTH_SECRET || !bindings.GOOGLE_CLIENT_ID || !bindings.GOOGLE_CLIENT_SECRET) throw new Error("Authentication is not configured");
  return { baseURL: bindings.BETTER_AUTH_URL, secret: bindings.BETTER_AUTH_SECRET, googleClientId: bindings.GOOGLE_CLIENT_ID, googleClientSecret: bindings.GOOGLE_CLIENT_SECRET };
}
export function createRuntime(bindings: Bindings) {
  if (!bindings.DB) throw new Error("D1 is not configured");
  const config = authConfiguration(bindings);
  const auth = createAuth(bindings.DB, config);
  const runtime: BusinessRuntime = {
    stores: { stores: new D1Stores(bindings.DB), environment: environment(bindings.TIENDLY_ENTORNO), now: () => new Date().toISOString(), newId: () => crypto.randomUUID() },
    actor: headers => authenticatedActor(auth, headers),
    origin: config.baseURL,
  };
  return { auth, runtime };
}
