"use client";

import { useEffect, useRef, useState } from "react";
import { Aviso, CONTENEDOR, EncabezadoSeccion, PanelHeader, Volver, type TextoAviso } from "@/components/panel";
import type { ConfigPagos } from "../../types";
import { guardarPagos } from "../../lib/acciones";
import { metodosVisibles, quedaAlgunMetodo } from "../../lib/reglas";
import { VistaCliente } from "../estado-metodo";
import { TarjetaCobros } from "./tarjeta-cobros";
import { TarjetaWhatsApp } from "./tarjeta-whatsapp";

function Grupo({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  const id = `pagos-${titulo.replaceAll(" ", "-").toLowerCase()}`;
  return <section aria-labelledby={id} className="flex min-w-0 flex-col gap-3"><EncabezadoSeccion id={id} titulo={titulo} /><div className={`${CONTENEDOR} min-w-0 divide-y divide-line-subtle`}>{children}</div></section>;
}

/**
 * Configuración → Métodos de pago (Figma, módulo 2): activos arriba, lo que se puede activar o está
 * apagado abajo, y la vista previa del cliente. Cada cambio se guarda al momento y llega al checkout.
 */
export function VistaPagos({ inicial }: { inicial: ConfigPagos }) {
  const [pagos, setPagos] = useState(inicial);
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState<TextoAviso>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const avisar = (a: TextoAviso) => (setAviso(a), window.clearTimeout(timer.current), (timer.current = window.setTimeout(() => setAviso(null), 4000)));

  async function cambiar(sig: ConfigPagos) {
    if (guardando) return;
    const antes = pagos;
    setGuardando(true); setPagos(sig);
    try {
      const r = await guardarPagos(sig);
      if ("error" in r) { setPagos(antes); avisar({ texto: r.error, tono: "error" }); }
      else avisar({ texto: "Cambios guardados. Tu tienda ya muestra los métodos nuevos.", tono: "ok" });
    } catch { setPagos(antes); avisar({ texto: "No pudimos guardar el método de pago. Revisa tu conexión e inténtalo de nuevo.", tono: "error" }); }
    finally { setGuardando(false); }
  }

  const cobrosActivos = pagos.cobros.estado === "activo" && (pagos.cobros.tarjeta || pagos.cobros.yape);
  const unicoWhatsApp = !cobrosActivos;
  const whatsapp = <TarjetaWhatsApp key="w" whatsapp={pagos.whatsapp} unico={unicoWhatsApp} onCambio={(w) => cambiar({ ...pagos, whatsapp: w })} />;
  const cobros = (
    <TarjetaCobros
      key="c"
      cobros={pagos.cobros}
      onCambio={(c) => cambiar({ ...pagos, cobros: c })}
      esUltimo={(c) => !quedaAlgunMetodo({ ...pagos, cobros: c })}
      onUltimo={() => avisar({ texto: "Es tu único método de cobro, así que no se puede apagar. Prende Pedidos por WhatsApp primero.", tono: "error" })}
    />
  );
  const enRevision = pagos.cobros.estado === "en-revision"; // Figma A7: va en «En proceso», con WhatsApp activo arriba
  const activos = [pagos.whatsapp.activo && whatsapp, cobrosActivos && cobros].filter(Boolean);
  const resto = [!pagos.whatsapp.activo && whatsapp, !cobrosActivos && !enRevision && cobros].filter(Boolean);
  const visibles = metodosVisibles(pagos);

  return (
    <div className="flex min-w-0 flex-col gap-10 lg:gap-12 [&_h1]:font-display-light">
      <div className="flex flex-col gap-2">
        <Volver href="/panel/configuracion">Configuración</Volver>
        <PanelHeader titulo="Métodos de pago" subtitulo="Elige cómo te pagan tus clientes. En tu tienda solo se ve lo que actives." />
      </div>
      <div className="grid min-w-0 items-start gap-10 lg:grid-cols-3 lg:gap-12">
        <fieldset disabled={guardando} aria-busy={guardando || undefined} className="flex min-w-0 flex-col gap-10 lg:col-span-2 lg:gap-12">
          <legend className="sr-only">Métodos de pago</legend>
          <Grupo titulo="Activos">{activos.length ? activos : <p className="p-5 text-body-sm text-fg-secondary">Activa un método para que tus clientes puedan pagar.</p>}</Grupo>
          {enRevision && <Grupo titulo="En proceso">{cobros}</Grupo>}
          {resto.length > 0 && <Grupo titulo={pagos.cobros.estado === "sin-activar" ? "Puedes activar" : "Apagados"}>{resto}</Grupo>}
          {guardando && <p role="status" className="text-body-sm text-fg-secondary">Guardando el método de pago…</p>}
        </fieldset>
        <VistaCliente titulo="Al pagar, tu cliente verá">
          {(
            [
              ["Pagar ahora", visibles.ahora],
              ["Pagar después", visibles.despues],
            ] as const
          ).map(([t, lista]) =>
            lista.length ? (
              <div key={t} className="flex flex-wrap items-center gap-2">
                <span className="w-28 text-body-sm text-fg-secondary">{t}</span>
                {/* Muestra (no es un control): el mismo aspecto del chip, sin botón. */}
                {lista.map((m) => (
                  <span key={m} className="inline-flex h-7 items-center rounded-chip border border-line bg-surface px-3 text-body-sm font-medium text-fg">{m}</span>
                ))}
              </div>
            ) : null,
          )}
          {!visibles.ahora.length && !visibles.despues.length && <p className="text-body-sm text-fg-secondary">Activa un método de pago para mostrar aquí las opciones de tu cliente.</p>}
          {enRevision && <p className="text-caption text-fg-secondary">Tarjeta y Yape aparecerán cuando se aprueben tus cobros automáticos.</p>}
        </VistaCliente>
      </div>
      <Aviso aviso={aviso} />
    </div>
  );
}
