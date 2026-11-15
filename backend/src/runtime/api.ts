import type { StoreView, StoreSnapshot } from '@tiendly/contracts';
import { createRuntime, type Bindings } from './business.ts';
import { storesHandler } from './stores-handler.ts';
import { catalogHandler } from './catalog-handler.ts';
import { catalogCommand } from './catalog-commands.ts';
import { imagesHandler } from './images-handler.ts';
import { readImage } from '../catalog/adapters/r2-images.ts';
import { D1Stores } from '../stores/adapters/d1-stores.ts';
import { D1Catalog } from '../catalog/adapters/d1-catalog.ts';
import { D1Settings } from '../settings/adapters/d1-settings.ts';
import { effectivePlan, type Store } from '../stores/domain/store.ts';
import { BusinessError, requireActor, requireStoreWrite } from '../identity/domain/access.ts';

const statuses = { unauthorized: 401, forbidden: 403, invalid: 400, conflict: 409, not_found: 404 };
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } });
function storeView(store: Store): StoreView {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  return { id: store.id, slug: store.slug, name: store.name, salesPhone: store.salesPhone, categories: store.categories, otherCategory: store.otherCategory, offerSectionName: store.offerSectionName, appearance: store.appearance, onboarding: store.onboarding, createdAt: store.createdAt, isDemo: store.isDemo, effectivePlan: effectivePlan(store.plan, store.founderUntil, today) === 'free' ? 'free' : 'pro' };
}
async function snapshot(bindings: Bindings, store: Store, publicOnly: boolean): Promise<StoreSnapshot> {
  const [configuration, catalog] = await Promise.all([new D1Settings(bindings.DB).read(store.id), new D1Catalog(bindings.DB).list(store.id)]);
  // SKU is a private merchant reference. Paused products never leave the public API.
  const products = publicOnly ? catalog.filter(p => p.status === 'active').map(p => ({ ...p, sku: '' })) : catalog;
  return { store: storeView(store), configuration, products };
}

/** Standalone HTTP boundary. Never relies on Next, a slug cookie, or caller-supplied ownership. */
async function dispatch(request: Request, bindings: Bindings): Promise<Response> {
  const url = new URL(request.url);
  try {
    if (url.pathname.startsWith('/images/')) {
      if (!['GET', 'HEAD'].includes(request.method)) return json({ error: 'method_not_allowed' }, 405);
      if (!bindings.UPLOADS) throw new Error('R2 unavailable');
      const response = await readImage(bindings.UPLOADS, url.pathname.slice('/images/'.length));
      return request.method === 'HEAD' ? new Response(null, response) : response;
    }
    if (url.pathname === '/health') {
      if (request.method !== 'GET') return json({ error: 'method_not_allowed' }, 405);
      await bindings.DB.prepare('SELECT id FROM stores LIMIT 1').all();
      return json({ status: 'ok', service: 'tiendly-api', contract: 1, revision: bindings.TIENDLY_REVISION ?? null });
    }
    const publicStore = url.pathname.match(/^\/api\/public\/stores\/([a-z0-9-]{1,40})$/);
    if (publicStore) {
      if (request.method !== 'GET') return json({ error: 'method_not_allowed' }, 405);
      const store = await new D1Stores(bindings.DB).findBySlug(publicStore[1]);
      return store ? json({ snapshot: await snapshot(bindings, store, true) }) : json({ error: 'not_found' }, 404);
    }
    if (!url.pathname.startsWith('/api/auth/') && !['/api/business/stores', '/api/business/catalog', '/api/business/images', '/api/business/snapshot', '/api/business/catalog/commands'].includes(url.pathname)) return json({ error: 'not_found' }, 404);
    const context = createRuntime(bindings);
    const { runtime, auth } = context;
    await auth.$context;
    if (url.pathname.startsWith('/api/auth/')) {
      // Auth's public URL is the frontend proxy origin; cookies remain host-only there.
      const authURL = new URL(url.pathname + url.search, runtime.origin);
      return await auth.handler(new Request(authURL, request));
    }
    if (url.pathname === '/api/business/stores') return await storesHandler(request, runtime);
    if (url.pathname === '/api/business/catalog') return await catalogHandler(request, runtime);
    if (url.pathname === '/api/business/catalog/commands') return await catalogCommand(request, runtime);
    if (url.pathname === '/api/business/images') return await imagesHandler(request, context);
    if (url.pathname === '/api/business/snapshot') {
      if (request.method !== 'GET') return json({ error: 'method_not_allowed' }, 405);
      const actor = requireActor(await runtime.actor(request.headers));
      const store = await runtime.stores.stores.findOwned(actor.userId);
      return json({ snapshot: store ? await snapshot(bindings, store, false) : null });
    }
    return json({ error: 'not_found' }, 404);
  } catch (error) {
    return json({ error: error instanceof BusinessError ? error.code : 'unavailable' }, error instanceof BusinessError ? statuses[error.code] : 503);
  }
}
export async function apiFetch(request: Request, bindings: Bindings): Promise<Response> {
  const response = await dispatch(request, bindings);
  const output = new Response(response.body, response);
  if (!new URL(request.url).pathname.startsWith('/images/')) output.headers.set('Cache-Control', 'private, no-store');
  if (bindings.TIENDLY_ENTORNO !== 'production') output.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return output;
}
export default { fetch: apiFetch };
