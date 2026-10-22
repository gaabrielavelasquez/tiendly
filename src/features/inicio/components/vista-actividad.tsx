import { PanelHeader } from "@/components/panel";
import type { InicioData } from "../types";
import { fechaCorta, fechaLarga, hora } from "../lib/format";
import { compararSemana, pendientes, resumenHoy, totalSemana } from "../lib/reglas";
import { AccionesRapidas } from "./acciones-rapidas";
import { AtenderCard } from "./atender-card";
import { HoyCard } from "./hoy-card";
import { SemanaCard } from "./semana-card";

/**
 * I1 / ID1 · Inicio con actividad. Desktop: acciones rápidas en la cabecera, Hoy y Para atender lado a
 * lado, Esta semana a todo el ancho. Móvil: las acciones van al final, como en Figma.
 */
/** Sin nombre de la dueña (el onboarding no lo pide, decisión 0013): "¡Hola! 👋". Con Google: su nombre de pila. */
const saludo = (duena?: string) => (duena ? `¡Hola, ${duena}! 👋` : "¡Hola! 👋");

export function VistaActividad({ datos }: { datos: InicioData }) {
  const hoy = resumenHoy(datos);
  const semana = totalSemana(datos);

  return (
    <>
      <PanelHeader
        titulo={saludo(datos.tienda.duena)}
        subtitulo={`${datos.tienda.nombre} · ${fechaLarga(datos.ahora)}`}
        accion={<AccionesRapidas link={datos.tienda.link} />}
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
      <AccionesRapidas link={datos.tienda.link} className="lg:hidden" />
    </>
  );
}
