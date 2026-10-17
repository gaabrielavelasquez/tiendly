import Link from "next/link";
import { CreditCard } from "lucide-react";
import { PanelMain } from "@/components/panel";
import { buttonVariants, Card } from "@/components/ui";

/** Punto de entrada del módulo 4 en main, que todavía no incluye el módulo 2 (#7). */
export default function ConfiguracionPage() {
  return <PanelMain>
    <header><h1 className="font-display-title text-h1">Configuración</h1><p className="mt-2 text-body text-fg-secondary">Configura los cobros de tu tienda.</p></header>
    <Card className="flex max-w-2xl flex-col items-start gap-4"><CreditCard aria-hidden className="size-6 text-icon" /><h2 className="font-display-title text-h2">Cobros automáticos</h2><p className="text-body text-fg-secondary">Solicita pagos con tarjeta y Yape o retoma tu solicitud. Mientras tanto, puedes seguir recibiendo Pedidos por WhatsApp.</p><Link href="/panel/configuracion/afiliacion" className={buttonVariants({ variant: "primary" })}>Ver solicitud de afiliación</Link></Card>
  </PanelMain>;
}
