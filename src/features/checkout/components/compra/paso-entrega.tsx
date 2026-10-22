import { MapPin, MessageCircle, Store, Truck } from "lucide-react";
import { Button, Field, Opcion } from "@/components/ui";
import { formatoSoles } from "@/lib/formato";
import type { Compra } from "../../hooks/use-compra";
import type { ReglasCompra } from "../../types";
import { BuscadorDistrito } from "./buscador-distrito";
import { Paso } from "./paso";

/** 2 · Entrega (Figma, entrega, E1–E3): delivery con distrito y dirección, recojo en tienda, o coordinarla por WhatsApp. */
type Props = { c: Compra; envioGratis: boolean; tienda: string; delivery: ReglasCompra["delivery"]; recojo: ReglasCompra["recojo"]; coordinar: boolean };

/** Solo se ofrece lo que la tienda activó en Configuración → Entregas (decisión 0009). */
export function PasoEntrega({ c, envioGratis, tienda, delivery, recojo, coordinar }: Props) {
  const lima = delivery?.soloLima ? delivery.distritos[0] : null;
  const estado = c.paso === "entrega" ? "abierto" : c.hechos.entrega ? "hecho" : "pendiente";
  const resumen =
    c.hechos.entrega && c.entrega ? (
      c.entrega.tipo === "recojo" ? (
        <>Recojo en tienda · Gratis</>
      ) : c.entrega.tipo === "coordinar" ? (
        <>Por WhatsApp · el envío se coordina aparte</>
      ) : (
        <>
          <span className="block">
            Delivery a {c.entrega.distrito.nombre} · {envioGratis ? "Gratis" : formatoSoles(c.entrega.distrito.costo)}
          </span>
          <span className="block">{c.entrega.direccion}</span>
        </>
      )
    ) : (
      coordinar ? "Se coordina por WhatsApp" : "Delivery o recojo en tienda"
    );

  return (
    <Paso numero={2} titulo="Entrega" estado={estado} resumen={resumen} onEditar={() => c.setPaso("entrega")}>
      <form noValidate onSubmit={(e) => (e.preventDefault(), c.continuarEntrega())} className="flex flex-col gap-4">
        <fieldset className="flex flex-col gap-3">
          <legend className="pb-3 text-body-sm font-semibold text-fg">¿Cómo lo recibes?</legend>
          {delivery && (
            <Opcion
              nombre="entrega"
              valor="delivery"
              icono={Truck}
              elegida={c.tipoEntrega === "delivery"}
              onElegir={() => c.setTipoEntrega("delivery")}
              titulo={lima ? "Delivery en Lima" : "Delivery"}
              detalle={envioGratis ? "Gratis en tu pedido" : lima ? `${formatoSoles(lima.costo)} · Llega en ${lima.plazo}` : "El costo depende de tu distrito"}
            />
          )}
          {recojo && (
            <Opcion
              nombre="entrega"
              valor="recojo"
              icono={Store}
              elegida={c.tipoEntrega === "recojo"}
              onElegir={() => c.setTipoEntrega("recojo")}
              titulo="Recojo en tienda"
              detalle={`Gratis · ${recojo.distrito}, coordinas el día`}
            >
              <div className="flex gap-3 bg-sunken p-3 text-body-sm">
                <MapPin aria-hidden strokeWidth={1.6} className="mt-0.5 size-5 shrink-0 text-icon" />
                <p className="flex flex-col gap-1 text-fg-secondary">
                  <span className="font-semibold text-fg">Dirección de recojo</span>
                  <span>
                    {recojo.direccion}, {recojo.distrito}
                  </span>
                  <span>{recojo.horario}</span>
                </p>
              </div>
              <p className="text-caption text-fg-secondary">{recojo.nota || `${tienda} te escribe por WhatsApp para coordinar el día y la hora.`} Lleva tu código de pedido.</p>
            </Opcion>
          )}
          {coordinar && (
            <Opcion
              nombre="entrega"
              valor="coordinar"
              icono={MessageCircle}
              elegida={c.tipoEntrega === "coordinar"}
              onElegir={() => c.setTipoEntrega("coordinar")}
              titulo="Coordinar la entrega por WhatsApp"
              detalle={`${tienda} te escribe para acordar cómo te llega y cuánto cuesta el envío.`}
            />
          )}
        </fieldset>
        {c.tipoEntrega === "delivery" && delivery && (
          <>
            <BuscadorDistrito distritos={delivery?.distritos ?? []} valor={c.distrito} onCambio={c.setDistrito} error={c.erroresEntrega.distrito} />
            <Field label="Dirección" placeholder="Ej.: Av. Primavera 1234, dpto. 302" autoComplete="street-address" value={c.direccion} onChange={(e) => c.setDireccion(e.target.value)} error={c.erroresEntrega.direccion} />
            <Field label="Referencia (opcional)" placeholder="Ej.: Frente al parque" value={c.referencia} onChange={(e) => c.setReferencia(e.target.value)} hint="Ayuda a encontrar tu casa más rápido." />
          </>
        )}
        <Button type="submit" variant="secondary" block className="h-12">
          Continuar al pago
        </Button>
      </form>
    </Paso>
  );
}
