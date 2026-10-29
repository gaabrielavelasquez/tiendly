import type { DatosTienda } from "@/lib/datos/tienda";
import { TIENDAS_EJEMPLO } from "@/lib/datos/tiendas-ejemplo";
import { esHeather } from "@/lib/datos/semillas";
import { INICIAL, VACIA } from "./config";
import type { Tienda } from "../types";

/** Misma identidad para panel y vitrina. Compatibilidad en lectura, sin escribir ni reiniciar tiendas. */
export function identidadDe(d: DatosTienda): Tienda {
  const ejemplo = TIENDAS_EJEMPLO.find(t => t.slug === d.tienda.slug);
  const base = esHeather(d.tienda.slug) ? INICIAL : ejemplo ? {
    ...VACIA, tema: ejemplo.tema, acento: ejemplo.acento ?? "tema",
    portada: ejemplo.portada.src, bienvenida: ejemplo.portada.titulo,
  } : VACIA;
  return { ...base, logo: d.tienda.logo ?? "", ...d.tienda.apariencia,
    whatsapp: d.config.pagos.whatsapp.celular, nombreOfertas: d.tienda.nombreOfertas ?? "" };
}
