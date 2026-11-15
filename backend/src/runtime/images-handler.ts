import { requireActor } from '../identity/domain/access.ts';
import { uploadImage, MAX_IMAGE_BYTES } from '../catalog/adapters/r2-images.ts';
import type { createRuntime } from './business.ts';
import { errorReply, jsonReply, readBytes, requireOrigin } from './request-body.ts';

export async function imagesHandler(request: Request, context: ReturnType<typeof createRuntime>): Promise<Response> {
  const { runtime, uploads } = context;
  try {
    if (request.method !== 'POST') return jsonReply({ error: 'method_not_allowed' }, 405);
    const actor = requireActor(await runtime.actor(request.headers));
    requireOrigin(request, runtime.origin);
    if (!uploads) throw new Error('R2 unavailable');
    const bytes = await readBytes(request, MAX_IMAGE_BYTES);
    if (!bytes) return jsonReply({ error: 'too_large' }, 413);
    return jsonReply({ url: await uploadImage(runtime.stores, uploads, actor, bytes, request.headers.get('content-type') ?? '') }, 201);
  } catch (error) {
    return errorReply(error);
  }
}
