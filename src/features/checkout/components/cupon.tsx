"use client";

import { ChevronDown, Check, CircleCheck, Tag } from "lucide-react";
import { useId, useState } from "react";
import { Button, Field } from "@/components/ui";
import { formatoSoles } from "@/lib/formato";
import { cn } from "@/lib/cn";
import type { Cupon as TipoCupon } from "../types";

type Props = {
  sereno?: boolean;
  cupon: TipoCupon | null;
  descuento: number;
  /** Valida en el servidor contra los cupones de la tienda (módulo 3). */
  validar: (codigo: string) => Promise<{ cupon: TipoCupon } | { error: string }>;
  onAplicar: (c: TipoCupon | null) => void;
  className?: string;
};

/** "¿Tienes un cupón de descuento?" plegable (Figma C3a–C3c y C5). Aplicado, muestra el ahorro y "Quitar". */
export function Cupon({ cupon, descuento, validar, onAplicar, className, sereno = false }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [aplicando, setAplicando] = useState(false);
  const id = useId();

  if (cupon) {
    return (
      <div className={cn("flex min-w-0 items-start gap-3 p-4", sereno ? "border-y border-line-subtle" : "border border-success-border bg-success-surface", className)}>
        {sereno ? <Check aria-hidden strokeWidth={1.5} className="mt-0.5 size-5 shrink-0 text-icon" /> : <CircleCheck aria-hidden strokeWidth={1.8} className="mt-0.5 size-5 shrink-0 text-success" />}
        <p className="flex min-w-0 flex-1 flex-col break-words text-body-sm">
          <span className="font-semibold text-fg">{cupon.codigo} aplicado</span>
          <span className="text-fg-secondary">
            {cupon.tipo === "envio" ? "Tu envío es gratis." : `Ahorras ${formatoSoles(descuento)}${cupon.tipo === "porcentaje" ? ` (${cupon.valor}%)` : ""}.`}
          </span>
        </p>
        <button type="button" onClick={() => onAplicar(null)} className="-my-2.5 h-11 text-body-sm font-semibold text-fg underline-offset-4 hover:underline">
          Quitar<span className="sr-only"> el cupón</span>
        </button>
      </div>
    );
  }

  async function aplicar(e: React.FormEvent) {
    e.preventDefault();
    setAplicando(true);
    setError("");
    try {
      const r = await validar(codigo);
      if ("cupon" in r) onAplicar(r.cupon);
      else setError(r.error);
    } catch { setError("No pudimos revisar el cupón. Revisa tu conexión e inténtalo de nuevo."); }
    finally { setAplicando(false); }
  }

  return (
    <div className={cn("min-w-0 bg-surface", sereno ? "border-y border-line-subtle" : "border border-line-subtle", className)}>
      <button type="button" aria-expanded={abierto} aria-controls={id} onClick={() => setAbierto((v) => !v)} className="flex min-h-12 w-full items-center gap-2 px-4 text-left text-body-sm font-semibold text-fg">
        <Tag aria-hidden strokeWidth={1.6} className="size-5 text-icon" />
        <span className="flex-1">¿Tienes un cupón de descuento?</span>
        <ChevronDown aria-hidden strokeWidth={1.6} className={cn("size-5 text-icon transition-transform", abierto && "rotate-180")} />
      </button>
      {abierto && (
        <form id={id} onSubmit={aplicar} className="flex flex-col gap-3 px-4 pb-4">
          <Field label="Código de cupón" value={codigo} onChange={(e) => (setCodigo(e.target.value.toUpperCase()), setError(""))} error={error || undefined} autoCapitalize="characters" autoComplete="off" />
          <Button type="submit" variant="secondary" block disabled={aplicando} aria-busy={aplicando || undefined}>
            {aplicando ? "Aplicando…" : "Aplicar cupón"}
          </Button>
        </form>
      )}
    </div>
  );
}
