import { environment } from "@tiendly/backend/rules";

/** Herramientas disponibles solo en un entorno local o preview explícito. */
export const herramientasDev = environment(process.env.TIENDLY_ENTORNO) !== "production";
