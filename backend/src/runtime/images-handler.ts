import { BusinessError } from '../identity/domain/access.ts';
import { uploadImage, MAX_IMAGE_BYTES } from '../catalog/adapters/r2-images.ts';
import type { createRuntime } from './business.ts';

export async function imagesHandler(request: Request, context: ReturnType<typeof createRuntime>): Promise<Response> {
  const { runtime, uploads } = context;
  try {
    if (request.method !== 'POST') return Response.json({ error: 'method_not_allowed' }, { status: 405 });
    const actor = await runtime.actor(request.headers);
    if (!actor) return Response.json({ error: 'unauthorized' }, { status: 401 });
    if (request.headers.get('origin') !== runtime.origin) return Response.json({ error: 'forbidden' }, { status: 403 });
    if (!uploads) throw new Error('R2 unavailable');
    const reader = request.body?.getReader();
    if (!reader) throw new BusinessError('invalid');
    const chunks: Uint8Array[] = [];
    let length = 0;
    for (;;) {
      const next = await reader.read();
      if (next.done) break;
      length += next.value.byteLength;
      if (length > MAX_IMAGE_BYTES) {
        await reader.cancel();
        return Response.json({ error: 'too_large' }, { status: 413 });
      }
      chunks.push(next.value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    return Response.json({ url: await uploadImage(runtime.stores, uploads, actor, bytes, request.headers.get('content-type') ?? '') }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof BusinessError ? error.code : 'unavailable' }, { status: error instanceof BusinessError ? (error.code === 'invalid' ? 400 : 403) : 503 });
  }
}
