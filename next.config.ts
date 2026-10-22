import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Las fotos de productos viajan con el guardado (achicadas a 1200 px) hasta tener un servicio de imágenes.
  experimental: { serverActions: { bodySizeLimit: "8mb" } },
  // Fotos de productos subidas desde el panel (Vercel Blob). Las de Heather son locales (public/heather).
  images: { remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }] },
};

export default nextConfig;
