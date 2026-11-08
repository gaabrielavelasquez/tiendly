import { businessRuntime } from '@/lib/business-runtime';
import { BusinessError } from '@tiendly/backend/rules';
import { MAX_IMAGE_BYTES, uploadImage } from '@tiendly/backend/server';
export async function POST(request:Request) {
  try {
    const { runtime, uploads }=await businessRuntime();
    const actor=await runtime.actor(request.headers);
    if(!actor)return Response.json({error:'unauthorized'},{status:401});
    if(request.headers.get('origin')!==runtime.origin)return Response.json({error:'forbidden'},{status:403});
    if(!uploads)throw new Error('R2 unavailable');
    const reader=request.body?.getReader();
    if(!reader)throw new BusinessError('invalid');
    const chunks:Uint8Array[]=[];let length=0;
    for(;;){const next=await reader.read();if(next.done)break;length+=next.value.byteLength;if(length>MAX_IMAGE_BYTES){await reader.cancel();return Response.json({error:'too_large'},{status:413});}chunks.push(next.value);}
    const bytes=new Uint8Array(length);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
    return Response.json({url:await uploadImage(runtime.stores,uploads,actor,bytes,request.headers.get('content-type')??'')},{status:201,headers:{'Cache-Control':'private, no-store'}});
  }catch(error){return Response.json({error:error instanceof BusinessError?error.code:'unavailable'},{status:error instanceof BusinessError?(error.code==='invalid'?400:403):503});}
}
