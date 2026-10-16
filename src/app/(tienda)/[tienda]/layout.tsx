type Tema = "neutral" | "editorial" | "suave" | "custom";

/** Vitrina: cada tienda aplica su tema con data-theme (colección Brand). */
export default async function TiendaLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tienda: string }>;
}) {
  const { tienda } = await params;
  const tema: Tema = tienda === "demo" ? "editorial" : "neutral"; // TODO: leer el tema de la tienda.
  return (
    <div data-theme={tema} className="min-h-dvh bg-page">
      {children}
    </div>
  );
}
