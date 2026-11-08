import { BusinessError, requireActor, requireStoreWrite, type Actor, type Environment } from "../../identity/domain/access.ts";
import { INITIAL_APPEARANCE, validateStoreInput, type Store, type StoreInput } from "../domain/store.ts";

// Concrete persistence needs of this slice; reads return the canonical DTO.
export interface StoreRepository {
  findOwned(userId: string): Promise<Store | null>;
  findBySlug(slug: string): Promise<Store | null>;
  ownerId(storeId: string): Promise<string | null>;
  create(store: Store, ownerId: string): Promise<void>;
  rename(storeId: string, ownerId: string, expectedVersion: number, name: string, now: string): Promise<Store>;
}
export type StoreDependencies = { stores: StoreRepository; environment: Environment; now: () => string; newId: () => string };

export async function createStore(deps: StoreDependencies, actor: Actor | null, input: StoreInput): Promise<Store> {
  const owner = requireActor(actor);
  const clean = validateStoreInput(input);
  if (await deps.stores.findOwned(owner.userId) || await deps.stores.findBySlug(clean.slug)) throw new BusinessError("conflict");
  const now = deps.now();
  const store: Store = { ...clean, id: deps.newId(), offerSectionName: "", appearance: { ...INITIAL_APPEARANCE }, onboarding: { payments: false, delivery: false, share: false }, plan: "free", founderUntil: null, founderSince: null, measurementConsentAt: null, isDemo: false, version: 1, createdAt: now, updatedAt: now };
  await deps.stores.create(store, owner.userId);
  return store;
}

export async function ownedStore(deps: StoreDependencies, actor: Actor | null): Promise<Store | null> {
  return deps.stores.findOwned(requireActor(actor).userId);
}

export async function renameStore(deps: StoreDependencies, actor: Actor | null, id: string, expectedVersion: number, name: string): Promise<Store> {
  const owner = requireActor(actor);
  const ownerId = await deps.stores.ownerId(id);
  if (!ownerId || ownerId !== owner.userId) throw new BusinessError("forbidden");
  const store = await deps.stores.findOwned(owner.userId);
  if (!store || store.id !== id) throw new BusinessError("forbidden");
  requireStoreWrite(owner, ownerId, store.isDemo, deps.environment);
  if (!Number.isSafeInteger(expectedVersion) || expectedVersion < 1 || typeof name !== "string" || name.trim().length < 2 || name.trim().length > 120) throw new BusinessError("invalid");
  return deps.stores.rename(id, owner.userId, expectedVersion, name.trim(), deps.now());
}
