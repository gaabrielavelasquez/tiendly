import type { D1Database } from '@cloudflare/workers-types';
import { D1Stores } from '../../src/stores/adapters/d1-stores.ts';
import { createStore } from '../../src/stores/application/stores.ts';
import { D1Catalog } from '../../src/catalog/adapters/d1-catalog.ts';
import { saveProduct } from '../../src/catalog/application/catalog.ts';
import type { ProductInput } from '../../src/catalog/domain/product.ts';

export default {
 async fetch(_request:Request,{DB:db}:{DB:D1Database}) {
  const userId=crypto.randomUUID();let storeId:string|null=null;
  try {
   await db.prepare('INSERT INTO user(id,name,email,emailVerified,createdAt,updatedAt) VALUES(?,?,?,1,?,?)').bind(userId,'Probe',`${userId}@example.invalid`,Date.now(),Date.now()).run();
   const deps={stores:new D1Stores(db),catalog:new D1Catalog(db),environment:'production' as const,now:()=>new Date().toISOString(),newId:()=>crypto.randomUUID()};
   const store=await createStore(deps,{userId},{slug:`catalog-${userId.slice(0,20)}`,name:'Remote catalog test',salesPhone:'900000000',categories:['home'],otherCategory:''});storeId=store.id;
   const input:ProductInput={name:'Objeto de prueba',description:'Synthetic.',sku:'',categories:['Hogar'],status:'paused',priceCents:9099,compareAtCents:null,offer:null,options:[],variants:[{values:[],stock:2}],primaryImage:null,photos:{'':[]},measurements:null};
   const product=await saveProduct(deps,{userId},null,null,input);
   const race=await Promise.allSettled([saveProduct(deps,{userId},product.id,1,{...input,description:'First.'}),saveProduct(deps,{userId},product.id,1,{...input,description:'Second.'})]);
   const before=(await deps.catalog.list(store.id))[0];
   let rollback=false;try{await deps.catalog.save({...before,version:3,variants:[{values:[],stock:-1}]},userId,2);}catch{rollback=true;}
   const after=(await deps.catalog.list(store.id))[0];
   let foreignRejected=false;try{await deps.catalog.save({...before,version:3},'foreign',2);}catch{foreignRejected=true;}
   const result={competingEdits:race.filter(x=>x.status==='fulfilled').length===1&&before.version===2,rollback:rollback&&JSON.stringify(before)===JSON.stringify(after),foreignRejected,semantics:after.id===product.id&&after.priceCents===9099&&after.measurements===null&&Object.hasOwn(after.photos,'')&&after.photos[''].length===0&&after.variants[0].values.length===0};
   return Response.json(result,{status:Object.values(result).every(Boolean)?200:500});
  } finally {
   if(storeId)await db.prepare('DELETE FROM stores WHERE id=?').bind(storeId).run();
   await db.prepare('DELETE FROM user WHERE id=?').bind(userId).run();
  }
 }
};
