"use client";

import { Switch } from "@/components/ui";
import type { Categoria } from "../../types";
import { ChipsOpciones } from "./chips-opciones";
import { TarjetaSeccion as Tarjeta } from "@/components/panel";

const CATEGORIAS: { id: Categoria; label: string }[] = [
  { id: "balerinas", label: "Balerinas" },
  { id: "tacos", label: "Tacos" },
  { id: "botas", label: "Botas" },
  { id: "plataformas", label: "Plataformas" },
];

type EstadoProps = { estado: "activo" | "borrador"; onCambio: (e: "activo" | "borrador") => void };

/** Estado: interruptor Activo / Borrador, con qué significa cada uno para el cliente. */
export function TarjetaEstado({ estado, onCambio }: EstadoProps) {
  const activo = estado === "activo";
  return (
    <Tarjeta titulo="Estado">
      <div className="flex flex-col gap-1">
        <Switch checked={activo} onChange={(v) => onCambio(v ? "activo" : "borrador")} aria-describedby="ayuda-estado">
          {activo ? "Activo" : "Borrador"}
        </Switch>
        <p id="ayuda-estado" className="text-caption text-fg-secondary">
          {activo ? "Tus clientes lo ven y lo pueden comprar en tu tienda." : "Solo tú lo ves. Actívalo cuando esté listo para vender."}
        </p>
      </div>
    </Tarjeta>
  );
}

type OrgProps = { categorias: Categoria[]; onAlternar: (c: Categoria) => void };

/** Organización: categorías (selección múltiple). Ayudan a tus clientes a encontrarlo en la tienda. */
export function TarjetaOrganizacion({ categorias, onAlternar }: OrgProps) {
  const porLabel = Object.fromEntries(CATEGORIAS.map((c) => [c.label, c.id])) as Record<string, Categoria>;
  return (
    <Tarjeta titulo="Organización" descripcion="Puedes elegir más de una. Así tus clientes lo encuentran más rápido.">
      <ChipsOpciones
        legend="Categorías"
        opciones={CATEGORIAS.map((c) => c.label)}
        elegidas={CATEGORIAS.filter((c) => categorias.includes(c.id)).map((c) => c.label)}
        onAlternar={(label) => onAlternar(porLabel[label])}
      />
    </Tarjeta>
  );
}
