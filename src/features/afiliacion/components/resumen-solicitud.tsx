import { Button } from "@/components/ui";
import { BANCOS } from "../lib/reglas";
import type { Datos, Negocio } from "../types";

export function ResumenSolicitud({ datos, negocio, editar }: { datos: Datos; negocio: Negocio; editar?: (paso: number) => void }) {
  const secciones = [
    { titulo: "Tu negocio", paso: 1, valores: [negocio.razonSocial, `RUC ${datos.ruc}`, negocio.direccion] },
    { titulo: "Representante legal", paso: 2, valores: [datos.nombre, `DNI ${datos.dni}`, `+51 ${datos.celular}`, datos.correo] },
    { titulo: "Cuenta bancaria", paso: 3, valores: [BANCOS.find(b => b.id === datos.banco)?.nombre || "Banco", `CCI ${datos.cci}`, `Titular: ${negocio.razonSocial}`] },
  ];
  return <div className="flex flex-col divide-y divide-line-subtle">
    {secciones.map(s => <section key={s.paso} className="py-4 first:pt-0">
      <div className="mb-2 flex items-center justify-between gap-3"><h3 className="font-semibold text-fg">{s.titulo}</h3>{editar && <Button type="button" variant="ghost" onClick={() => editar(s.paso)} aria-label={`Editar ${s.titulo.toLowerCase()}`}>Editar</Button>}</div>
      <div className="space-y-1 text-body-sm text-fg-secondary">{s.valores.map((v,i) => <p key={i} className="break-words">{v}</p>)}</div>
    </section>)}
  </div>;
}
