import { BusinessError, requireActor } from '../identity/domain/access.ts';
import { ownedCatalog, saveProduct } from '../catalog/application/catalog.ts';
import type { ProductInput } from '../catalog/domain/product.ts';
import type { BusinessRuntime } from './business.ts';
import { errorReply, jsonReply, readJsonBody, requireOrigin } from './request-body.ts';

export async function catalogHandler(request: Request, runtime: BusinessRuntime): Promise<Response> {
  try {
    if (!['GET', 'POST', 'PUT'].includes(request.method)) return jsonReply({ error: 'method_not_allowed' }, 405);
    const actor = requireActor(await runtime.actor(request.headers));
    if (request.method === 'GET') return jsonReply({ products: await ownedCatalog(runtime.catalog, actor) });
    requireOrigin(request, runtime.origin);
    const input = await readJsonBody(request, 256 * 1024);
    const id = request.method === 'POST' ? null : input.id;
    if (id !== null && typeof id !== 'string') throw new BusinessError('invalid');
    const product = await saveProduct(runtime.catalog, actor, id, request.method === 'POST' ? null : input.version as number, input.product as ProductInput);
    return jsonReply({ product }, request.method === 'POST' ? 201 : 200);
  } catch (error) {
    return errorReply(error);
  }
}
