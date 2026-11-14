import 'server-only';
import type { Product, CatalogCommand } from '@tiendly/contracts';
import { apiJson, privateSnapshot, ApiError } from './api-client';
import { toCatalogInput, fromCatalog } from './catalog-mapping';
import { subirFotos } from './datos/fotos';
import { aProducto, faltaParaPublicar, type FormProducto } from '@/features/productos/lib/formulario';

export async function apiCatalogResult<T>(action: () => Promise<T>): Promise<T | { error: string }> {
  try { return await action(); }
  catch (error) {
    const messages: Record<string, string> = { conflict: 'El catálogo cambió. Recarga la página antes de guardar.', unauthorized: 'Ingresa de nuevo para guardar los cambios.', forbidden: 'No tienes permiso para cambiar este catálogo.', invalid: 'Revisa los datos del producto antes de guardar.' };
    return { error: error instanceof ApiError ? messages[error.code] ?? 'No pudimos guardar los cambios. Inténtalo de nuevo.' : 'No pudimos guardar los cambios. Inténtalo de nuevo.' };
  }
}
export async function apiSaveProduct(id: string | null, form: FormProducto, expectedVersion?: number) {
  const snapshot = await privateSnapshot();
  if (!snapshot) throw new ApiError('unauthorized', 401);
  const previous = id ? snapshot.products.find(p => p.id === id) : null;
  if (id && (!previous || expectedVersion !== previous.version)) throw new ApiError('conflict', 409);
  const urls = await subirFotos(snapshot.store.slug, form.imagenes.map(image => image.url));
  const paused = form.estado === 'activo' ? faltaParaPublicar(form) : null;
  const product = aProducto({ ...form, imagenes: form.imagenes.map((image, index) => ({ ...image, url: urls[index] })), estado: paused ? 'pausado' : form.estado }, id ?? 'new', previous ? fromCatalog(previous) : null);
  const saved = (await apiJson<{ product: Product }>('/api/business/catalog', { method: id ? 'PUT' : 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...(id ? { id, version: expectedVersion } : {}), product: toCatalogInput(product) }) })).product;
  return { id: saved.id, version: saved.version, pausado: paused, urls, urlTienda: saved.status === 'active' ? `/${snapshot.store.slug}/${saved.slug}` : null };
}
export async function apiDuplicateProduct(id: string) {
  const response = await apiJson<{ product: Product }>('/api/business/catalog/commands', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ kind: 'duplicate', id }) });
  return fromCatalog(response.product);
}
export async function apiCatalogCommand(command: Exclude<CatalogCommand, { kind: 'duplicate' }>) {
  const result = await apiJson<{ products: Product[]; skipped: number }>('/api/business/catalog/commands', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(command) });
  return { products: result.products.map(fromCatalog), skipped: result.skipped };
}
