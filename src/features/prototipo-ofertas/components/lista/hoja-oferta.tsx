"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, Chip, Field } from "@/components/ui";
import { formatoSoles, plural } from "@/lib/formato";
import type { ProductoProto } from "../../lib/datos";
import { estadoOferta, precioEnLote, type Oferta } from "../../lib/oferta";
import { CONTENEDOR } from "../comunes";

type Modo = "porcentaje" | "precio";
type Props = { productos: ProductoProto[]; hoy: string; onCerrar: () => void; onAplicar: (cambios: Record<string, { precio: number; precioAntes: number; oferta: Oferta }>) => void };

/** El precio normal: el "precio antes" si ya está en oferta; si no, el precio. */
const normal = (p: ProductoProto) => (p.precioAntes && p.precioAntes > p.precio ? p.precioAntes : p.precio);

/**
 * Poner en oferta en lote (0034). Móvil: hoja desde abajo; desktop: diálogo. Descuento en % o precio fijo, fechas
 * opcionales y la lista de cómo queda cada producto antes de confirmar. Un solo CTA: "Poner 3 en oferta".
 */
export function HojaOferta({ productos, hoy, onCerrar, onAplicar }: Props) {
  const [modo, setModo] = useState<Modo>("porcentaje");
  const [valor, setValor] = useState("20");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const n = Number(valor.replace(",", "."));
  const filas = productos.map((p) => ({ p, antes: normal(p), nuevo: n > 0 ? precioEnLote(normal(p), modo, n) : normal(p) }));
  const validas = filas.filter((f) => f.nuevo > 0 && f.nuevo < f.antes);
  const error = !(n > 0) ? "Escribe un número mayor a 0." : modo === "porcentaje" && n >= 100 ? "El descuento tiene que ser menor a 100 %." : hasta && desde && hasta < desde ? "La fecha de fin tiene que ser después del inicio." : "";

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onCerrar();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [onCerrar]);

  const aplicar = () => onAplicar(Object.fromEntries(validas.map((f) => [f.p.id, { precio: f.nuevo, precioAntes: f.antes, oferta: { desde: desde || undefined, hasta: hasta || undefined } }])));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-fg/40 lg:items-center" onClick={onCerrar}>
      <div role="dialog" aria-modal aria-labelledby="hoja-titulo" onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90dvh] w-full flex-col overflow-hidden rounded-t-card bg-surface shadow-overlay lg:max-w-lg lg:rounded-card">
        <header className="flex items-start justify-between gap-3 border-b border-line-subtle px-5 py-4">
          <div>
            <h2 id="hoja-titulo" className="font-titulo-seccion text-h3 tracking-tight text-fg">Poner en oferta</h2>
            <p className="text-body-sm text-fg-secondary">{plural(productos.length, "producto seleccionado", "productos seleccionados")}.</p>
          </div>
          <button type="button" onClick={onCerrar} aria-label="Cerrar" className="flex size-10 items-center justify-center rounded-button text-icon hover:bg-sunken"><X aria-hidden strokeWidth={1.5} className="size-5" /></button>
        </header>
        <div className="flex flex-col gap-5 overflow-y-auto px-5 py-5">
          <div role="group" aria-label="Tipo de oferta" className="flex gap-2">
            <Chip selected={modo === "porcentaje"} onClick={() => (setModo("porcentaje"), setValor("20"))}>Descuento en %</Chip>
            <Chip selected={modo === "precio"} onClick={() => (setModo("precio"), setValor(""))}>Precio fijo</Chip>
          </div>
          <Field id="lote-valor" label={modo === "porcentaje" ? "Descuento (%)" : "Precio de oferta"} prefix={modo === "precio" ? "S/" : undefined} inputMode="numeric" value={valor}
            placeholder={modo === "porcentaje" ? "Ej.: 20" : "Ej.: 59"} onChange={(e) => setValor(e.target.value.replace(/\D/g, ""))} error={valor ? error || undefined : undefined}
            hint={modo === "porcentaje" ? "Se descuenta del precio normal de cada producto, redondeado al sol." : "El mismo precio para todos los seleccionados."} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field id="lote-desde" type="date" label="Empieza" min={hoy} value={desde} onChange={(e) => setDesde(e.target.value)} hint="Si lo dejas vacío, empieza hoy." />
            <Field id="lote-hasta" type="date" label="Termina" min={desde || hoy} value={hasta} onChange={(e) => setHasta(e.target.value)} hint="Si lo dejas vacío, dura hasta que borres el precio antes." />
          </div>
          <ul className={`${CONTENEDOR} flex flex-col divide-y divide-line-subtle`}>
            {filas.map(({ p, antes, nuevo }) => (
              <li key={p.id} className="flex items-baseline justify-between gap-3 px-4 py-3 text-body-sm">
                <span className="flex min-w-0 flex-col">
                  <span className="truncate text-fg">{p.nombre}</span>
                  {estadoOferta(p, hoy) !== "sin-oferta" && <span className="text-caption text-fg-secondary">Reemplaza su oferta actual.</span>}
                  {nuevo >= antes && <span className="text-caption text-warning">No baja el precio: queda fuera.</span>}
                </span>
                <span className="shrink-0 tabular-nums"><span className="text-fg-tertiary line-through"><span className="sr-only">Precio anterior: </span>{formatoSoles(antes)}</span> <span className="font-medium text-fg"><span className="sr-only">, nuevo: </span>{formatoSoles(nuevo)}</span></span>
              </li>
            ))}
          </ul>
        </div>
        <footer className="flex gap-2 border-t border-line-subtle px-5 py-3 pb-[max(calc(var(--spacing)*3),env(safe-area-inset-bottom))]">
          <Button type="button" variant="ghost" className="flex-1" onClick={onCerrar}>Cancelar</Button>
          <Button type="button" className="flex-[2]" disabled={!!error || !validas.length} onClick={aplicar}>Poner {validas.length} en oferta</Button>
        </footer>
      </div>
    </div>
  );
}
