import { Card } from "@/components/ui";
export function Seccion({ titulo, descripcion, children }: { titulo: string; descripcion?: string; children: React.ReactNode }) {
  return <Card as="section" className="flex flex-col gap-4 p-5 lg:p-6">
    <div><h2 className="font-display-title text-h3 text-fg">{titulo}</h2>
      {descripcion && <p className="mt-1 text-body-sm text-fg-secondary">{descripcion}</p>}</div>
    {children}
  </Card>;
}
