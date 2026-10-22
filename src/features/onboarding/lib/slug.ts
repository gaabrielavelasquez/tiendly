// Simulación local de links (decisión 0013). Se reemplaza por la API cuando exista el backend.
// Además de los ocupados de ejemplo: la tienda de demo y las rutas de la app (un link /panel abriría el panel).
const OCUPADOS = new Set(["tienda", "moda", "zapatos", "belleza", "tiendly", "admin", "heather", "demo", "panel", "registro", "kit"]);

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

export async function revisarSlug(slug: string): Promise<ResultadoSlug> {
  await new Promise((r) => setTimeout(r, 450));
  if (!OCUPADOS.has(slug)) return { slug, libre: true };
  let n = 2;
  let sugerencia = `${slug}-pe`;
  while (OCUPADOS.has(sugerencia)) sugerencia = `${slug}-${n++}`;
  return { slug, libre: false, sugerencia };
}
