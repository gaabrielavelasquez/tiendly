import type { InicioData } from "../types";
import { fechaCorta, fechaLarga, hora } from "../lib/format";
import { compararSemana, pendientes, resumenHoy, totalSemana } from "../lib/reglas";
import { AccionesRapidas } from "./acciones-rapidas";
import { CabeceraInicio } from "./cabecera-inicio";
import { HoyCard } from "./hoy-card";
import { ParaAtender } from "./para-atender";
import { SemanaCard } from "./semana-card";

/**
 * Con el nombre de la dueña (Heather: Cecilia; o el nombre de pila de Google): "Hola, Cecilia 👋".
 * Sin nombre (el onboarding no lo pide, decisión 0013): "¡Hola! 👋" y la tienda debajo (decisión 0031).
 */
export const saludo = (duena?: string) => (duena ? `Hola, ${duena} 👋` : "¡Hola! 👋");

/**
 * I1 / ID1 · Inicio con actividad (decisión 0031). Móvil: saludo, Hoy, Para atender, Esta semana y acciones.
 * Desktop: Hoy y Esta semana lado a lado, y debajo la fila de tarjetas de Para atender; acciones en la cabecera.
 */
export function VistaActividad({ datos }: { datos: InicioData }) {
  const hoy = resumenHoy(datos);
  const semana = totalSemana(datos);

  return (
    <>
      <CabeceraInicio
        titulo={saludo(datos.tienda.duena)}
        subtitulo={
          <>
            <span className="font-medium text-fg">{datos.tienda.nombre}</span> · {fechaLarga(datos.ahora)}
          </>
        }
        accion={<AccionesRapidas link={datos.tienda.link} />}
      />
      <div className="grid gap-10 lg:grid-cols-5 lg:gap-x-8 lg:gap-y-12">
        <HoyCard className="lg:col-span-2 lg:row-start-1" ventas={hoy.ventas} pedidos={hoy.pedidos} corte={hora(datos.ahora)} />
        <ParaAtender className="lg:col-span-5 lg:row-start-2" filas={pendientes(datos)} />
        <SemanaCard
          className="lg:col-span-3 lg:row-start-1"
          total={semana.monto}
          pedidos={semana.pedidos}
          comparacion={compararSemana(semana.monto, datos.semanaPasadaTotal)}
          dias={datos.semana}
          hoy={fechaCorta(datos.ahora)}
        />
      </div>
      <AccionesRapidas link={datos.tienda.link} className="lg:hidden" />
    </>
  );
}
