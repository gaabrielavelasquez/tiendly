import type { InicioData } from "../types";
import { Encabezado } from "./encabezado";
import { LinkTiendaCard } from "./link-tienda-card";
import { PasosCard } from "./pasos-card";

/** I2 / ID2 · Tienda nueva: es el estado vacío de Inicio. Desktop: pasos a la izquierda, link a la derecha. */
export function VistaNueva({ datos }: { datos: InicioData }) {
  return (
    <>
      <Encabezado titulo="Te damos la bienvenida" subtitulo="Tu tienda ya existe. Sigue estos pasos para recibir tu primer pedido." />
      <div className="grid items-start gap-6 lg:grid-cols-5">
        <PasosCard className="lg:col-span-3" pasos={datos.pasos} />
        <LinkTiendaCard className="lg:col-span-2" slug={datos.tienda.slug} />
      </div>
    </>
  );
}
