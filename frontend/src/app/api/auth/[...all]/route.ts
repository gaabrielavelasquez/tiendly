import { usingApi, proxyApi } from '@/lib/api-client';
import { businessRuntime } from "@/lib/business-runtime";

async function handler(request: Request) {
  if (usingApi()) return proxyApi(request);
  try {
    return await (await businessRuntime()).auth.handler(request);
  } catch {
    return Response.json({ error: "El ingreso no está disponible. Intenta de nuevo." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
export { handler as GET, handler as POST };
