"use client";

import { useEffect, useState } from "react";

/** Saludo con el nombre del negocio recién creado (dato simulado del onboarding). */
export function Bienvenida() {
  const [nombre, setNombre] = useState("");
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tiendly:onboarding");
      if (raw) setNombre(JSON.parse(raw).nombre ?? "");
    } catch {}
  }, []);
  return <h1 className="font-display-hero text-h1">{nombre ? `¡Hola, ${nombre}!` : "¡Hola!"}</h1>;
}
