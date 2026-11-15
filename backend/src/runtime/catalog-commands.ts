import { BusinessError, requireActor, requireStoreWrite, type Actor } from '../identity/domain/access.ts';
import { saveProduct } from '../catalog/application/catalog.ts';
import { validateProduct, bulkPrice, type Product } from '../catalog/domain/product.ts';
import { validCalendarDate } from '../stores/domain/store.ts';
import { errorReply, jsonReply, readJsonBody, requireOrigin } from './request-body.ts';
import type { BusinessRuntime } from './business.ts';

function readOffer(value: unknown) {
  const offer = value as { mode: string; value: number; from?: string; until?: string } | null;
  if (!offer || !['percentage', 'price'].includes(offer.mode) || !Number.isFinite(offer.value) || offer.value <= 0 || (offer.mode === 'percentage' && offer.value >= 100) || (offer.from !== undefined && offer.from !== '' && !validCalendarDate(offer.from)) || (offer.until !== undefined && offer.until !== '' && !validCalendarDate(offer.until)) || (offer.from && offer.until && offer.from > offer.until)) throw new BusinessError('invalid');
  return offer;
}

export async function runCatalogCommand(runtime: BusinessRuntime, actor: Actor | null, input: Record<string, unknown>) {
  const owner = requireActor(actor);
  const store = await runtime.stores.stores.findOwned(owner.userId);
  if (!store) throw new BusinessError('forbidden');
  requireStoreWrite(owner, owner.userId, store.isDemo, runtime.stores.environment);
  const products = await runtime.catalog.catalog.list(store.id);
  if (input.kind === 'duplicate') {
    const previous = products.find(p => p.id === input.id);
    if (!previous) throw new BusinessError('not_found');
    const product = await saveProduct(runtime.catalog, owner, null, null, { ...previous, name: `Copia de ${previous.name}`, sku: previous.sku ? `${previous.sku}-C` : '', status: 'paused', variants: previous.variants.map(v => ({ ...v, stock: 0 })) });
    return { product };
  }
  if (!['statuses', 'offer', 'remove-offer', 'restore'].includes(input.kind as string)) throw new BusinessError('invalid');
  const statuses = input.statuses as Record<string, unknown> | undefined;
  const previous = input.previous as Partial<Product>[] | undefined;
  if (input.kind === 'statuses' && (!statuses || typeof statuses !== 'object' || Array.isArray(statuses))) throw new BusinessError('invalid');
  if (input.kind === 'restore' && !Array.isArray(previous)) throw new BusinessError('invalid');
  const ids: unknown = input.kind === 'statuses' ? Object.keys(statuses!) : input.kind === 'restore' ? previous!.map(p => p?.id) : input.ids;
  if (!Array.isArray(ids) || !ids.length || ids.length > 100 || !ids.every(id => typeof id === 'string') || new Set(ids).size !== ids.length) throw new BusinessError('invalid');
  const versions = input.versions as Record<string, unknown> | undefined;
  if (!versions || typeof versions !== 'object' || Array.isArray(versions)) throw new BusinessError('invalid');
  const offer = input.kind === 'offer' ? readOffer(input.offer) : null;
  let skipped = 0;
  const writes = ids.flatMap(id => {
    const current = products.find(p => p.id === id);
    if (!current || !Number.isSafeInteger(versions[id]) || versions[id] !== current.version) throw new BusinessError('conflict');
    let changed = { ...current };
    const normal = current.compareAtCents ?? current.priceCents;
    if (input.kind === 'statuses') {
      if (!['active', 'paused'].includes(statuses![id] as string)) throw new BusinessError('invalid');
      changed.status = statuses![id] as 'active' | 'paused';
    } else if (input.kind === 'remove-offer') changed = { ...current, priceCents: normal, compareAtCents: null, offer: null };
    else if (input.kind === 'offer') {
      if (!offer) throw new BusinessError('invalid');
      const price = bulkPrice(normal, offer.mode as 'percentage' | 'price', offer.value);
      if (price <= 0 || price >= normal) { skipped++; return []; }
      changed = { ...current, priceCents: price, compareAtCents: normal, offer: offer.from || offer.until ? { ...(offer.from ? { from: offer.from } : {}), ...(offer.until ? { until: offer.until } : {}) } : null };
    } else {
      const prior = previous!.find(p => p.id === id);
      if (!prior) throw new BusinessError('invalid');
      changed = { ...current, status: prior.status!, priceCents: prior.priceCents!, compareAtCents: prior.compareAtCents ?? null, offer: prior.offer ?? null };
    }
    return [{ product: { ...current, ...validateProduct(changed, store.id), version: current.version + 1, updatedAt: runtime.catalog.now() }, expectedVersion: current.version }];
  });
  return { products: writes.length ? await runtime.catalog.catalog.saveMany(writes, owner.userId) : [], skipped };
}

export async function catalogCommand(request: Request, runtime: BusinessRuntime): Promise<Response> {
  try {
    if (request.method !== 'POST') return jsonReply({ error: 'method_not_allowed' }, 405);
    const actor = requireActor(await runtime.actor(request.headers));
    requireOrigin(request, runtime.origin);
    const input = await readJsonBody(request, 256 * 1024);
    return jsonReply(await runCatalogCommand(runtime, actor, input));
  } catch (error) {
    return errorReply(error);
  }
}
