import { PackageOpen } from "lucide-react";
import { Button, EmptyState } from "@/components/ui";

// Placeholder: Inicio (decisión 0012) se construye en src/features/inicio.
export default function PanelInicio() {
  return (
    <main className="mx-auto max-w-xl px-4 py-8">
      <EmptyState
        icon={PackageOpen}
        title="Tu panel está en construcción"
        description="Acá vas a ver las ventas del día y lo que tienes que atender hoy."
        action={<Button>Agregar mi primer producto</Button>}
      />
    </main>
  );
}
