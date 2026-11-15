import { errorReply, jsonReply, readJsonBody, requireOrigin } from "./request-body.ts";
import { BusinessError, requireActor } from "../identity/domain/access.ts";
import { createStore, ownedStore, renameStore } from "../stores/application/stores.ts";
import type { StoreInput } from "../stores/domain/store.ts";
import type { BusinessRuntime } from "./business.ts";

export async function storesHandler(request: Request, runtime: BusinessRuntime): Promise<Response> {
  try {
    if (!["GET", "POST", "PATCH"].includes(request.method)) return jsonReply({ error: "method_not_allowed" }, 405);
    const actor = requireActor(await runtime.actor(request.headers));
    if (request.method === "GET") return jsonReply({ store: await ownedStore(runtime.stores, actor) });
    requireOrigin(request, runtime.origin);
    const input = await readJsonBody(request);
    if (request.method === "POST") return jsonReply({ store: await createStore(runtime.stores, actor, input as StoreInput) }, 201);
    if (typeof input.id !== "string") throw new BusinessError("invalid");
    return jsonReply({ store: await renameStore(runtime.stores, actor, input.id, input.version as number, input.name as string) });
  } catch (error) {
    return errorReply(error);
  }
}
