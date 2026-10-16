import type { InicioData } from "../types";
import { fechaCorta, fechaLarga, hora } from "../lib/format";
import { compararSemana, pendientes, resumenHoy, totalSemana } from "../lib/reglas";
import { AccionesRapidas } from "./acciones-rapidas";
import { AtenderCard } from "./atender-card";
import { Encabezado } from "./encabezado";
import { HoyCard } from "./hoy-card";
import { SemanaCard } from "./semana-card";

/**
 * I1 / ID1 · Inicio con actividad. Desktop: acciones rápidas en la cabecera, Hoy y Para atender lado a
 * lado, Esta semana a todo el ancho. Móvil: las acciones van al final, como en Figma.
 */
export function VistaActividad({ datos }: { datos: InicioData }) {
  const hoy = resumenHoy(datos);
  const semana = totalSemana(datos);

  return (
    <>
      <Encabezado
        titulo={`Hola, ${datos.tienda.duena}`}
        subtitulo={fechaLarga(datos.ahora)}
        duena={datos.tienda.duena}
        accion={<AccionesRapidas slug={datos.tienda.slug} />}
      />
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
      <AccionesRapidas slug={datos.tienda.slug} className="lg:hidden" />
    </>
  );
}
