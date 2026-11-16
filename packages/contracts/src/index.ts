export type Option = { name: string; kind: "color" | "size" | "other"; values: string[] };
export type Variant = { values: string[]; stock: number; /** Base stock minus sold units and live reservations. Absent when there are no orders. */ availableStock?: number };
export type Measurements = { columns: string[]; rows: Record<string, string[]> };
export type ProductInput = {
  name: string; description: string; sku: string; categories: string[]; status: "active" | "paused";
  priceCents: number; compareAtCents: number | null; offer: { from?: string; until?: string } | null;
  options: Option[]; variants: Variant[]; photoOption?: number;
  primaryImage: string | null; photos: Record<string, string[]>;
  measurements?: Measurements | null;
};
export type Product = ProductInput & { id: string; storeId: string; slug: string; version: number; createdAt: string; updatedAt: string };

export type Plan = "free" | "founder" | "pro";
export type Capability = "unlimited_coupons" | "cover_banner";
export type Appearance = {
  theme: "neutral" | "editorial" | "soft";
  accent: "theme" | "black" | "terracotta" | "pink" | "olive";
  logo: string; cover: string; welcome: string; instagram: string; hours: string;
};
export type Store = {
  id: string; slug: string; name: string; salesPhone: string;
  categories: string[]; otherCategory: string; offerSectionName: string;
  appearance: Appearance;
  onboarding: { payments: boolean; delivery: boolean; share: boolean };
  plan: Plan; founderUntil: string | null; founderSince: string | null;
  measurementConsentAt: string | null; isDemo: boolean;
  version: number; createdAt: string; updatedAt: string;
};
export type StoreInput = Pick<Store, "slug" | "name" | "salesPhone" | "categories" | "otherCategory">;

export type StoreConfiguration = {
 payments:{whatsappEnabled:boolean;automaticStatus:'inactive'|'review'|'active';cardEnabled:boolean;yapeEnabled:boolean};
 delivery:{enabled:boolean;freeShippingEnabled:boolean;freeShippingThresholdCents:number;pickupEnabled:boolean;pickupAddress:string;pickupDistrict:string;pickupHours:string;pickupNote:string;zones:{key:'lima'|'callao'|'provincias';enabled:boolean;costCents:number|null;estimate:string}[]};
};

/** Public store identity deliberately excludes consent, founder dates and membership data. */
export type StoreView = Pick<Store, 'id' | 'slug' | 'name' | 'salesPhone' | 'categories' | 'otherCategory' | 'offerSectionName' | 'appearance' | 'onboarding' | 'createdAt' | 'isDemo'> & { effectivePlan: 'free' | 'pro' };
export type StoreSnapshot = { store: StoreView; configuration: StoreConfiguration; products: Product[] };
export type SessionView = { user: { id: string; name: string } } | null;
export type CatalogVersions = Record<string, number>;
export type CatalogCommand =
  | { kind: 'duplicate'; id: string }
  | { kind: 'statuses'; statuses: Record<string, ProductInput['status']>; versions: CatalogVersions }
  | { kind: 'offer'; ids: string[]; versions: CatalogVersions; offer: { mode: 'percentage' | 'price'; value: number; from?: string; until?: string } }
  | { kind: 'remove-offer'; ids: string[]; versions: CatalogVersions }
  | { kind: 'restore'; previous: Pick<Product, 'id' | 'status' | 'priceCents' | 'compareAtCents' | 'offer'>[]; versions: CatalogVersions };
export type ApiErrorCode = 'unauthorized' | 'forbidden' | 'invalid' | 'conflict' | 'not_found' | 'unavailable' | 'method_not_allowed' | 'too_large';

// ── Geografía de envío (única fuente para el checkout y la API) ─────────────────────────────────────
export type ShippingZone = 'lima' | 'callao' | 'provincias';
/** Distrito → zona (decisión 0009). El checkout solo ofrece estos distritos y la API solo acepta estos. */
export const DISTRICT_ZONES = {
  Barranco: 'lima', 'Breña': 'lima', Chorrillos: 'lima', 'Jesús María': 'lima', 'La Molina': 'lima',
  'La Victoria': 'lima', Lince: 'lima', 'Magdalena del Mar': 'lima', Miraflores: 'lima',
  'Pueblo Libre': 'lima', 'San Borja': 'lima', 'San Isidro': 'lima', 'San Miguel': 'lima',
  'Santiago de Surco': 'lima', Surquillo: 'lima',
  Callao: 'callao', Bellavista: 'callao', 'La Perla': 'callao', Ventanilla: 'callao',
  Cayma: 'provincias', Yanahuara: 'provincias', 'Cayaltí': 'provincias', Trujillo: 'provincias',
  Cusco: 'provincias', Piura: 'provincias',
} satisfies Record<string, ShippingZone>;
export function zoneOfDistrict(district: string): ShippingZone | null {
  return (DISTRICT_ZONES as Record<string, ShippingZone>)[district] ?? null;
}

/** Cupón de checkout: el código se valida en el backend; el navegador nunca manda el descuento. */
export type CheckoutCoupon = { code: string };

// ── Orders (storefront checkout + panel) ─────────────────────────────────────────────────────────────
export type OrderPaymentMethod = 'card' | 'yape' | 'whatsapp';
export type OrderPaymentStatus = 'pending' | 'paid' | 'canceled';
export type OrderDeliveryMethod = 'delivery' | 'pickup' | 'coordinate';
export type OrderDeliveryStatus = 'to-ship' | 'shipped' | 'delivered';
export type OrderCancellation = 'store' | 'expired-reservation';
export type CheckoutDelivery =
  | { kind: 'delivery'; district: string; address: string; reference?: string }
  | { kind: 'pickup' }
  | { kind: 'coordinate' };
export type CheckoutInput = {
  /** Checkout attempt token: ties the order to its reserved number. */
  token: string;
  items: { productId: string; variant: string[]; quantity: number }[];
  customer: { name: string; phone: string };
  delivery: CheckoutDelivery;
  payment: { method: OrderPaymentMethod };
  /** Opcional y aún sin efecto: se valida en el backend al migrar cupones (decisión 0047). */
  coupon?: CheckoutCoupon;
};
export type OrderTotals = { subtotalCents: number; discountCents: number; shippingCents: number | null; shippingPending: boolean; totalCents: number; units: number };
/** Storefront receipt: everything the confirmation screen needs, nothing about the panel. */
export type OrderReceipt = { number: string; createdAt: string; totals: OrderTotals; receiptToken: string };
export type OrderItem = { productId: string | null; name: string; variantText: string; quantity: number; unitPriceCents: number; photoUrl: string | null };
export type OrderView = {
  id: string; number: string; createdAt: string; version: number;
  customer: { name: string; phone: string };
  totals: OrderTotals;
  payment: { status: OrderPaymentStatus; method: OrderPaymentMethod };
  delivery: { status: OrderDeliveryStatus; method: OrderDeliveryMethod; district: string | null };
};
export type OrderDetail = OrderView & {
  items: OrderItem[];
  couponCode: string | null;
  address: string | null;
  reference: string | null;
  pickup: { address: string; district: string; hours: string; note: string } | null;
  paidAt: string | null;
  unmarkedPayments: string[];
  shippedAt: string | null;
  deliveredAt: string | null;
  canceledAt: string | null;
  cancellation: OrderCancellation | null;
};
/** Panel actions run as their own command; the browser never sends prices or statuses. */
export type OrderCommand =
  | { kind: 'pay'; version: number }
  | { kind: 'unpay'; version: number }
  | { kind: 'ship'; version: number }
  | { kind: 'unship'; version: number }
  | { kind: 'deliver'; version: number }
  | { kind: 'undeliver'; version: number }
  | { kind: 'cancel'; version: number }
  | { kind: 'undo' };
