import Link from "next/link";
import { Inbox } from "lucide-react";
import { CONTENEDOR, PanelMain } from "@/components/panel";
import { buttonVariants } from "@/components/ui";
import { EstadoPedidos } from "@/features/pedidos/components/estado-pedidos";

/** El estado sin pedido conserva la salida a la lista, dentro del panel. */
export default function PedidoNoEncontrado() {
  return (
    <PanelMain>
      <div className={CONTENEDOR}>
        <EstadoPedidos icon={Inbox} title="No encontramos este pedido" description="Vuelve a la lista para elegir otro pedido."
          action={<Link href="/panel/pedidos" className={buttonVariants({ variant: "secondary" })}>Volver a Pedidos</Link>} />
      </div>
    </PanelMain>
  );
}
