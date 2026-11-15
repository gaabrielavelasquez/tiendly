import { BusinessError } from "../../identity/domain/access.ts";

import type { Plan, Capability, Appearance, Store, StoreInput } from '@tiendly/contracts';
export type { Plan, Capability, Appearance, Store, StoreInput } from '@tiendly/contracts';
export const CATEGORIES = ["accessories", "beauty", "footwear", "food", "home", "handmade", "clothing", "secondhand", "technology", "other"] as const;
const RESERVED = new Set(["images", "api", "tienda", "moda", "zapatos", "belleza", "tiendly", "admin", "heather", "demo", "panel", "registro", "kit", "muna", "keyhaus", "glow-labo", "aurora"]);
export const INITIAL_APPEARANCE: Appearance = { theme: "neutral", accent: "theme", logo: "", cover: "", welcome: "", instagram: "", hours: "" };

export function validateStoreInput(value: StoreInput): StoreInput {
  if (!value || typeof value.name !== "string" || typeof value.slug !== "string" || typeof value.salesPhone !== "string" || typeof value.otherCategory !== "string") throw new BusinessError("invalid");
  const name = value.name.trim();
  const otherCategory = value.otherCategory.trim();
  if (name.length < 2 || name.length > 120 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug) || value.slug.length > 40 || RESERVED.has(value.slug) || !/^9\d{8}$/.test(value.salesPhone)) throw new BusinessError("invalid");
  if (!Array.isArray(value.categories) || !value.categories.length || value.categories.length > CATEGORIES.length || !value.categories.every(x => CATEGORIES.includes(x as typeof CATEGORIES[number]))) throw new BusinessError("invalid");
  if (value.categories.includes("other") && (otherCategory.length < 2 || otherCategory.length > 80)) throw new BusinessError("invalid");
  return { slug: value.slug, name, salesPhone: value.salesPhone, categories: [...new Set(value.categories)], otherCategory: value.categories.includes("other") ? otherCategory : "" };
}

function validCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

export function effectivePlan(plan: unknown, founderUntil: string | null, limaDate: string): Plan {
  if (plan === "pro") return "pro";
  return plan === "founder" && founderUntil && validCalendarDate(founderUntil) && validCalendarDate(limaDate) && founderUntil >= limaDate ? "founder" : "free";
}

export function canUse(plan: unknown, founderUntil: string | null, capability: string, limaDate: string): boolean {
  return ["unlimited_coupons", "cover_banner"].includes(capability) && effectivePlan(plan, founderUntil, limaDate) !== "free";
}
