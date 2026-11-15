import { usingApi, proxyApi } from '@/lib/api-client';
async function handler(request: Request) {
  if (!usingApi()) return Response.json({ error: 'unavailable' }, { status: 503 });
  return proxyApi(request);
}
export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };
