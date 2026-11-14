import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { betterAuth } from 'better-auth';
import { testUtils } from 'better-auth/plugins';
import type { D1Database, R2Bucket } from '@cloudflare/workers-types';
import type { Product, Store, StoreSnapshot } from '@tiendly/contracts';
import { createRuntime, type Bindings } from '../src/runtime/business.ts';
import { apiFetch } from '../src/runtime/api.ts';

const origin = 'http://localhost:3220';
async function fixture() {
  const mf = new Miniflare(convertV4MiniflareOptions({ modules: true, script: 'export default {fetch(){return new Response("ok")}}', compatibilityDate: '2026-11-08', d1Databases: ['DB'], r2Buckets: ['UPLOADS'] }));
  const db = await mf.getD1Database('DB') as unknown as D1Database;
  for (const file of ['0001_auth.sql', '0002_stores.sql', '0003_catalog.sql']) {
    const sql = await readFile(new URL(`../db/migrations/${file}`, import.meta.url), 'utf8');
    for (const statement of sql.replace(/^--.*$/gm, '').split(';').filter(x => x.trim())) await db.prepare(statement).run();
  }
  const bindings: Bindings = { DB: db, UPLOADS: await mf.getR2Bucket('UPLOADS') as unknown as R2Bucket, BETTER_AUTH_URL: origin, BETTER_AUTH_SECRET: 'test-only-secret-that-has-at-least-32-characters', GOOGLE_CLIENT_ID: 'test-only-client', GOOGLE_CLIENT_SECRET: 'test-only-secret', TIENDLY_ENTORNO: 'local' };
  const { auth } = createRuntime(bindings);
  const helpers = (await betterAuth({ ...auth.options, plugins: [testUtils()] }).$context).test;
  const owner = await helpers.saveUser(helpers.createUser({ email: 'api-owner@example.invalid', name: 'API QA' }));
  const foreign = await helpers.saveUser(helpers.createUser({ email: 'api-foreign@example.invalid' }));
  const login = await helpers.login({ userId: owner.id }), foreignLogin = await helpers.login({ userId: foreign.id });
  const cookie = login.headers.get('cookie')!;
  const request = (path: string, data?: unknown, method = data === undefined ? 'GET' : 'POST', session = cookie, requestOrigin: string | null = origin) => {
    const headers = new Headers({ 'content-type': 'application/json', cookie: session });
    if (requestOrigin) headers.set('origin', requestOrigin);
    return apiFetch(new Request(`http://127.0.0.1:3221${path}`, { method, headers, ...(data === undefined ? {} : { body: JSON.stringify(data) }) }), bindings);
  };
  const create = await request('/api/business/stores', { slug: 'api-casa-taller', name: 'Casa taller', salesPhone: '900000000', categories: ['home'], otherCategory: '' });
  assert.equal(create.status, 201);
  const store = (await create.json() as { store: Store }).store;
  return { mf, db, bindings, request, store, cookie, foreignCookie: foreignLogin.headers.get('cookie')! };
}
const product = { name: 'Jarrón con impresión 3D', description: 'Para casa.', sku: 'PRIVATE-SKU', categories: ['Hogar'], status: 'active', priceCents: 9099, compareAtCents: null, offer: null, options: [], variants: [{ values: [], stock: 4 }], primaryImage: '/tiendas-ejemplo/muna/portada.webp', photos: {} };

test('standalone API scopes private reads and exposes only published storefront data', async () => {
  const f = await fixture();
  try {
    const saved = await f.request('/api/business/catalog', { product }); assert.equal(saved.status, 201);
    const active = (await saved.json() as { product: Product }).product;
    await f.request('/api/business/catalog', { product: { ...product, name: 'Producto privado', status: 'paused' } });
    const own = await f.request('/api/business/snapshot'); assert.equal(own.headers.get('cache-control'), 'private, no-store');
    const snapshot = (await own.json() as { snapshot: StoreSnapshot }).snapshot;
    assert.equal(snapshot.products.length, 2); assert.equal(snapshot.products.find(p => p.id === active.id)?.sku, 'PRIVATE-SKU');
    assert.equal(snapshot.store.effectivePlan, 'free'); assert(!('measurementConsentAt' in snapshot.store));
    assert.equal((await f.request('/api/business/snapshot', undefined, 'GET', 'tiendly_tienda=muna')).status, 401);
    const other = await f.request('/api/business/snapshot', undefined, 'GET', f.foreignCookie);
    assert.equal((await other.json() as { snapshot: null }).snapshot, null);
    const publicData = (await (await f.request(`/api/public/stores/${f.store.slug}`, undefined, 'GET', '')).json() as { snapshot: StoreSnapshot }).snapshot;
    assert.deepEqual(publicData.products.map(p => p.id), [active.id]); assert.equal(publicData.products[0].sku, ''); assert(!('founderUntil' in publicData.store));
    assert.equal((await f.request('/api/public/stores/missing-store')).status, 404);
    assert.equal((await f.request('/api/business/snapshot', {}, 'POST')).status, 405);
    assert.equal((await f.request('/health')).status, 200);
  } finally { await f.mf.dispose(); }
});

test('API enforces browser origin, atomic conflicts and backend-calculated catalog commands', async () => {
  const f = await fixture();
  try {
    const first = (await (await f.request('/api/business/catalog', { product })).json() as { product: Product }).product;
    const second = (await (await f.request('/api/business/catalog', { product: { ...product, name: 'Vela de cedro' } })).json() as { product: Product }).product;
    const command = { kind: 'offer', ids: [first.id, second.id], versions: { [first.id]: 1, [second.id]: 1 }, offer: { mode: 'percentage', value: 20 } };
    assert.equal((await f.request('/api/business/catalog/commands', command, 'POST', undefined, 'https://foreign.invalid')).status, 403);
    assert.equal((await f.request('/api/business/catalog/commands', command, 'POST', undefined, null)).status, 403);
    assert.equal((await f.request('/api/business/catalog/commands', command, 'POST', f.foreignCookie)).status, 403);
    assert.equal((await f.request('/api/business/catalog/commands', { ...command, offer: { mode: 'price', value: 999999, from: '2026-02-30' } })).status, 400);
    const response = await f.request('/api/business/catalog/commands', command); assert.equal(response.status, 200); assert.equal(response.headers.get('cache-control'), 'private, no-store');
    const result = await response.json() as { products: Product[] };
    assert.deepEqual(result.products.map(p => [p.priceCents, p.compareAtCents, p.version]), [[7300, 9099, 2], [7300, 9099, 2]]);
    const stale = await f.request('/api/business/catalog/commands', { kind: 'statuses', statuses: { [first.id]: 'paused', [second.id]: 'paused' }, versions: { [first.id]: 2, [second.id]: 1 } }); assert.equal(stale.status, 409);
    const products = (await (await f.request('/api/business/catalog')).json() as { products: Product[] }).products;
    assert(products.every(p => p.status === 'active' && p.version === 2));
    const copy = (await (await f.request('/api/business/catalog/commands', { kind: 'duplicate', id: first.id })).json() as { product: Product }).product;
    assert.notEqual(copy.id, first.id); assert.equal(copy.status, 'paused'); assert.equal(copy.variants[0].stock, 0);
    assert.equal((await f.request('/api/business/catalog/commands', { kind: 'statuses', statuses: { [first.id]: 'invented' }, versions: { [first.id]: 2 } })).status, 400);
    assert.equal((await f.request('/api/business/catalog', { id: first.id, version: 1, product }, 'PUT')).status, 409);
  } finally { await f.mf.dispose(); }
});

test('Google callback, session lookup, cookie clearing and revocation honor frontend origin', async () => {
  const f = await fixture();
  try {
    const signIn = await f.request('/api/auth/sign-in/social', { provider: 'google', callbackURL: '/registro?google=1' }); assert.equal(signIn.status, 200);
    const payload = await signIn.json() as { url: string };
    assert.equal(new URL(payload.url).searchParams.get('redirect_uri'), `${origin}/api/auth/callback/google`);
    assert(signIn.headers.getSetCookie().length > 0);
    const session = await f.request('/api/auth/get-session'); assert.equal((await session.json() as { user: { name: string } }).user.name, 'API QA');
    const signOut = await f.request('/api/auth/sign-out', {}); assert.equal(signOut.status, 200); assert(signOut.headers.getSetCookie().some(cookie => /Max-Age=0/i.test(cookie)));
    assert.equal((await f.request('/api/business/catalog')).status, 401);
    assert(!(await (await f.request('/health')).text()).includes(f.bindings.BETTER_AUTH_SECRET!));
  } finally { await f.mf.dispose(); }
});

test('image upload and public reads work across API boundary without auth for downloads', async () => {
  const f = await fixture();
  try {
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aexkAAAAASUVORK5CYII=', 'base64');
    const upload = await apiFetch(new Request('http://127.0.0.1:3221/api/business/images', { method: 'POST', headers: { cookie: f.cookie, origin, 'content-type': 'image/png' }, body: png }), f.bindings); assert.equal(upload.status, 201);
    const url = (await upload.json() as { url: string }).url;
    const response = await apiFetch(new Request('http://127.0.0.1:3221' + url), { ...f.bindings, BETTER_AUTH_SECRET: undefined });
    assert.equal(response.status, 200); assert.equal(response.headers.get('content-type'), 'image/png'); assert.deepEqual(Buffer.from(await response.arrayBuffer()), png);
    const head = await apiFetch(new Request('http://127.0.0.1:3221' + url, { method: 'HEAD' }), f.bindings); assert.equal(head.status, 200); assert.equal(await head.text(), '');
    assert.equal((await apiFetch(new Request('http://127.0.0.1:3221/images/../private'), f.bindings)).status, 404);
  } finally { await f.mf.dispose(); }
});
