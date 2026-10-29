"use client";

import { CircleAlert, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PanelHeader, Seccion, Volver, useOcultarBarraInferior } from "@/components/panel";
import { Button, Card, Switch } from "@/components/ui";
import { formatoSoles } from "@/lib/formato";
import type { Cupon, EstadoCupon } from "../types";
import { eliminarCupon, guardarCupon } from "../lib/acciones";
import { aForm, descuentoDe, validarCupon, type ErroresCupon, type FormCupon } from "../lib/reglas";
import { HojaModal } from "@/features/afiliacion/components/hoja-modal";
import { useSesionCupones } from "./sesion-cupones";
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
  const sesion = useSesionCupones();
  useOcultarBarraInferior(true);
  const [eliminando, setEliminando] = useState(false);
  const [f, setF] = useState<FormCupon>(() => aForm(cupon));
  const [intento, setIntento] = useState(false);
  const [error, setError] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [confirmar, setConfirmar] = useState(false);
  const e: ErroresCupon = intento ? validarCupon(f, otros) : {};
  const claves = Object.keys(e) as (keyof ErroresCupon)[];
  const set = <K extends keyof FormCupon>(k: K, v: FormCupon[K]) => setF((x) => ({ ...x, [k]: v }));
  const codigo = f.codigo || "TUCODIGO";
  const ahorro = f.tipo === "envio" ? "Tu envío es gratis." : `Ahorras ${formatoSoles(descuentoDe({ tipo: f.tipo, valor: Number(f.valor.replace(",", ".")) || 0 }, EJEMPLO))}${f.tipo === "porcentaje" ? ` (${f.valor || 0}%)` : ""}`;

  async function guardar() {
    setIntento(true);
    setError("");
    if (Object.keys(validarCupon(f, otros)).length) return window.scrollTo({ top: 0, behavior: "smooth" });
    setGuardando(true);
    try {
      const r = await guardarCupon(f, cupon?.id);
      if ("cupon" in r) { sesion.recordar(r.cupon); router.push(`/panel/cupones?guardado=${encodeURIComponent(r.cupon.codigo)}`); return; }
      setError(r.error);
    } catch { setError("No pudimos guardar el cupón. Revisa tu conexión e inténtalo de nuevo."); }
    finally { setGuardando(false); }
  }
  async function eliminar() {
    if (!cupon || eliminando) return;
    setEliminando(true); setError("");
    try { await eliminarCupon(cupon.id); sesion.quitar(cupon.id); setConfirmar(false); router.push("/panel/cupones"); router.refresh(); }
    catch { setError("No pudimos eliminar el cupón. Revisa tu conexión e inténtalo de nuevo."); }
    finally { setEliminando(false); }
  }

  const boton = (clase: string) => <Button onClick={guardar} disabled={guardando} aria-busy={guardando || undefined} className={clase}>{guardando ? "Guardando…" : cupon ? "Guardar cambios" : "Guardar cupón"}</Button>;

  return (
    <div className="flex flex-col gap-10 pb-32 lg:gap-12 lg:pb-0 [&_h1]:font-display-light">
      <div className="flex flex-col gap-2">
        <Volver href="/panel/cupones">Cupones</Volver>
        <PanelHeader titulo={cupon ? "Editar cupón" : "Crear cupón"} subtitulo={cupon ? "Los cambios se aplican apenas guardas." : "Tus clientes escriben el código en el carrito para recibir el descuento."} accion={boton("")} />
      </div>
      {!confirmar && (claves.length > 0 || error) && (
        <div role="alert" className="flex gap-3 rounded-card border border-error-border bg-error-surface p-4">
          <CircleAlert aria-hidden strokeWidth={1.8} className="mt-0.5 size-5 shrink-0 text-error" />
          <p className="flex flex-col gap-0.5 text-body-sm">
            <span className="font-semibold text-fg">{claves.length ? `Revisa ${claves.length} ${claves.length === 1 ? "campo" : "campos"} antes de guardar` : "No se pudo guardar"}</span>
            <span className="text-fg-secondary">{claves.length ? `${claves.map((k) => RESUMEN[k](e[k]!)).join(" y ").replace(/^./, (l) => l.toUpperCase())}.` : error}</span>
          </p>
        </div>
      )}
      <div className="grid min-w-0 items-start gap-10 lg:grid-cols-3 lg:gap-12">
        <fieldset disabled={guardando || eliminando} className="flex min-w-0 flex-col gap-10 lg:col-span-2 lg:gap-12">
          <CamposDescuento f={f} e={e} set={set} />
          <CamposCondiciones f={f} e={e} set={set} />
        </fieldset>
        <aside className="flex min-w-0 flex-col gap-10 lg:gap-12">
          <Seccion id="estado-cupon" titulo="Estado">
            <Switch checked={f.activo} onChange={(v) => set("activo", v)} aria-describedby="cupon-activo">Cupón activo</Switch>
            <p id="cupon-activo" className="text-caption text-fg-secondary">{estado === "vencido" ? "Este cupón ya venció. Cambia las fechas para volver a usarlo." : "Si lo pausas, nadie puede usarlo hasta que lo actives otra vez."}</p>
          </Seccion>
          <Seccion id="preview-cupon" titulo="Así lo verá tu cliente">
            <p className="flex min-w-0 items-start gap-3 text-body-sm">
              <Check aria-hidden strokeWidth={1.5} className="mt-0.5 size-5 shrink-0 text-icon" />
              <span className="flex min-w-0 flex-col break-words"><span className="font-semibold text-fg">{codigo} aplicado</span><span className="text-fg-secondary">{ahorro}</span></span>
            </p>
          </Seccion>
          {cupon && <Button variant="ghost" onClick={() => { setError(""); setConfirmar(true); }} className="text-error">Eliminar cupón</Button>}

        </aside>
      </div>
      <HojaModal titulo={`¿Eliminar el cupón ${cupon?.codigo ?? ""}?`} abierto={confirmar} ocupado={eliminando} cerrar={() => !eliminando && setConfirmar(false)}>
        <p className="mb-5 text-body-sm text-fg-secondary">Tus clientes ya no podrán usarlo. Los pedidos donde se usó no cambian. Esta acción no se puede deshacer.</p>
        {error && <p role="alert" className="mb-3 text-body-sm text-error">{error}</p>}
        <div className="flex flex-col gap-3 sm:flex-row"><Button data-foco-inicial variant="secondary" disabled={eliminando} onClick={() => setConfirmar(false)}>Conservar cupón</Button><Button variant="danger" loading={eliminando} onClick={eliminar}>Eliminar cupón</Button></div>
      </HojaModal>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line-subtle bg-surface px-4 pt-3 pb-[max(env(safe-area-inset-bottom),--spacing(3))] lg:hidden">{boton("w-full h-12")}</div>
    </div>
  );
}
