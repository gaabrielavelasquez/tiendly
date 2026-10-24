"use server";

import { cookies } from "next/headers";
import { COOKIE_TIENDA } from "@/lib/sesion";

/** Olvida la tienda de este navegador; sus productos, pedidos y configuración permanecen guardados. */
export async function cerrarSesion() {
  (await cookies()).set(COOKIE_TIENDA, "", {
    path: "/", httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 0,
  });
}
