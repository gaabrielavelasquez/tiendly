/** Un solo titular en dos tonos, igual que el registro aprobado en 0033. */
export function TituloAcceso({ titulo, contexto, children }: { titulo: string; contexto: string; children?: React.ReactNode }) {
  return <header className="flex flex-col gap-3 pt-2">
    <h1 className="font-display-light text-h1 tracking-tight text-balance"><span className="block text-fg">{titulo}</span><span className="block text-fg-secondary">{contexto}</span></h1>
    {children}
  </header>;
}
