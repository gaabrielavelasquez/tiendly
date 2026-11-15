import type { D1Database } from "@cloudflare/workers-types";
import { BusinessError } from "../../identity/domain/access.ts";
import type { OrderDetail, OrderItem, OrderReceipt, OrderTotals, OrderView, OrderPaymentMethod } from '@tiendly/contracts';
import type { AllocationEffect, CommandPlan, OrderEffect, OrderEvent, OrderPatch, OrderRow } from "../domain/commands.ts";
export type { OrderDetail, OrderView, OrderReceipt, AllocationEffect, CommandPlan, OrderEffect, OrderEvent, OrderPatch, OrderRow };

const totalsOf = (row: OrderRow): OrderTotals => ({ subtotalCents: row.subtotal_cents, discountCents: row.discount_cents, shippingCents: row.shipping_cents, shippingPending: row.shipping_pending === 1, totalCents: row.total_cents, units: row.units });

export function toView(row: OrderRow): OrderView {
  return {
    id: row.id, number: `TL-${row.numero}`, createdAt: row.created_at, version: row.version,
    customer: { name: row.customer_name, phone: row.customer_phone },
    totals: totalsOf(row),
    payment: { status: row.payment_status, method: row.payment_method },
    delivery: { status: row.delivery_status, method: row.delivery_method, district: row.district },
  };
}

export function toDetail(row: OrderRow, items: OrderItem[], unmarkedPayments: string[]): OrderDetail {
  return {
    ...toView(row), items,
    couponCode: row.coupon_code,
    address: row.address, reference: row.reference,
    pickup: row.pickup_json ? JSON.parse(row.pickup_json) : null,
    paidAt: row.paid_at, unmarkedPayments, shippedAt: row.shipped_at, deliveredAt: row.delivered_at,
    canceledAt: row.canceled_at, cancellation: row.cancellation,
  };
}

export function toReceipt(row: OrderRow): OrderReceipt {
  return { number: `TL-${row.numero}`, createdAt: row.created_at, totals: totalsOf(row), receiptToken: row.receipt_token };
}

type ItemRow = { product_id: string | null; name: string; variant_text: string; quantity: number; unit_price_cents: number; photo_url: string | null };

/** El disponible nunca se guarda: stock base menos vendidos y reservas vigentes (decisión 0028). */
const LIVE = `(a.kind='sold' OR (a.expires_at IS NOT NULL AND a.expires_at > ?))`;

export class D1Orders {
  private readonly db: D1Database;
  constructor(db: D1Database) { this.db = db; }

  /** Reserva el número del pedido. Idempotente por token: reintentar devuelve el mismo número. */
  async reserveNumber(storeId: string, token: string, now: string): Promise<number> {
    const existing = await this.db.prepare('SELECT numero FROM checkout_attempts WHERE token=? AND store_id=?').bind(token, storeId).first<{ numero: number }>();
    if (existing) return existing.numero;
    try {
      // Número = contador de la tienda + 1, asignado en el mismo lote: dos intentos simultáneos
      // chocan contra UNIQUE(store_id, numero) y el lote perdedor se deshace entero.
      await this.db.batch([
        this.db.prepare(`INSERT INTO checkout_attempts(token,store_id,numero,created_at)
          SELECT ?, ?, (SELECT last_order_number FROM stores WHERE id=?) + 1, ?
          WHERE EXISTS(SELECT 1 FROM stores WHERE id=?)`).bind(token, storeId, storeId, now, storeId),
        this.db.prepare('INSERT INTO write_guards(ok) VALUES(changes())'),
        this.db.prepare('UPDATE stores SET last_order_number=(SELECT numero FROM checkout_attempts WHERE token=? AND store_id=?), updated_at=? WHERE id=?').bind(token, storeId, now, storeId),
        this.db.prepare('DELETE FROM write_guards'),
      ]);
    } catch (error) {
      if (/CHECK constraint failed|UNIQUE constraint failed/.test(String(error))) throw new BusinessError('conflict');
      throw error;
    }
    return (await this.db.prepare('SELECT numero FROM checkout_attempts WHERE token=? AND store_id=?').bind(token, storeId).first<{ numero: number }>())!.numero;
  }

  /** Guarda el pedido completo en un solo lote. El guard de disponible rechaza la sobrevenda. */
  async create(input: {
    row: OrderRow;
    items: { productId: string; variantKey: string; name: string; variantText: string; quantity: number; unitPriceCents: number; photoUrl: string | null }[];
    allocations: { productId: string; variantKey: string; quantity: number; kind: 'sold' | 'reserved'; expiresAt: string | null }[];
    payment: { id: string; method: OrderPaymentMethod; amountCents: number } | null;
    token: string; events: OrderEvent[];
  }): Promise<void> {
    const { row, items, allocations, payment, token, events, } = input;
    const now = row.created_at;
    const statements = [
      // El token se consume una sola vez: dos envíos con el mismo intento no crean dos pedidos.
      this.db.prepare('UPDATE checkout_attempts SET used_at=? WHERE token=? AND store_id=? AND used_at IS NULL').bind(now, token, row.store_id),
      this.db.prepare('INSERT INTO write_guards(ok) VALUES(changes())'),
      this.db.prepare(`INSERT INTO orders(
        id,store_id,numero,receipt_token,created_at,customer_name,customer_phone,units,subtotal_cents,discount_cents,
        shipping_cents,shipping_pending,total_cents,coupon_code,payment_status,payment_method,reserve_until,
        delivery_method,delivery_status,district,address,reference,pickup_json,paid_at,shipped_at,delivered_at,canceled_at,cancellation,version
      ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,1)`).bind(
        row.id, row.store_id, row.numero, row.receipt_token, row.created_at, row.customer_name, row.customer_phone,
        row.units, row.subtotal_cents, row.discount_cents, row.shipping_cents, row.shipping_pending, row.total_cents,
        row.coupon_code, row.payment_status, row.payment_method, row.reserve_until, row.delivery_method,
        row.delivery_status, row.district, row.address, row.reference, row.pickup_json,
        row.paid_at, row.shipped_at, row.delivered_at, row.canceled_at, row.cancellation,
      ),
      ...items.map((item, position) => this.db.prepare(
        'INSERT INTO order_items(order_id,product_id,variant_key,name,variant_text,quantity,unit_price_cents,photo_url,position) VALUES(?,?,?,?,?,?,?,?,?)',
      ).bind(row.id, item.productId, item.variantKey, item.name, item.variantText, item.quantity, item.unitPriceCents, item.photoUrl, position)),
      ...allocations.flatMap(allocation => [
        this.db.prepare(`
          INSERT INTO stock_allocations(order_id,store_id,product_id,variant_key,quantity,kind,expires_at,created_at)
          SELECT ?,?,?,?,?,?,?,?
          WHERE EXISTS (
            SELECT 1 FROM product_variants v
            WHERE v.store_id=? AND v.product_id=? AND v.variant_key=?
              AND v.stock >= ? + COALESCE((
                SELECT SUM(a.quantity) FROM stock_allocations a
                WHERE a.store_id=v.store_id AND a.product_id=v.product_id AND a.variant_key=v.variant_key
                  AND ${LIVE}
              ), 0)
          )`).bind(
          row.id, row.store_id, allocation.productId, allocation.variantKey, allocation.quantity, allocation.kind, allocation.expiresAt, now,
          row.store_id, allocation.productId, allocation.variantKey, allocation.quantity, now,
        ),
        this.db.prepare('INSERT INTO write_guards(ok) VALUES(changes())'),
      ]),
      ...(payment ? [this.db.prepare('INSERT INTO order_payments(id,order_id,method,amount_cents,status,created_at,created_by) VALUES(?,?,?,?,?,?,?)')
        .bind(payment.id, row.id, payment.method, payment.amountCents, 'confirmed', now, 'checkout')] : []),
      ...events.map(event => this.db.prepare('INSERT INTO order_events(order_id,kind,happened_at,actor) VALUES(?,?,?,?)').bind(row.id, event.kind, event.at, event.actor)),
      this.db.prepare('DELETE FROM write_guards'),
    ];
    try {
      await this.db.batch(statements);
    } catch (error) {
      // El guard de disponible y los CHECK de estados son la misma falla de negocio: conflicto.
      if (/CHECK constraint failed|guard/i.test(String(error))) throw new BusinessError('conflict');
      throw error;
    }
  }

  async list(storeId: string): Promise<OrderRow[]> {
    const result = await this.db.prepare('SELECT * FROM orders WHERE store_id=? ORDER BY created_at DESC, numero DESC').bind(storeId).all<OrderRow>();
    return result.results;
  }

  async read(storeId: string, id: string): Promise<{ row: OrderRow; items: OrderItem[]; unmarkedPayments: string[]; lastEvent: { kind: string; at: string } | null } | null> {
    const row = await this.db.prepare('SELECT * FROM orders WHERE store_id=? AND id=?').bind(storeId, id).first<OrderRow>();
    if (!row) return null;
    const [items, payments, events] = await this.db.batch([
      this.db.prepare('SELECT product_id,name,variant_text,quantity,unit_price_cents,photo_url FROM order_items WHERE order_id=? ORDER BY position').bind(id),
      this.db.prepare("SELECT voided_at FROM order_payments WHERE order_id=? AND status='voided' AND voided_at IS NOT NULL ORDER BY voided_at").bind(id),
      this.db.prepare('SELECT kind,happened_at FROM order_events WHERE order_id=? ORDER BY id DESC LIMIT 1').bind(id),
    ]);
    return {
      row,
      items: (items.results as ItemRow[]).map(item => ({ productId: item.product_id, name: item.name, variantText: item.variant_text, quantity: item.quantity, unitPriceCents: item.unit_price_cents, photoUrl: item.photo_url })),
      unmarkedPayments: (payments.results as { voided_at: string }[]).map(payment => payment.voided_at),
      lastEvent: events.results[0] ? { kind: (events.results[0] as { kind: string }).kind, at: (events.results[0] as { happened_at: string }).happened_at } : null,
    };
  }

  /** Aplica un comando en un lote: UPDATE versionado con guard, efectos y evento. 0 filas = conflicto. */
  async persist(storeId: string, id: string, expectedVersion: number, plan: CommandPlan): Promise<OrderRow> {
    const assignments: string[] = [];
    const values: unknown[] = [];
    for (const [column, value] of Object.entries(plan.patch)) {
      // La versión la lleva siempre el SQL (version=version+1): el patch nunca la enlaza.
      if (value === undefined || column === 'version') continue;
      assignments.push(`${column}=?`);
      values.push(value);
    }
    const statements = [
      this.db.prepare(`UPDATE orders SET ${[...assignments, 'version=version+1'].join(',')} WHERE id=? AND store_id=? AND version=? RETURNING *`).bind(...values, id, storeId, expectedVersion),
      this.db.prepare('INSERT INTO write_guards(ok) VALUES(changes())'),
      ...plan.effects.flatMap(effect => {
        if (effect.type === 'allocation') {
          const change = effect.change;
          return change.type === 'release'
            ? [this.db.prepare('DELETE FROM stock_allocations WHERE order_id=?').bind(id)]
            : [this.db.prepare(change.type === 'sold'
              ? "UPDATE stock_allocations SET kind='sold', expires_at=NULL WHERE order_id=?"
              : 'UPDATE stock_allocations SET kind=?, expires_at=? WHERE order_id=?').bind(...(change.type === 'sold' ? [id] : ['reserved', change.expiresAt, id]))];
        }
        if (effect.type === 'payment') {
          return [this.db.prepare('INSERT INTO order_payments(id,order_id,method,amount_cents,status,created_at,created_by) VALUES(?,?,?,?,?,?,?)')
            .bind(effect.id, id, effect.method, effect.amountCents, 'confirmed', effect.createdAt, effect.createdBy)];
        }
        return [this.db.prepare("UPDATE order_payments SET status='voided', voided_at=? WHERE order_id=? AND status='confirmed'").bind(effect.at, id)];
      }),
      ...plan.events.map(event => this.db.prepare('INSERT INTO order_events(order_id,kind,happened_at,actor) VALUES(?,?,?,?)').bind(id, event.kind, event.at, event.actor)),
      this.db.prepare('DELETE FROM write_guards'),
    ];
    try {
      const result = await this.db.batch(statements);
      if (!result[0].results.length) throw new BusinessError('conflict');
      return result[0].results[0] as unknown as OrderRow;
    } catch (error) {
      if (error instanceof BusinessError) throw error;
      if (/CHECK constraint failed|guard/i.test(String(error))) throw new BusinessError('conflict');
      throw error;
    }
  }

  /** Consumo vivo por variante, para calcular availableStock en los snapshots. */
  async availability(storeId: string, now: string): Promise<Map<string, number>> {
    const result = await this.db.prepare(`
      SELECT a.product_id, a.variant_key, SUM(a.quantity) AS taken
      FROM stock_allocations a
      WHERE a.store_id=? AND ${LIVE}
      GROUP BY a.product_id, a.variant_key
    `).bind(storeId, now).all<{ product_id: string; variant_key: string; taken: number }>();
    return new Map(result.results.map(row => [`${row.product_id}::${row.variant_key}`, row.taken]));
  }
}
