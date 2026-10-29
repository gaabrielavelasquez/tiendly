// Links de tienda (decisión 0013). Que esté libre lo decide el servidor (linkLibre, en acciones).
// Además de los ocupados de ejemplo: la tienda de demo y las rutas de la app (un link /panel abriría el panel).
export const OCUPADOS = new Set(["tienda", "moda", "zapatos", "belleza", "tiendly", "admin", "heather", "demo", "panel", "registro", "kit", "muna", "keyhaus", "glow-labo", "aurora"]);

export function aSlug(nombre: string): string {
  return nombre
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 30);
}

export type ResultadoSlug = { slug: string; libre: boolean; sugerencia?: string };
