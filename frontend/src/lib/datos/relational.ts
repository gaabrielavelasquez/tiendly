import 'server-only';
import { D1Stores, D1Catalog, D1Settings, type Bindings } from '@tiendly/backend/server';
import { frontendStore, frontendConfiguration, frontendCategories } from '../store-mapping';
import { fromCatalog } from '../catalog-mapping';
import type { DatosTienda } from './tienda';

export async function relationalStore(bindings:Bindings,slug:string):Promise<DatosTienda|null> {
 const store=await new D1Stores(bindings.DB).findBySlug(slug);
 if(!store)return null;
 const [products,settings]=await Promise.all([new D1Catalog(bindings.DB).list(store.id),new D1Settings(bindings.DB).read(store.id)]);
 const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Lima',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 return {tienda:frontendStore(store,today),productos:products.map(fromCatalog),config:frontendConfiguration(settings,store.salesPhone),rubros:frontendCategories(store.categories),...(store.otherCategory?{rubroOtro:store.otherCategory}:{}),
  // Sales/promotions are not enabled for D1 stores until their relational commands land.
  pedidos:{ultimo:1000,creados:[]},inventario:{},cupones:[]};
}
