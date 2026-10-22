import { CheckCircle, UserRound } from "lucide-react";
import { Field } from "@/components/ui";
import { BANCOS, detectarBanco, TIPOS_CUENTA } from "../lib/reglas";
import type { Banco, Datos } from "../types";
import type { ModeloAfiliacion } from "../hooks/use-afiliacion";
import { CampoSelect } from "./campo-select";

/** A4 · ¿Dónde recibes el dinero? (Figma 106:160): titular arriba; CCI, banco (detectado con el CCI) y tipo de cuenta. */
export function PasoCuenta({ m }: { m: ModeloAfiliacion }) {
  const banco = m.datos.cci.length === 20 ? detectarBanco(m.datos.cci) : null;
  const valida = banco?.id === m.datos.banco;
  function cambiarCci(v: string) {
    m.cambiar("cci", v);
    const detectado = v.length === 20 ? detectarBanco(v) : null;
    if (detectado && !m.datos.banco) m.cambiar("banco", detectado.id); // se completa solo; se puede cambiar
  }
  return <div className="flex flex-col gap-5">
    <div><h2 className="font-display-title text-h2">¿Dónde recibes el dinero?</h2><p className="mt-2 text-body-sm text-fg-secondary">Aquí te depositamos lo que vendas con tarjeta o Yape.</p></div>
    <section className="flex gap-3 rounded-card bg-sunken p-4">
      <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface text-icon"><UserRound className="size-5" /></span>
      <p className="flex flex-col gap-1 text-body-sm"><span className="text-fg-secondary">La cuenta debe estar a nombre de</span><strong className="font-semibold text-fg">{m.negocio?.razonSocial}</strong><span className="text-fg-secondary">Así el proveedor de pagos puede depositarte tus ventas sin problemas.</span></p>
    </section>
    <Field label="CCI (código de cuenta interbancario)" inputMode="numeric" autoComplete="off" value={m.datos.cci} maxLength={20} error={m.errores.cci} hint="Son 20 dígitos. Lo encuentras en tu estado de cuenta o en la app de tu banco. No es el número de tu tarjeta." onChange={e => cambiarCci(e.target.value.replace(/\D/g, ""))} />
    <CampoSelect label="Banco" value={m.datos.banco} placeholder="Elige tu banco" opciones={BANCOS.map(b => ({ valor: b.id, texto: b.nombre }))} error={m.errores.banco} hint={valida ? "Lo detectamos con tu CCI." : undefined} onChange={v => m.cambiar("banco", v as Banco | "")} />
    {banco && !valida && m.datos.banco && <p role="status" className="text-body-sm text-warning">Banco detectado con tu CCI: {banco.nombre}. No coincide con el elegido.</p>}
    {valida && <p role="status" className="flex items-center gap-2 text-caption text-success"><CheckCircle aria-hidden className="size-4" />CCI validado en la demo.</p>}
    <CampoSelect label="Tipo de cuenta" value={m.datos.tipoCuenta} placeholder="Elige el tipo de cuenta" opciones={TIPOS_CUENTA.map(t => ({ valor: t.id, texto: t.nombre }))} error={m.errores.tipoCuenta} onChange={v => m.cambiar("tipoCuenta", v as Datos["tipoCuenta"])} />
  </div>;
}
