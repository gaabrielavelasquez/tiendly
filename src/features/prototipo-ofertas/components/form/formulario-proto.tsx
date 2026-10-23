"use client";

import { ImagePlus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Chip, Field, Switch } from "@/components/ui";
import { CampoDescripcion } from "@/features/productos/components/form/campo-descripcion";
import { ejemplosFormulario, type ProductoProto } from "../../lib/datos";
import { Seccion } from "../comunes";
import { ControlPrototipo } from "../control-prototipo";
import { BarraGuardar } from "./barra-guardar";
import { SeccionOpciones } from "./seccion-opciones";
import { SeccionPrecio } from "./seccion-precio";
import { SeccionVariantes } from "./seccion-variantes";

type Ejemplo = "zapatilla" | "serum" | "vela";
const NOMBRES: Record<Ejemplo, string> = { zapatilla: "Zapatilla (Color + Talla)", serum: "Sérum (Tamaño, en oferta)", vela: "Vela nueva (sin opciones)" };
const CATEGORIAS = ["Calzado", "Skincare", "Maquillaje", "Hogar", "Cuerpo"];

/**
 * PROTOTIPO · Crear / editar producto con el pase 0031: títulos fuera de los contenedores, un contenedor por sección,
 * "Agregar opción" (0032) y precio con oferta (0034). Desktop: 2/3 contenido y 1/3 ajustes; móvil: una columna.
 */
export function FormularioProto({ hoy, inicial = "zapatilla" }: { hoy: string; inicial?: Ejemplo }) {
  const ejemplos = ejemplosFormulario(hoy);
  const [ejemplo, setEjemplo] = useState<Ejemplo>(inicial);
  const [p, setP] = useState<ProductoProto>(ejemplos[inicial]);
  const [descripcion, setDescripcion] = useState("");
  const cambiar = (c: Partial<ProductoProto>) => setP((x) => ({ ...x, ...c }));
  const elegir = (e: Ejemplo) => (setEjemplo(e), setP(ejemplos[e]));

  return (
    <form onSubmit={(e) => e.preventDefault()} noValidate className="flex flex-col gap-6 pb-28 lg:pb-0">
      <BarraGuardar titulo={ejemplo === "vela" ? "Nuevo producto" : "Editar producto"} />
      <ControlPrototipo etiqueta="Ejemplo">
        {(Object.keys(NOMBRES) as Ejemplo[]).map((e) => <Chip key={e} selected={ejemplo === e} onClick={() => elegir(e)} className="shrink-0">{NOMBRES[e]}</Chip>)}
      </ControlPrototipo>

      <div key={ejemplo} className="grid items-start gap-10 lg:grid-cols-3 lg:gap-12">
        <div className="flex flex-col gap-10 lg:col-span-2 lg:gap-12">
          <Seccion id="sec-info" titulo="Información">
            <Field id="nombre" label="Nombre" value={p.nombre} onChange={(e) => cambiar({ nombre: e.target.value })} />
            <CampoDescripcion valor={descripcion} onCambio={setDescripcion} />
          </Seccion>
          <Seccion id="sec-fotos" titulo="Fotos" descripcion="Si las fotos cambian por color, las asignas en Opciones.">
            <div className="flex gap-3">
              {p.foto && (
                <span className="relative aspect-4/5 w-24 overflow-hidden rounded-theme bg-sunken">
                  <Image src={p.foto} alt="" fill sizes="6rem" className="object-cover" />
                </span>
              )}
              <button type="button" className="flex aspect-4/5 w-24 flex-col items-center justify-center gap-1 rounded-theme border border-dashed border-line-strong text-caption text-fg-secondary hover:bg-sunken">
                <ImagePlus aria-hidden strokeWidth={1.5} className="size-5 text-icon" />
                Agregar
              </button>
            </div>
          </Seccion>
          <SeccionPrecio p={p} hoy={hoy} onCambio={cambiar} />
          <SeccionOpciones opciones={p.opciones} onCambio={(opciones) => cambiar({ opciones })} otrosConTabla={["Botín Saya", "Zapatilla Sur"]} />
          <SeccionVariantes opciones={p.opciones} stock={p.stock} onStock={(k, n) => cambiar({ stock: { ...p.stock, [k]: n } })} />
        </div>
        <aside className="flex flex-col gap-10 lg:sticky lg:top-24 lg:gap-12">
          <Seccion id="sec-estado" titulo="Estado">
            <Switch checked={p.estado === "activo"} onChange={(v) => cambiar({ estado: v ? "activo" : "pausado" })}>{p.estado === "activo" ? "Activo" : "Pausado"}</Switch>
            <p className="-mt-3 text-caption text-fg-secondary">{p.estado === "activo" ? "Tus clientes lo ven y lo pueden comprar." : "No se ve en tu tienda."}</p>
          </Seccion>
          <Seccion id="sec-categoria" titulo="Categoría">
            <div className="flex flex-wrap gap-2">
              {CATEGORIAS.map((c) => <Chip key={c} selected={p.categoria === c} onClick={() => cambiar({ categoria: c })}>{c}</Chip>)}
              <Chip className="border-dashed text-fg-secondary">+ Nueva</Chip>
            </div>
          </Seccion>
        </aside>
      </div>
    </form>
  );
}
