import { usingApi, proxyApi } from '@/lib/api-client';
import { imageStorage } from '@/lib/image-storage';
import { readImage } from '@tiendly/backend/server';
export async function GET(request:Request,{params}:{params:Promise<{key:string[]}>}) {
  if (usingApi()) return proxyApi(request);
  try { return await readImage(await imageStorage(),(await params).key.join('/')); }
  catch { return new Response(null,{status:503}); }
}
