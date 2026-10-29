"use client";

import { useState } from "react";
import { CLAVE_ONBOARDING } from "@/features/onboarding/lib/recuerdo";
import { cerrarSesion } from "../lib/acciones";

export function useCerrarSesion() {
  const [abierto, setAbierto] = useState(false);
  const [saliendo, setSaliendo] = useState(false);
  const [error, setError] = useState("");
  const abrir = () => { setError(""); setAbierto(true); };
  const cerrar = () => { if (!saliendo) setAbierto(false); };
  async function confirmar() {
    if (saliendo) return;
    setSaliendo(true);
    setError("");
    try {
      await cerrarSesion();
      try { sessionStorage.removeItem(CLAVE_ONBOARDING); } catch { /* El registro también funciona sin storage. */ }
      // Navegación completa: el panel anterior no queda en la caché del router de la sesión.
      window.location.replace("/registro");
    } catch {
      setError("No pudimos cerrar sesión. Inténtalo de nuevo.");
      setSaliendo(false);
    }
  }
  return { abierto, saliendo, error, abrir, cerrar, confirmar };
}
