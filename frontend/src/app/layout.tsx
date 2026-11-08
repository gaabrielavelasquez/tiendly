import type { Metadata } from "next";
import { MotionProvider } from "@/components/motion/motion-provider";
import "@fontsource-variable/inter";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import "@fontsource-variable/outfit";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/bricolage-grotesque/700.css";
import "@fontsource/bricolage-grotesque/800.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Tiendly",
  description: "Tu tienda online, lista para vender por WhatsApp.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-PE">
      <body className="min-h-dvh bg-page font-body text-body text-fg">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
