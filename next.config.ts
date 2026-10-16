import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Fotos de ejemplo del catálogo simulado (Pexels, licencia libre). Con backend, el dominio del CDN propio.
    remotePatterns: [{ protocol: "https", hostname: "images.pexels.com", pathname: "/photos/**" }],
  },
};

export default nextConfig;
