import { BusinessError } from "../../identity/domain/access.ts";
import type { OrderCommand, OrderPaymentStatus, OrderPaymentMethod, OrderDeliveryMethod, OrderDeliveryStatus, OrderCancellation } from '@tiendly/contracts';
import { reserveUntil, RESERVE_HOURS } from "./order.ts";

export type OrderRow = {
  id: string; store_id: string; numero: number; receipt_token: string; created_at: string;
  customer_name: string; customer_phone: string;
  units: number; subtotal_cents: number; discount_cents: number; shipping_cents: number | null; shipping_pending: number; total_cents: number;
  coupon_code: string | null;
  payment_status: OrderPaymentStatus; payment_method: OrderPaymentMethod; reserve_until: string | null;
  delivery_method: OrderDeliveryMethod; delivery_status: OrderDeliveryStatus;
  district: string | null; address: string | null; reference: string | null; pickup_json: string | null;
  paid_at: string | null; shipped_at: string | null; delivered_at: string | null; canceled_at: string | null; cancellation: OrderCancellation | null;
  note: string | null; version: number;
};

/** Lo que un comando cambia: el patch pasa por el UPDATE versionado; el resto son efectos del mismo lote. */
export type AllocationEffect = { type: 'sold' } | { type: 'reserved'; expiresAt: string } | { type: 'release' };
export type OrderEffect =
  | { type: 'allocation'; change: AllocationEffect }
  | { type: 'payment'; id: string; method: OrderPaymentMethod; amountCents: number; createdAt: string; createdBy: string }
  | { type: 'void-payments'; at: string };
export type OrderEvent = { kind: string; at: string; actor: string };
export type OrderPatch = Partial<Pick<OrderRow,
  'payment_status' | 'reserve_until' | 'paid_at' | 'delivery_status' | 'shipped_at' | 'delivered_at' | 'canceled_at' | 'cancellation' | 'note' | 'version'>>;
export type CommandPlan = { patch: OrderPatch; effects: OrderEffect[]; events: OrderEvent[] };

/** Deshacer solo alcanza lo recién hecho: la lista deshace en segundos, la API acota la ventana. */
export const UNDO_WINDOW_MS = 10 * 60 * 1000;

const invalid = (): never => { throw new BusinessError('invalid'); };
const effect = (change: AllocationEffect): OrderEffect => ({ type: 'allocation', change });
const voidPayments = (at: string): OrderEffect => ({ type: 'void-payments', at });
const event = (kind: string, at: string, actor: string): OrderEvent => ({ kind, at, actor });

/** Vencimiento efectivo de la reserva: los pedidos antiguos pueden no tenerlo (pagados al nacer). */
const liveReserveUntil = (row: OrderRow) => row.reserve_until ?? reserveUntil(row.created_at);

/**
 * Estados de un pedido (0007, 0010 y #31): pendiente → pagado; cancelado no se reabre.
 * Cada comando cambia solo lo suyo y deja su evento; el lote rechaza el comando viejo con la versión.
 */
export function planCommand(row: OrderRow, command: OrderCommand, now: string, actor: string, lastEvent: { kind: string; at: string } | null, newId: () => string): CommandPlan {
  const patch = (fields: OrderPatch, effects: OrderEffect[], events: OrderEvent[]): CommandPlan => ({ patch: { ...fields, version: row.version + 1 }, effects, events });
  if (command.kind === 'undo') {
    if (!lastEvent || Date.now() - Date.parse(lastEvent.at) > UNDO_WINDOW_MS) throw new BusinessError('conflict');
    const inverse = { paid: 'unpay', shipped: 'unship', delivered: 'undeliver' }[lastEvent.kind] as OrderCommand['kind'] | undefined;
    if (!inverse) throw new BusinessError('conflict');
    return planCommand(row, { kind: inverse, version: row.version }, now, actor, null, newId);
  }
  switch (command.kind) {
    case 'pay': {
      if (row.payment_status !== 'pending') invalid();
      if (Date.parse(liveReserveUntil(row)) <= Date.parse(now)) throw new BusinessError('conflict'); // la reserva venció: se libera sola
      return patch({ payment_status: 'paid', paid_at: now }, [effect({ type: 'sold' }), { type: 'payment', id: newId(), method: row.payment_method, amountCents: row.total_cents, createdAt: now, createdBy: actor }], [event('paid', now, actor)]);
    }
    case 'unpay': {
      if (row.payment_status !== 'paid') invalid();
      const hasta = liveReserveUntil(row);
      if (Date.parse(hasta) <= Date.parse(now)) {
        // La reserva venció mientras estaba pagado: se desmarca y se cancela sola (como hoy en el panel).
        return patch({ payment_status: 'canceled', paid_at: null, canceled_at: now, cancellation: 'expired-reservation', reserve_until: hasta }, [effect({ type: 'release' }), voidPayments(now)], [event('unpaid', now, actor), event('canceled', now, actor)]);
      }
      return patch({ payment_status: 'pending', paid_at: null, reserve_until: hasta }, [effect({ type: 'reserved', expiresAt: hasta }), voidPayments(now)], [event('unpaid', now, actor)]);
    }
    case 'ship': {
      if (row.payment_status !== 'paid' || row.delivery_status !== 'to-ship' || row.delivery_method !== 'delivery') invalid(); // el recojo se recoge, no se envía
      return patch({ delivery_status: 'shipped', shipped_at: now }, [], [event('shipped', now, actor)]);
    }
    case 'unship': {
      if (row.delivery_method !== 'delivery' || row.delivery_status !== 'shipped') invalid();
      return patch({ delivery_status: 'to-ship', shipped_at: null }, [], [event('unshipped', now, actor)]);
    }
    case 'deliver': {
      const valid = row.payment_status === 'paid' && (row.delivery_status === 'shipped' || (row.delivery_status === 'to-ship' && row.delivery_method === 'pickup'));
      if (!valid) invalid();
      return patch({ delivery_status: 'delivered', delivered_at: now }, [], [event('delivered', now, actor)]);
    }
    case 'undeliver': {
      if (row.delivery_status !== 'delivered') invalid();
      const target = row.delivery_method === 'delivery' ? 'shipped' : 'to-ship';
      return patch({ delivery_status: target, delivered_at: null, ...(target === 'to-ship' ? { shipped_at: null } : {}) }, [], [event('undelivered', now, actor)]);
    }
    case 'cancel': {
      if (row.payment_status === 'canceled' || row.delivery_status === 'delivered') invalid();
      // Cancelar es irreversible (#31); el pago confirmado queda como historial, el stock se libera.
      return patch({ payment_status: 'canceled', paid_at: null, canceled_at: now, cancellation: 'store' }, [effect({ type: 'release' })], [event('canceled', now, actor)]);
    }
  }
  invalid();
}

export { RESERVE_HOURS };
