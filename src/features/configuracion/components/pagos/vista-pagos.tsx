"use client";

import { useRef, useState } from "react";
import { Aviso, PanelHeader, Volver, type TextoAviso } from "@/components/panel";
import type { ConfigPagos } from "../../types";
import { guardarPagos } from "../../lib/acciones";
import { metodosVisibles, quedaAlgunMetodo } from "../../lib/reglas";
import { VistaCliente } from "../estado-metodo";
import { TarjetaCobros } from "./tarjeta-cobros";
import { TarjetaWhatsApp } from "./tarjeta-whatsapp";

const grupo = "text-label font-semibold tracking-widest text-fg-secondary uppercase";

/**
 * Configuración → Métodos de pago (Figma, módulo 2): activos arriba, lo que se puede activar o está
 * apagado abajo, y la vista previa del cliente. Cada cambio se guarda al momento y llega al checkout.
 */
export function VistaPagos({ inicial }: { inicial: ConfigPagos }) {
  const [pagos, setPagos] = useState(inicial);
  const [aviso, setAviso] = useState<TextoAviso>(null);
  const timer = useRef<number | undefined>(undefined);
  const avisar = (a: TextoAviso) => (setAviso(a), window.clearTimeout(timer.current), (timer.current = window.setTimeout(() => setAviso(null), 4000)));

  async function cambiar(sig: ConfigPagos) {
    const antes = pagos;
    setPagos(sig);
    const r = await guardarPagos(sig);
    if ("error" in r) return setPagos(antes), avisar({ texto: r.error, tono: "error" });
    avisar({ texto: "Cambios guardados. Tu tienda ya muestra los métodos nuevos.", tono: "ok" });
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
  const activos = [pagos.whatsapp.activo && whatsapp, cobrosActivos && cobros].filter(Boolean);
  const resto = [!pagos.whatsapp.activo && whatsapp, !cobrosActivos && cobros].filter(Boolean);
  const visibles = metodosVisibles(pagos);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Volver href="/panel/configuracion">Configuración</Volver>
        <PanelHeader titulo="Métodos de pago" subtitulo="Elige cómo te pagan tus clientes. En tu tienda solo se ve lo que actives." />
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <h2 className={grupo}>Activos</h2>
          {activos}
          {resto.length > 0 && <h2 className={`${grupo} pt-2`}>{pagos.cobros.estado === "sin-activar" ? "Puedes activar" : "Apagados"}</h2>}
          {resto}
        </div>
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
        </VistaCliente>
      </div>
      <Aviso aviso={aviso} />
    </div>
  );
}
