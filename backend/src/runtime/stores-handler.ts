import { readJsonBody } from "./request-body.ts";
import { BusinessError } from "../identity/domain/access.ts";
import { createStore, ownedStore, renameStore } from "../stores/application/stores.ts";
import type { StoreInput } from "../stores/domain/store.ts";
import type { BusinessRuntime } from "./business.ts";

const STATUS = { unauthorized: 401, forbidden: 403, invalid: 400, conflict: 409, not_found: 404 };
const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "private, no-store" } });


export async function storesHandler(request: Request, runtime: BusinessRuntime): Promise<Response> {
  try {
    if (!["GET", "POST", "PATCH"].includes(request.method)) return reply({ error: "method_not_allowed" }, 405);
    const actor = await runtime.actor(request.headers);
    if (!actor) throw new BusinessError("unauthorized");
    if (request.method === "GET") return reply({ store: await ownedStore(runtime.stores, actor) });
    if (request.headers.get("origin") !== runtime.origin) throw new BusinessError("forbidden");
    const input = await readJsonBody(request);
    if (request.method === "POST") return reply({ store: await createStore(runtime.stores, actor, input as StoreInput) }, 201);
    if (typeof input.id !== "string") throw new BusinessError("invalid");
    return reply({ store: await renameStore(runtime.stores, actor, input.id, input.version as number, input.name as string) });
  } catch (error) {
    if (error instanceof BusinessError) return reply({ error: error.code }, STATUS[error.code]);
    // Infrastructure failures never log request contents or authentication headers.
    return reply({ error: "unavailable" }, 503);
  }
}
