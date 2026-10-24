"use client";

import { CloudOff } from "lucide-react";
import { CONTENEDOR, PanelMain } from "@/components/panel";
import { Button } from "@/components/ui";
import { EstadoPedidos } from "@/features/pedidos/components/estado-pedidos";

export default function PedidoError({ retry }: { error: Error; retry: () => void }) {
  return (
    <PanelMain>
      <div className={CONTENEDOR}>
        <EstadoPedidos icon={CloudOff} title="No pudimos cargar este pedido" description="Revisa tu conexión e inténtalo de nuevo. Los datos del pedido están a salvo."
          action={<Button onClick={() => retry()}>Reintentar</Button>} />
      </div>
    </PanelMain>
  );
}
