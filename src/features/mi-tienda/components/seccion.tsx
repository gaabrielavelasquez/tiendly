"use client";

import { useId } from "react";
import { Seccion as SeccionPanel } from "@/components/panel";

/** 0031: encabezado fuera de un único contenedor sereno. */
export function Seccion({ titulo, descripcion, children }: { titulo: string; descripcion?: string; children: React.ReactNode }) {
  const id = useId();
  return <SeccionPanel id={id} titulo={titulo} descripcion={descripcion}>{children}</SeccionPanel>;
}
