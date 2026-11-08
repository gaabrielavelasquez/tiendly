import { BusinessError } from "../identity/domain/access.ts";
import { createStore, ownedStore, renameStore } from "../stores/application/stores.ts";
import type { StoreInput } from "../stores/domain/store.ts";
import type { BusinessRuntime } from "./business.ts";

const STATUS = { unauthorized: 401, forbidden: 403, invalid: 400, conflict: 409, not_found: 404 };
const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "private, no-store" } });

async function body(request: Request): Promise<Record<string, unknown>> {
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new BusinessError("invalid");
  const reader = request.body?.getReader();
  if (!reader) throw new BusinessError("invalid");
  const chunks: Uint8Array[] = [];
  let length = 0;
  for (;;) {
    const next = await reader.read();
    if (next.done) break;
    length += next.value.byteLength;
    if (length > 16384) { await reader.cancel(); throw new BusinessError("invalid"); }
    chunks.push(next.value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try {
    const value: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error();
    return value as Record<string, unknown>;
  } catch { throw new BusinessError("invalid"); }
}

export async function storesHandler(request: Request, runtime: BusinessRuntime): Promise<Response> {
  try {
    if (!["GET", "POST", "PATCH"].includes(request.method)) return reply({ error: "method_not_allowed" }, 405);
    const actor = await runtime.actor(request.headers);
    if (!actor) throw new BusinessError("unauthorized");
    if (request.method === "GET") return reply({ store: await ownedStore(runtime.stores, actor) });
    if (request.headers.get("origin") !== runtime.origin) throw new BusinessError("forbidden");
    const input = await body(request);
    if (request.method === "POST") return reply({ store: await createStore(runtime.stores, actor, input as StoreInput) }, 201);
    if (typeof input.id !== "string") throw new BusinessError("invalid");
    return reply({ store: await renameStore(runtime.stores, actor, input.id, input.version as number, input.name as string) });
  } catch (error) {
    if (error instanceof BusinessError) return reply({ error: error.code }, STATUS[error.code]);
    // Infrastructure failures never log request contents or authentication headers.
    return reply({ error: "unavailable" }, 503);
  }
}
