import { Field } from "@/components/ui";
import type { Compra } from "../../hooks/use-compra";
import { formatoCelular } from "../../lib/reglas";

/** Yape con código de aprobación (Figma, Yape y K4). El celular viene de "Tus datos". */
export function FormYape({ c }: { c: Compra }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-body-sm text-fg-secondary">Abre Yape › &quot;Código de aprobación&quot; y escribe aquí los 6 dígitos.</p>
      <Field label="Celular con Yape" type="tel" inputMode="numeric" autoComplete="tel-national" value={formatoCelular(c.yape.celular)} onChange={(e) => c.setYape({ ...c.yape, celular: e.target.value })} error={c.errorYape.celular} />
      <Field
        label="Código de aprobación"
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder="000 000"
        value={c.yape.codigo.replace(/\D/g, "").slice(0, 6).replace(/(\d{3})(?=\d)/, "$1 ")}
        onChange={(e) => c.setYape({ ...c.yape, codigo: e.target.value.replace(/\D/g, "").slice(0, 6) })}
        hint="Cambia cada pocos minutos."
        error={c.errorYape.codigo}
      />
    </div>
  );
}
