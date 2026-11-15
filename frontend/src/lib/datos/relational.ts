import 'server-only';
import { D1Stores, storeSnapshot, type Bindings } from '@tiendly/backend/server';
import { snapshotData } from './api';
import type { DatosTienda } from './tienda';

export async function relationalStore(bindings:Bindings,slug:string):Promise<DatosTienda|null> {
 const store=await new D1Stores(bindings.DB).findBySlug(slug);
 if(!store)return null;
 return snapshotData(await storeSnapshot(bindings, store, false));
}
