import { Seccion } from "@/components/panel";
import { Field } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatoSoles } from "@/lib/formato";
import { entradaPrecio, leerPrecio } from "../../lib/precio";
import { descuentoForm, type Errores, type FormProducto } from "../../lib/formulario";
import { cuando, estadoOferta } from "../../lib/ofertas";
import { PrecioOferta } from "../precio-oferta";

type Campo = "precio" | "precioAntes" | "ofertaDesde" | "ofertaHasta";
type Props = { form: FormProducto; errores: Errores; hoy: string; onCambio: (k: Campo, v: string) => void };

/**
 * Precio y oferta (0034). Soles con hasta dos decimales, vacíos con un ejemplo. "Precio antes" es opcional: si es mayor, el producto
 * queda en oferta y aparecen las fechas (no suman campos a quien no las usa). Debajo, cómo lo ve el cliente (sin
 * fechas: la tienda no las muestra) y el estado de la oferta para quien vende.
 */
export function SeccionPrecio({ form, errores, hoy, onCambio }: Props) {
  const precio = leerPrecio(form.precio) || 0;
  const antes = leerPrecio(form.precioAntes) || 0;
  const pct = descuentoForm(form);
  const p = { precio, precioAntes: antes || undefined, oferta: { desde: form.ofertaDesde || undefined, hasta: form.ofertaHasta || undefined } };
  const estado = estadoOferta(p, hoy);
  const resumen =
    estado === "programada" ? `Programada: empieza ${cuando(form.ofertaDesde, hoy)}. Hasta entonces se vende a ${formatoSoles(antes)}.`
    : estado === "terminada" ? `Terminó ${cuando(form.ofertaHasta, hoy)}. Se vende a ${formatoSoles(antes)}; borra el precio antes o cambia las fechas.`
    : form.ofertaHasta ? `Activa hasta ${cuando(form.ofertaHasta, hoy)}. Cuando termine, vuelve a ${formatoSoles(antes)}.`
    : "Activa desde hoy, sin fecha de fin.";
  const precioEscrito = (k: "precio" | "precioAntes", v: string) => {
    if (entradaPrecio(v)) onCambio(k, v.replace(",", "."));
  };

  return (
    <Seccion id="sec-precio" titulo="Precio y oferta">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="campo-precio" label="Precio" prefix="S/" inputMode="decimal" placeholder="Ej.: 89" value={form.precio}
          onChange={(e) => precioEscrito("precio", e.target.value)} error={errores.precio} />
        <Field id="campo-precioAntes" label="Precio antes (opcional)" prefix="S/" inputMode="decimal" placeholder="Ej.: 119" value={form.precioAntes}
          onChange={(e) => precioEscrito("precioAntes", e.target.value)} error={errores.precioAntes}
          hint={pct ? `Tus clientes verán −${pct} % y el precio antes tachado.` : "Escríbelo para poner este producto en oferta."} />
      </div>
      {pct > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="campo-ofertaDesde" type="date" label="Empieza (opcional)" min={hoy} value={form.ofertaDesde}
              onChange={(e) => onCambio("ofertaDesde", e.target.value)} hint="Si lo dejas vacío, empieza hoy." />
            <Field id="campo-ofertaHasta" type="date" label="Termina (opcional)" min={form.ofertaDesde || hoy} value={form.ofertaHasta}
              onChange={(e) => onCambio("ofertaHasta", e.target.value)} error={errores.ofertaHasta} hint="Si lo dejas vacío, dura hasta que borres el precio antes." />
          </div>
          <div className="flex flex-col gap-2 border-t border-line-subtle pt-4">
            <p className="text-caption text-fg-secondary">Así lo verán tus clientes (las fechas solo las ves tú)</p>
            <PrecioOferta p={estado === "activa" ? p : { precio, precioAntes: antes }} hoy={hoy} tamano="ficha" />
            <p className={cn("text-body-sm", estado === "terminada" ? "text-warning" : "text-fg-secondary")}>{resumen}</p>
          </div>
        </>
      )}
    </Seccion>
  );
}
