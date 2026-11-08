import { BusinessError } from '../identity/domain/access.ts';
import { ownedCatalog, saveProduct } from '../catalog/application/catalog.ts';
import type { ProductInput } from '../catalog/domain/product.ts';
import type { BusinessRuntime } from './business.ts';
import { readJsonBody } from './request-body.ts';
export async function catalogHandler(request:Request,runtime:BusinessRuntime):Promise<Response> {
  const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'private, no-store'}});
  try {
    if(!['GET','POST','PUT'].includes(request.method))return reply({error:'method_not_allowed'},405);
    const actor=await runtime.actor(request.headers);
    if(!actor)throw new BusinessError('unauthorized');
    if(request.method==='GET')return reply({products:await ownedCatalog(runtime.catalog,actor)});
    if(request.headers.get('origin')!==runtime.origin)throw new BusinessError('forbidden');
    const input=await readJsonBody(request, 256 * 1024);
    const id=request.method==='POST'?null:input.id;
    if(id!==null&&typeof id!=='string')throw new BusinessError('invalid');
    const product=await saveProduct(runtime.catalog,actor,id,request.method==='POST'?null:input.version as number,input.product as ProductInput);
    return reply({product},request.method==='POST'?201:200);
  }catch(error){return reply({error:error instanceof BusinessError?error.code:'unavailable'},error instanceof BusinessError?{unauthorized:401,forbidden:403,invalid:400,conflict:409,not_found:404}[error.code]:503);}
}
