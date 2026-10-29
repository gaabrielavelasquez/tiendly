"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Seccion } from "@/components/panel";
import { Chip, Switch } from "@/components/ui";
import type { Categoria } from "../../types";
import { CAMPO } from "./opcion-fila";

type EstadoProps = { estado: "activo" | "pausado"; onCambio: (e: "activo" | "pausado") => void };

/** Estado: un solo interruptor Activo / Pausado (decisiones 0011 y 0027), con qué significa para el cliente. */
export function SeccionEstado({ estado, onCambio }: EstadoProps) {
  const activo = estado === "activo";
  return (
    <Seccion id="sec-estado" titulo="Estado">
      <div className="flex flex-col gap-1">
        <Switch checked={activo} onChange={(v) => onCambio(v ? "activo" : "pausado")} aria-describedby="ayuda-estado">
          {activo ? "Activo" : "Pausado"}
        </Switch>
        <p id="ayuda-estado" className="text-caption text-fg-secondary">
          {activo ? "Tus clientes lo ven y lo pueden comprar en tu tienda." : "No se ve en tu tienda. Actívalo cuando quieras venderlo."}
        </p>
      </div>
    </Seccion>
  );
}

type CategoriaProps = { elegidas: Categoria[]; deLaTienda: Categoria[]; onAlternar: (c: Categoria) => void; onAgregar: (c: Categoria) => void };

/**
 * Categorías (multirubro, 0032): las que ya usa la tienda más "Nueva" para escribir otra. Se puede elegir más de una.
 * Sin categorías, el producto igual se vende (la vitrina solo muestra el filtro cuando hay más de una).
 */
export function SeccionCategoria({ elegidas, deLaTienda, onAlternar, onAgregar }: CategoriaProps) {
  const [nueva, setNueva] = useState<string | null>(null);
  const opciones = [...new Set([...deLaTienda, ...elegidas])];
  const sumar = () => {
    const c = (nueva ?? "").trim().replace(/\s+/g, " ");
    if (c) onAgregar(c.charAt(0).toUpperCase() + c.slice(1));
    setNueva(null);
  };
  return (
    <Seccion id="sec-categoria" titulo="Categoría" descripcion="Puedes elegir más de una. Así tus clientes lo encuentran más rápido.">
      <div role="group" aria-label="Categorías" className="flex flex-wrap gap-2">
        {opciones.map((c) => <Chip key={c} selected={elegidas.includes(c)} onClick={() => onAlternar(c)}>{c}</Chip>)}
        {nueva === null && (
          <Chip className="border-dashed text-fg-secondary" onClick={() => setNueva("")}>
            <Plus aria-hidden strokeWidth={1.5} className="size-3.5" />Nueva
          </Chip>
        )}
      </div>
      {nueva !== null && (
        <label className="flex flex-col gap-1.5">
          <span className="text-body-sm font-semibold text-fg">Nueva categoría</span>
          <input autoFocus value={nueva} maxLength={24} placeholder="Ej.: Velas" className={CAMPO} onChange={(e) => setNueva(e.target.value)}
            onKeyDown={(e) => (e.key === "Enter" ? (e.preventDefault(), sumar()) : e.key === "Escape" && setNueva(null))} onBlur={sumar} />
          <span className="text-caption text-fg-secondary">Escríbela y presiona Enter.</span>
        </label>
      )}
    </Seccion>
  );
}
