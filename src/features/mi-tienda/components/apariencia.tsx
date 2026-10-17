import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { ACENTOS, INICIAL, TEMAS } from "../lib/config";
import type { Tienda } from "../types";
import { TiendaPreview } from "./tienda-preview";
import { Seccion } from "./seccion";

type Props = { tienda: Tienda; cambiar: <K extends keyof Tienda>(key: K, valor: Tienda[K]) => void };
export function Apariencia({ tienda, cambiar }: Props) {
  return <Seccion titulo="El estilo de tu tienda" descripcion="Tres temas listos para que tu marca se vea profesional.">
    <fieldset><legend className="mb-3 text-body-sm font-semibold">Tema</legend>
      <div className="grid grid-cols-3 gap-2">
        {TEMAS.map(t => <label key={t.id} className={cn("relative cursor-pointer rounded-card border p-2", tienda.tema === t.id ? "border-selected-border ring-1 ring-selected-border" : "border-line-subtle")}>
          <input type="radio" name="tema" value={t.id} checked={tienda.tema === t.id} onChange={() => cambiar("tema", t.id)} className="peer sr-only" />
          <div className="rounded-theme ring-focus peer-focus-visible:ring-2"><TiendaPreview tienda={{ ...INICIAL, tema: t.id }} mini /></div>
          <span className="mt-2 flex items-center justify-between gap-1 text-caption font-semibold">{t.nombre}{tienda.tema === t.id && <Check aria-hidden className="size-4 shrink-0" />}</span>
          <span className="sr-only">{t.descripcion}</span>
        </label>)}
      </div>
    </fieldset>
    <fieldset><legend className="mb-3 text-body-sm font-semibold">Color de acento</legend>
      <div className="flex flex-wrap gap-3">
        {ACENTOS.map(a => <label key={a.id} className="flex min-h-11 cursor-pointer flex-col items-center gap-2">
          <input type="radio" name="acento" value={a.id} checked={tienda.acento === a.id} onChange={() => cambiar("acento", a.id)} className="peer sr-only" />
          <span style={{ backgroundColor: `var(--tl-accent-option-${a.id}-fill)`, color: `var(--tl-accent-option-${a.id}-contrast)` }}
            className={cn("flex size-11 items-center justify-center rounded-full border border-line-subtle shadow-card ring-offset-2 ring-offset-surface peer-focus-visible:outline-2 peer-focus-visible:outline-focus", tienda.acento === a.id && "ring-2 ring-selected-border")}>
            {tienda.acento === a.id && <Check aria-hidden className="size-5" />}
          </span><span className="text-caption text-fg-secondary">{a.nombre}</span>
        </label>)}
      </div><p className="mt-3 text-caption text-fg-secondary">Cada color incluye texto con contraste validado.</p>
    </fieldset>
  </Seccion>;
}
