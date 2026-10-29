import { CircleAlert, CreditCard, MessageCircle, QrCode } from "lucide-react";
import { Opcion } from "@/components/ui";
import type { Compra } from "../../hooks/use-compra";
import type { ReglasCompra } from "../../types";
import { FormTarjeta } from "./form-tarjeta";
import { FormYape } from "./form-yape";
import { Paso } from "./paso";

const grupo = "pb-2 text-body-sm font-medium text-fg-secondary";
/** "Tarjeta, Yape o por WhatsApp", solo con los métodos activos. */
function resumenPagos(p: ReglasCompra["pagos"]) {
  const m = [p.tarjeta && "Tarjeta", p.yape && "Yape", p.whatsapp && "por WhatsApp"].filter(Boolean) as string[];
  return m.length > 1 ? `${m.slice(0, -1).join(", ")} o ${m.at(-1)}` : m[0] === "por WhatsApp" ? "Por WhatsApp" : (m[0] ?? "");
}

const inmediata = <span className="text-caption text-success">Confirmación inmediata.</span>;

/**
 * 3 · Pago (Figma, tarjeta, Yape y WhatsApp): "Pagar ahora" (confirmación inmediata) o "Pagar después"
 * (separado por 24 h). Solo se ven los métodos que la tienda tiene activos.
 */
export function PasoPago({ c, mensaje, pagos }: { c: Compra; mensaje: string; pagos: ReglasCompra["pagos"] }) {
  const estado = c.paso === "pago" ? "abierto" : "pendiente";
  return (
    <Paso numero={3} titulo="Pago" estado={estado} resumen={resumenPagos(pagos)}>
      <fieldset className="flex flex-col gap-3">
        <legend className="pb-3 text-body-sm font-semibold text-fg">¿Cómo quieres pagar?</legend>
        <div>
        {(pagos.tarjeta || pagos.yape) && <p className={grupo}>Pagar ahora</p>}<div className="divide-y divide-line-subtle">
        {pagos.tarjeta && (
          <Opcion fila nombre="pago" valor="tarjeta" icono={CreditCard} elegida={c.metodo === "tarjeta"} onElegir={() => c.elegirMetodo("tarjeta")} titulo="Tarjeta de débito o crédito" detalle="Visa, Mastercard y más" etiqueta={inmediata}>
            {c.fallo && <Fallo titulo={c.fallo.titulo} detalle={c.fallo.detalle} />}
            <FormTarjeta c={c} />
          </Opcion>
        )}
        {pagos.yape && (
          <Opcion fila nombre="pago" valor="yape" icono={QrCode} elegida={c.metodo === "yape"} onElegir={() => c.elegirMetodo("yape")} titulo="Yape" detalle="Con código de aprobación" etiqueta={inmediata}>
            <FormYape c={c} />
          </Opcion>
        )}
        </div></div>
        {pagos.whatsapp && (
          <>
            <p className={`${grupo} pt-2`}>Pagar después</p>
            <Opcion fila
              nombre="pago"
              valor="whatsapp"
              icono={MessageCircle}
              elegida={c.metodo === "whatsapp"}
              onElegir={() => c.elegirMetodo("whatsapp")}
              titulo="Pedir por WhatsApp"
              detalle="Acuerdas el pago con la tienda por chat"
              etiqueta={<span className="text-caption text-warning">Separado por 24 h.</span>}
            >
              <div className="flex flex-col gap-2">
                <p className="text-body-sm font-semibold text-fg">Mensaje que se enviará</p>
                <p className="break-words border-t border-line-subtle pt-3 text-body-sm whitespace-pre-line text-fg-secondary">{mensaje}</p>
              </div>
              <p className="text-caption text-fg-secondary">Separamos tus productos por 24 horas. Si el pago no se confirma en ese tiempo, se liberan solos.</p>
            </Opcion>
          </>
        )}
      </fieldset>
    </Paso>
  );
}

function Fallo({ titulo, detalle }: { titulo: string; detalle: string }) {
  return (
    <div role="alert" className="flex gap-3 border border-error-border bg-error-surface p-3">
      <CircleAlert aria-hidden strokeWidth={1.8} className="mt-0.5 size-5 shrink-0 text-error" />
      <p className="flex flex-col gap-0.5 text-body-sm">
        <span className="font-semibold text-fg">{titulo}</span>
        <span className="text-fg-secondary">{detalle}</span>
      </p>
    </div>
  );
}
