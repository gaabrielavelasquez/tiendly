import { Truck } from "lucide-react";
import { formatoSoles } from "@/lib/formato";
import { CONFIG_COMPRA } from "../../lib/config";
import { faltaEnvioGratis } from "../../lib/reglas";

/** Avance hacia el envío gratis (Figma C0 y C4). La barra va en indicator/* (carbón). */
export function EnvioGratis({ base }: { base: number }) {
  const falta = faltaEnvioGratis(base);
  const desde = CONFIG_COMPRA.envioGratisDesde;
  return (
    <div className="flex flex-col gap-2 border border-line-subtle bg-surface p-4">
      <p className="flex items-center gap-2 text-body-sm font-semibold text-fg">
        <Truck aria-hidden strokeWidth={1.6} className="size-5 shrink-0 text-icon" />
        {falta ? `Te faltan ${formatoSoles(falta)} para el envío gratis` : "¡Tu pedido tiene envío gratis!"}
      </p>
      <div role="progressbar" aria-label="Avance hacia el envío gratis" aria-valuemin={0} aria-valuemax={desde} aria-valuenow={Math.min(base, desde)} className="h-1.5 overflow-hidden rounded-full bg-sunken">
        <div className="h-full rounded-full bg-indicator transition-[width] duration-300" style={{ width: `${Math.min(100, (base / desde) * 100)}%` }} />
      </div>
      <p className="text-caption text-fg-secondary">Envío gratis en compras desde {formatoSoles(desde)}.</p>
    </div>
  );
}
