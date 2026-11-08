import { BusinessError, requireActor, requireStoreWrite, type Actor } from "../../identity/domain/access.ts";
import type { StoreDependencies } from "../../stores/application/stores.ts";
import { productSlug, validateProduct, type Product, type ProductInput } from "../domain/product.ts";

export interface CatalogRepository {
  list(storeId: string): Promise<Product[]>;
  save(product: Product, ownerId: string, expectedVersion: number | null): Promise<Product>;
}
export type CatalogDependencies = StoreDependencies & { catalog: CatalogRepository };
export async function saveProduct(deps: CatalogDependencies, actor: Actor | null, id: string | null, expectedVersion: number | null, input: ProductInput): Promise<Product> {
  const owner = requireActor(actor);
  const store = await deps.stores.findOwned(owner.userId);
  if (!store) throw new BusinessError("forbidden");
  requireStoreWrite(owner, owner.userId, store.isDemo, deps.environment);
  if (id !== null && (!/^[a-zA-Z0-9-]{1,100}$/.test(id) || !Number.isSafeInteger(expectedVersion) || expectedVersion! < 1)) throw new BusinessError("invalid");
  if (id === null && expectedVersion !== null) throw new BusinessError("invalid");
  const clean = validateProduct(input, store.id);
  const now = deps.now();
  return deps.catalog.save({ ...clean, id: id ?? deps.newId(), storeId: store.id, slug: productSlug(clean.name), version: expectedVersion === null ? 1 : expectedVersion + 1, createdAt: now, updatedAt: now }, owner.userId, expectedVersion);
}
export async function ownedCatalog(deps: CatalogDependencies, actor: Actor | null): Promise<Product[]> {
  const store = await deps.stores.findOwned(requireActor(actor).userId);
  if (!store) throw new BusinessError("forbidden");
  return deps.catalog.list(store.id);
}
