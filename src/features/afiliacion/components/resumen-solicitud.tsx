import { Button } from "@/components/ui";
import { nombresRubros } from "@/features/onboarding/lib/rubros";
import { BANCOS, nombreTipoCuenta } from "../lib/reglas";
import type { Datos, Negocio } from "../types";

/** A5 · Resumen (Figma 106:203): negocio, representante y cuenta de depósito, cada uno con «Editar». */
export function ResumenSolicitud({ datos, negocio, editar }: { datos: Datos; negocio: Negocio; editar?: (paso: number) => void }) {
  const banco = BANCOS.find(b => b.id === datos.banco)?.nombre || "Banco";
  const secciones = [
    { titulo: "Tu negocio", paso: 1, principal: negocio.razonSocial, valores: [`RUC ${datos.ruc}`, `Tienda: ${datos.tienda} · ${nombresRubros(datos.rubros)}`, negocio.direccion] },
    { titulo: "Representante legal", paso: 2, principal: datos.nombre, valores: [`DNI ${datos.dni} · ${datos.cargo}`, `+51 ${datos.celular} · ${datos.correo}`] },
    { titulo: "Cuenta de depósito", paso: 3, principal: `${banco} ···· ${datos.cci.slice(-4)}`, valores: [nombreTipoCuenta(datos.tipoCuenta), `A nombre de ${negocio.razonSocial}`] },
  ];
  return <div className="flex flex-col divide-y divide-line-subtle rounded-card border border-line-subtle bg-surface px-4">
    {secciones.map(s => <section key={s.paso} className="flex flex-col gap-1 py-4">
      <div className="flex items-center justify-between gap-3"><h3 className="text-label font-semibold tracking-widest text-fg-secondary uppercase">{s.titulo}</h3>{editar && <Button type="button" variant="ghost" size="sm" onClick={() => editar(s.paso)} aria-label={`Editar ${s.titulo.toLowerCase()}`}>Editar</Button>}</div>
      <p className="text-body font-semibold break-words text-fg">{s.principal}</p>
      {s.valores.map((v, i) => <p key={i} className="text-body-sm break-words text-fg-secondary">{v}</p>)}
    </section>)}
  </div>;
}
