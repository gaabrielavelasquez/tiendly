"use client";

import { CircleAlert, Plus, TicketPercent } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Aviso, CONTENEDOR, EncabezadoSeccion, PanelHeader, useOcultarBarraInferior, type TextoAviso } from "@/components/panel";
import { Button, buttonVariants, Card, EmptyState } from "@/components/ui";
import { cn } from "@/lib/cn";
import type { Cupon } from "../types";
import { alternarCupon } from "../lib/acciones";
import { cuponesEnUso, estadoCupon, LIMITE_FREE, limiteCupones } from "../lib/reglas";
import { TarjetaCupon } from "./tarjeta-cupon";



/** Cupones (Figma, módulo 3; decisión 0008): en uso arriba, pausados y vencidos abajo. Plan Free: hasta 3 en uso; Pro: sin límite. */
export function VistaCupones({ inicial, hoy, creado, plan }: { inicial: Cupon[]; hoy: string; creado?: string; plan: "free" | "pro" }) {
  useOcultarBarraInferior(inicial.length > 0);
  const [ocupado, setOcupado] = useState(false);
  const [lista, setLista] = useState(inicial);
  const [aviso, setAviso] = useState<TextoAviso>(creado ? { texto: `Cupón guardado. Ya puedes compartir ${creado}.`, tono: "ok" } : null);
  const timer = useRef<number | undefined>(undefined);
  const avisar = (a: TextoAviso) => (setAviso(a), window.clearTimeout(timer.current), (timer.current = window.setTimeout(() => setAviso(null), 4500)));
  useEffect(() => {
    if (creado) timer.current = window.setTimeout(() => setAviso(null), 4500);
    return () => window.clearTimeout(timer.current);
  }, [creado]);

  const conEstado = lista.map((c) => ({ c, estado: estadoCupon(c, hoy) }));
  const usados = cuponesEnUso(lista, hoy);
  const activos = conEstado.filter((x) => x.estado === "activo").length;
  const limite = limiteCupones(plan);
  const enLimite = limite !== null && usados >= limite;
  const crear = (clase = "") => (enLimite ? <Button disabled className={clase}><Plus aria-hidden className="size-4" />Crear cupón</Button> : <Link href="/panel/cupones/nuevo" className={cn(buttonVariants(), clase)}><Plus aria-hidden className="size-4" />Crear cupón</Link>);

  async function alternar(c: Cupon, activo: boolean) {
    if (ocupado) return;
    setLista((l) => l.map((x) => (x.id === c.id ? { ...x, activo } : x)));
    setOcupado(true);
    try {
      const r = await alternarCupon(c.id, activo);
      if ("error" in r) { setLista(l => l.map(x => x.id === c.id ? c : x)); avisar({ texto: r.error, tono: "error" }); return; }
      avisar({ texto: activo ? `${c.codigo} está activo.` : `${c.codigo} está pausado. Nadie puede usarlo hasta que lo actives.`, tono: "ok" });
    } catch (e) {
      setLista(l => l.map(x => x.id === c.id ? c : x));
      avisar({ texto: "No pudimos guardar. Revisa tu conexión e inténtalo de nuevo.", tono: "error" });
    } finally { setOcupado(false); }
  }
  async function copiar(codigo: string) {
    try { await navigator.clipboard.writeText(codigo); avisar({ texto: `Copiaste ${codigo}.`, tono: "ok" }); }
    catch { avisar({ texto: "No pudimos copiar el código. Inténtalo de nuevo.", tono: "error" }); }
  }

  const subtitulo = "Crea códigos de descuento para tus clientes: bienvenida, influencers o la campaña del mes.";
  if (!lista.length) {
    return (
      <>
        <PanelHeader titulo="Cupones" subtitulo={subtitulo} />
        <div className={CONTENEDOR}><EmptyState simple icon={TicketPercent} title="Todavía no tienes cupones" description="Tu primer cupón puede ser de bienvenida: un 10% para quien compra por primera vez." action={<div className="flex flex-col items-center gap-2">{crear()}<p className="text-caption text-fg-secondary">{limite ? `Plan Free: hasta ${limite} cupones activos a la vez.` : "Plan Pro: cupones ilimitados."}</p></div>} /></div>
      </>
    );
  }

  const seccion = (titulo: string, items: typeof conEstado) =>
    items.length > 0 && (
      <section className="flex flex-col gap-3" aria-label={titulo}>
        <EncabezadoSeccion id={`cupones-${titulo.split(" ")[0]}`} titulo={titulo} />
        <ul className={`${CONTENEDOR} min-w-0 divide-y divide-line-subtle`}>{items.map(({ c, estado }) => <TarjetaCupon key={c.id} c={c} estado={estado} onAlternar={(v) => alternar(c, v)} onCopiar={() => copiar(c.codigo)} />)}</ul>
      </section>
    );

  return (
    <>
      <PanelHeader titulo="Cupones" subtitulo={subtitulo} accion={crear()} />
      {enLimite && (
        <div className="flex min-w-0 gap-3 text-warning">
          <CircleAlert aria-hidden strokeWidth={1.8} className="mt-0.5 size-5 shrink-0 text-warning" />
          <p className="flex flex-col gap-0.5 text-body-sm">
            <span className="font-semibold text-fg">Llegaste al límite de {LIMITE_FREE} cupones en uso del Plan Free</span>
            <span className="text-fg-secondary">Los programados también ocupan lugar. Pausa uno para crear otro, o mejora tu plan para tener cupones ilimitados.</span>
          </p>
        </div>
      )}
      <p className="text-body-sm text-fg-secondary">
        <span className="font-semibold text-fg">{limite ? `${usados} de ${limite} en uso` : `${usados} en uso`}</span> · {activos} {activos === 1 ? "activo" : "activos"} y {usados - activos} {usados - activos === 1 ? "programado" : "programados"} · {limite ? "Plan Free" : "Plan Pro, sin límite"}
      </p>
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line-subtle bg-surface p-4 lg:hidden">{crear("w-full")}</div>
      <fieldset disabled={ocupado} className="flex min-w-0 flex-col gap-10 lg:gap-12">
      {seccion("Activos y programados", conEstado.filter((x) => x.estado === "activo" || x.estado === "programado"))}
      {seccion("Pausados y vencidos", conEstado.filter((x) => x.estado !== "activo" && x.estado !== "programado"))}
      </fieldset>
      <Aviso aviso={aviso} />
    </>
  );
}
