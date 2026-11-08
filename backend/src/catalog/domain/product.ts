import { BusinessError } from "../../identity/domain/access.ts";

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
export const variantKey = (values: readonly string[]) => values.join("|");
export const productSlug = (name: string) => name.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const invalid = (): never => { throw new BusinessError("invalid"); };
const string = (value: unknown, max: number): value is string => typeof value === "string" && value.length <= max;
const cents = (value: unknown): value is number => Number.isSafeInteger(value) && (value as number) >= 0;
const day = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value + "T00:00:00Z")) && new Date(value + "T00:00:00Z").toISOString().slice(0, 10) === value;

export function toCents(soles: number): number {
  if (!Number.isFinite(soles) || soles < 0) return invalid();
  const value = Math.round((soles + Number.EPSILON) * 100);
  return cents(value) ? value : invalid();
}
export function priceOn(product: Pick<ProductInput, "priceCents" | "compareAtCents" | "offer">, limaDate: string): number {
  return product.compareAtCents && ((product.offer?.from && product.offer.from > limaDate) || (product.offer?.until && product.offer.until < limaDate)) ? product.compareAtCents : product.priceCents;
}
export function bulkPrice(normalCents: number, mode: "percentage" | "price", value: number): number {
  if (!["percentage", "price"].includes(mode) || !cents(normalCents) || !Number.isFinite(value) || value <= 0 || (mode === "percentage" && value >= 100)) return invalid();
  return Math.round(mode === "percentage" ? normalCents / 100 * (1 - value / 100) : value) * 100;
}

export function validateProduct(input: ProductInput, storeId: string): ProductInput {
  if (!input || !string(input.name, 160) || input.name.trim().length < 2 || !productSlug(input.name) || !string(input.description, 10000) || !string(input.sku, 100) || !["active", "paused"].includes(input.status) || !cents(input.priceCents)) return invalid();
  if (input.compareAtCents !== null && (!cents(input.compareAtCents) || input.compareAtCents <= input.priceCents)) return invalid();
  if (input.offer !== null && (!input.offer || typeof input.offer !== "object" || (input.offer.from !== undefined && (!string(input.offer.from,10) || !day(input.offer.from))) || (input.offer.until !== undefined && (!string(input.offer.until,10) || !day(input.offer.until))) || (input.offer.from && input.offer.until && input.offer.from > input.offer.until) || input.compareAtCents === null)) return invalid();
  if (!Array.isArray(input.categories) || input.categories.length > 30 || !input.categories.every(x => string(x, 100) && x.trim())) return invalid();
  if (!Array.isArray(input.options) || input.options.length > 3) return invalid();
  for (const option of input.options) {
    if (!option || !string(option.name, 60) || !option.name.trim() || !["color", "size", "other"].includes(option.kind) || !Array.isArray(option.values) || !option.values.length || option.values.length > 100 || !option.values.every(x => string(x, 80) && x.trim() && !x.includes("|")) || new Set(option.values).size !== option.values.length) return invalid();
  }
  const count = input.options.reduce((n, o) => n * o.values.length, 1);
  if (count > 1000 || !Array.isArray(input.variants) || input.variants.length !== count) return invalid();
  const keys = new Set<string>();
  for (const variant of input.variants) {
    if (!variant || !Array.isArray(variant.values) || variant.values.length !== input.options.length || !variant.values.every((v,i) => input.options[i].values.includes(v)) || !Number.isSafeInteger(variant.stock) || variant.stock < 0 || variant.stock > 2147483647) return invalid();
    const key = variantKey(variant.values);
    if (keys.has(key)) return invalid();
    keys.add(key);
  }
  if (input.photoOption !== undefined && (!Number.isInteger(input.photoOption) || input.photoOption < -1 || input.photoOption >= input.options.length)) return invalid();
  const photoIndex = input.photoOption ?? (input.options.some(o=>o.kind==="color") ? input.options.findIndex(o=>o.kind==="color") : input.options.findIndex(o=>o.name.trim().toLowerCase()==="tono"));
  const validPhoto = (url: unknown) => {
    if (!string(url, 512) || url.includes("..")) return false;
    const prefix = `/images/${storeId}/`;
    return url.startsWith(prefix) ? /^[a-zA-Z0-9-]{1,100}\.(jpg|png|webp)$/.test(url.slice(prefix.length)) : /^\/tiendas-ejemplo\/[a-zA-Z0-9_./-]+\.(jpg|jpeg|png|webp)$/.test(url);
  };
  if (input.primaryImage !== null && !validPhoto(input.primaryImage)) return invalid();
  if (!input.photos || typeof input.photos !== "object" || Array.isArray(input.photos)) return invalid();
  for (const [group, urls] of Object.entries(input.photos)) {
    if (!(group === "" || (photoIndex >= 0 && input.options[photoIndex].values.includes(group))) || !Array.isArray(urls) || urls.length > 20 || !urls.every(validPhoto)) return invalid();
  }
  if (input.measurements !== undefined && input.measurements !== null) {
    const table = input.measurements;
    const sizes = input.options.find(o=>o.kind==="size")?.values ?? [""];
    if (!table || !Array.isArray(table.columns) || !table.columns.length || table.columns.length > 4 || !table.columns.every(x=>string(x,60) && x.trim()) || !table.rows || typeof table.rows !== "object" || Array.isArray(table.rows)) return invalid();
    for (const [size, values] of Object.entries(table.rows)) if (!sizes.includes(size) || !Array.isArray(values) || values.length !== table.columns.length || !values.every(x=>string(x,80))) return invalid();
  }
  const complete = input.priceCents > 0 && input.variants.some(v=>v.stock>0) && (input.primaryImage || Object.values(input.photos).some(x=>x.length));
  return { name:input.name.trim(),description:input.description,sku:input.sku,categories:input.categories,status:input.status === "active" && !complete ? "paused" : input.status,priceCents:input.priceCents,compareAtCents:input.compareAtCents,offer:input.offer,options:input.options,variants:input.variants,primaryImage:input.primaryImage,photos:input.photos,...(input.photoOption===undefined?{}:{photoOption:input.photoOption}),...(input.measurements===undefined?{}:{measurements:input.measurements}) };
}
