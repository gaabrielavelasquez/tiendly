"use client";

import { useCallback, useEffect, useState } from "react";
import { revisarSlug } from "../lib/acciones";
import { aSlug, type ResultadoSlug } from "../lib/slug";

export type EstadoSlug = { estado: "vacio" } | { estado: "revisando"; slug: string } | { estado: "error"; slug: string } | ({ estado: "listo" } & ResultadoSlug);

/** Genera el link al escribir el nombre y revisa si está libre (con espera de 400 ms). */
export function useSlugCheck(nombre: string): EstadoSlug & { reintentar: () => void } {
  const slug = aSlug(nombre);
  const [intento, setIntento] = useState(0);
  const reintentar = useCallback(() => setIntento((i) => i + 1), []);
  const [res, setRes] = useState<EstadoSlug>({ estado: "vacio" });

  useEffect(() => {
    if (slug.length < 2) {
      setRes({ estado: "vacio" });
      return;
    }
    let vigente = true;
    setRes({ estado: "revisando", slug });
    const t = setTimeout(() => {
      revisarSlug(slug)
        .then((r) => vigente && setRes({ estado: "listo", ...r }))
        .catch(() => vigente && setRes({ estado: "error", slug }));
    }, 400);
    return () => {
      vigente = false;
      clearTimeout(t);
    };
  }, [slug, intento]);

  return { ...res, reintentar };
}
