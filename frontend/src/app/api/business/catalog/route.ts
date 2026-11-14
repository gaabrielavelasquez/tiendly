import { usingApi, proxyApi } from '@/lib/api-client';
import { businessRuntime } from '@/lib/business-runtime';
import { catalogHandler } from '@tiendly/backend/server';
async function handler(request:Request) {
  if (usingApi()) return proxyApi(request);
  try { return await catalogHandler(request,(await businessRuntime()).runtime); }
  catch { return Response.json({error:'unavailable'},{status:503,headers:{'Cache-Control':'private, no-store'}}); }
}
export { handler as GET, handler as POST, handler as PUT };
