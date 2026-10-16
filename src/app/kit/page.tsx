import { Inbox } from "lucide-react";
import { Badge, Button, Card, EmptyState, Skeleton } from "@/components/ui";
import { ChipsDemo } from "./chips-demo";

/** UI Kit en vivo: verifica que cada componente consuma solo tokens. */
export default function Kit() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="font-display-hero text-display">UI Kit</h1>
        <p className="text-body text-fg-secondary">Todo lo que ves sale de design/tokens.json.</p>
      </header>

      <Card className="flex flex-wrap gap-3">
        <Button>Guardar cambios</Button>
        <Button variant="secondary">Cancelar</Button>
        <Button variant="ghost">Ver detalle</Button>
        <Button variant="danger">Eliminar</Button>
        <Button loading>Guardando</Button>
        <Button disabled>No disponible</Button>
      </Card>

      <Card className="flex flex-col gap-4">
        <ChipsDemo />
        <div className="flex flex-wrap gap-2">
          <Badge>Borrador</Badge>
          <Badge tone="selected">Nuevo</Badge>
          <Badge tone="success">Pagado</Badge>
          <Badge tone="warning">Pago pendiente</Badge>
          <Badge tone="error">Cancelado</Badge>
          <Badge tone="info">En camino</Badge>
        </div>
      </Card>

      <Card className="flex flex-col gap-3">
        <Skeleton shape="circle" />
        <Skeleton className="w-2/3" />
        <Skeleton className="w-1/2" />
      </Card>

      <Card>
        <EmptyState
          icon={Inbox}
          title="Todavía no tienes pedidos"
          description="Cuando un cliente compre, su pedido va a aparecer aquí."
          action={<Button variant="secondary">Compartir mi tienda</Button>}
        />
      </Card>
    </main>
  );
}
