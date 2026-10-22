"use client";

import { CircleAlert } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { Aviso, PanelHeader, Volver, type TextoAviso } from "@/components/panel";
import { Button } from "@/components/ui";
import type { ConfigEntregas } from "../../types";
import { guardarEntregas } from "../../lib/acciones";
import { validarEntregas, vistaCliente } from "../../lib/reglas";
import { VistaCliente } from "../estado-metodo";
import { TarjetaDelivery } from "./tarjeta-delivery";
import { TarjetaRecojo } from "./tarjeta-recojo";

function Banner({ titulo, detalle, tono }: { titulo: string; detalle: string; tono: "error" | "warning" }) {
  const clase = tono === "error" ? "border-error-border bg-error-surface" : "border-warning-border bg-warning-surface";
  return (
    <div role={tono === "error" ? "alert" : undefined} className={`flex gap-3 rounded-card border p-4 ${clase}`}>
      <CircleAlert aria-hidden strokeWidth={1.8} className={`mt-0.5 size-5 shrink-0 ${tono === "error" ? "text-error" : "text-warning"}`} />
      <p className="flex flex-col gap-0.5 text-body-sm"><span className="font-semibold text-fg">{titulo}</span><span className="text-fg-secondary">{detalle}</span></p>
    </div>
  );
}

/**
 * Configuración → Entregas (Figma, módulo 2): delivery por zona con envío gratis y recojo en tienda.
 * Se valida al guardar (errores por campo y resumen arriba) y al menos un método tiene que quedar activo.
 */
export function VistaEntregas({ inicial }: { inicial: ConfigEntregas }) {
  const [entregas, setEntregas] = useState(inicial);
  const [intento, setIntento] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState<TextoAviso>(null);
  const timer = useRef<number | undefined>(undefined);
  const r = useMemo(() => validarEntregas(entregas), [entregas]);
  const errores = intento ? r.errores : {};
  const cantidad = Object.keys(errores).length;
  const ninguno = !entregas.delivery.activo && !entregas.recojo.activo;

  async function guardar() {
    setIntento(true);
    if (r.regla || r.resumen) return window.scrollTo({ top: 0, behavior: "smooth" });
    setGuardando(true);
    const res = await guardarEntregas(entregas);
    setGuardando(false);
    setIntento(false);
    setAviso("error" in res ? { texto: res.error, tono: "error" } : { texto: "Cambios guardados. Tu tienda ya muestra las nuevas tarifas.", tono: "ok" });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAviso(null), 4000);
  }

  const boton = (clase: string) => (
    <Button onClick={guardar} disabled={guardando} aria-busy={guardando || undefined} className={clase}>
      {guardando ? "Guardando…" : "Guardar cambios"}
    </Button>
  );

  return (
    <div className="flex flex-col gap-6 pb-24 lg:pb-0">
      <div className="flex flex-col gap-2">
        <Volver href="/panel/configuracion">Configuración</Volver>
        <PanelHeader titulo="Entregas" subtitulo="Elige cómo reciben sus pedidos tus clientes. En tu tienda solo se ve lo que actives." accion={boton("")} />
      </div>
      {intento && r.regla ? (
        <Banner tono="error" titulo="Debes mantener al menos un método de entrega activo" detalle="Activa Delivery o Recojo en tienda para poder guardar." />
      ) : ninguno ? (
        <Banner tono="warning" titulo="Activa al menos un método de entrega" detalle="Mientras tanto, tu tienda muestra tus productos, pero tus clientes no pueden finalizar la compra." />
      ) : null}
      {cantidad > 0 && r.resumen && <Banner tono="error" titulo={`Revisa ${cantidad} ${cantidad === 1 ? "campo" : "campos"} antes de guardar`} detalle={r.resumen} />}
      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <TarjetaDelivery delivery={entregas.delivery} errores={errores} onCambio={(d) => setEntregas({ ...entregas, delivery: d })} />
          <TarjetaRecojo recojo={entregas.recojo} errores={errores} onCambio={(rc) => setEntregas({ ...entregas, recojo: rc })} />
        </div>
        {!ninguno && (
          <VistaCliente titulo="Al comprar, tu cliente verá">
            <ul className="flex flex-col gap-1.5 text-body-sm text-fg-secondary">
              {vistaCliente(entregas).map((l) => <li key={l}>{l}</li>)}
            </ul>
          </VistaCliente>
        )}
      </div>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line-subtle bg-surface px-4 pt-3 pb-[max(env(safe-area-inset-bottom),--spacing(3))] lg:hidden">{boton("w-full h-12")}</div>
      <Aviso aviso={aviso} />
    </div>
  );
}
