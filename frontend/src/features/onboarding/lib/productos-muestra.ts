import { TIENDAS_EJEMPLO, type ProductoEjemplo } from "@/lib/datos/tiendas-ejemplo";
import type { RubroId } from "./rubros";

const [moda, tecnologia, belleza] = TIENDAS_EJEMPLO.map((t) => t.productos);
const hogar: ProductoEjemplo[] = [
  { nombre: "Taza de cerámica", precio: 39, foto: "/onboarding/taza.webp", alt: "Taza blanca de cerámica sobre una mesa" },
  { nombre: "Florero de cerámica", precio: 79, foto: "/onboarding/florero.webp", alt: "Florero de cerámica sobre una mesa blanca" },
];
const comida: ProductoEjemplo[] = [
  { nombre: "Brownie de chocolate", precio: 12, foto: "/onboarding/brownie.webp", alt: "Brownie de chocolate con salsa" },
  { nombre: "Galletas de chocolate", precio: 18, foto: "/onboarding/galletas.webp", alt: "Galletas con trozos de chocolate en una bandeja" },
];
const POR_RUBRO: Record<RubroId, ProductoEjemplo[]> = {
  accesorios: [moda[1], moda[5], moda[6]], belleza, calzado: [moda[2], moda[7]],
  reposteria: comida, hogar, "hecho-a-mano": [hogar[1], hogar[0], belleza[3]],
  moda: [moda[0], moda[3], moda[4]], "segunda-mano": [moda[4], tecnologia[0], hogar[0]],
  tecnologia, otro: [hogar[0], tecnologia[0], belleza[3]],
};

/** Muestras solo visuales. Intercala rubros elegidos; sin selección muestra varias categorías. Nunca se guardan. */
export function productosMuestra(rubros: readonly RubroId[]): ProductoEjemplo[] {
  const grupos = (rubros.length ? rubros : ["hogar", "tecnologia", "belleza"] as const).map((r) => POR_RUBRO[r]);
  const candidatos = Array.from({ length: 4 }, (_, i) => grupos.flatMap((g) => g[i] ? [g[i]] : [])).flat();
  return candidatos.filter((p, i) => candidatos.findIndex((otro) => otro.foto === p.foto) === i).slice(0, 4);
}
