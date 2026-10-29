import { Button } from "@/components/ui";
import type { ModeloAfiliacion } from "../hooks/use-afiliacion";
import { HojaModal } from "./hoja-modal";
import { ResumenSolicitud } from "./resumen-solicitud";
export type Dialogo = "ayuda" | "salir" | "terminos" | "detalle" | null;
export function AfiliacionDialogos({ dialogo, cerrar, salir, m, errorSalir }: { dialogo: Dialogo; cerrar: () => void; salir: () => void; m: ModeloAfiliacion; errorSalir: string }) {
  return <>
    <HojaModal titulo="¿Salir de la solicitud?" abierto={dialogo === "salir"} cerrar={cerrar}>
      <p className="mb-5 text-body text-fg-secondary">Guardamos tu borrador en esta pestaña para que puedas retomarlo. Todavía no se ha enviado.</p>
      {errorSalir && <p role="alert" className="mb-4 text-body-sm text-error">{errorSalir}</p>}
      <div className="flex flex-col gap-3 sm:flex-row"><Button variant="secondary" onClick={cerrar}>Seguir con la solicitud</Button><Button onClick={salir}>Guardar y salir</Button></div>
    </HojaModal>
    <HojaModal titulo="Cómo sacar mi RUC" abierto={dialogo === "ayuda"} cerrar={cerrar}>
      <div className="space-y-4 text-body text-fg-secondary"><p>Consulta los requisitos y canales oficiales en SUNAT para inscribirte o regularizar tu RUC.</p><p>Mientras lo tramitas, puedes seguir recibiendo Pedidos por WhatsApp. No necesitas terminar la afiliación para usar tu tienda.</p><a className="link-text inline-flex min-h-12 items-center" href="https://www.sunat.gob.pe/" target="_blank" rel="noreferrer">Ir a SUNAT</a></div>
    </HojaModal>
    <HojaModal titulo="Términos de afiliación" abierto={dialogo === "terminos"} cerrar={cerrar}>
      <div className="space-y-4 text-body-sm text-fg-secondary"><p>Al enviar, autorizas la revisión de los datos del negocio, representante y cuenta de depósito.</p><p>Esta solicitud es una demostración. No envía tus datos a SUNAT, bancos ni pasarelas, y no activa cobros reales.</p><p>Las comisiones, plazos y condiciones definitivas se confirmarán antes de activar el servicio. Puedes seguir recibiendo Pedidos por WhatsApp.</p></div>
    </HojaModal>
    <HojaModal titulo="Detalle de tu solicitud" abierto={dialogo === "detalle"} cerrar={cerrar}>
      {m.solicitud && <ResumenSolicitud datos={m.solicitud.datos} negocio={m.solicitud.negocio} />}
    </HojaModal>
  </>;
}
