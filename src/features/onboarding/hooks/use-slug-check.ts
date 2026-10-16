"use client";

import { useEffect, useState } from "react";
import { aSlug, revisarSlug, type ResultadoSlug } from "../lib/slug";

export type EstadoSlug = { estado: "vacio" } | { estado: "revisando"; slug: string } | ({ estado: "listo" } & ResultadoSlug);

/** Genera el link al escribir el nombre y revisa si está libre (con espera de 400 ms). */
export function useSlugCheck(nombre: string): EstadoSlug {
  const slug = aSlug(nombre);
  const [res, setRes] = useState<EstadoSlug>({ estado: "vacio" });

  useEffect(() => {
    if (slug.length < 2) {
      setRes({ estado: "vacio" });
      return;
    }
    let vigente = true;
    setRes({ estado: "revisando", slug });
    const t = setTimeout(() => {
      revisarSlug(slug).then((r) => vigente && setRes({ estado: "listo", ...r }));
    }, 400);
    return () => {
      vigente = false;
      clearTimeout(t);
    };
  }, [slug]);

  return res;
}
