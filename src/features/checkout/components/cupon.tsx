"use client";

import { ChevronDown, CircleCheck, Tag } from "lucide-react";
import { useId, useState } from "react";
import { Button, Field } from "@/components/ui";
import { formatoSoles } from "@/lib/formato";
import { cn } from "@/lib/cn";
import type { Cupon as TipoCupon } from "../types";
import { validarCupon } from "../lib/reglas";

type Props = { cupon: TipoCupon | null; productos: number; descuento: number; onAplicar: (c: TipoCupon | null) => void; className?: string };

/** "¿Tienes un cupón de descuento?" plegable (Figma C3a–C3c y C5). Aplicado, muestra el ahorro y "Quitar". */
export function Cupon({ cupon, productos, descuento, onAplicar, className }: Props) {
  const [abierto, setAbierto] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const id = useId();

  if (cupon) {
    return (
      <div className={cn("flex items-start gap-3 border border-success-border bg-success-surface p-4", className)}>
        <CircleCheck aria-hidden strokeWidth={1.8} className="mt-0.5 size-5 shrink-0 text-success" />
        <p className="flex flex-1 flex-col text-body-sm">
          <span className="font-semibold text-fg">{cupon.codigo} aplicado</span>
          <span className="text-fg-secondary">
            {cupon.tipo === "envio" ? "Tu envío es gratis." : `Ahorras ${formatoSoles(descuento)} (${cupon.valor}%).`}
          </span>
        </p>
        <button type="button" onClick={() => onAplicar(null)} className="-my-2.5 h-11 text-body-sm font-semibold text-fg underline-offset-4 hover:underline">
          Quitar<span className="sr-only"> el cupón</span>
        </button>
      </div>
    );
  }

  function aplicar(e: React.FormEvent) {
    e.preventDefault();
    const r = validarCupon(codigo, productos);
    if (r.ok) onAplicar(r.cupon);
    else setError(r.error);
  }

  return (
    <div className={cn("border border-line-subtle bg-surface", className)}>
      <button type="button" aria-expanded={abierto} aria-controls={id} onClick={() => setAbierto((v) => !v)} className="flex min-h-12 w-full items-center gap-2 px-4 text-left text-body-sm font-semibold text-fg">
        <Tag aria-hidden strokeWidth={1.6} className="size-5 text-icon" />
        <span className="flex-1">¿Tienes un cupón de descuento?</span>
        <ChevronDown aria-hidden strokeWidth={1.6} className={cn("size-5 text-icon transition-transform", abierto && "rotate-180")} />
      </button>
      {abierto && (
        <form id={id} onSubmit={aplicar} className="flex flex-col gap-3 px-4 pb-4">
          <Field label="Código de cupón" value={codigo} onChange={(e) => (setCodigo(e.target.value.toUpperCase()), setError(""))} error={error || undefined} autoCapitalize="characters" autoComplete="off" />
          <Button type="submit" variant="secondary" block>
            Aplicar cupón
          </Button>
        </form>
      )}
    </div>
  );
}
