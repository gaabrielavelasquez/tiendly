import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { betterAuth } from 'better-auth';
import { testUtils } from 'better-auth/plugins';
import type { D1Database } from '@cloudflare/workers-types';
import type { OrderDetail, OrderReceipt, OrderView, Product, Store, StoreConfiguration, StoreSnapshot } from '@tiendly/contracts';
import { limaDate, resolveItems, shippingFor, totals, validateCheckout, zoneOfDistrict } from '../src/orders/domain/order.ts';
import { createRuntime, type Bindings } from '../src/runtime/business.ts';
import { apiFetch } from '../src/runtime/api.ts';

const origin = 'http://localhost:3220';

async function fixture() {
  const mf = new Miniflare(convertV4MiniflareOptions({ modules: true, script: 'export default {fetch(){return new Response("ok")}}', compatibilityDate: '2026-11-08', d1Databases: ['DB'] }));
  const db = await mf.getD1Database('DB') as unknown as D1Database;
  for (const file of (await readdir(new URL('../db/migrations', import.meta.url))).filter(name => name.endsWith('.sql')).sort()) {
    const sql = await readFile(new URL(`../db/migrations/${file}`, import.meta.url), 'utf8');
    for (const statement of sql.replace(/^--.*$/gm, '').split(';').filter(x => x.trim())) await db.prepare(statement).run();
  }
  const bindings: Bindings = { DB: db, BETTER_AUTH_URL: origin, BETTER_AUTH_SECRET: 'test-only-secret-that-has-at-least-32-characters', GOOGLE_CLIENT_ID: 'test-only-client', GOOGLE_CLIENT_SECRET: 'test-only-secret', TIENDLY_ENTORNO: 'local' };
  const { auth } = createRuntime(bindings);
  const helpers = (await betterAuth({ ...auth.options, plugins: [testUtils()] }).$context).test;
  const owner = await helpers.saveUser(helpers.createUser({ email: 'orders-owner@example.invalid', name: 'Dueña de la tienda' }));
  const foreign = await helpers.saveUser(helpers.createUser({ email: 'orders-foreign@example.invalid' }));
  const cookie = (await helpers.login({ userId: owner.id })).headers.get('cookie')!;
  const request = (path: string, data?: unknown, method = data === undefined ? 'GET' : 'POST', session = cookie, requestOrigin: string | null = origin) => {
    const headers = new Headers({ 'content-type': 'application/json', cookie: session });
    if (requestOrigin) headers.set('origin', requestOrigin);
    return apiFetch(new Request(`http://127.0.0.1:3221${path}`, { method, headers, ...(data === undefined ? {} : { body: JSON.stringify(data) }) }), bindings);
  };
  const store = ((await (await request('/api/business/stores', { slug: 'api-orders', name: 'Casa taller', salesPhone: '900000000', categories: ['clothing'], otherCategory: '' })).json()) as { store: Store }).store;
  const product = ((await (await request('/api/business/catalog', { product: {
    name: 'Blusa de lino', description: 'Tejido liviano.', sku: 'BL-1', categories: ['Ropa'], status: 'active', priceCents: 9099, compareAtCents: null, offer: null,
    options: [{ name: 'Color', kind: 'color', values: ['Beige', 'Azul'] }],
    variants: [{ values: ['Beige'], stock: 2 }, { values: ['Azul'], stock: 1 }],
    primaryImage: '/tiendas-ejemplo/muna/portada.webp', photos: { Beige: ['/tiendas-ejemplo/muna/producto-1.webp'], Azul: [] },
  } })).json()) as { product: Product }).product;
  // Configuración de Pagos y Entregas: no tiene endpoint todavía (módulo pendiente), se escribe directo.
  await db.batch([
    db.prepare("UPDATE payment_settings SET whatsapp_enabled=1, automatic_status='active', card_enabled=1, yape_enabled=1 WHERE store_id=?").bind(store.id),
    db.prepare("UPDATE delivery_settings SET delivery_enabled=1, free_shipping_enabled=1, free_shipping_threshold_cents=200000, pickup_enabled=1, pickup_address='Calle Real 123', pickup_district='Miraflores', pickup_hours='Lun a Sáb 10 a. m. – 7 p. m.', pickup_note='Tocar el timbre.' WHERE store_id=?").bind(store.id),
    db.prepare("UPDATE delivery_zones SET enabled=1, cost_cents=1000, delivery_estimate='2 a 3 días' WHERE store_id=? AND zone_key='lima'").bind(store.id),
  ]);
  const checkout = (body: Record<string, unknown>, token = body.token as string) => request(`/api/public/stores/${store.slug}/orders`, { token, customer: { name: 'Ana Quispe', phone: '987654321' }, ...body });
  void checkout;
  const reserve = (token: string) => request(`/api/public/stores/${store.slug}/checkout`, { token });
  const snapshot = async (session = '') => ((await (await request(`/api/public/stores/${store.slug}`, undefined, 'GET', session)).json()) as { snapshot: StoreSnapshot }).snapshot;
  const items = (variants: [string, number][]) => variants.map(([values, quantity]) => ({ productId: product.id, variant: [values], quantity }));
  return { mf, db, request, store, product, checkout, reserve, snapshot, items, foreignCookie: (await helpers.login({ userId: foreign.id })).headers.get('cookie')! };
}

test('order geography, totals and checkout validation mirror the storefront rules', () => {
  assert.equal(zoneOfDistrict('Miraflores'), 'lima');
  assert.equal(zoneOfDistrict('Ventanilla'), 'callao');
  assert.equal(zoneOfDistrict('Trujillo'), 'provincias');
  assert.equal(zoneOfDistrict('Iquitos'), null);
  const product = { id: 'p', storeId: 's', slug: 'p', name: 'Blusa', description: '', sku: '', categories: [] as string[], status: 'active' as const, priceCents: 9099, compareAtCents: 10000, offer: null, options: [], variants: [{ values: [] as string[], stock: 9 }], primaryImage: null, photos: {} };
  const lines = resolveItems(
    { token: 't'.repeat(10), items: [{ productId: 'p', variant: [], quantity: 2 }, { productId: 'p', variant: [], quantity: 1 }], customer: { name: 'Ana Quispe', phone: '987654321' }, delivery: { kind: 'pickup' }, payment: { method: 'card' } } as never,
    [product] as never,
    limaDate(),
  );
  assert.equal(lines.length, 1);
  assert.equal(totals(lines, 1000, false).totalCents, 9099 * 3 + 1000);
  const configuration = {
    payments: { whatsappEnabled: true, automaticStatus: 'active', cardEnabled: true, yapeEnabled: false },
    delivery: { enabled: true, freeShippingEnabled: false, freeShippingThresholdCents: 0, pickupEnabled: true, pickupAddress: '', pickupDistrict: '', pickupHours: '', pickupNote: '', zones: [{ key: 'lima' as const, enabled: true, costCents: 1000, estimate: '' }, { key: 'provincias' as const, enabled: true, costCents: null, estimate: '' }] },
  };
  const shipping = { kind: 'pickup' as const, shippingCents: 1000, shippingPending: false, district: null, address: null, reference: null };
  const freeFrom30 = { ...configuration, delivery: { ...configuration.delivery, freeShippingEnabled: true, freeShippingThresholdCents: 30000 } };
  assert.equal(shippingFor(shipping, freeFrom30 as never, 9099 * 4), 0);
  assert.equal(shippingFor(shipping, freeFrom30 as never, 9099 * 3), 1000);
  const input = (overrides: Record<string, unknown>) => validateCheckout({
    token: 'a'.repeat(10), items: [{ productId: 'p', variant: [], quantity: 1 }],
    customer: { name: 'Ana Quispe', phone: '987654321' }, delivery: { kind: 'pickup' }, payment: { method: 'card' },
    ...overrides,
  } as never, configuration as never);
  assert.throws(() => input({ payment: { method: 'yape' } })); // apagado en Pagos
  assert.throws(() => input({ customer: { name: 'Ana', phone: '987654321' } })); // sin apellido
  assert.throws(() => input({ customer: { name: 'Ana Quispe', phone: '1' } }));
  assert.throws(() => input({ delivery: { kind: 'delivery', district: 'Trujillo', address: 'Calle falsa 123' } })); // por coordinar: sin costo fijo
  assert.throws(() => input({ delivery: { kind: 'coordinate' } })); // hay recojo y delivery: coordinar no entra
  assert.equal(input({ payment: { method: 'whatsapp' } }).method, 'whatsapp');
  assert.equal(input({ delivery: { kind: 'delivery', district: 'Miraflores', address: 'Calle falsa 123', reference: 'Dpto 402' } }).delivery.reference, 'Dpto 402');
});

test('checkout reserves numbers idempotently and creates pending orders that reserve stock', async () => {
  const f = await fixture();
  try {
    const token = 'attempt-token-1';
    assert.equal(((await (await f.reserve(token)).json()) as { number: string }).number, 'TL-1001');
    assert.equal(((await (await f.reserve(token)).json()) as { number: string }).number, 'TL-1001');
    assert.equal(((await (await f.reserve('attempt-token-2')).json()) as { number: string }).number, 'TL-1002');
    assert.equal((await f.reserve('short')).status, 400);
    assert.equal((await f.request('/api/public/stores/tienda-fantasma/checkout', { token: 'attempt-token-3' })).status, 404);
    const response = await f.request(`/api/public/stores/${f.store.slug}/orders`, {
      token, customer: { name: 'Ana Quispe', phone: '987654321' }, items: f.items([['Beige', 2], ['Azul', 1]]),
      delivery: { kind: 'delivery', district: 'Miraflores', address: 'Av. Larco 500', reference: 'Depto 402' }, payment: { method: 'whatsapp' },
    });
    assert.equal(response.status, 201);
    const receipt = ((await response.json()) as { order: OrderReceipt }).order;
    assert.equal(receipt.number, 'TL-1001');
    assert.deepEqual([receipt.totals.subtotalCents, receipt.totals.shippingCents, receipt.totals.totalCents, receipt.totals.units], [27297, 1000, 28297, 3]);
    const list = ((await (await f.request('/api/business/orders')).json()) as { orders: OrderView[] }).orders;
    assert.equal(list.length, 1);
    assert.equal(list[0].number, 'TL-1001');
    assert.deepEqual([list[0].payment.status, list[0].payment.method, list[0].delivery.status, list[0].delivery.method, list[0].delivery.district], ['pending', 'whatsapp', 'to-ship', 'delivery', 'Miraflores']);
    const detail = ((await (await f.request(`/api/business/orders/${list[0].id}`)).json()) as { order: OrderDetail }).order;
    assert.equal(detail.items.length, 2);
    assert.deepEqual([detail.items[0].name, detail.items[0].variantText, detail.items[0].quantity], ['Blusa de lino', 'Beige', 2]);
    assert.ok(detail.items[0].photoUrl && detail.items[0].photoUrl.includes('producto-1')); // foto de la variante, copiada al comprar
    const publicData = await f.snapshot();
    const variants = publicData.products[0].variants;
    assert.equal(variants.find(v => v.values[0] === 'Beige')?.availableStock, 0);
    assert.equal(variants.find(v => v.values[0] === 'Azul')?.availableStock, 0); // una unidad reservada
    const privateData = ((await (await f.request('/api/business/snapshot')).json()) as { snapshot: StoreSnapshot }).snapshot;
    assert.equal(privateData.products[0].variants.find(v => v.values[0] === 'Beige')?.stock, 2); // el base sigue intacto para editar
    // Reusar el mismo token ya no crea otro pedido.
    const reuse = await f.request(`/api/public/stores/${f.store.slug}/orders`, {
      token, customer: { name: 'Ana Quispe', phone: '987654321' }, items: f.items([['Beige', 1]]),
      delivery: { kind: 'pickup' }, payment: { method: 'whatsapp' },
    });
    assert.equal(reuse.status, 409);
    const stillOne = ((await (await f.request('/api/business/orders')).json()) as { orders: OrderView[] }).orders;
    assert.equal(stillOne.length, 1);
  } finally { await f.mf.dispose(); }
});

test('paid checkout sells stock and concurrent buyers cannot oversell', async () => {
  const f = await fixture();
  try {
    const body = (token: string) => ({ token, items: f.items([['Beige', 2]]), delivery: { kind: 'pickup' }, payment: { method: 'card' } });
    await f.reserve('paid-token-a');
    await f.reserve('paid-token-b');
    const attempts = await Promise.allSettled([
      f.request(`/api/public/stores/${f.store.slug}/orders`, { ...body('paid-token-a'), customer: { name: 'Ana Quispe', phone: '987654321' } }),
      f.request(`/api/public/stores/${f.store.slug}/orders`, { ...body('paid-token-b'), customer: { name: 'Ana Quispe', phone: '987654321' } }),
    ]);
    const statuses = attempts.map(attempt => attempt.status === 'fulfilled' ? attempt.value.status : 599);
    assert.deepEqual(statuses.filter(status => status === 201).length, 1);
    assert.deepEqual(statuses.filter(status => status === 409).length, 1);
    const list = ((await (await f.request('/api/business/orders')).json()) as { orders: OrderView[] }).orders;
    assert.equal(list.length, 1);
    assert.deepEqual([list[0].payment.status, list[0].totals.shippingCents, list[0].totals.totalCents], ['paid', 0, 18198]);
    const publicData = await f.snapshot();
    assert.equal(publicData.products[0].variants.find(v => v.values[0] === 'Beige')?.availableStock, 0);
    // Pausar y editar el producto no borra la copia de la línea del pedido.
    const detail = ((await (await f.request(`/api/business/orders/${list[0].id}`)).json()) as { order: OrderDetail }).order;
    assert.deepEqual([detail.items[0].name, detail.items[0].variantText, detail.items[0].quantity, detail.items[0].unitPriceCents], ['Blusa de lino', 'Beige', 2, 9099]);
    assert.equal((await f.db.prepare('SELECT COUNT(*) AS n FROM write_guards').first<{ n: number }>())?.n, 0);
  } finally { await f.mf.dispose(); }
});

test('panel commands run the order lifecycle without trusting the browser', async () => {
  const f = await fixture();
  try {
    await f.reserve('wa-token-1');
    const created = ((await (await f.request(`/api/public/stores/${f.store.slug}/orders`, {
      token: 'wa-token-1', customer: { name: 'Ana Quispe', phone: '987654321' }, items: f.items([['Azul', 1]]),
      delivery: { kind: 'delivery', district: 'Miraflores', address: 'Av. Larco 500' }, payment: { method: 'whatsapp' },
    })).json()) as { order: OrderReceipt }).order;
    const orders = ((await (await f.request('/api/business/orders')).json()) as { orders: OrderView[] }).orders;
    const id = orders[0].id;
    const version = orders[0].version;
    assert.equal((await f.request(`/api/business/orders/${id}/commands`, { kind: 'pay' }, 'POST', undefined, 'https://otra.origen')).status, 403);
    assert.equal((await f.request(`/api/business/orders/${id}/commands`, { kind: 'pay', version }, 'POST', f.foreignCookie)).status, 404); // otra tienda: no existe
    assert.equal((await f.request(`/api/business/orders/${id}/commands`, { kind: 'pagar', version })).status, 400);
    assert.equal((await f.request(`/api/business/orders/${id}/commands`, { kind: 'ship', version })).status, 400); // pendiente no se envía
    // Pagar y deshacer dentro de la ventana.
    let order = ((await (await f.request(`/api/business/orders/${id}/commands`, { kind: 'pay', version })).json()) as { order: OrderDetail }).order;
    assert.deepEqual([order.payment.status, order.version], ['paid', version + 1]);
    order = ((await (await f.request(`/api/business/orders/${id}/commands`, { kind: 'undo' })).json()) as { order: OrderDetail }).order;
    assert.deepEqual([order.payment.status, order.version], ['pending', version + 2]);
    const payments = await f.db.prepare("SELECT status FROM order_payments WHERE order_id=? ORDER BY created_at").bind(id).all<{ status: string }>();
    assert.deepEqual(payments.results.map(p => p.status), ['voided']); // el pago del intento queda anulado, no borrado
    // Comando viejo (versión anterior): conflicto, sin cambiar nada.
    assert.equal((await f.request(`/api/business/orders/${id}/commands`, { kind: 'pay', version })).status, 409);
    // Enviar → entregar → deshacer entrega → cancelar (irreversible).
    order = ((await (await f.request(`/api/business/orders/${id}/commands`, { kind: 'pay', version: order.version })).json()) as { order: OrderDetail }).order;
    order = ((await (await f.request(`/api/business/orders/${id}/commands`, { kind: 'ship', version: order.version })).json()) as { order: OrderDetail }).order;
    assert.equal(order.delivery.status, 'shipped');
    order = ((await (await f.request(`/api/business/orders/${id}/commands`, { kind: 'deliver', version: order.version })).json()) as { order: OrderDetail }).order;
    assert.equal(order.delivery.status, 'delivered');
    order = ((await (await f.request(`/api/business/orders/${id}/commands`, { kind: 'undo' })).json()) as { order: OrderDetail }).order;
    assert.equal(order.delivery.status, 'shipped'); // delivery vuelve a enviado
    order = ((await (await f.request(`/api/business/orders/${id}/commands`, { kind: 'unship', version: order.version })).json()) as { order: OrderDetail }).order;
    assert.equal(order.delivery.status, 'to-ship');
    assert.equal((await f.request(`/api/business/orders/${id}/commands`, { kind: 'undo' })).status, 409); // deshacer ya no alcanza el envío
    order = ((await (await f.request(`/api/business/orders/${id}/commands`, { kind: 'cancel', version: order.version })).json()) as { order: OrderDetail }).order;
    assert.deepEqual([order.payment.status, order.cancellation], ['canceled', 'store']);
    assert.equal((await f.request(`/api/business/orders/${id}/commands`, { kind: 'undo' })).status, 409);
    assert.equal((await f.request(`/api/business/orders/${id}/commands`, { kind: 'pay', version: order.version })).status, 400);
    const publicData = await f.snapshot();
    assert.equal(publicData.products[0].variants.find(v => v.values[0] === 'Azul')?.availableStock, undefined); // cancelar libera
  } finally { await f.mf.dispose(); }
});

test('expired reservations release stock and refuse payment, and unpaying late cancels', async () => {
  const f = await fixture();
  try {
    await f.reserve('exp-token-1');
    await f.request(`/api/public/stores/${f.store.slug}/orders`, {
      token: 'exp-token-1', customer: { name: 'Ana Quispe', phone: '987654321' }, items: f.items([['Beige', 2]]),
      delivery: { kind: 'pickup' }, payment: { method: 'whatsapp' },
    });
    let publicData = await f.snapshot();
    assert.equal(publicData.products[0].variants.find(v => v.values[0] === 'Beige')?.availableStock, 0);
    const orders = ((await (await f.request('/api/business/orders')).json()) as { orders: OrderView[] }).orders;
    const id = orders[0].id, version = orders[0].version;
    await f.db.batch([
      f.db.prepare("UPDATE orders SET reserve_until='2026-01-01T00:00:00.000Z' WHERE id=?").bind(id),
      f.db.prepare("UPDATE stock_allocations SET expires_at='2026-01-01T00:00:00.000Z' WHERE order_id=?").bind(id),
    ]);
    publicData = await f.snapshot();
    assert.equal(publicData.products[0].variants.find(v => v.values[0] === 'Beige')?.availableStock, undefined); // venció: se libera sola
    assert.equal((await f.request(`/api/business/orders/${id}/commands`, { kind: 'pay', version })).status, 409);
    // Desmarcar un pago cuya reserva ya venció: se cancela solo con su motivo.
    await f.reserve('card-token-1');
    const paid = ((await (await f.request(`/api/public/stores/${f.store.slug}/orders`, {
      token: 'card-token-1', customer: { name: 'Ana Quispe', phone: '987654321' }, items: f.items([['Azul', 1]]),
      delivery: { kind: 'pickup' }, payment: { method: 'yape' },
    })).json()) as { order: OrderReceipt }).order;
    const paidOrders = ((await (await f.request('/api/business/orders')).json()) as { orders: OrderView[] }).orders;
    const paidOrder = paidOrders.find(o => o.id !== id)!;
    await f.db.prepare("UPDATE orders SET reserve_until='2026-01-01T00:00:00.000Z' WHERE id=?").bind(paidOrder.id).run();
    const order = ((await (await f.request(`/api/business/orders/${paidOrder.id}/commands`, { kind: 'unpay', version: paidOrder.version })).json()) as { order: OrderDetail }).order;
    assert.deepEqual([order.payment.status, order.cancellation], ['canceled', 'expired-reservation']);
    assert.ok(order.unmarkedPayments.length >= 1);
    assert.equal(await f.request(`/api/business/orders/${id}`, undefined, 'GET', f.foreignCookie).then(r => r.status), 404);
  } finally { await f.mf.dispose(); }
});
