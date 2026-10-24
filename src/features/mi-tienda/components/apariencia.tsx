import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { ACENTOS, TEMAS } from "../lib/config";
import type { Muestra } from "./tienda-preview";
import type { Tienda } from "../types";
import { MiniaturaTema } from "./miniatura-tema";
import { Seccion } from "./seccion";
import { Button } from "@/components/ui";

type Props = { tienda: Tienda; nombre: string; muestras: Muestra[]; muestrasEjemplo: boolean; cambiar: <K extends keyof Tienda>(key: K, valor: Tienda[K]) => void; vistaPrevia: () => void };
export function Apariencia({ tienda, nombre, muestras, muestrasEjemplo, cambiar, vistaPrevia }: Props) {
  return <><Seccion titulo="Tema">
    <fieldset><legend className="sr-only">Tema</legend>
      <div className="grid grid-cols-3 gap-2">
        {TEMAS.map(t => <label key={t.id} className={cn("relative cursor-pointer rounded-card border p-2", tienda.tema === t.id ? "border-selected-border ring-1 ring-selected-border" : "border-line-subtle")}>
          <input type="radio" name="tema" value={t.id} checked={tienda.tema === t.id} onChange={() => cambiar("tema", t.id)} className="peer sr-only" />
          <div className="rounded-theme ring-focus peer-focus-visible:ring-2"><MiniaturaTema tienda={tienda} tema={t.id} nombre={nombre} muestras={muestras} /></div>
          <span className="mt-2 flex items-center justify-between gap-1 text-caption font-semibold">{t.nombre}{tienda.tema === t.id && <Check aria-hidden className="size-4 shrink-0" />}</span>
          <span className="sr-only">{t.descripcion}</span>
        </label>)}
      </div>
    </fieldset>
    {muestrasEjemplo && <p className="text-caption text-fg-secondary">Productos de muestra según tu rubro. Se reemplazan al publicar tus productos.</p>}
    <Button variant="secondary" block className="xl:hidden" onClick={vistaPrevia}>Ver vista previa</Button>
    </Seccion><Seccion titulo="Color de acento">
    <fieldset><legend className="sr-only">Color de acento</legend>
      <div className="flex flex-wrap justify-between gap-2">
        {ACENTOS.map(a => <label key={a.id} className="flex min-h-11 cursor-pointer flex-col items-center gap-2">
          <input type="radio" name="acento" value={a.id} checked={tienda.acento === a.id} onChange={() => cambiar("acento", a.id)} className="peer sr-only" />
          <span style={{ backgroundColor: `var(--tl-accent-option-${a.id}-fill)`, color: `var(--tl-accent-option-${a.id}-contrast)` }}
            className={cn("flex size-11 items-center justify-center rounded-full border border-line-subtle shadow-card ring-offset-2 ring-offset-surface peer-focus-visible:outline-2 peer-focus-visible:outline-focus", tienda.acento === a.id && "ring-2 ring-selected-border")}>
            {tienda.acento === a.id && <Check aria-hidden className="size-5" />}
          </span><span className="text-caption text-fg-secondary">{a.nombre}</span>
        </label>)}
      </div><p className="mt-3 text-caption text-fg-secondary">Lo usamos en botones y detalles. Elegimos el color del texto para que siempre se lea bien.</p>
    </fieldset>
  </Seccion></>;
}
