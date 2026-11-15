import { BusinessError } from "../../identity/domain/access.ts";
import type { StoreRepository } from "../../stores/application/stores.ts";
import type { CatalogRepository } from "../../catalog/application/catalog.ts";
import type { D1Settings } from "../../settings/adapters/d1-settings.ts";
import { D1Orders, toDetail, toReceipt, toView, type OrderRow } from "../adapters/d1-orders.ts";
import { limaDate, resolveItems, reserveUntil, shippingFor, totals, validateCheckout, withAvailability } from "../domain/order.ts";
import { planCommand } from "../domain/commands.ts";
import type { CheckoutInput, OrderCommand, OrderDetail, OrderReceipt, OrderView, Product } from '@tiendly/contracts';

export type OrderDependencies = {
  stores: StoreRepository;
  catalog: CatalogRepository;
  settings: D1Settings;
  orders: D1Orders;
  now: () => string;
  newId: () => string;
};

/**
 * Vitrina: reserva el número al llegar al paso Pago. Público y idempotente por token.
 * Un número reservado sin pedido se pierde, igual que hoy con el almacén del navegador.
 */
export async function reserveCheckoutNumber(deps: OrderDependencies, slug: string, token: string): Promise<string> {
  const store = await deps.stores.findBySlug(slug);
  if (!store) throw new BusinessError('not_found');
  if (typeof token !== 'string' || token.length < 8 || token.length > 100 || !/^[A-Za-z0-9_-]+$/.test(token)) throw new BusinessError('invalid');
  return `TL-${await deps.orders.reserveNumber(store.id, token, deps.now())}`;
}

/** Crea el pedido con precios y stock recalculados aquí. El guard del lote rechaza la sobrevenda. */
export async function createOrder(deps: OrderDependencies, slug: string, input: CheckoutInput): Promise<OrderReceipt> {
  const store = await deps.stores.findBySlug(slug);
  if (!store) throw new BusinessError('not_found');
  const now = deps.now();
  const [configuration, products] = await Promise.all([deps.settings.read(store.id), deps.catalog.list(store.id)]);
  const checkout = validateCheckout(input, configuration);
  const items = resolveItems(input, products, limaDate(new Date(now)));
  const subtotalCents = items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);
  const shippingCents = shippingFor(checkout.delivery, configuration, subtotalCents);
  const orderTotals = totals(items, shippingCents, checkout.delivery.shippingPending);
  const paid = checkout.method !== 'whatsapp';
  const numero = await deps.orders.reserveNumber(store.id, input.token, now);
  const hasta = reserveUntil(now);
  const row: OrderRow = {
    id: deps.newId(), store_id: store.id, numero, receipt_token: deps.newId(), created_at: now,
    customer_name: checkout.customer.name, customer_phone: checkout.customer.phone,
    units: orderTotals.units, subtotal_cents: orderTotals.subtotalCents, discount_cents: 0,
    shipping_cents: shippingCents, shipping_pending: checkout.delivery.shippingPending ? 1 : 0, total_cents: orderTotals.totalCents,
    coupon_code: null,
    payment_status: paid ? 'paid' : 'pending', payment_method: checkout.method, reserve_until: paid ? null : hasta,
    delivery_method: checkout.delivery.kind, delivery_status: 'to-ship',
    district: checkout.delivery.district, address: checkout.delivery.address, reference: checkout.delivery.reference,
    pickup_json: input.delivery.kind === 'pickup' ? JSON.stringify({
      address: configuration.delivery.pickupAddress, district: configuration.delivery.pickupDistrict,
      hours: configuration.delivery.pickupHours, note: configuration.delivery.pickupNote,
    }) : null,
    paid_at: paid ? now : null, shipped_at: null, delivered_at: null, canceled_at: null, cancellation: null,
    note: null, version: 1,
  };
  await deps.orders.create({
    row,
    items: items.map(item => ({ productId: item.productId, variantKey: item.key, name: item.name, variantText: item.variantText, quantity: item.quantity, unitPriceCents: item.unitPriceCents, photoUrl: item.photoUrl })),
    allocations: items.map(item => ({ productId: item.productId, variantKey: item.key, quantity: item.quantity, kind: paid ? 'sold' as const : 'reserved' as const, expiresAt: paid ? null : hasta })),
    payment: paid ? { id: deps.newId(), method: checkout.method, amountCents: orderTotals.totalCents } : null,
    token: input.token,
    events: [ { kind: 'created', at: now, actor: 'checkout' }, ...(paid ? [{ kind: 'paid', at: now, actor: 'checkout' }] : []) ],
  });
  return toReceipt(row);
}

/** El stock disponible de los snapshots: base menos vendidos y reservas vigentes (decisión 0028). */
export async function availableCatalog(deps: OrderDependencies, storeId: string, products: Product[]): Promise<Product[]> {
  return withAvailability(products, await deps.orders.availability(storeId, deps.now()));
}

async function ownStore(deps: OrderDependencies, actor: { userId: string }): Promise<string> {
  const store = await deps.stores.findOwned(actor.userId);
  if (!store) throw new BusinessError('not_found');
  return store.id;
}

export async function ownedOrders(deps: OrderDependencies, actor: { userId: string }): Promise<OrderView[]> {
  return (await deps.orders.list(await ownStore(deps, actor))).map(toView);
}

export async function ownedOrder(deps: OrderDependencies, actor: { userId: string }, id: string): Promise<OrderDetail | null> {
  const order = await deps.orders.read(await ownStore(deps, actor), id);
  return order ? toDetail(order.row, order.items, order.unmarkedPayments) : null;
}

/** Los pedidos vencen solos al leerse (conReglas); aquí el comando de pago rechaza la reserva vencida. */
export async function commandOrder(deps: OrderDependencies, actor: { userId: string }, id: string, command: OrderCommand): Promise<OrderDetail> {
  const storeId = await ownStore(deps, actor);
  const order = await deps.orders.read(storeId, id);
  if (!order) throw new BusinessError('not_found');
  if (command.kind !== 'undo' && command.version !== order.row.version) throw new BusinessError('conflict');
  const now = deps.now();
  const plan = planCommand(order.row, command, now, actor.userId, order.lastEvent, deps.newId);
  const updated = await deps.orders.persist(storeId, id, order.row.version, plan);
  const fresh = await deps.orders.read(storeId, id);
  return fresh ? toDetail(fresh.row, fresh.items, fresh.unmarkedPayments) : toDetail(updated, order.items, order.unmarkedPayments);
}
