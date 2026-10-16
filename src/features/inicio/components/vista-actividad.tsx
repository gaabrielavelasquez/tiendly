import type { InicioData } from "../types";
import { fechaCorta, fechaLarga, hora } from "../lib/format";
import { compararSemana, pendientes, resumenHoy, totalSemana } from "../lib/reglas";
import { AtenderCard } from "./atender-card";
import { CompartirWhatsApp } from "./compartir-whatsapp";
import { Encabezado } from "./encabezado";
import { HoyCard } from "./hoy-card";
import { SemanaCard } from "./semana-card";

/** I1 / ID1 · Inicio con actividad. Desktop: Hoy y Para atender lado a lado; Esta semana a todo el ancho. */
export function VistaActividad({ datos }: { datos: InicioData }) {
  const hoy = resumenHoy(datos);
  const semana = totalSemana(datos);
  const compartir = <CompartirWhatsApp slug={datos.tienda.slug} />;

  return (
    <>
      <Encabezado titulo={`Hola, ${datos.tienda.duena}`} subtitulo={fechaLarga(datos.ahora)} accion={compartir} />
      <div className="grid gap-6 lg:grid-cols-5">
        <HoyCard className="lg:col-span-2" ventas={hoy.ventas} pedidos={hoy.pedidos} corte={hora(datos.ahora)} />
        <AtenderCard className="lg:col-span-3" filas={pendientes(datos)} />
      </div>
      <SemanaCard
        total={semana.monto}
        pedidos={semana.pedidos}
        comparacion={compararSemana(semana.monto, datos.semanaPasadaTotal)}
        dias={datos.semana}
        hoy={fechaCorta(datos.ahora)}
      />
      <div className="lg:hidden">
        <CompartirWhatsApp slug={datos.tienda.slug} className="w-full" />
      </div>
    </>
  );
}
