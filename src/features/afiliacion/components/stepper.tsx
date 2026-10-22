import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
const PASOS = ["Tu negocio", "Representante", "Cuenta", "Revisar"];
export function Stepper({ paso }: { paso: number }) {
  return <ol aria-label="Pasos de la solicitud" className="grid grid-cols-4 gap-2">
    {PASOS.map((p, i) => <li key={p} aria-current={paso === i + 1 ? "step" : undefined} className="flex flex-col gap-2">
      <div className={cn("h-1 rounded-full", paso >= i + 1 ? "bg-indicator" : "bg-skeleton")} />
      <span className={cn("flex items-center gap-1 text-label sm:text-caption", paso === i + 1 ? "font-bold text-fg" : "text-fg-secondary")}>
        {paso > i + 1 ? <Check aria-label="Completado" className="size-3 shrink-0" /> : <span>{i + 1}.</span>}
        <span className="sm:hidden">{i === 1 ? "Persona" : p}</span><span className="hidden sm:inline">{p}</span>
      </span>
    </li>)}
  </ol>;
}
