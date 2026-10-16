import { Field } from "@/components/ui";
import { descuento, type Errores, type FormProducto } from "../../lib/formulario";
import { Tarjeta } from "./tarjeta";

type PreciosProps = { form: FormProducto; errores: Errores; onCambio: (k: "precio" | "precioAntes", v: string) => void };

/** Precio y precio de comparación (opcional). Si hay rebaja, se adelanta cómo la verá el cliente. */
export function TarjetaPrecios({ form, errores, onCambio }: PreciosProps) {
  const pct = descuento(form);
  const limpiar = (v: string) => v.replace(/[^\d.,]/g, "");
  return (
    <Tarjeta titulo="Precio">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="campo-precio"
          label="Precio"
          prefix="S/"
          inputMode="decimal"
          placeholder="0.00"
          value={form.precio}
          onChange={(e) => onCambio("precio", limpiar(e.target.value))}
          error={errores.precio}
        />
        <Field
          id="campo-precioAntes"
          label="Precio de comparación (opcional)"
          prefix="S/"
          inputMode="decimal"
          placeholder="0.00"
          value={form.precioAntes}
          onChange={(e) => onCambio("precioAntes", limpiar(e.target.value))}
          hint={pct ? `Tus clientes verán −${pct} % y el precio anterior tachado.` : "El precio antes de la rebaja. Se muestra tachado."}
          error={errores.precioAntes}
        />
      </div>
    </Tarjeta>
  );
}
