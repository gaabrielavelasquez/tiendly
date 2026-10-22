import type { Metadata } from "next";
import { MotionProvider } from "@/components/motion/motion-provider";
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
