import { BusinessError, requireActor } from '../identity/domain/access.ts';
import { commandOrder, createOrder, ownedOrder, ownedOrders, reserveCheckoutNumber } from '../orders/application/orders.ts';
import type { OrderCommand } from '@tiendly/contracts';
import type { BusinessRuntime } from './business.ts';
import { readJsonBody } from './request-body.ts';

const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } });

/**
 * Checkout público de la vitrina. Sin sesión: la tienda se nombra en la ruta y los precios se
 * recalculan en el servidor. `reserve`: número TL-#### para el mensaje de WhatsApp, idempotente.
 */
export async function publicCheckout(request: Request, runtime: BusinessRuntime, slug: string, kind: 'reserve' | 'create'): Promise<Response> {
  if (request.method !== 'POST') return reply({ error: 'method_not_allowed' }, 405);
  const input = await readJsonBody(request, 64 * 1024);
  if (kind === 'reserve') return reply({ number: await reserveCheckoutNumber(runtime.orders, slug, (input as { token?: unknown }).token as string) }, 201);
  return reply({ order: await createOrder(runtime.orders, slug, input as Parameters<typeof createOrder>[2]) }, 201);
}

const COMMANDS = new Set(['pay', 'unpay', 'ship', 'unship', 'deliver', 'undeliver', 'cancel', 'undo']);

/** Pedidos de la tienda dueña de la sesión: lista, detalle y comandos del panel. */
export async function ordersHandler(request: Request, runtime: BusinessRuntime): Promise<Response> {
  const url = new URL(request.url);
  if (!['GET', 'POST'].includes(request.method)) return reply({ error: 'method_not_allowed' }, 405);
  const actor = requireActor(await runtime.actor(request.headers));
  const match = url.pathname.match(/^\/api\/business\/orders(?:\/([A-Za-z0-9-]{1,64})(\/commands)?)?$/);
  if (!match) return reply({ error: 'not_found' }, 404);
  const [, id, commands] = match;
  if (!id && request.method === 'GET') return reply({ orders: await ownedOrders(runtime.orders, actor) });
  if (!id || (!commands && request.method !== 'GET')) return reply({ error: 'not_found' }, 404);
  if (request.method === 'GET') {
    const order = await ownedOrder(runtime.orders, actor, id);
    return order ? reply({ order }) : reply({ error: 'not_found' }, 404);
  }
  // Igual que el catálogo: los comandos que escriben exigen el mismo origen del panel.
  if (request.headers.get('origin') !== runtime.origin) throw new BusinessError('forbidden');
  const input = await readJsonBody(request) as unknown as OrderCommand;
  if (!input || typeof input !== 'object' || !COMMANDS.has((input as { kind?: string }).kind ?? '')) return reply({ error: 'invalid' }, 400);
  if (input.kind !== 'undo' && !Number.isSafeInteger(input.version)) return reply({ error: 'invalid' }, 400);
  return reply({ order: await commandOrder(runtime.orders, actor, id, input) });
}
