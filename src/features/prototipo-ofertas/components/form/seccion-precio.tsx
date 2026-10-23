"use client";

import { Field } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatoSoles } from "@/lib/formato";
import { cuando, descuento, estadoOferta } from "../../lib/oferta";
import type { ProductoProto } from "../../lib/datos";
import { PrecioOferta, Seccion } from "../comunes";

type Props = { p: ProductoProto; hoy: string; onCambio: (cambio: Partial<ProductoProto>) => void };

/** Soles enteros (ronda 2): sin decimales, como se muestran los precios en toda la app. */
const numero = (s: string) => {
  const d = s.replace(/\D/g, "");
  return d === "" ? undefined : Number(d);
};

/**
 * Precio y oferta (0034). "Precio antes" es opcional: si es mayor, el producto queda en oferta. Las fechas solo
 * aparecen cuando hay oferta (no suman campos a quien no la usa). Debajo, cómo lo verá el cliente.
 */
export function SeccionPrecio({ p, hoy, onCambio }: Props) {
  const hayOferta = !!p.precioAntes && p.precioAntes > p.precio;
  const antesInvalido = p.precioAntes !== undefined && p.precioAntes <= p.precio;
  const estado = estadoOferta(p, hoy);
  const resumen =
    estado === "programada" ? `Programada: empieza ${cuando(p.oferta!.desde!, hoy)}. Hasta entonces se vende a ${formatoSoles(p.precioAntes!)}.`
    : estado === "terminada" ? `Terminó. Se vende a ${formatoSoles(p.precioAntes!)}; puedes quitar el precio antes o cambiar las fechas.`
    : p.oferta?.hasta ? `Activa hasta ${cuando(p.oferta.hasta, hoy)}. Cuando termine, vuelve a ${formatoSoles(p.precioAntes!)}.`
    : "Activa desde hoy, sin fecha de fin.";

  return (
    <Seccion id="sec-precio" titulo="Precio y oferta">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="precio" label="Precio" prefix="S/" inputMode="numeric" placeholder="Ej.: 89" value={p.precio ? String(p.precio) : ""} onChange={(e) => onCambio({ precio: numero(e.target.value) ?? 0 })} />
        <Field
          id="precio-antes"
          label="Precio antes (opcional)"
          prefix="S/"
          inputMode="numeric"
          placeholder="Ej.: 119"
          value={p.precioAntes === undefined ? "" : String(p.precioAntes)}
          onChange={(e) => onCambio({ precioAntes: numero(e.target.value) })}
          error={antesInvalido ? "Tiene que ser mayor que el precio, para que se vea como oferta." : undefined}
          hint={hayOferta ? `Tus clientes verán −${descuento(p.precio, p.precioAntes)} % y el precio antes tachado.` : "Escríbelo para poner este producto en oferta."}
        />
      </div>
      {hayOferta && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="oferta-desde" type="date" label="Empieza (opcional)" value={p.oferta?.desde ?? ""} min={hoy}
              onChange={(e) => onCambio({ oferta: { ...p.oferta, desde: e.target.value || undefined } })} hint="Si lo dejas vacío, empieza hoy." />
            <Field id="oferta-hasta" type="date" label="Termina (opcional)" value={p.oferta?.hasta ?? ""} min={p.oferta?.desde ?? hoy}
              onChange={(e) => onCambio({ oferta: { ...p.oferta, hasta: e.target.value || undefined } })} hint="Si lo dejas vacío, dura hasta que borres el precio antes." />
          </div>
          <div className="flex flex-col gap-2 border-t border-line-subtle pt-4">
            <p className="text-caption text-fg-secondary">Así lo verán tus clientes (las fechas solo las ves tú)</p>
            <PrecioOferta p={p} hoy={hoy} tamano="ficha" />
            <p className={cn("text-body-sm", estado === "terminada" ? "text-warning" : "text-fg-secondary")}>{resumen}</p>
          </div>
        </>
      )}
    </Seccion>
  );
}
