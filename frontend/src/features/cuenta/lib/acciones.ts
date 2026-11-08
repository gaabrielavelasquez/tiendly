"use server";

import { cookies, headers } from "next/headers";
import { testLoginAllowed } from "@tiendly/backend/rules";
import { COOKIE_TIENDA } from "@/lib/sesion";
import { businessRuntime } from "@/lib/business-runtime";

/** Revoca la sesión persistida; una cookie de slug nunca mantiene el acceso. */
export async function cerrarSesion() {
  const jar = await cookies();
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
