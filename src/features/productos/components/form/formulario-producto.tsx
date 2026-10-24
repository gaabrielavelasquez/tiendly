"use client";

import { CircleCheck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/use-reduced-motion";
import Link from "next/link";
import { useState } from "react";
import { Seccion } from "@/components/panel";
import { Field } from "@/components/ui";
import { plural } from "@/lib/formato";
import { motionTokens } from "@/styles/tokens";
import { useFormularioProducto } from "../../hooks/use-formulario-producto";
import type { FormProducto } from "../../lib/formulario";
import type { TablaDeOtro } from "../../lib/tabla-tallas";
import { tipoDeNombre } from "../../lib/variantes";
import { TablaTallasCampos } from "./tabla-tallas-campos";
import type { Categoria } from "../../types";
import { BarraAcciones } from "./barra-acciones";
import { CampoDescripcion } from "./campo-descripcion";
import { SeccionFotos } from "./seccion-fotos";
import { SeccionCategoria, SeccionEstado } from "./seccion-laterales";
import { SeccionOpciones } from "./seccion-opciones";
import { SeccionPrecio } from "./seccion-precio";
import { SeccionStock } from "./seccion-stock";

/** `hoy`: día de Lima (para la oferta); `categorias`: las que ya usa la tienda; `tablas`: las tablas de tallas de sus otros productos. */
type FormularioProps = { titulo: string; inicial: FormProducto; id?: string; urlTienda?: string | null; hoy: string; categorias: Categoria[]; tablas: TablaDeOtro[] };

/**
 * Crear / editar producto con el pase 0031: títulos de sección fuera de los contenedores, un contenedor por sección y
 * 40 · 48 px entre secciones. Desktop: 2/3 contenido y 1/3 ajustes (Estado y Categoría); móvil: una columna, con
 * "Guardar producto" fijo abajo (la barra de pestañas no se muestra aquí). Opciones genéricas (0032) y oferta (0034).
 */
export function FormularioProducto({ titulo, inicial, id, urlTienda, hoy, categorias, tablas }: FormularioProps) {
  const f = useFormularioProducto(inicial, id, urlTienda);
  const reduce = useReducedMotion();
  const [resumen, setResumen] = useState("");

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const n = await f.guardar();
    setResumen(n ? `Revisa ${plural(n, "campo", "campos")} marcados en rojo.` : "");
  }

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-6 pb-24 lg:pb-0">
      <BarraAcciones titulo={titulo} sinGuardar={f.sinGuardar} guardando={f.guardando} urlTienda={f.form.estado === "activo" ? f.urlTienda : null} notaTienda={f.form.estado === "pausado" ? "Activa y guarda el producto para verlo." : "Guarda el producto para verlo."} />
      {resumen && Object.keys(f.errores).length > 0 && (
        <p role="alert" className="rounded-theme border border-error-border bg-error-surface px-4 py-3 text-body-sm text-error">
          {resumen}
        </p>
      )}
      {f.fallo && (
        <p role="alert" className="rounded-theme border border-error-border bg-error-surface px-4 py-3 text-body-sm text-error">
          {f.fallo}
        </p>
      )}

      <div className="grid min-w-0 grid-cols-1 items-start gap-10 lg:grid-cols-3 lg:gap-12">
        <div className="flex min-w-0 flex-col gap-10 lg:col-span-2 lg:gap-12">
          <Seccion id="sec-info" titulo="Información">
            <Field id="campo-nombre" label="Nombre" placeholder="Ej.: Lámpara lunar impresa en 3D" value={f.form.nombre}
              onChange={(e) => f.set("nombre", e.target.value)} error={f.errores.nombre} />
            <CampoDescripcion valor={f.form.descripcion} onCambio={(v) => f.set("descripcion", v)} />
          </Seccion>
          <SeccionFotos imagenes={f.form.imagenes} onAgregar={f.agregarImagenes} onQuitar={f.quitarImagen} />
          <SeccionPrecio form={f.form} errores={f.errores} hoy={hoy} onCambio={(k, v) => f.set(k, v)} />
          <SeccionOpciones form={f.form} error={f.errores.opciones} errorTabla={f.errores.tabla} imagenes={f.form.imagenes}
            onOpciones={f.setOpciones} onOpcionFotos={f.setOpcionFotos} onFotoValor={f.alternarFotoValor} tablas={tablas} onTabla={f.setTabla} />
          {!f.form.opciones.some((o) => tipoDeNombre(o.nombre) === "talla") && (
            <Seccion id="sec-medidas" titulo="Medidas">
              <TablaTallasCampos sinTallas tallas={[]} tabla={f.form.tabla} tablas={tablas} error={f.errores.tabla} onCambio={f.setTabla} />
            </Seccion>
          )}
          <SeccionStock form={f.form} onStock={f.setStock} />
        </div>
        <aside className="flex min-w-0 flex-col gap-10 lg:sticky lg:top-24 lg:gap-12">
          <SeccionEstado estado={f.form.estado} onCambio={(e) => f.set("estado", e)} />
          <SeccionCategoria elegidas={f.form.categorias} deLaTienda={categorias} onAlternar={f.alternarCategoria} onAgregar={f.agregarCategoria} />
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
              <span className="flex-1">
                {f.guardado.pausado
                  ? `Guardamos ${f.form.nombre || "el producto"} en pausa: le falta ${f.guardado.pausado}.`
                  : `${f.form.nombre} se guardó${f.form.estado === "activo" ? " y ya se ve en tu tienda" : ""}.`}
              </span>
              <Link href="/panel/productos" className="h-9 shrink-0 rounded-theme px-3 py-2 font-semibold hover:bg-fg-inverse/10">
                Ver productos
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
