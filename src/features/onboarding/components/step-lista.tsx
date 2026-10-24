"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui";
import { TituloAcceso } from "./titulo-acceso";
import { EXPLICACION_TEMA } from "../lib/rubros";

/** Tienda creada: titular sereno y vista previa de su propia tienda en el shell compartido. */
export function StepLista() {
  const router = useRouter();
  const [yendo, setYendo] = useState(false);
  return <div className="flex flex-col gap-6">
    <TituloAcceso titulo="Tu tienda está lista." contexto="Empieza con tu primer producto.">
      <p className="text-body text-pretty text-fg-secondary">{EXPLICACION_TEMA}</p>
    </TituloAcceso>
    <Button block loading={yendo} disabled={yendo} onClick={() => { setYendo(true); router.push("/panel"); }}>Ir a mi panel</Button>
  </div>;
}
