import { imageStorage } from '@/lib/image-storage';
import { readImage } from '@tiendly/backend/server';
export async function GET(_request:Request,{params}:{params:Promise<{key:string[]}>}) {
  try { return await readImage(await imageStorage(),(await params).key.join('/')); }
  catch { return new Response(null,{status:503}); }
}
