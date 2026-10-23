"use client";

import { Switch } from "@/components/ui";
import type { Categoria } from "../../types";
import { ChipsOpciones } from "./chips-opciones";
import { TarjetaSeccion as Tarjeta } from "@/components/panel";

/** Sugeridas hasta que el formulario permita escribir una nueva (auditoría multirubro, PR 3). */
const SUGERIDAS: Categoria[] = ["Balerinas", "Tacos", "Botas", "Plataformas", "Ropa"];

type EstadoProps = { estado: "activo" | "pausado"; onCambio: (e: "activo" | "pausado") => void };

/** Estado: un solo interruptor Activo / Pausado (decisiones 0011 y 0027), con qué significa para el cliente. */
export function TarjetaEstado({ estado, onCambio }: EstadoProps) {
  const activo = estado === "activo";
  return (
    <Tarjeta titulo="Estado">
      <div className="flex flex-col gap-1">
        <Switch checked={activo} onChange={(v) => onCambio(v ? "activo" : "pausado")} aria-describedby="ayuda-estado">
          {activo ? "Activo" : "Pausado"}
        </Switch>
        <p id="ayuda-estado" className="text-caption text-fg-secondary">
          {activo ? "Tus clientes lo ven y lo pueden comprar en tu tienda." : "No se ve en tu tienda. Actívalo cuando esté listo para vender."}
        </p>
      </div>
    </Tarjeta>
  );
}

type OrgProps = { categorias: Categoria[]; onAlternar: (c: Categoria) => void };

/** Organización: categorías (selección múltiple). Ayudan a tus clientes a encontrarlo en la tienda. */
export function TarjetaOrganizacion({ categorias, onAlternar }: OrgProps) {
  return (
    <Tarjeta titulo="Organización" descripcion="Puedes elegir más de una. Así tus clientes lo encuentran más rápido.">
      <ChipsOpciones
        legend="Categorías"
        opciones={[...new Set([...SUGERIDAS, ...categorias])]}
        elegidas={categorias}
        onAlternar={onAlternar}
      />
    </Tarjeta>
  );
}
