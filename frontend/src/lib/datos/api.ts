import 'server-only';
import { headers } from 'next/headers';
import type { StoreSnapshot } from '@tiendly/contracts';
import { privateSnapshot, publicSnapshot } from '../api-client';
import { frontendConfiguration, frontendCategories, frontendStore } from '../store-mapping';
import { fromCatalog } from '../catalog-mapping';
import type { Inventario, ItemStock } from '@/features/productos/lib/inventario';
import { claveVariante } from '@/features/productos/lib/variantes';
import type { DatosTienda } from './tienda';

export function snapshotData({ store, configuration, products }: StoreSnapshot): DatosTienda {
  // El stock base viene para editar; el disponible (base − vendidos − reservas vigentes) llega como
  // availableStock. Se traduce a una asignación sintética para que conDisponible muestre lo vendido.
  const asignaciones: ItemStock[] = [];
  for (const product of products) {
    for (const variant of product.variants) {
      if (variant.availableStock !== undefined && variant.availableStock < variant.stock) {
        asignaciones.push({ id: product.id, variante: claveVariante(variant.values), cantidad: variant.stock - variant.availableStock });
      }
    }
  }
  const inventario: Inventario = asignaciones.length ? { api: { tipo: 'vendido', items: asignaciones } } : {};
  return { tienda: frontendStore(store, ''), productos: products.map(fromCatalog), config: frontendConfiguration(configuration, store.salesPhone), rubros: frontendCategories(store.categories), ...(store.otherCategory ? { rubroOtro: store.otherCategory } : {}), pedidos: { ultimo: 1000, creados: [] }, inventario, cupones: [] };
}
export async function apiStoreData(slug: string): Promise<DatosTienda | null> {
  const own = (await headers()).get('cookie') ? await privateSnapshot() : null;
  const data = own?.store.slug === slug ? own : await publicSnapshot(slug);
  return data ? snapshotData(data) : null;
}
