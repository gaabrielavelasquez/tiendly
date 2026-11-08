import { betterAuth } from "better-auth";
import type { D1Database } from "@cloudflare/workers-types";
import type { Actor } from "../domain/access.ts";

export type AuthConfiguration = { baseURL: string; secret: string; googleClientId?: string; googleClientSecret?: string };
export function createAuth(database: D1Database, config: AuthConfiguration) {
  const url = new URL(config.baseURL);
  if ((url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname))) || url.origin !== config.baseURL || config.secret.length < 32 || Boolean(config.googleClientId) !== Boolean(config.googleClientSecret)) throw new Error("Invalid authentication configuration");
  return betterAuth({
    database,
    logger: { log(level) { console.log(JSON.stringify({ event: "authentication", level })); } },
    baseURL: config.baseURL,
    secret: config.secret,
    trustedOrigins: [config.baseURL],
    // Las sesiones D1 funcionan antes de configurar Google; no se habilita otro
    // método de ingreso ni se aceptan credenciales OAuth ficticias en el runtime.
    socialProviders: config.googleClientId && config.googleClientSecret ? { google: { clientId: config.googleClientId, clientSecret: config.googleClientSecret } } : {},
    emailAndPassword: { enabled: false },
    account: { accountLinking: { enabled: false } },
    session: { cookieCache: { enabled: false } },
  });
}

export async function authenticatedActor(auth: ReturnType<typeof createAuth>, headers: Headers): Promise<Actor | null> {
  const session = await auth.api.getSession({ headers });
  return session ? { userId: session.user.id } : null;
}
