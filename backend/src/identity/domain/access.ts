export type Actor = { userId: string };
export type Environment = "local" | "preview" | "production";

export function environment(value: unknown): Environment {
  return value === "local" || value === "preview" ? value : "production";
}

export function testLoginAllowed(value: unknown, enabled: unknown): boolean {
  return environment(value) !== "production" && enabled === "true";
}

export class BusinessError extends Error {
  readonly code: "unauthorized" | "forbidden" | "invalid" | "conflict" | "not_found";
  constructor(code: BusinessError["code"]) { super(code); this.code = code; }
}

export function requireActor(actor: Actor | null): Actor {
  if (!actor?.userId) throw new BusinessError("unauthorized");
  return actor;
}

export function requireStoreWrite(actor: Actor | null, ownerId: string, demo: boolean, env: Environment): Actor {
  const authenticated = requireActor(actor);
  if (authenticated.userId !== ownerId || (demo && env === "production")) throw new BusinessError("forbidden");
  return authenticated;
}
