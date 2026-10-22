"use client";

import { CircleAlert, CircleCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PanelHeader, Volver } from "@/components/panel";
import { Button, Card, Switch } from "@/components/ui";
import { formatoSoles } from "@/lib/formato";
import type { Cupon, EstadoCupon } from "../types";
import { eliminarCupon, guardarCupon } from "../lib/acciones";
import { aForm, descuentoDe, validarCupon, type ErroresCupon, type FormCupon } from "../lib/reglas";
import { CamposCondiciones, CamposDescuento } from "./campos-cupon";

const RESUMEN: Record<keyof ErroresCupon, (m: string) => string> = {
  codigo: (m) => (m.startsWith("Ya") ? "el código ya existe" : "el código no es válido"),
  valor: (m) => (m.includes("100") ? "el descuento es mayor a 100%" : "falta el descuento"),
  minimo: () => "falta el monto mínimo",
  hasta: () => "revisa las fechas",
  limite: () => "falta el límite de usos",
};
const EJEMPLO = 650; // subtotal de ejemplo para la vista previa (Figma: "Ahorras S/ 65 (10%)")

/** Crear o editar un cupón (Figma, módulo 3). Errores al guardar con resumen arriba; en edición, "Eliminar cupón". */
export function FormularioCupon({ cupon, estado, otros }: { cupon?: Cupon; estado?: EstadoCupon; otros: Cupon[] }) {
  const router = useRouter();
  const [f, setF] = useState<FormCupon>(() => aForm(cupon));
  const [intento, setIntento] = useState(false);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [confirmar, setConfirmar] = useState(false);
  const e: ErroresCupon = intento ? validarCupon(f, otros) : {};
  const claves = Object.keys(e) as (keyof ErroresCupon)[];
  const set = <K extends keyof FormCupon>(k: K, v: FormCupon[K]) => setF((x) => ({ ...x, [k]: v }));
  const codigo = f.codigo || "TUCODIGO";
  const ahorro = f.tipo === "envio" ? "Tu envío es gratis." : `Ahorras ${formatoSoles(descuentoDe({ tipo: f.tipo, valor: Number(f.valor) || 0 }, EJEMPLO))}${f.tipo === "porcentaje" ? ` (${f.valor || 0}%)` : ""}`;

  async function guardar() {
    setIntento(true);
    setError("");
    if (Object.keys(validarCupon(f, otros)).length) return window.scrollTo({ top: 0, behavior: "smooth" });
    setGuardando(true);
    const r = await guardarCupon(f, cupon?.id);
    setGuardando(false);
    if ("codigo" in r) return router.push(`/panel/cupones?guardado=${r.codigo}`);
    setError(r.error);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const boton = (clase: string) => <Button onClick={guardar} disabled={guardando} aria-busy={guardando || undefined} className={clase}>{guardando ? "Guardando…" : cupon ? "Guardar cambios" : "Guardar cupón"}</Button>;

  return (
    <div className="flex flex-col gap-6 pb-24 lg:pb-0">
      <div className="flex flex-col gap-2">
        <Volver href="/panel/cupones">Cupones</Volver>
        <PanelHeader titulo={cupon ? "Editar cupón" : "Crear cupón"} subtitulo={cupon ? "Los cambios se aplican apenas guardas." : "Tus clientes escriben el código en el carrito para recibir el descuento."} accion={boton("")} />
      </div>
      {(claves.length > 0 || error) && (
        <div role="alert" className="flex gap-3 rounded-card border border-error-border bg-error-surface p-4">
          <CircleAlert aria-hidden strokeWidth={1.8} className="mt-0.5 size-5 shrink-0 text-error" />
          <p className="flex flex-col gap-0.5 text-body-sm">
            <span className="font-semibold text-fg">{claves.length ? `Revisa ${claves.length} ${claves.length === 1 ? "campo" : "campos"} antes de guardar` : "No se pudo guardar"}</span>
            <span className="text-fg-secondary">{claves.length ? `${claves.map((k) => RESUMEN[k](e[k]!)).join(" y ").replace(/^./, (l) => l.toUpperCase())}.` : error}</span>
          </p>
        </div>
      )}
      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <CamposDescuento f={f} e={e} set={set} />
          <CamposCondiciones f={f} e={e} set={set} />
        </div>
        <aside className="flex flex-col gap-4">
          <Card className="flex flex-col gap-1 p-5 lg:p-6">
            <Switch checked={f.activo} onChange={(v) => set("activo", v)} aria-describedby="cupon-activo">Cupón activo</Switch>
            <p id="cupon-activo" className="text-caption text-fg-secondary">{estado === "vencido" ? "Este cupón ya venció. Cambia las fechas para volver a usarlo." : "Si lo pausas, nadie puede usarlo hasta que lo actives otra vez."}</p>
          </Card>
          <section aria-label="Vista previa en el carrito" className="flex flex-col gap-3 rounded-card bg-sunken p-4">
            <h2 className="text-body-sm font-semibold text-fg">Así lo verá tu cliente en el carrito</h2>
            <p className="flex items-start gap-3 rounded-theme border border-success-border bg-success-surface p-3 text-body-sm">
              <CircleCheck aria-hidden strokeWidth={1.8} className="mt-0.5 size-5 shrink-0 text-success" />
              <span className="flex flex-col"><span className="font-semibold text-fg">{codigo} aplicado</span><span className="text-fg-secondary">{ahorro}</span></span>
            </p>
          </section>
          {cupon && (confirmar ? (
            <div role="alertdialog" aria-labelledby="eliminar-titulo" className="flex flex-col gap-3 rounded-card border border-error-border bg-error-surface p-4">
              <p id="eliminar-titulo" className="text-body-sm font-semibold text-fg">¿Eliminar el cupón {cupon.codigo}?</p>
              <p className="text-caption text-fg-secondary">Tus clientes ya no podrán usarlo. Los pedidos donde se usó no cambian. Esta acción no se puede deshacer.</p>
              <div className="flex gap-2">
                <Button variant="danger" size="sm" onClick={async () => (await eliminarCupon(cupon.id), router.push("/panel/cupones"))}>Eliminar</Button>
                <Button variant="ghost" size="sm" onClick={() => setConfirmar(false)}>Cancelar</Button>
              </div>
            </div>
          ) : (
            <Button variant="ghost" onClick={() => setConfirmar(true)} className="text-error">Eliminar cupón</Button>
          ))}
        </aside>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line-subtle bg-surface px-4 pt-3 pb-[max(env(safe-area-inset-bottom),--spacing(3))] lg:hidden">{boton("w-full h-12")}</div>
    </div>
  );
}
