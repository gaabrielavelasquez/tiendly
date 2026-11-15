export type Option = { name: string; kind: "color" | "size" | "other"; values: string[] };
export type Variant = { values: string[]; stock: number };
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
