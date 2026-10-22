type Tema = "neutral" | "editorial" | "suave" | "custom";

/** Vitrina: cada tienda aplica su tema con data-theme (colección Brand). Neutral: decisión 0025. */
export default async function TiendaLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tienda: string }>;
}) {
  const { tienda } = await params;
  // TODO: leer el tema de la tienda. Heather (moda y calzado) usa Editorial, como en Figma; las demás, Neutral (0025).
  const tema: Tema = tienda === "heather" || tienda === "demo" ? "editorial" : "neutral";
  return (
    <div data-theme={tema} className="min-h-dvh bg-page">
      {children}
    </div>
  );
}
