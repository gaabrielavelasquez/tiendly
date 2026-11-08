import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import type { D1Database, R2Bucket } from '@cloudflare/workers-types';
import { D1Stores } from '../src/stores/adapters/d1-stores.ts';
import { createStore } from '../src/stores/application/stores.ts';
import { D1Catalog } from '../src/catalog/adapters/d1-catalog.ts';
import { ownedCatalog, saveProduct } from '../src/catalog/application/catalog.ts';
import { bulkPrice, priceOn, productSlug, toCents, validateProduct, variantKey, type ProductInput } from '../src/catalog/domain/product.ts';
import { uploadImage, readImage, MAX_IMAGE_BYTES } from '../src/catalog/adapters/r2-images.ts';
import { BusinessError } from '../src/identity/domain/access.ts';

async function fixture() {
  const mf=new Miniflare(convertV4MiniflareOptions({modules:true,script:'export default { fetch() { return new Response("ok") } }',compatibilityDate:'2026-11-08',d1Databases:['DB'],r2Buckets:['UPLOADS']}));
  const db=await mf.getD1Database('DB') as unknown as D1Database;
  for(const file of ['0001_auth.sql','0002_stores.sql','0003_catalog.sql']) {
    const sql=await readFile(new URL(`../db/migrations/${file}`,import.meta.url),'utf8');
    for(const statement of sql.replace(/^--.*$/gm,'').split(';').filter(x=>x.trim()))await db.prepare(statement).run();
  }
  for(const id of ['owner','foreign'])await db.prepare('INSERT INTO user(id,name,email,emailVerified,createdAt,updatedAt) VALUES(?,?,?,1,?,?)').bind(id,'Test',`${id}@example.invalid`,Date.now(),Date.now()).run();
  const deps={stores:new D1Stores(db),catalog:new D1Catalog(db),environment:'production' as const,now:()=>new Date().toISOString(),newId:()=>crypto.randomUUID()};
  const store=await createStore(deps,{userId:'owner'},{slug:'test-catalog',name:'Casa taller',salesPhone:'900000000',categories:['home'],otherCategory:''});
  return {mf,db,deps,store,bucket:await mf.getR2Bucket('UPLOADS') as unknown as R2Bucket};
}
const input=(storeId:string):ProductInput=>({name:'Jarrón Chloé',description:'Una pieza.',sku:'J-1',categories:['Hogar'],status:'active',priceCents:9099,compareAtCents:10000,offer:{from:'2026-11-08',until:'2026-11-09'},options:[{name:'Color',kind:'color',values:['Beige','Azul']}],variants:[{values:['Beige'],stock:2},{values:['Azul'],stock:1}],primaryImage:`/images/${storeId}/photo.jpg`,photos:{Beige:[`/images/${storeId}/first.jpg`,`/images/${storeId}/second.jpg`],Azul:[]}});
const code=(value:string)=>(error:unknown)=>error instanceof BusinessError&&error.code===value;

test('catalog money, inclusive Lima offers, variant keys and whole-sol bulk rounding',()=>{
 assert.equal(toCents(90.99),9099);assert.equal(toCents(129999.1),12999910);assert.equal(bulkPrice(9099,'percentage',20),7300);
 assert.equal(productSlug('Jarrón Chloé'),'jarron-chloe');assert.equal(variantKey(['Plata','36']),'Plata|36');assert.equal(variantKey([]),'');
 const p=input('test');assert.equal(priceOn(p,'2026-11-07'),10000);assert.equal(priceOn(p,'2026-11-08'),9099);assert.equal(priceOn(p,'2026-11-09'),9099);assert.equal(priceOn(p,'2026-11-10'),10000);
 assert.throws(()=>validateProduct({...p,offer:{from:'2026-02-30'}},'test'),code('invalid'));
 assert.throws(()=>validateProduct({...p,variants:[{values:['Beige'],stock:1}]},'test'),code('invalid'));
 assert.throws(()=>validateProduct({...p,photos:{Beige:['/images/other/first.jpg']}},'test'),code('invalid'));
 assert.equal(validateProduct({...p,variants:p.variants.map(v=>({...v,stock:0}))},'test').status,'paused');
});

test('catalog persists IDs, option order, gallery order/empty groups and three measurement modes',async()=>{
 const {mf,deps,store}=await fixture();
 try {
  const p=await saveProduct(deps,{userId:'owner'},null,null,input(store.id));
  const first=(await ownedCatalog(deps,{userId:'owner'}))[0];
  assert.equal(first.id,p.id);assert.deepEqual(first.variants,p.variants);assert.deepEqual(first.photos,p.photos);assert.equal(first.measurements,undefined);
  const none=await saveProduct(deps,{userId:'owner'},p.id,1,{...input(store.id),measurements:null});
  assert.equal((await ownedCatalog(deps,{userId:'owner'}))[0].measurements,null);
  const custom={columns:['Alto'],rows:{'':['12']}};
  await saveProduct(deps,{userId:'owner'},none.id,2,{...input(store.id),measurements:custom});
  assert.deepEqual((await ownedCatalog(deps,{userId:'owner'}))[0].measurements,custom);
 }finally{await mf.dispose();}
});

test('catalog version conflicts and failed child rows roll back the complete aggregate',async()=>{
 const {mf,db,deps,store}=await fixture();
 try {
  const p=await saveProduct(deps,{userId:'owner'},null,null,input(store.id));
  const attempts=await Promise.allSettled([saveProduct(deps,{userId:'owner'},p.id,1,{...input(store.id),description:'First.'}),saveProduct(deps,{userId:'owner'},p.id,1,{...input(store.id),description:'Second.'})]);
  assert.equal(attempts.filter(x=>x.status==='fulfilled').length,1);
  const before=(await deps.catalog.list(store.id))[0];
  await assert.rejects(deps.catalog.save({...before,name:'Invalid write',version:3,variants:[{values:['Beige'],stock:-1}]},'owner',2),code('conflict'));
  assert.deepEqual((await deps.catalog.list(store.id))[0],before);
  await createStore(deps,{userId:'foreign'},{slug:'other-catalog',name:'Other store',salesPhone:'900000001',categories:['home'],otherCategory:''});
  await assert.rejects(saveProduct(deps,{userId:'foreign'},p.id,2,input(store.id)),code('invalid'));
  await assert.rejects(deps.catalog.save({...before,name:'Foreign',version:3},'foreign',2),code('conflict'));
  assert.equal((await db.prepare('SELECT COUNT(*) AS n FROM write_guards').first<{n:number}>())?.n,0);
 }finally{await mf.dispose();}
});

test('R2 images are scoped, size/type checked and served without OAuth dependencies',async()=>{
 const {mf,deps,store,bucket}=await fixture();
 try {
  const png=Uint8Array.from(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aexkAAAAASUVORK5CYII=','base64'));
  const url=await uploadImage(deps,bucket,{userId:'owner'},png,'image/png');
  assert.ok(url.startsWith(`/images/${store.id}/`));
  const response=await readImage(bucket,url.slice('/images/'.length));
  assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'image/png');assert.deepEqual(new Uint8Array(await response.arrayBuffer()),png);
  await assert.rejects(uploadImage(deps,bucket,{userId:'owner'},png,'image/jpeg'),code('invalid'));
  await assert.rejects(uploadImage(deps,bucket,{userId:'foreign'},png,'image/png'),code('forbidden'));
  const huge=new Uint8Array(MAX_IMAGE_BYTES+1);huge.set(png);
  await assert.rejects(uploadImage(deps,bucket,{userId:'owner'},huge,'image/png'),code('invalid'));
  assert.equal((await readImage(bucket,'../private')).status,404);
 }finally{await mf.dispose();}
});
