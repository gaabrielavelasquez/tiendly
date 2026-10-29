import { Button, Field } from "@/components/ui";
import type { Compra } from "../../hooks/use-compra";
import { formatoCelular } from "../../lib/reglas";
import { Paso } from "./paso";

/** 1 · Tus datos (Figma K0 y K1): nombre y apellido, y celular de 9 dígitos. */
export function PasoDatos({ c }: { c: Compra }) {
  const estado = c.paso === "datos" ? "abierto" : c.hechos.datos ? "hecho" : "pendiente";
  return (
    <Paso numero={1} titulo="Tus datos" estado={estado} resumen={`${c.datos.nombre.trim()} · ${formatoCelular(c.datos.celular)}`} onEditar={() => c.setPaso("datos")}>
      <form noValidate onSubmit={(e) => (e.preventDefault(), c.continuarDatos())} className="flex flex-col gap-4">
        <Field
          label="Nombre y apellido"
          placeholder="Ej.: Andrea Quispe"
          autoComplete="name"
          value={c.datos.nombre}
          onChange={(e) => c.setDatos({ ...c.datos, nombre: e.target.value })}
          error={c.erroresDatos.nombre}
        />
        <Field
          label="Celular"
          placeholder="Ej.: 987 654 321"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={formatoCelular(c.datos.celular)}
          onChange={(e) => c.setDatos({ ...c.datos, celular: e.target.value })}
          hint="La tienda te escribe aquí sobre tu pedido."
          error={c.erroresDatos.celular}
        />
        <Button type="submit" variant="secondary" block className="h-12">
          Continuar con la entrega
        </Button>
      </form>
    </Paso>
  );
}
