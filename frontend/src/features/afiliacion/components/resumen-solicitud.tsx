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
  return <div className="flex min-w-0 flex-col gap-10 lg:gap-12">
    {secciones.map(s => <section key={s.paso} className="flex min-w-0 flex-col gap-3">
      <div className="flex items-center justify-between gap-3"><h3 className="font-titulo-seccion text-h3 text-fg">{s.titulo}</h3>{editar && <Button type="button" variant="quiet" size="sm" onClick={() => editar(s.paso)} aria-label={`Editar ${s.titulo.toLowerCase()}`}>Editar</Button>}</div>
      <div className="min-w-0 divide-y divide-line-subtle rounded-card bg-surface px-5 shadow-contenedor"><p className="break-words py-4 text-body font-medium text-fg">{s.principal}</p>
      {s.valores.map((v, i) => <p key={i} className="break-words py-4 text-body-sm text-fg-secondary">{v}</p>)}</div>
    </section>)}
  </div>;
}
