import 'server-only';
import { headers } from 'next/headers';
import type { StoreSnapshot } from '@tiendly/contracts';
import { privateSnapshot, publicSnapshot } from '../api-client';
import { frontendConfiguration, frontendCategories, frontendStore } from '../store-mapping';
import { fromCatalog } from '../catalog-mapping';
import type { DatosTienda } from './tienda';

export function snapshotData({ store, configuration, products }: StoreSnapshot): DatosTienda {
  return { tienda: frontendStore(store, ''), productos: products.map(fromCatalog), config: frontendConfiguration(configuration, store.salesPhone), rubros: frontendCategories(store.categories), ...(store.otherCategory ? { rubroOtro: store.otherCategory } : {}), pedidos: { ultimo: 1000, creados: [] }, inventario: {}, cupones: [] };
}
export async function apiStoreData(slug: string): Promise<DatosTienda | null> {
  const own = (await headers()).get('cookie') ? await privateSnapshot() : null;
  const data = own?.store.slug === slug ? own : await publicSnapshot(slug);
  return data ? snapshotData(data) : null;
}
