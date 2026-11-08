import type { D1Database } from "@cloudflare/workers-types";
import { BusinessError } from "../../identity/domain/access.ts";
import { variantKey, type Product, type Option } from "../domain/product.ts";
import type { CatalogRepository } from "../application/catalog.ts";

type ProductRow = { id:string;store_id:string;slug:string;name:string;description:string;sku:string;categories_json:string;status:Product["status"];price_cents:number;compare_at_cents:number|null;offer_from:string|null;offer_until:string|null;photo_option:number|null;primary_image:string|null;photo_groups_json:string;measurements_mode:"inherited"|"none"|"custom";measurements_json:string|null;version:number;created_at:string;updated_at:string };
type OptionRow = {product_id:string;name:string;kind:Option["kind"];values_json:string};
type VariantRow = {product_id:string;values_json:string;stock:number};
type PhotoRow = {product_id:string;photo_group:string;url:string};
const COLUMNS = ["slug","name","description","sku","categories_json","status","price_cents","compare_at_cents","offer_from","offer_until","photo_option","primary_image","photo_groups_json","measurements_mode","measurements_json","version","updated_at"];
export class D1Catalog implements CatalogRepository {
  private readonly db: D1Database;
  constructor(db: D1Database) { this.db=db; }
  async list(storeId: string): Promise<Product[]> {
    const result = await this.db.batch([
      this.db.prepare('SELECT * FROM products WHERE store_id=? ORDER BY created_at DESC,id').bind(storeId),
      this.db.prepare('SELECT * FROM product_options WHERE store_id=? ORDER BY position').bind(storeId),
      this.db.prepare('SELECT * FROM product_variants WHERE store_id=? AND active=1 ORDER BY variant_key').bind(storeId),
      this.db.prepare('SELECT * FROM product_photos WHERE store_id=? ORDER BY photo_group,position').bind(storeId),
    ]);
    return (result[0].results as ProductRow[]).map(row=>{
      const options=(result[1].results as OptionRow[]).filter(x=>x.product_id===row.id).map(x=>({name:x.name,kind:x.kind,values:JSON.parse(x.values_json)}));
      const photos: Record<string,string[]> = Object.create(null);
      for(const group of JSON.parse(row.photo_groups_json)) photos[group]=[];
      for(const photo of result[3].results as PhotoRow[]) if(photo.product_id===row.id) (photos[photo.photo_group]??=[]).push(photo.url);
      const variants=(result[2].results as VariantRow[]).filter(x=>x.product_id===row.id).map(x=>({values:JSON.parse(x.values_json),stock:x.stock}));
      // Preserve option/cart combination order rather than SQL collation order.
      const combinations=options.reduce<string[][]>((a,o)=>a.flatMap(c=>o.values.map((v:string)=>[...c,v])),[[]]);
      const rank=new Map(combinations.map((values,index)=>[variantKey(values),index]));
      variants.sort((a,b)=>(rank.get(variantKey(a.values))??0)-(rank.get(variantKey(b.values))??0));
      return { id:row.id,storeId:row.store_id,slug:row.slug,name:row.name,description:row.description,sku:row.sku,categories:JSON.parse(row.categories_json),status:row.status,priceCents:row.price_cents,compareAtCents:row.compare_at_cents,offer:row.offer_from||row.offer_until?{...(row.offer_from?{from:row.offer_from}:{}),...(row.offer_until?{until:row.offer_until}:{})}:null,options,variants,...(row.photo_option===null?{}:{photoOption:row.photo_option}),primaryImage:row.primary_image,photos:{...photos},...(row.measurements_mode==='inherited'?{}:{measurements:row.measurements_mode==='none'?null:JSON.parse(row.measurements_json!)}),version:row.version,createdAt:row.created_at,updatedAt:row.updated_at };
    });
  }
  async save(p: Product, ownerId: string, expectedVersion: number | null): Promise<Product> {
    return (await this.saveMany([{ product:p, expectedVersion }],ownerId))[0];
  }
  private statements(p: Product, ownerId: string, expectedVersion: number | null) {
    const values=[p.slug,p.name,p.description,p.sku,JSON.stringify(p.categories),p.status,p.priceCents,p.compareAtCents,p.offer?.from??null,p.offer?.until??null,p.photoOption??null,p.primaryImage,JSON.stringify(Object.keys(p.photos)),p.measurements===undefined?'inherited':p.measurements===null?'none':'custom',p.measurements==null?null:JSON.stringify(p.measurements),p.version,p.updatedAt];
    const scope=[p.storeId,p.id];
    const membership="EXISTS(SELECT 1 FROM memberships WHERE store_id=? AND user_id=? AND role='owner')";
    const write=expectedVersion===null
      ?this.db.prepare(`INSERT INTO products(store_id,id,created_at,${COLUMNS.join(',')}) SELECT ${Array(3+COLUMNS.length).fill('?').join(',')} WHERE ${membership} RETURNING created_at`).bind(p.storeId,p.id,p.createdAt,...values,p.storeId,ownerId)
      :this.db.prepare(`UPDATE products SET ${COLUMNS.map(c=>c+'=?').join(',')} WHERE store_id=? AND id=? AND version=? AND ${membership} RETURNING created_at`).bind(...values,...scope,expectedVersion,p.storeId,ownerId);
    return [
        write,
        this.db.prepare('INSERT INTO write_guards(ok) VALUES(changes())'),
        this.db.prepare('DELETE FROM write_guards'),
        this.db.prepare('DELETE FROM product_options WHERE store_id=? AND product_id=?').bind(...scope),
        this.db.prepare('DELETE FROM product_photos WHERE store_id=? AND product_id=?').bind(...scope),
        this.db.prepare('UPDATE product_variants SET active=0 WHERE store_id=? AND product_id=?').bind(...scope),
        ...p.options.map((o,position)=>this.db.prepare('INSERT INTO product_options(store_id,product_id,position,name,kind,values_json) VALUES(?,?,?,?,?,?)').bind(...scope,position,o.name,o.kind,JSON.stringify(o.values))),
        ...p.variants.map(v=>this.db.prepare('INSERT INTO product_variants(store_id,product_id,variant_key,values_json,stock,active) VALUES(?,?,?,?,?,1) ON CONFLICT(store_id,product_id,variant_key) DO UPDATE SET values_json=excluded.values_json,stock=excluded.stock,active=1').bind(...scope,variantKey(v.values),JSON.stringify(v.values),v.stock)),
        ...Object.entries(p.photos).flatMap(([group,urls])=>urls.map((url,position)=>this.db.prepare('INSERT INTO product_photos(store_id,product_id,photo_group,position,url) VALUES(?,?,?,?,?)').bind(...scope,group,position,url))),
    ];
  }
  async saveMany(changes:{product:Product;expectedVersion:number|null}[],ownerId:string):Promise<Product[]> {
    if (!changes.length) return [];
    const batches=changes.map(c=>this.statements(c.product,ownerId,c.expectedVersion));
    try {
      const result=await this.db.batch(batches.flat());
      let offset=0;
      return changes.map((change,index)=>{
        const row=result[offset].results[0] as {created_at:string};
        offset+=batches[index].length;
        return {...change.product,createdAt:row.created_at};
      });
    } catch(error) {
      if(/CHECK constraint failed|UNIQUE constraint failed/.test(String(error))) throw new BusinessError('conflict');
      throw error;
    }
  }
}
