import { Lock } from "lucide-react";
import { Field } from "@/components/ui";
import type { Compra } from "../../hooks/use-compra";
import { formatoTarjeta, formatoVencimiento, marcaTarjeta } from "../../lib/pago";

/** Datos de la tarjeta dentro de la opción (Figma, tarjeta y K3a–K3c). La marca se detecta al escribir. */
export function FormTarjeta({ c }: { c: Compra }) {
  const marca = marcaTarjeta(c.tarjeta.numero);
  const set = (campo: keyof Compra["tarjeta"], v: string) => c.setTarjeta({ ...c.tarjeta, [campo]: v });
  return (
    <div className="flex flex-col gap-4">
      <Field
        label="Número de tarjeta"
        inputMode="numeric"
        autoComplete="cc-number"
        placeholder="0000 0000 0000 0000"
        value={formatoTarjeta(c.tarjeta.numero)}
        onChange={(e) => set("numero", e.target.value)}
        error={c.erroresTarjeta.numero}
      />
      {marca && (
        <p className="-mt-2 flex items-center gap-2 text-caption text-fg-secondary">
          Tarjeta detectada: <span className="border border-line-strong px-2 py-0.5 font-semibold text-fg">{marca}</span>
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Vencimiento" inputMode="numeric" autoComplete="cc-exp" placeholder="MM/AA" value={c.tarjeta.vencimiento} onChange={(e) => set("vencimiento", formatoVencimiento(e.target.value))} error={c.erroresTarjeta.vencimiento} />
        <Field label="CVV" type="password" inputMode="numeric" autoComplete="cc-csc" placeholder="•••" maxLength={4} value={c.tarjeta.cvv} onChange={(e) => set("cvv", e.target.value.replace(/\D/g, ""))} error={c.erroresTarjeta.cvv} />
      </div>
      <p className="flex items-start gap-2 text-caption text-fg-secondary">
        <Lock aria-hidden strokeWidth={1.6} className="mt-px size-4 shrink-0" />
        Tus datos van protegidos directo al proveedor de pagos. La tienda no los ve.
      </p>
    </div>
  );
}
