import { BusinessError } from "../identity/domain/access.ts";

export const STATUS = { unauthorized: 401, forbidden: 403, invalid: 400, conflict: 409, not_found: 404 } as const;

export const jsonReply = (body: unknown, status = 200): Response =>
  Response.json(body, { status, headers: { "Cache-Control": "private, no-store" } });

export function errorReply(error: unknown): Response {
  // Infrastructure failures never log request contents or authentication headers.
  return error instanceof BusinessError
    ? jsonReply({ error: error.code }, STATUS[error.code])
    : jsonReply({ error: "unavailable" }, 503);
}

export function requireOrigin(request: Request, origin: string): void {
  if (request.headers.get("origin") !== origin) throw new BusinessError("forbidden");
}

export async function readBytes(request: Request, maximumBytes: number): Promise<Uint8Array | null> {
  const reader = request.body?.getReader();
  if (!reader) throw new BusinessError("invalid");
  const chunks: Uint8Array[] = [];
  let length = 0;
  for (;;) {
    const next = await reader.read();
    if (next.done) break;
    length += next.value.byteLength;
    if (length > maximumBytes) { await reader.cancel(); return null; }
    chunks.push(next.value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return bytes;
}

export async function readJsonBody(request: Request, maximumBytes = 16384): Promise<Record<string, unknown>> {
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new BusinessError("invalid");
  const bytes = await readBytes(request, maximumBytes);
  if (!bytes) throw new BusinessError("invalid");
  try {
    const value: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error();
    return value as Record<string, unknown>;
  } catch { throw new BusinessError("invalid"); }
}

