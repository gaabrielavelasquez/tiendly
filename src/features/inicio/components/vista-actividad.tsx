import type { InicioData } from "../types";
import { fechaCorta, fechaLarga, hora } from "../lib/format";
import { compararSemana, pendientes, resumenHoy, totalSemana } from "../lib/reglas";
import { AccionesRapidas } from "./acciones-rapidas";
import { CabeceraInicio } from "./cabecera-inicio";
import { HoyCard } from "./hoy-card";
import { ParaAtender } from "./para-atender";
import { SemanaCard } from "./semana-card";

/**
 * Con el nombre de la dueña (Heather: Cecilia; o el nombre de pila de Google): "Hola, Cecilia.".
 * Sin nombre (el onboarding no lo pide, decisión 0013): "¡Hola!". Sin emoji desde la ronda 4 de 0031.
 */
export const saludo = (duena?: string) => (duena ? `Hola, ${duena}.` : "¡Hola!");

/** Segundo tono del título: cuántos pendientes hay (filas de Para atender hoy). */
export const resumenPendientes = (n: number) => (n === 0 ? "Todo al día por hoy." : `Tienes ${n} ${n === 1 ? "cosa" : "cosas"} para hoy.`);

/**
 * I1 / ID1 · Inicio con actividad. Orden de la decisión 0012 con el pase 0031.
 * Móvil: saludo, Hoy, Para atender, Esta semana y acciones.
 * Desktop: Hoy (a la medida de su contenido) y Para atender lado a lado, Esta semana a todo el ancho; acciones en la cabecera.
 */
export function VistaActividad({ datos }: { datos: InicioData }) {
  const hoy = resumenHoy(datos);
  const semana = totalSemana(datos);
  const filas = pendientes(datos);

  return (
    <>
      <CabeceraInicio
        titulo={
          <>
            {/* Dos líneas a propósito en todos los tamaños (ronda 5). */}
            <span className="block">{saludo(datos.tienda.duena)}</span>
            <span className="block text-fg-secondary">{resumenPendientes(filas.length)}</span>
          </>
        }
        subtitulo={
          <>
            {/* En móvil la tienda ya está en la barra superior: debajo del saludo, solo la fecha. */}
            <span className="hidden lg:inline">
              <span className="font-medium text-fg">{datos.tienda.nombre}</span> ·{" "}
            </span>
            {fechaLarga(datos.ahora)}
          </>
        }
        accion={<AccionesRapidas link={datos.tienda.link} />}
      />
      <div className="grid gap-10 lg:grid-cols-5 lg:items-start lg:gap-x-8 lg:gap-y-12">
        <HoyCard className="lg:col-span-2" ventas={hoy.ventas} pedidos={hoy.pedidos} corte={hora(datos.ahora)} />
        <ParaAtender className="lg:col-span-3" filas={filas} />
        <SemanaCard
          className="lg:col-span-5"
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
