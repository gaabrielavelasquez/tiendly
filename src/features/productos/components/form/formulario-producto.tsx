"use client";

import { CircleCheck } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { plural } from "@/lib/formato";
import { motionTokens } from "@/styles/tokens";
import { useFormularioProducto } from "../../hooks/use-formulario-producto";
import type { FormProducto } from "../../lib/formulario";
import { BarraAcciones } from "./barra-acciones";
import { EditorDescripcion } from "./editor-descripcion";
import { TarjetaMedia } from "./tarjeta-media";
import { TarjetaPrecios } from "./tarjeta-precios";
import { TarjetaVariantes } from "./tarjeta-variantes";
import { Tarjeta } from "./tarjeta";
import { TarjetaEstado, TarjetaOrganizacion } from "./tarjetas-laterales";
import { Field } from "@/components/ui";

type FormularioProps = { titulo: string; inicial: FormProducto };

/**
 * Crear / editar producto en dos columnas (2/3 contenido, 1/3 ajustes) para no cansar con un
 * formulario larguísimo. En móvil, una columna con los ajustes primero.
 */
export function FormularioProducto({ titulo, inicial }: FormularioProps) {
  const f = useFormularioProducto(inicial);
  const reduce = useReducedMotion();
  const [resumen, setResumen] = useState("");

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const n = await f.guardar();
    setResumen(n ? `Revisa ${plural(n, "campo", "campos")} marcados en rojo.` : "");
  }

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-6 pb-24 lg:pb-0">
      <BarraAcciones titulo={titulo} sinGuardar={f.sinGuardar} guardando={f.guardando} />
      {resumen && Object.keys(f.errores).length > 0 && (
        <p role="alert" className="rounded-sm border border-error-border bg-error-surface px-4 py-3 text-body-sm text-error">
          {resumen}
        </p>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="order-2 flex flex-col gap-6 lg:order-1 lg:col-span-2">
          <Tarjeta titulo="Información general">
            <Field
              id="campo-nombre"
              label="Nombre"
              placeholder="Ej. Vestido Chloé"
              value={f.form.nombre}
              onChange={(e) => f.set("nombre", e.target.value)}
              error={f.errores.nombre}
            />
            <EditorDescripcion valor={f.form.descripcion} onCambio={(v) => f.set("descripcion", v)} />
          </Tarjeta>
          <TarjetaMedia imagenes={f.form.imagenes} onAgregar={f.agregarImagenes} onQuitar={f.quitarImagen} />
          <TarjetaPrecios form={f.form} errores={f.errores} onCambio={(k, v) => f.set(k, v)} />
          <TarjetaVariantes form={f.form} errores={f.errores} onColor={f.alternarColor} onTalla={f.alternarTalla} onVariante={f.setVariante} />
        </div>
        <aside className="order-1 flex flex-col gap-6 lg:sticky lg:top-24 lg:order-2">
          <TarjetaEstado estado={f.form.estado} onCambio={(e) => f.set("estado", e)} />
          <TarjetaOrganizacion categorias={f.form.categorias} onAlternar={f.alternarCategoria} />
        </aside>
      </div>

      <div role="status" className="pointer-events-none fixed inset-x-4 bottom-24 z-30 flex justify-center lg:inset-x-auto lg:right-8 lg:bottom-8">
        <AnimatePresence>
          {f.guardado && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: 12 }}
              transition={{ duration: motionTokens.durationFast, ease: [...motionTokens.easing] as [number, number, number, number] }}
              className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-card bg-inverse py-2 pr-2 pl-4 text-body-sm text-fg-inverse shadow-overlay"
            >
              <CircleCheck aria-hidden strokeWidth={1.8} className="size-4 shrink-0" />
              <span className="flex-1 truncate">{f.form.nombre} se guardó.</span>
              <Link href="/panel/productos" className="h-9 shrink-0 rounded-sm px-3 py-2 font-semibold hover:bg-fg-inverse/10">
                Ver productos
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
