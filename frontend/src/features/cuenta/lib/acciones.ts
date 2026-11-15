"use server";

import { usingApi, apiResponse, ApiError } from '@/lib/api-client';
import { cookies, headers } from "next/headers";
import { testLoginAllowed } from "@tiendly/backend/rules";
import { COOKIE_TIENDA } from "@/lib/sesion";
import { businessRuntime } from "@/lib/business-runtime";

/** Revoca la sesión persistida; una cookie de slug nunca mantiene el acceso. */
export async function cerrarSesion() {
  const jar = await cookies();
  if (usingApi()) {
    const response = await apiResponse('/api/auth/sign-out', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' });
    if (!response.ok) throw new ApiError('unavailable', response.status);
    for (const cookie of response.headers.getSetCookie()) {
      const pair = cookie.split(';', 1)[0];
      const index = pair.indexOf('=');
      if (index < 1) continue;
      jar.set(pair.slice(0, index), '', { path: '/', httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 0 });
    }
    jar.delete(COOKIE_TIENDA);
    return;
  }
  if (!testLoginAllowed(process.env.TIENDLY_ENTORNO, process.env.TIENDLY_TEST_LOGIN)) {
    const { auth } = await businessRuntime();
    await auth.api.signOut({ headers: await headers() });
    const context = await auth.$context;
    for (const cookie of Object.values(context.authCookies)) {
      const sameSite = cookie.attributes.sameSite?.toLowerCase() as "strict" | "lax" | "none" | undefined;
      jar.set(cookie.name, "", { ...cookie.attributes, sameSite, maxAge: 0, expires: new Date(0) });
    }
  }
  jar.delete(COOKIE_TIENDA);
}
