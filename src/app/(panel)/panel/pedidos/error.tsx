"use client";

import { CloudOff } from "lucide-react";
import { PanelMain } from "@/components/panel";
import { Button, Card, EmptyState } from "@/components/ui";

/** Error de Pedidos (CLAUDE.md §5). `retry` vuelve a pedir los datos al servidor (Next 16). */
export default function PedidosError({ retry }: { error: Error; retry: () => void }) {
  return (
    <PanelMain>
      <Card>
        <EmptyState
          icon={CloudOff}
          title="No pudimos cargar tus pedidos"
          description="Revisa tu conexión e inténtalo de nuevo. Tus pedidos están a salvo."
          action={<Button onClick={() => retry()}>Reintentar</Button>}
        />
      </Card>
    </PanelMain>
  );
}
