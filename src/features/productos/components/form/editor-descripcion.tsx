"use client";

import { Bold, Italic, List, type LucideIcon } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/cn";

type EditorProps = { valor: string; onCambio: (v: string) => void };

type Formato = { icono: LucideIcon; label: string; antes: string; despues: string; linea?: boolean };
const FORMATOS: Formato[] = [
  { icono: Bold, label: "Negrita", antes: "**", despues: "**" },
  { icono: Italic, label: "Cursiva", antes: "_", despues: "_" },
  { icono: List, label: "Lista", antes: "- ", despues: "", linea: true },
];

/**
 * Descripción con barra de formato liviana (markdown: **negrita**, _cursiva_, - lista), que la tienda
 * renderiza. Un editor enriquecido completo (Tiptap u otro) queda para cuando se defina la dependencia.
 */
export function EditorDescripcion({ valor, onCambio }: EditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function aplicar(f: Formato) {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: a, selectionEnd: b } = el;
    const inicio = f.linea ? valor.lastIndexOf("\n", a - 1) + 1 : a;
    const sel = valor.slice(inicio, b);
    const nuevo = valor.slice(0, inicio) + f.antes + sel + f.despues + valor.slice(b);
    onCambio(nuevo);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(inicio + f.antes.length, inicio + f.antes.length + sel.length);
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="campo-descripcion" className="text-body-sm font-semibold text-fg">
        Descripción
      </label>
      <div
        className={cn(
          "overflow-hidden rounded-button border border-line-strong bg-surface transition",
          "outline-2 outline-offset-2 outline-transparent focus-within:outline-focus",
        )}
      >
        <div role="toolbar" aria-label="Formato de la descripción" className="flex gap-0.5 border-b border-line-subtle bg-sunken/60 p-1">
          {FORMATOS.map((f) => (
            <button
              key={f.label}
              type="button"
              aria-label={f.label}
              title={f.label}
              onClick={() => aplicar(f)}
              className="flex size-8 items-center justify-center rounded-sm text-icon transition-colors hover:bg-surface hover:text-fg"
            >
              <f.icono aria-hidden strokeWidth={1.8} className="size-4" />
            </button>
          ))}
        </div>
        <textarea
          ref={ref}
          id="campo-descripcion"
          value={valor}
          onChange={(e) => onCambio(e.target.value)}
          rows={6}
          placeholder="Cuenta de qué está hecho, cómo queda y cómo cuidarlo."
          aria-describedby="ayuda-descripcion"
          className="block w-full resize-y bg-transparent px-3 py-2.5 text-body text-fg outline-none placeholder:text-fg-tertiary"
        />
      </div>
      <p id="ayuda-descripcion" className="text-caption text-fg-secondary">
        Tus clientes la ven en la página del producto.
      </p>
    </div>
  );
}
