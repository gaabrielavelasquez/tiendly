// Placeholder: Home de la vitrina (decisiones 0002 y 0006).
export default async function TiendaHome({ params }: { params: Promise<{ tienda: string }> }) {
  const { tienda } = await params;
  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <h1 className="font-display-hero text-display">{tienda}</h1>
      <p className="text-body text-fg-secondary">El catálogo de la tienda va aquí.</p>
    </main>
  );
}
