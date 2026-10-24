import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Enlaces compartidos de la demo antes del cambio de nombres: conservan sus parámetros.
  async redirects() {
    const anteriores = {
      "cartera-wari": "cartera-cher",
      "bolso-puyu": "cartera-noche",
      "slingback-inti": "slingback-brillo",
      "botin-saya": "botin-otono",
      "chompa-qori": "chompa-bruma",
      "traje-arena": "conjunto-arena",
      "guantes-killa": "guantes-malbec",
    };
    return Object.entries(anteriores).map(([antes, ahora]) => ({
      source: `/muna/${antes}`, destination: `/muna/${ahora}`, permanent: true,
    }));
  },
  // AGENTS.md lo escribimos nosotros (reglas del repo): que `next dev` no le agregue su bloque.
  agentRules: false,
  // Las fotos de productos viajan con el guardado (achicadas a 1200 px) hasta tener un servicio de imágenes.
  experimental: { serverActions: { bodySizeLimit: "8mb" } },
  // Fotos de productos subidas desde el panel (Vercel Blob). Las de Heather son locales (public/heather).
  images: { remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }] },
};

export default nextConfig;
