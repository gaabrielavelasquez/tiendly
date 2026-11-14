import { D1Catalog } from "../catalog/adapters/d1-catalog.ts";
import type { CatalogDependencies } from "../catalog/application/catalog.ts";
import type { D1Database, R2Bucket } from "@cloudflare/workers-types";
import { createAuth, authenticatedActor, type AuthConfiguration } from "../identity/adapters/better-auth.ts";
import { environment, type Actor } from "../identity/domain/access.ts";
import { D1Stores } from "../stores/adapters/d1-stores.ts";
import type { StoreDependencies } from "../stores/application/stores.ts";

export type BusinessRuntime = { stores: StoreDependencies; catalog: CatalogDependencies; actor: (headers: Headers) => Promise<Actor | null>; origin: string };
export type Bindings = {
  DB: D1Database;
  UPLOADS?: R2Bucket;
  TIENDLY_ENTORNO?: string;
  TIENDLY_REVISION?: string;
  BETTER_AUTH_URL?: string;
  BETTER_AUTH_SECRET?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
};
export function authConfiguration(bindings: Bindings): AuthConfiguration {
  if (!bindings.BETTER_AUTH_URL || !bindings.BETTER_AUTH_SECRET) throw new Error("Authentication is not configured");
  return { baseURL: bindings.BETTER_AUTH_URL, secret: bindings.BETTER_AUTH_SECRET, googleClientId: bindings.GOOGLE_CLIENT_ID, googleClientSecret: bindings.GOOGLE_CLIENT_SECRET };
}
export function createRuntime(bindings: Bindings) {
  if (!bindings.DB) throw new Error("D1 is not configured");
  const config = authConfiguration(bindings);
  const auth = createAuth(bindings.DB, config);
  const stores: StoreDependencies = { stores: new D1Stores(bindings.DB), environment: environment(bindings.TIENDLY_ENTORNO), now: () => new Date().toISOString(), newId: () => crypto.randomUUID() };
  const runtime: BusinessRuntime = {
    stores,
    catalog: { ...stores, catalog: new D1Catalog(bindings.DB) },
    actor: headers => authenticatedActor(auth, headers),
    origin: config.baseURL,
  };
  return { auth, runtime, uploads: bindings.UPLOADS };
}
