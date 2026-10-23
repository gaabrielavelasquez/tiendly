"use client";

import Link from "next/link";
import { useState } from "react";
import { PanelHeader } from "@/components/panel";
import { Chip, Field } from "@/components/ui";
import { cn } from "@/lib/cn";
import { Seccion } from "../comunes";
import { ControlPrototipo } from "../control-prototipo";

const SUGERIDOS = ["Ofertas", "SALE", "Cyber Wow", "Liquidación", "Fin de temporada"];
const MAXIMO = 20;
const CATEGORIAS = ["Skincare", "Maquillaje", "Cuerpo"];

/**
 * PROTOTIPO · Mi tienda › Sección de ofertas (Plan Free, 0034 ronda 2): el nombre de la sección y de su link en el
 * menú. Por defecto "Ofertas"; sugerencias o un texto propio. En el prototipo se guarda en una cookie para que la
 * tienda de prueba lo muestre.
 */
export function NombreOfertasProto({ inicial }: { inicial: string }) {
  const [nombre, setNombre] = useState(inicial);
  const [propio, setPropio] = useState(!SUGERIDOS.includes(inicial));
  const guardar = (n: string) => {
    setNombre(n);
    document.cookie = `proto-ofertas=${encodeURIComponent(n.trim())}; path=/; max-age=2592000; samesite=lax`;
  };
  const visible = nombre.trim() || "Ofertas";

  return (
    <>
      <PanelHeader titulo="Mi tienda" subtitulo="Cómo se ve tu tienda para tus clientes." />
      <ControlPrototipo etiqueta="Mi tienda"><span className="text-caption text-fg-secondary">Solo la sección nueva; el resto de Mi tienda no cambia.</span></ControlPrototipo>
      <Seccion id="sec-ofertas" titulo="Sección de ofertas" descripcion="El nombre de la sección y de su link en el menú. Solo aparece cuando tienes productos en oferta.">
        <div role="group" aria-label="Nombre de la sección" className="flex flex-wrap gap-2">
          {SUGERIDOS.map((s) => (
            <Chip key={s} selected={!propio && nombre === s} onClick={() => (setPropio(false), guardar(s))}>{s}</Chip>
          ))}
          <Chip selected={propio} onClick={() => (setPropio(true), guardar(""))}>Otro nombre</Chip>
        </div>
        {propio && (
          <Field id="nombre-ofertas" label="Nombre" placeholder="Ej.: Black Friday" maxLength={MAXIMO} value={nombre} autoFocus
            onChange={(e) => guardar(e.target.value)} hint={`${nombre.length}/${MAXIMO} caracteres. Si lo dejas vacío, se llama "Ofertas".`} />
        )}
        <div className="flex flex-col gap-2 border-t border-line-subtle pt-4">
          <p className="text-caption text-fg-secondary">Así se ve el menú de tu tienda</p>
          <div data-theme="suave" className="flex items-center gap-5 overflow-x-auto rounded-theme bg-page px-4 py-3">
            <span className="shrink-0 font-display-title text-body text-fg">GLOW LABO</span>
            {[visible, ...CATEGORIAS].map((c, i) => (
              <span key={c} className={cn("shrink-0 text-body-sm", i === 0 ? "font-semibold text-fg" : "text-fg-secondary")}>{c}</span>
            ))}
          </div>
          <Link href="/prototipo/tienda" className="link-text w-fit text-body-sm">Ver en la tienda</Link>
        </div>
      </Seccion>
    </>
  );
}
