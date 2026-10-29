"use client";

import { useState } from "react";
import { Chip, Field } from "@/components/ui";
import { MAX_NOMBRE_OFERTAS, NOMBRES_OFERTAS } from "../lib/config";
import type { Errores, Tienda } from "../types";
import { Seccion } from "./seccion";

type Props = { tienda: Tienda; errores: Errores; cambiar: <K extends keyof Tienda>(key: K, valor: Tienda[K]) => void; categorias: string[] };

/**
 * Sección de ofertas (Plan Free, 0034): el nombre de la sección en la tienda y de su link en el menú, primero junto
 * a las categorías. "Ofertas" por defecto, sugerencias o un nombre propio. Solo aparece cuando hay productos en oferta.
 */
export function SeccionOfertas({ tienda, errores, cambiar, categorias }: Props) {
  const actual = tienda.nombreOfertas.trim();
  const [propio, setPropio] = useState(actual !== "" && !NOMBRES_OFERTAS.includes(actual));
  const elegido = actual || "Ofertas";
  return (
    <Seccion titulo="Sección de ofertas" descripcion="El nombre de la sección y de su link en el menú de tu tienda. Solo aparece cuando tienes productos en oferta.">
      <div role="group" aria-label="Nombre de la sección" className="flex flex-wrap gap-2">
        {NOMBRES_OFERTAS.map((n) => (
          <Chip key={n} selected={!propio && elegido === n} onClick={() => (setPropio(false), cambiar("nombreOfertas", n === "Ofertas" ? "" : n))}>{n}</Chip>
        ))}
        <Chip selected={propio} onClick={() => (setPropio(true), cambiar("nombreOfertas", ""))}>Otro nombre</Chip>
      </div>
      {propio && (
        <Field id="nombre-ofertas" label="Nombre" placeholder="Ej.: Black Friday" maxLength={MAX_NOMBRE_OFERTAS} value={tienda.nombreOfertas} autoFocus
          onChange={(e) => cambiar("nombreOfertas", e.target.value)} error={errores.nombreOfertas}
          hint={`${tienda.nombreOfertas.length}/${MAX_NOMBRE_OFERTAS} caracteres. Si lo dejas vacío, se llama "Ofertas".`} />
      )}
      <div className="flex flex-col gap-2">
        <p className="text-caption text-fg-secondary">Así se ve el menú de tu tienda</p>
        <div className="sin-scrollbar flex items-center gap-2 overflow-x-auto rounded-theme bg-sunken px-3 py-2.5">
          {[elegido, ...categorias.slice(0, 3)].map((c, i) => (
            <span key={c} className={i === 0 ? "shrink-0 rounded-full bg-selected px-3 py-1 text-body-sm text-on-selected" : "shrink-0 rounded-full border border-line-subtle bg-surface px-3 py-1 text-body-sm text-fg"}>{c}</span>
          ))}
        </div>
      </div>
    </Seccion>
  );
}
