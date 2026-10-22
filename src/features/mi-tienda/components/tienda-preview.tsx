import { Clock, Menu, ShoppingBag } from "lucide-react";
import { estiloAcento } from "../lib/config";
import type { Tienda } from "../types";
import { cn } from "@/lib/cn";

/** La misma vitrina se utiliza en miniaturas, móvil y desktop. No modifica el tema del panel. */
/** `nombre`: el de la tienda de la sesión. */
export function TiendaPreview({ tienda, nombre, mini = false, computadora = false }: { tienda: Tienda; nombre: string; mini?: boolean; computadora?: boolean }) {
  return <div data-theme={tienda.tema} style={estiloAcento(tienda.acento)} className="overflow-hidden rounded-theme bg-surface font-body text-fg">
    <div className={cn("flex items-center justify-between border-b border-line-subtle p-4", mini && "p-2")}>
      {!mini && <Menu aria-hidden className="size-5" />}
      {tienda.logo ? <img src={tienda.logo} alt={nombre} className={mini ? "h-5 max-w-16 object-contain" : "h-10 max-w-32 object-contain"} />
        : <p className={cn("font-display-title text-h2", mini && "w-full text-center text-caption")}>{nombre}</p>}
      {!mini && <ShoppingBag aria-hidden className="size-5" />}
    </div>
    {!mini && <p className="break-words px-5 py-3 text-center text-body-sm text-fg-secondary">{tienda.bienvenida || `Bienvenidos a ${nombre}.`}</p>}
    {tienda.portada ? <img src={tienda.portada} alt={`Portada de ${nombre}`} className={cn("aspect-video w-full object-cover", mini && "aspect-[2/1]")} />
      : <div className="flex aspect-video items-center justify-center bg-sunken p-4 text-caption text-fg-secondary">Tu foto de portada</div>}
    <div className={cn("flex flex-col gap-4 p-5", mini && "gap-2 p-2")}>
      <h3 className={cn("font-display-title text-h2", mini && "text-label")}>{mini ? "Nueva colección" : "Tu próximo par favorito"}</h3>
      <div className="flex gap-2"><span className={cn("rounded-chip bg-accent px-3 py-2 text-body-sm text-on-accent", mini && "px-2 py-1 text-label")}>Todos</span>
        {!mini && <span className="p-2 text-body-sm text-fg-secondary">Balerinas</span>}</div>
      <div className={cn("grid grid-cols-2 gap-3", computadora && "grid-cols-4")}>
        {[{ foto: "chloe.jpg", nombre: "Balerinas Chloé", precio: "S/ 360" }, { foto: "amelie.png", nombre: "Balerinas Amélie", precio: "S/ 290" }].map(p =>
          <div key={p.nombre} className="min-w-0"><img src={`/mi-tienda/${p.foto}`} alt={p.nombre} className="aspect-[4/5] w-full rounded-theme bg-sunken object-cover" />
            {!mini && <><p className="mt-2 text-body-sm">{p.nombre}</p><p className="text-body-sm font-semibold">{p.precio}</p></>}
          </div>)}
      </div>
      {!mini && <>
        <div className="flex flex-col gap-2 border-t border-line-subtle pt-4 text-caption text-fg-secondary">
          {tienda.instagram && <p>@{tienda.instagram.replace(/^@/, "")}</p>}
          {tienda.whatsapp && <p>WhatsApp: +51 {tienda.whatsapp}</p>}
          {tienda.horario && <p className="flex gap-2"><Clock aria-hidden className="size-4 shrink-0" />{tienda.horario}</p>}
        </div>
        <p className="text-center text-label text-fg-secondary">Hecho con Tiendly</p>
      </>}
    </div>
  </div>;
}
