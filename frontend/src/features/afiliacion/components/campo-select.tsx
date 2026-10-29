import { CircleAlert } from "lucide-react";
import { useId } from "react";
import { cn } from "@/lib/cn";

type Props = { label: string; value: string; opciones: readonly { valor: string; texto: string }[]; placeholder: string; onChange: (v: string) => void; error?: string; hint?: string };

/** Selector nativo con el mismo aspecto de Field (caja de 40 px, etiqueta, ayuda o error). Sin tokens nuevos. */
export function CampoSelect({ label, value, opciones, placeholder, onChange, error, hint }: Props) {
  const id = useId();
  const mensaje = error ?? hint;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-body-sm font-semibold text-fg">{label}</label>
      <select
        id={id}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={mensaje ? `${id}-msg` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={cn("h-10 w-full rounded-button border bg-surface px-3 text-body text-fg outline-2 outline-offset-2 outline-transparent transition focus:outline-focus", error ? "border-error" : "border-line-strong")}
      >
        <option value="">{placeholder}</option>
        {opciones.map((o) => <option key={o.valor} value={o.valor}>{o.texto}</option>)}
      </select>
      {mensaje && (
        <p id={`${id}-msg`} className={cn("flex items-start gap-1 text-caption", error ? "text-error" : "text-fg-secondary")}>
          {error && <CircleAlert aria-hidden className="mt-px size-4 shrink-0" />}
          {mensaje}
        </p>
      )}
    </div>
  );
}
