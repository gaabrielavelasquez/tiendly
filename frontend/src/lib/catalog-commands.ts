import 'server-only';
import { headers } from 'next/headers';
import { BusinessError, requireActor, requireStoreWrite, validateProduct, productSlug } from '@tiendly/backend/rules';
import { businessRuntime } from '@/lib/business-runtime';
import { toCatalogInput, fromCatalog } from './catalog-mapping';
import type { Producto } from '@/features/productos/types';

/** Los conflictos llegan al cliente con una recuperación útil, sin exponer errores internos. */
export async function catalogResult<T>(command: () => Promise<T>): Promise<T | { error: string }> {
 try { return await command(); }
 catch (error) {
  if (error instanceof BusinessError) {
   if (error.code === 'conflict') return { error: 'El catálogo cambió. Recarga la página antes de guardar.' };
   if (error.code === 'unauthorized') return { error: 'Ingresa de nuevo para guardar los cambios.' };
   if (error.code === 'forbidden') return { error: 'No tienes permiso para cambiar este catálogo.' };
   if (error.code === 'invalid') return { error: 'Revisa los datos del producto antes de guardar.' };
  }
  return { error: 'No pudimos guardar los cambios. Inténtalo de nuevo.' };
 }
}

export async function catalogContext() {
 const {runtime}=await businessRuntime();
 const actor=requireActor(await runtime.actor(await headers()));
 const store=await runtime.stores.stores.findOwned(actor.userId);
 if(!store)throw new BusinessError('forbidden');
 requireStoreWrite(actor,actor.userId,store.isDemo,runtime.stores.environment);
 return {runtime,actor,store,products:await runtime.catalog.catalog.list(store.id)};
}
export async function changeCatalog(ids:string[],versions:Record<string,number>,change:(product:Producto)=>Producto|null):Promise<{products:Producto[];skipped:number}> {
 const {runtime,actor,store,products}=await catalogContext();
 let skipped=0;
 const writes=[...new Set(ids)].flatMap(id=>{
  const current=products.find(p=>p.id===id);
  if(!current||versions[id]!==current.version)throw new BusinessError('conflict');
  const result=change(fromCatalog(current));
  if(!result){skipped++;return [];}
  const clean=validateProduct(toCatalogInput(result),store.id);
  return [{product:{...current,...clean,slug:productSlug(clean.name),version:current.version+1,updatedAt:runtime.stores.now()},expectedVersion:current.version}];
 });
 return {products:(await runtime.catalog.catalog.saveMany(writes,actor.userId)).map(fromCatalog),skipped};
}
