"use server";

import { configNueva } from "@/features/configuracion/lib/mock";
import { vaciarCupones } from "@/features/cupones/lib/mock";
import { reiniciarPedidos } from "@/features/pedidos/lib/almacen";
import { reiniciarInventario } from "@/features/productos/lib/inventario";
import { vaciarCatalogo } from "@/features/productos/lib/mock";
import { abrirTienda } from "@/lib/sesion";
import { fijarRubros } from "./perfil";
import { esRubro, type RubroId } from "./rubros";
import { errorCelular } from "./phone";
import { aSlug } from "./slug";

/** Guarda los rubros del negocio. Se vuelve a validar aquí: no se confía en el navegador. */
export async function guardarRubros(rubros: RubroId[]): Promise<{ ok: true } | { error: string }> {
  if (!Array.isArray(rubros) || !rubros.length || !rubros.every(esRubro)) return { error: "Elige al menos una opción." };
  fijarRubros(rubros);
  return { ok: true };
}

type NuevaTienda = { nombre: string; slug: string; celularVentas: string; rubros: RubroId[] };

/**
 * Crea la tienda (simulado, en la memoria del servidor): pasa a ser la de la sesión, con su link y su WhatsApp,
 * y arranca vacía (sin productos, pedidos ni cupones). Desde aquí el panel y la vitrina son los de esta tienda.
 */
export async function crearTienda(t: NuevaTienda): Promise<{ ok: true } | { error: string }> {
  const nombre = t.nombre.trim();
  const slug = aSlug(t.slug);
  if (nombre.length < 2 || !slug) return { error: "Escribe el nombre de tu negocio." };
  if (errorCelular(t.celularVentas)) return { error: "Revisa el WhatsApp de ventas." };
  const r = await guardarRubros(t.rubros);
  if ("error" in r) return r;
  abrirTienda({ nombre, slug, celularVentas: t.celularVentas });
  vaciarCatalogo();
  reiniciarPedidos();
  reiniciarInventario();
  vaciarCupones();
  configNueva(t.celularVentas);
  return { ok: true };
}
