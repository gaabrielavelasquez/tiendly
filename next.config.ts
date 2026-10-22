import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Las fotos de productos viajan con el guardado (achicadas a 1200 px) hasta tener un servicio de imágenes.
  experimental: { serverActions: { bodySizeLimit: "8mb" } },
  // Las fotos de Heather son locales (public/heather). Con backend, agregar aquí el dominio del CDN de imágenes.
};

export default nextConfig;
