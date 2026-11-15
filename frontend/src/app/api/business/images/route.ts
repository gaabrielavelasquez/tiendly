import { usingApi, proxyApi } from '@/lib/api-client';
import { businessRuntime } from '@/lib/business-runtime';
import { imagesHandler } from '@tiendly/backend/server';

export async function POST(request: Request) {
  if (usingApi()) return proxyApi(request);
  try {
    return await imagesHandler(request, await businessRuntime());
  } catch {
    return Response.json({ error: 'unavailable' }, { status: 503, headers: { 'Cache-Control': 'private, no-store' } });
  }
}
