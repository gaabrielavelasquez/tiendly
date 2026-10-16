"use client";

import { useState } from "react";
import { Button, Field } from "@/components/ui";
import { Wordmark } from "./wordmark";
import { useOnboarding } from "../hooks/use-onboarding";
import { errorCelular, formatear, soloDigitos } from "../lib/phone";

/** O1 / OD1 · Registro con WhatsApp o Google. */
export function StepRegistro() {
  const { state, set } = useOnboarding();
  const [digitos, setDigitos] = useState(state.celular);
  const [error, setError] = useState<string>();
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const err = errorCelular(digitos);
    setError(err);
    if (err) return;
    setEnviando(true);
    await new Promise((r) => setTimeout(r, 700)); // simulación del envío por WhatsApp
    set({ celular: digitos, celularVentas: state.celularVentas || digitos, paso: "codigo" });
  }

  return (
    <form onSubmit={enviar} noValidate className="flex flex-1 flex-col gap-6">
      <Wordmark className="lg:hidden" />
      <header className="flex flex-col gap-2 pt-4">
        <h1 className="font-display-hero text-h1">{state.modo === "ingresar" ? "Ingresa a tu tienda" : "Crea tu tienda gratis"}</h1>
        <p className="text-body text-fg-secondary">
          En 2 minutos tienes tu link para vender por WhatsApp e Instagram. Sin tarjeta.
        </p>
      </header>
      <Field
        label="Tu número de WhatsApp"
        prefix="+51"
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="987 654 321"
        value={formatear(digitos)}
        onChange={(e) => setDigitos(soloDigitos(e.target.value))}
        hint="Te mandamos un código por WhatsApp. No usamos contraseñas."
        error={error}
      />
      <Button type="submit" block loading={enviando}>
        Recibir código por WhatsApp
      </Button>
      <div className="flex items-center gap-3 text-body-sm text-fg-secondary" aria-hidden>
        <span className="h-px flex-1 bg-line-subtle" />o<span className="h-px flex-1 bg-line-subtle" />
      </div>
      {/* Con backend: usar el botón oficial de Google con su logo (guías de marca de Google). */}
      <Button type="button" variant="secondary" block>
        Continuar con Google
      </Button>
      <div className="mt-auto flex flex-col gap-3 pt-6 text-center lg:mt-0">
        <p className="text-body-sm text-fg-secondary">
          {state.modo === "ingresar" ? "¿Todavía no tienes tienda? " : "¿Ya tienes tienda? "}
          <button
            type="button"
            className="inline-flex min-h-11 items-center font-semibold text-accent-text"
            onClick={() => set({ modo: state.modo === "ingresar" ? "crear" : "ingresar" })}
          >
            {state.modo === "ingresar" ? "Crear una" : "Ingresar"}
          </button>
        </p>
        <p className="text-label text-fg-secondary">
          Al continuar aceptas los{" "}
          <a href="#" className="font-semibold text-accent-text underline">Términos</a> y la{" "}
          <a href="#" className="font-semibold text-accent-text underline">Política de privacidad</a>.
        </p>
      </div>
    </form>
  );
}
