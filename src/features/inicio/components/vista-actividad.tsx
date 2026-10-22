import type { InicioData } from "../types";
import { fechaCorta, fechaLarga, hora } from "../lib/format";
import { compararSemana, pendientes, resumenHoy, totalSemana } from "../lib/reglas";
import { AccionesRapidas } from "./acciones-rapidas";
import { CabeceraInicio } from "./cabecera-inicio";
import { HoyCard } from "./hoy-card";
import { ParaAtender } from "./para-atender";
import { SemanaCard } from "./semana-card";

/**
 * Con el nombre de la dueña (Heather: Cecilia; o el nombre de pila de Google): "Hola, Cecilia".
 * Sin nombre (el onboarding no lo pide, decisión 0013): "¡Hola!" y la tienda debajo (decisión 0031; en móvil la tienda
 * ya va en la barra superior). Sin emoji desde la ronda 4.
 */
export const saludo = (duena?: string) => (duena ? `Hola, ${duena}` : "¡Hola!");

/**
 * I1 / ID1 · Inicio con actividad. Orden de la decisión 0012 con el pase 0031.
 * Móvil: saludo, Hoy, Para atender, Esta semana y acciones.
 * Desktop: Hoy (a la medida de su contenido) y Para atender lado a lado, Esta semana a todo el ancho; acciones en la cabecera.
 */
/** `grano`: variante de la tarjeta Hoy con textura sutil (ronda 4, se prueba con ?hoy=grano). */
export function VistaActividad({ datos, grano = false }: { datos: InicioData; grano?: boolean }) {
  const hoy = resumenHoy(datos);
  const semana = totalSemana(datos);

  return (
    <>
      <CabeceraInicio
        titulo={saludo(datos.tienda.duena)}
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
        <HoyCard className="lg:col-span-2" grano={grano} ventas={hoy.ventas} pedidos={hoy.pedidos} corte={hora(datos.ahora)} />
        <ParaAtender className="lg:col-span-3" filas={pendientes(datos)} />
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
