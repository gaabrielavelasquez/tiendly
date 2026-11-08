import { businessRuntime } from "@/lib/business-runtime";
import { storesHandler } from "@tiendly/backend/server";

async function handler(request: Request) {
  try {
    return await storesHandler(request, (await businessRuntime()).runtime);
  } catch {
    return Response.json({ error: "unavailable" }, { status: 503, headers: { "Cache-Control": "private, no-store" } });
  }
}
export { handler as GET, handler as POST, handler as PATCH };
