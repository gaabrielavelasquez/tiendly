/** Panel de la tienda: usa el tema Tiendly (valores de :root). */
export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-page">{children}</div>;
}
