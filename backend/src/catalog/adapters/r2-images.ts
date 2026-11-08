import type { R2Bucket } from "@cloudflare/workers-types";
import { BusinessError, requireActor, requireStoreWrite, type Actor } from "../../identity/domain/access.ts";
import type { StoreDependencies } from "../../stores/application/stores.ts";

export const MAX_IMAGE_BYTES=5*1024*1024;
const bytesMatch=(bytes:Uint8Array,expected:number[],offset=0)=>expected.every((x,i)=>bytes[offset+i]===x);
function imageType(bytes:Uint8Array): {type:string;extension:string}|null {
  if(bytes.length<12)return null;
  if(bytesMatch(bytes,[0xff,0xd8,0xff]))return {type:'image/jpeg',extension:'jpg'};
  if(bytesMatch(bytes,[137,80,78,71,13,10,26,10]))return {type:'image/png',extension:'png'};
  if(bytesMatch(bytes,[82,73,70,70])&&bytesMatch(bytes,[87,69,66,80],8))return {type:'image/webp',extension:'webp'};
  return null;
}
export async function uploadImage(deps:StoreDependencies,bucket:R2Bucket,actor:Actor|null,bytes:Uint8Array,contentType:string):Promise<string> {
  const owner=requireActor(actor);
  const store=await deps.stores.findOwned(owner.userId);
  if(!store)throw new BusinessError('forbidden');
  requireStoreWrite(owner,owner.userId,store.isDemo,deps.environment);
  const detected=imageType(bytes);
  if(bytes.byteLength>MAX_IMAGE_BYTES||!detected||detected.type!==contentType||!/^[a-zA-Z0-9-]{1,100}$/.test(store.id))throw new BusinessError('invalid');
  const key=`${store.id}/${deps.newId()}.${detected.extension}`;
  await bucket.put(key,bytes,{httpMetadata:{contentType:detected.type,cacheControl:'public, max-age=31536000, immutable'}});
  return `/images/${key}`;
}
export async function readImage(bucket:R2Bucket,key:string):Promise<Response> {
  if(!/^[a-zA-Z0-9-]{1,100}\/[a-zA-Z0-9-]{1,100}\.(jpg|png|webp)$/.test(key))return new Response(null,{status:404});
  const object=await bucket.get(key);
  if(!object)return new Response(null,{status:404});
  const headers=new Headers({'Content-Type':object.httpMetadata?.contentType??'application/octet-stream','Cache-Control':'public, max-age=31536000, immutable','ETag':object.httpEtag,'X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; sandbox"});
  return new Response(object.body as unknown as ReadableStream,{headers});
}
