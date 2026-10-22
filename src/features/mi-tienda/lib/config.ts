import type { Acento, Errores, Tienda } from "../types";
import type { CSSProperties } from "react";

export const TEMAS = [
  { id: "neutral", nombre: "Neutral", descripcion: "El producto es protagonista." },
  { id: "editorial", nombre: "Editorial", descripcion: "Como una revista de tu marca." },
  { id: "suave", nombre: "Suave", descripcion: "Cercano, cálido y acogedor." },
] as const;
export const ACENTOS = [
  { id: "tema", nombre: "Del tema" }, { id: "negro", nombre: "Negro" },
  { id: "terracota", nombre: "Terracota" }, { id: "rosa", nombre: "Rosa" }, { id: "oliva", nombre: "Oliva" },
] as const;
export const INICIAL: Tienda = {
  tema: "editorial", acento: "tema", logo: "", portada: "/mi-tienda/chloe.jpg",
  bienvenida: "Zapatos que acompañan tu día, hechos para ti.",
  instagram: "heather.pe", whatsapp: "987654321", horario: "Lunes a sábado, de 9 a. m. a 6 p. m.",
};
export const VACIA: Tienda = { ...INICIAL, tema: "neutral", portada: "", bienvenida: "", instagram: "", whatsapp: "", horario: "" };
export const STORAGE = "tiendly:mi-tienda:heather";

/** Solo reemplaza tokens de acento en la vitrina; el tema sigue controlando fuentes y radios. */
export function estiloAcento(acento: Acento): CSSProperties {
  if (acento === "tema") return {};
  const fill = `var(--tl-accent-option-${acento}-fill)`;
  const contrast = `var(--tl-accent-option-${acento}-contrast)`;
  return {
    "--tl-accent-base": fill, "--tl-accent-base-deep": fill,
    "--tl-accent-hover": fill, "--tl-accent-pressed": fill, "--tl-accent-contrast": contrast,
  } as CSSProperties;
}

export function validarTienda(tienda: Tienda): Errores {
  const errores: Errores = {};
  if (tienda.bienvenida.length > 80) errores.bienvenida = "Usa hasta 80 caracteres.";
  if (tienda.instagram && !/^@?[a-zA-Z0-9._]{1,30}$/.test(tienda.instagram)) errores.instagram = "Escribe tu usuario de Instagram, sin el enlace.";
  if (tienda.whatsapp && !/^9\d{8}$/.test(tienda.whatsapp)) errores.whatsapp = "Escribe 9 dígitos y empieza con 9.";
  if (tienda.horario.length > 160) errores.horario = "Usa hasta 160 caracteres.";
  return errores;
}

export function leerTienda(valor: string): Tienda {
  const datos = JSON.parse(valor) as Tienda;
  if (!TEMAS.some(t => t.id === datos.tema) || !ACENTOS.some(a => a.id === datos.acento)) throw new Error("Configuración no válida.");
  for (const key of ["logo", "portada", "bienvenida", "instagram", "whatsapp", "horario"] as const) {
    if (typeof datos[key] !== "string") throw new Error("Configuración incompleta.");
  }
  for (const key of ["logo", "portada"] as const) {
    if (datos[key] && !datos[key].startsWith("/mi-tienda/") && !/^data:image\/(png|jpeg|webp);base64,/.test(datos[key])) throw new Error("Imagen no válida.");
  }
  if (Object.keys(validarTienda(datos)).length) throw new Error("Revisa la configuración guardada.");
  return datos;
}
