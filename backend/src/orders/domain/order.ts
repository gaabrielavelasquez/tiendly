import { variantKey, priceOn } from "../../catalog/domain/product.ts";
import { BusinessError } from "../../identity/domain/access.ts";
import type { Product } from '@tiendly/contracts';
import type { CheckoutDelivery, CheckoutInput, OrderTotals, StoreConfiguration } from '@tiendly/contracts';
export type { CheckoutDelivery, CheckoutInput, OrderTotals };

/** Misma geografía que checkout/lib/config.ts: el distrito define la zona y con ella el costo. */
const LIMA = ["Barranco", "Breña", "Chorrillos", "Jesús María", "La Molina", "La Victoria", "Lince", "Magdalena del Mar", "Miraflores", "Pueblo Libre", "San Borja", "San Isidro", "San Miguel", "Santiago de Surco", "Surquillo"];
const CALLAO = ["Callao", "Bellavista", "La Perla", "Ventanilla"];
const ZONES: Record<string, 'lima' | 'callao' | 'provincias'> = {
  ...Object.fromEntries(LIMA.map(name => [name, 'lima'])),
  ...Object.fromEntries(CALLAO.map(name => [name, 'callao'])),
  Cayma: 'provincias', Yanahuara: 'provincias', Cayaltí: 'provincias', Trujillo: 'provincias', Cusco: 'provincias', Piura: 'provincias',
};
export const zoneOfDistrict = (district: string) => ZONES[district] ?? null;

/** Hoy como día AAAA-MM-DD en Lima: las ofertas y el envío gratis se miden en días de Lima. */
export function limaDate(at: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' }).format(at);
}

/** Horas que se separan los productos de un pedido por WhatsApp (decisión 0010). */
export const RESERVE_HOURS = 24;
export const reserveUntil = (createdAt: string) => new Date(Date.parse(createdAt) + RESERVE_HOURS * 3600000).toISOString();

const invalid = (): never => { throw new BusinessError("invalid"); };
const text = (value: unknown, min: number, max: number): value is string => typeof value === "string" && value.trim().length >= min && value.trim().length <= max;
const phone = (value: unknown): value is string => typeof value === "string" && /^9\d{8}$/.test(value.replace(/\D/g, ""));
const count = (value: unknown): value is number => Number.isSafeInteger(value) && (value as number) > 0 && (value as number) <= 999;

/** Grupo de fotos de una variante (misma regla que productos/lib/variantes.ts): la opción elegida, color o "Tono". */
function photoFor(product: Product, values: string[]): string | null {
  const index = product.photoOption !== undefined
    ? (product.photoOption >= 0 && product.photoOption < product.options.length ? product.photoOption : -1)
    : product.options.findIndex(option => option.kind === 'color') >= 0
      ? product.options.findIndex(option => option.kind === 'color')
      : product.options.findIndex(option => option.name.trim().toLowerCase() === 'tono');
  const group = index < 0 ? '' : values[index] ?? '';
  return product.photos[group]?.[0] ?? product.primaryImage ?? null;
}

export type ResolvedItem = { productId: string; key: string; name: string; variantText: string; quantity: number; unitPriceCents: number; photoUrl: string | null };

/** El mismo cálculo que el carrito (checkout/lib/reglas.ts), en céntimos y sin cupones todavía. */
export function totals(items: ResolvedItem[], shippingCents: number | null, shippingPending: boolean): OrderTotals {
  const subtotalCents = items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);
  const units = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalCents = subtotalCents + (shippingCents ?? 0);
  return { subtotalCents, discountCents: 0, shippingCents, shippingPending, totalCents, units };
}

/**
 * Precio y stock se resuelven aquí con el catálogo publicado: no se confía en los montos que manda el
 * navegador. Un producto pausado o una variante inexistente descartan la línea (el carrito pide quitarla).
 */
export function resolveItems(input: CheckoutInput, products: Product[], limaDay: string): ResolvedItem[] {
  const byId = new Map(products.filter(product => product.status === 'active').map(product => [product.id, product]));
  const merged = new Map<string, ResolvedItem>();
  if (!Array.isArray(input.items) || !input.items.length || input.items.length > 50) invalid();
  for (const item of input.items) {
    if (!item || typeof item.productId !== 'string' || !Array.isArray(item.variant) || !count(item.quantity)) invalid();
    const product = byId.get(item.productId);
    if (!product) continue; // el cliente lo verá como agotado; su carrito se lo pide quitar
    const key = variantKey(item.variant);
    const variant = product.variants.find(candidate => variantKey(candidate.values) === key);
    if (!variant) continue;
    const previous = merged.get(`${product.id}::${key}`);
    if (previous) { previous.quantity += item.quantity; continue; }
    merged.set(`${product.id}::${key}`, {
      productId: product.id, key, name: product.name,
      variantText: item.variant.join(" · "),
      quantity: item.quantity,
      unitPriceCents: priceOn(product, limaDay),
      photoUrl: photoFor(product, item.variant),
    });
  }
  if (!merged.size) invalid();
  return [...merged.values()];
}

export type DeliveryResolution = { kind: CheckoutDelivery['kind']; shippingCents: number | null; shippingPending: boolean; district: string | null; address: string | null; reference: string | null };

function validateDelivery(input: CheckoutDelivery, configuration: StoreConfiguration): DeliveryResolution {
  const { delivery, payments } = configuration;
  if (!input || typeof input !== 'object') invalid();
  if (input.kind === 'delivery') {
    if (!text(input.address, 5, 200) || !text(input.district, 1, 80) || (input.reference !== undefined && !text(input.reference, 1, 200))) invalid();
    const zone = zoneOfDistrict(input.district.trim());
    const configured = zone ? delivery.zones.find(candidate => candidate.key === zone) : undefined;
    // Una zona sin costo fijo no se vende en línea: el checkout la esconde y aquí también se rechaza.
    if (!delivery.enabled || !configured?.enabled || configured.costCents === null) return invalid();
    return { kind: 'delivery', shippingCents: configured.costCents, shippingPending: false, district: input.district.trim(), address: input.address.trim(), reference: input.reference?.trim() || null };
  }
  if (input.kind === 'pickup') {
    if (!delivery.pickupEnabled) invalid();
    return { kind: 'pickup', shippingCents: 0, shippingPending: false, district: null, address: null, reference: null };
  }
  if (input.kind === 'coordinate') {
    // Sin entregas definidas, la entrega y su costo se coordinan por WhatsApp (decisión 0009).
    const sellable = delivery.enabled && delivery.zones.some(zone => zone.enabled && zone.costCents !== null);
    if (sellable || delivery.pickupEnabled || !payments.whatsappEnabled) invalid();
    return { kind: 'coordinate', shippingCents: null, shippingPending: true, district: null, address: null, reference: null };
  }
  return invalid();
}

export function paymentAllowed(method: CheckoutInput["payment"]["method"], configuration: StoreConfiguration): boolean {
  const { payments } = configuration;
  if (method === 'whatsapp') return payments.whatsappEnabled;
  // Los cobros automáticos solo cobran de verdad con la afiliación activa (módulo 2).
  return payments.automaticStatus === 'active' && (method === 'card' ? payments.cardEnabled : payments.yapeEnabled);
}

/** Valida y normaliza lo que manda el navegador del cliente. Nunca confía en precios ni totales. */
export function validateCheckout(input: CheckoutInput, configuration: StoreConfiguration): { customer: { name: string; phone: string }; delivery: ReturnType<typeof validateDelivery>; method: CheckoutInput["payment"]["method"] } {
  if (!input || typeof input !== 'object' || typeof input.token !== 'string' || input.token.length < 8 || input.token.length > 100 || !/^[A-Za-z0-9_-]+$/.test(input.token)) invalid();
  if (!input.customer || !text(input.customer.name, 3, 120) || input.customer.name.trim().split(/\s+/).length < 2 || !phone(input.customer.phone)) invalid();
  const method = input.payment?.method;
  if (method !== 'card' && method !== 'yape' && method !== 'whatsapp') invalid();
  if (!paymentAllowed(method, configuration)) invalid();
  return { customer: { name: input.customer.name.trim(), phone: input.customer.phone.replace(/\D/g, "") }, delivery: validateDelivery(input.delivery, configuration), method };
}

/** Envío gratis por monto (decisión 0009), con el mismo orden que el carrito: primero el subtotal. */
export function shippingFor(delivery: ReturnType<typeof validateDelivery>, configuration: StoreConfiguration, subtotalCents: number): number | null {
  if (delivery.shippingPending) return null;
  if (delivery.shippingCents === 0) return 0;
  const { freeShippingEnabled, freeShippingThresholdCents } = configuration.delivery;
  return freeShippingEnabled && freeShippingThresholdCents > 0 && subtotalCents >= freeShippingThresholdCents ? 0 : delivery.shippingCents;
}

/** disponibleStock por variante, calculado aquí y no en el navegador. Sin pedidos, no cambia nada. */
export function withAvailability(products: Product[], taken: Map<string, number>): Product[] {
  if (!taken.size) return products;
  return products.map(product => ({
    ...product,
    variants: product.variants.map(variant => {
      const consumed = taken.get(`${product.id}::${variantKey(variant.values)}`);
      return consumed ? { ...variant, availableStock: Math.max(0, variant.stock - consumed) } : variant;
    }),
  }));
}
