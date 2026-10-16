import { PackageOpen } from "lucide-react";
import { Button, Card, EmptyState } from "@/components/ui";
import { Bienvenida } from "./bienvenida";

// Placeholder: Inicio (decisión 0012) se construye en feat/inicio.
export default function PanelInicio() {
  return (
    <main className="mx-auto flex max-w-xl flex-col gap-4 px-4 py-8">
      <Bienvenida />
      <Card>
        <EmptyState
          icon={PackageOpen}
          title="Tu tienda está lista para recibir productos"
          description="Inicio con tus pasos para arrancar llega en la próxima entrega."
          action={<Button>Agregar mi primer producto</Button>}
        />
      </Card>
    </main>
  );
}
