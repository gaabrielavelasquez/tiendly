import { useId } from "react";
import { CheckCircle } from "lucide-react";
import { Field } from "@/components/ui";
import { BANCOS, detectarBanco } from "../lib/reglas";
import type { Banco } from "../types";
import type { ModeloAfiliacion } from "../hooks/use-afiliacion";
export function PasoCuenta({ m }: { m: ModeloAfiliacion }) {
  const id = useId();
  const banco = m.datos.cci.length === 20 ? detectarBanco(m.datos.cci) : null;
  const valida = banco?.id === m.datos.banco;
  return <div className="flex flex-col gap-5">
    <div><h2 className="font-display-title text-h2">Cuenta bancaria</h2><p className="mt-2 text-body-sm text-fg-secondary">Aquí recibirás los depósitos de tus ventas.</p></div>
    <div className="flex flex-col gap-2"><label htmlFor={id} className="text-body-sm font-semibold">Banco</label>
      <select id={id} value={m.datos.banco} aria-invalid={!!m.errores.banco} aria-describedby={m.errores.banco ? `${id}-error` : undefined}
        className="h-10 w-full rounded-button border border-line-strong bg-surface px-3 text-body text-fg" onChange={e => m.cambiar("banco", e.target.value as Banco | "")}>
        <option value="">Elige tu banco</option>{BANCOS.map(b => <option key={b.id} value={b.id}>{b.nombre}</option>)}
      </select>{m.errores.banco && <p id={`${id}-error`} className="text-caption text-error">{m.errores.banco}</p>}
    </div>
    <Field label="CCI" inputMode="numeric" autoComplete="off" value={m.datos.cci} maxLength={20} error={m.errores.cci} hint="Tiene 20 dígitos. No es el número de tu tarjeta." onChange={e => m.cambiar("cci", e.target.value.replace(/\D/g, ""))} />
    {banco && <p role="status" className={valida ? "flex items-center gap-2 text-body-sm text-success" : "text-body-sm text-warning"}>{valida && <CheckCircle aria-hidden className="size-5" />}{valida ? `CCI validado en la demo. Banco detectado: ${banco.nombre}.` : `Banco detectado: ${banco.nombre}. No coincide con el elegido.`}</p>}
    <p className="rounded-card border border-line-subtle bg-sunken p-4 text-body-sm text-fg-secondary">La cuenta debe estar a nombre de <strong className="font-semibold text-fg">{m.negocio?.razonSocial}</strong>. Revisaremos que el titular coincida.</p>
  </div>;
}
