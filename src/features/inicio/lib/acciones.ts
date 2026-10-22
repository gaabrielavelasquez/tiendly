"use server";

import { marcarHecho } from "@/lib/sesion";

/** Paso "Comparte el link de tu tienda" (tienda nueva): se marca al compartirlo o copiarlo. */
export async function marcarCompartido() {
  await marcarHecho("compartir");
}
