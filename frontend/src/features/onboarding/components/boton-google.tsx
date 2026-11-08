"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

/** Inicia OAuth mediante Better Auth; el botón conserva su estilo existente. */
export function BotonGoogle() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  async function ingresar() {
    setLoading(true); setError(undefined);
    try {
      const response = await fetch("/api/auth/sign-in/social", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ provider: "google", callbackURL: "/registro?google=1", errorCallbackURL: "/registro?error=google" }) });
      const data = await response.json();
      if (!response.ok || typeof data.url !== "string") throw new Error();
      const url = new URL(data.url);
      if (url.protocol !== "https:" || url.hostname !== "accounts.google.com") throw new Error();
      window.location.assign(url.href);
    } catch { setError("No pudimos ingresar con Google. Inténtalo de nuevo."); setLoading(false); }
  }
  return <>
    <Button type="button" variant="secondary" block loading={loading} disabled={loading} onClick={ingresar}>
      <span className="inline-flex items-center gap-3">
        <img src="/icons/google-g.svg" alt="" aria-hidden className="size-4.5 shrink-0" />
        Continuar con Google
      </span>
    </Button>
    {error && <p role="alert" className="text-body-sm text-error">{error}</p>}
  </>;
}
