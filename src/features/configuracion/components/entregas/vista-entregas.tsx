"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Aviso, CONTENEDOR, EncabezadoSeccion, PanelHeader, useOcultarBarraInferior, Volver, type TextoAviso } from "@/components/panel";
import { Button } from "@/components/ui";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import type { ConfigEntregas } from "../../types";
import { guardarEntregas } from "../../lib/acciones";
import { validarEntregas, vistaCliente } from "../../lib/reglas";
import { VistaCliente } from "../estado-metodo";
import { TarjetaDelivery } from "./tarjeta-delivery";
import { TarjetaRecojo } from "./tarjeta-recojo";

/** Tarifas y recojo conservan 0009. Zonas obligatorias visibles antes de guardar y preview siempre informado. */
export function VistaEntregas({ inicial }: { inicial: ConfigEntregas }) {
  const [entregas, setEntregas] = useState(inicial);
  const [intento, setIntento] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState<TextoAviso>(null);
  const timer = useRef<number | undefined>(undefined);
  const reduce = useReducedMotion();
  useOcultarBarraInferior(true);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const r = useMemo(() => validarEntregas(entregas), [entregas]);
  const errores = { ...(intento ? r.errores : {}), ...(r.errores.zonas ? { zonas: r.errores.zonas } : {}) };
  const ninguno = !entregas.delivery.activo && !entregas.recojo.activo;
  const lineas = vistaCliente(entregas);

  async function guardar() {
    setIntento(true);
    if (r.regla || r.resumen) return window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    setGuardando(true);
    try {
      const res = await guardarEntregas(entregas);
      if ("error" in res) setAviso({ texto: res.error, tono: "error" });
      else { setIntento(false); setAviso({ texto: "Cambios guardados. Tu tienda ya muestra las nuevas tarifas.", tono: "ok" }); }
    } catch { setAviso({ texto: "No pudimos guardar las entregas. Revisa tu conexión e inténtalo de nuevo.", tono: "error" }); }
    finally { setGuardando(false); }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAviso(null), 4000);
  }

  const boton = (clase: string) => <Button onClick={guardar} loading={guardando} disabled={guardando || !!r.errores.zonas} aria-describedby={r.errores.zonas ? "error-zonas" : undefined} className={clase}>Guardar cambios</Button>;
  return <div className="flex min-w-0 flex-col gap-10 pb-24 lg:gap-12 lg:pb-0 [&_h1]:font-display-light">
    <div className="flex flex-col gap-2">
      <Volver href="/panel/configuracion">Configuración</Volver>
      <PanelHeader titulo="Entregas" subtitulo="Elige cómo reciben sus pedidos tus clientes. En tu tienda solo se ve lo que actives." accion={boton("")} />
    </div>
    {ninguno && <div role={intento ? "alert" : "status"} className="flex flex-col gap-1 text-body-sm">
      <p className={intento ? "text-error" : "text-warning"}>Activa al menos un método de entrega.</p>
      <p className="text-fg-secondary">Mientras tanto, tus clientes pueden hacer su pedido y coordinar la entrega contigo por WhatsApp.</p>
    </div>}
    {intento && r.resumen && <p role="alert" className="text-body-sm text-error">{r.resumen}</p>}
    <div className="grid min-w-0 items-start gap-10 lg:grid-cols-3 lg:gap-12">
      <section aria-labelledby="opciones-entrega" className="flex min-w-0 flex-col gap-3 lg:col-span-2">
        <EncabezadoSeccion id="opciones-entrega" titulo="Opciones de entrega" />
        <fieldset disabled={guardando} aria-busy={guardando || undefined} className={`${CONTENEDOR} min-w-0 divide-y divide-line-subtle`}>
          <legend className="sr-only">Opciones de entrega</legend>
          <TarjetaDelivery delivery={entregas.delivery} errores={errores} onCambio={(delivery) => setEntregas({ ...entregas, delivery })} />
          <TarjetaRecojo recojo={entregas.recojo} errores={errores} onCambio={(recojo) => setEntregas({ ...entregas, recojo })} />
        </fieldset>
      </section>
      <VistaCliente titulo="Al comprar, tu cliente verá">
        {lineas.length > 0 && <ul className="divide-y divide-line-subtle text-body-sm text-fg">{lineas.map((l) => <li key={l} className="py-3 first:pt-0 last:pb-0">{l}</li>)}</ul>}
        {(r.resumen || !lineas.length) && <p className="text-body-sm text-fg-secondary">{r.resumen ?? "Activa Delivery o Recojo en tienda para ver aquí las opciones de entrega."}</p>}
      </VistaCliente>
    </div>
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line-subtle bg-surface px-4 pt-3 pb-[max(env(safe-area-inset-bottom),--spacing(3))] lg:hidden">{boton("w-full")}</div>
    <Aviso aviso={aviso} />
  </div>;
}
