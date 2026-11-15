/** Aceptación manual del checkout y Pedidos sobre el par local Next 3220 + API 3221. Sin Google ni datos remotos. */
import assert from 'node:assert/strict';
import { createHmac, randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
const origin = process.argv[2] ?? 'http://localhost:3220', url = new URL(origin);
assert(url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname) && url.origin === origin, 'Only an exact local HTTP origin is allowed.');
const root = fileURLToPath(new URL('../', import.meta.url)), out = resolve(root, process.env.TIENDLY_QA_OUTPUT ?? '../docs/verificacion/backend-api/checkout-local');
const { chromium, webkit } = await import(process.env.PLAYWRIGHT_MODULE ?? 'playwright');
const variables = Object.fromEntries((await readFile(resolve(root, '../backend/.dev.vars'), 'utf8')).split('\n').filter(line => line.includes('=') && !line.trim().startsWith('#')).map(line => { const i = line.indexOf('='); return [line.slice(0, i).trim(), line.slice(i + 1).trim().replace(/^(["'])(.*)\1$/, '$2')]; }));
assert(variables.BETTER_AUTH_SECRET?.length >= 32, 'Local Better Auth configuration is required.');
const apiOrigin = 'http://127.0.0.1:3221';
const navigation = { waitUntil: 'networkidle' };
const results = [];
async function local(path, data, method = data ? 'POST' : 'GET') {
  const response = await fetch(`${apiOrigin}/cdn-cgi/local/explorer/api${path}`, { method, ...(data ? { headers: { 'content-type': 'application/json' }, body: JSON.stringify(data) } : {}) });
  const result = await response.json(); assert(response.ok && result.success, `Local explorer rejected ${method} ${path}.`); return result.result;
}
const database = (await local('/d1/database')).find(item => item.name === 'DB'); assert(database, 'Local DB is required.');
const sql = (statement, params = []) => local(`/d1/database/${encodeURIComponent(database.uuid)}/raw`, { sql: statement, params: params.map(String) });
async function fixture(context) {
  const id = `checkout-qa-${randomUUID()}`, token = randomUUID(), now = Date.now();
  await sql('INSERT INTO user(id,name,email,emailVerified,createdAt,updatedAt) VALUES(?,?,?,1,?,?)', [id, 'QA Tiendly', `${id}@example.invalid`, now, now]);
  await sql('INSERT INTO session(id,expiresAt,token,createdAt,updatedAt,userId) VALUES(?,?,?,?,?,?)', [randomUUID(), now + 3600000, token, now, now, id]);
  const signed = `${token}.${createHmac('sha256', variables.BETTER_AUTH_SECRET).update(token).digest('base64')}`;
  await context.addCookies([{ name: 'better-auth.session_token', value: signed, url: origin, httpOnly: true, sameSite: 'Lax' }]); return id;
}
const catalog = async context => (await (await context.request.get(`${origin}/api/business/catalog`)).json()).products;
const publicStock = async (context, slug, productName, values) => {
  const { snapshot } = await (await context.request.get(`${origin}/api/public/stores/${slug}`)).json();
  const product = snapshot.products.find(p => p.name === productName);
  return product.variants.filter(v => values.includes(v.values[0])).map(v => v.availableStock ?? v.stock);
};
for (const [engineName, engine] of Object.entries({ chromium, webkit })) {
  const browser = await engine.launch();
  try { for (const width of [390]) {
    const context = await browser.newContext({ viewport: { width, height: 844 } }), user = await fixture(context), checks = [];
    const page = await context.newPage(), errors = []; page.on('pageerror', error => errors.push(`${page.url()} :: ${error.message}`));
    let store, product;
    try {
      // Tienda y producto vía API; Pagos y Entregas todavía no tienen endpoint, se configuran directo.
      const response = await context.request.post(`${origin}/api/business/stores`, { headers: { origin }, data: { slug: `checkout-${user.slice(-8)}`, name: 'Casa taller de QA', salesPhone: '900000000', categories: ['home'], otherCategory: '' } });
      assert.equal(response.status(), 201); store = (await response.json()).store;
      const saved = await context.request.post(`${origin}/api/business/catalog`, { headers: { origin }, data: { product: { name: 'Vaso de cerámica esmaltado', description: 'Hecho a mano.', sku: 'VASO-1', categories: ['Hogar'], status: 'active', priceCents: 4500, compareAtCents: null, offer: null, options: [{ name: 'Color', kind: 'color', values: ['Beige', 'Azul'] }], variants: [{ values: ['Beige'], stock: 2 }, { values: ['Azul'], stock: 1 }], primaryImage: '/tiendas-ejemplo/muna/producto-1.webp', photos: { Beige: ['/tiendas-ejemplo/muna/producto-1.webp'], Azul: [] } } } });
      assert.equal(saved.status(), 201); product = (await saved.json()).product;
      for (const statement of [
        ["UPDATE payment_settings SET whatsapp_enabled=1, automatic_status='active', card_enabled=1, yape_enabled=1 WHERE store_id=?", [store.id]],
        ["UPDATE delivery_settings SET delivery_enabled=1, pickup_enabled=1, pickup_address='Calle Real 123', pickup_district='Miraflores', pickup_hours='Lun a Sáb 10 a. m. – 7 p. m.', pickup_note='Tocar el timbre.' WHERE store_id=?", [store.id]],
        ["UPDATE delivery_zones SET enabled=1, cost_cents=1000, delivery_estimate='2 a 3 días' WHERE store_id=? AND zone_key='lima'", [store.id]],
      ]) await sql(statement[0], statement[1]);
      // Compra real: vitrina → producto → carrito → checkout → pagar con tarjeta (simulado).
      await page.goto(`${origin}/${store.slug}`, navigation);
      await page.getByRole('link', { name: new RegExp(product.name.slice(0, 20)) }).first().click();
      await page.getByRole('radio', { name: 'Beige' }).click();
      await page.getByRole('button', { name: 'Agregar al carrito' }).click(); // se agrega una unidad y abre el drawer
      await page.getByRole('button', { name: 'Finalizar compra' }).click();
      await page.getByLabel('Nombre y apellido').fill('Ana Quispe Ramos');
      await page.getByLabel('Celular').fill('987654321');
      await page.getByRole('button', { name: 'Continuar con la entrega' }).click();
      await page.getByText('Delivery en Lima').click();
      await page.getByLabel('Distrito, provincia o departamento').fill('Mira');
      await page.getByRole('button', { name: /Miraflores/ }).click();
      await page.getByLabel('Dirección').fill('Av. Larco 500, dpto. 402');
      await page.getByRole('button', { name: 'Continuar al pago' }).click();
      await page.getByText('Tarjeta de débito o crédito').click();
      await page.getByLabel('Número de tarjeta').fill('4557880012345678');
      await page.getByLabel('Vencimiento').fill('12/30');
      await page.getByLabel('CVV').fill('123');
      await page.getByRole('button', { name: /^Pagar S/ }).click();
      await page.waitForURL(`**/${store.slug}/pedido/TL-*`, navigation);
      const numero = page.url().match(/TL-\d+/)[0];
      assert.deepEqual(await publicStock(context, store.slug, product.name, ['Beige']), [1], 'El pago descuenta el stock ya.');
      assert.deepEqual(await publicStock(context, store.slug, product.name, ['Azul']), [1]);
      // Pedidos: la lista viene de la API y el detalle ejecuta comandos reales.
      await page.goto(`${origin}/panel/pedidos`, navigation);
      await page.getByRole('link', { name: new RegExp(numero) }).first().click();
      await page.getByRole('button', { name: 'Marcar como enviado' }).click();
      await page.getByText(`Pedido #${numero} marcado como enviado.`).waitFor();
      await page.getByRole('button', { name: 'Deshacer' }).click();
      await page.getByRole('button', { name: 'Marcar como enviado' }).waitFor(); // el deshacer volvió el pedido a "Por enviar"
      await page.getByRole('button', { name: 'Marcar como no pagado' }).click();
      await page.getByRole('button', { name: 'Sí, marcar como no pagado' }).click();
      await page.getByText(`Pedido #${numero} marcado como no pagado.`).waitFor();
      await page.getByText('Esperando el pago').first().waitFor(); // desmarcar volvió el pago a pendiente
      assert.deepEqual(await publicStock(context, store.slug, product.name, ['Beige']), [1], 'La reserva de 24 h sigue tomando el stock.');
      await page.getByRole('button', { name: 'Cancelar pedido' }).click();
      await page.getByRole('button', { name: 'Sí, cancelar pedido' }).click();
      await page.getByText(`Pedido #${numero} cancelado.`).waitFor();
      assert.deepEqual(await publicStock(context, store.slug, product.name, ['Beige']), [2], 'Cancelar libera el stock.');
      const apiOrders = await (await context.request.get(`${origin}/api/business/orders`)).json();
      assert.equal(apiOrders.orders.length, 1); assert.equal(apiOrders.orders[0].payment.status, 'canceled');
      assert.deepEqual(errors, [], 'Uncaught client errors.');
      checks.push(`${engineName}/${width}: checkout + pedidos OK (${numero})`);
      results.push({ engine: engineName, width, pass: true, checks });
    } catch (error) { results.push({ engine: engineName, width, pass: false, error: error.message.split('Call log:')[0].trim() }); throw error; } finally {
      if (store) { await sql('DELETE FROM stores WHERE id=?', [store.id]); await sql('DELETE FROM user WHERE id=?', [user]); }
      await context.close();
    }
  } } finally { await browser.close(); }
}
await mkdir(out, { recursive: true });
await writeFile(resolve(out, 'result.json'), JSON.stringify({ scope: 'Storefront checkout + panel orders against the local API pair; simulated card payment.', results }, null, 2) + '\n', { recursive: true });
console.log(JSON.stringify({ passed: results.filter(r => r.pass).length, scope: 'Local checkout acceptance.' }));
