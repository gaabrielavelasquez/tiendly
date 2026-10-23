"use client";

import { useState } from "react";
import { Button, Field } from "@/components/ui";
import { BotonGoogle } from "./boton-google";
import { TiendasEjemplo } from "./tiendas-ejemplo";
import { Wordmark } from "./wordmark";
import { useOnboarding } from "../hooks/use-onboarding";
import { errorCelular, formatear, soloDigitos } from "../lib/phone";

// Titular en dos tonos, como el saludo de Inicio (decisión 0031): mismo tamaño, primario + secundario.
const TITULAR = {
  crear: ["Crea tu tienda gratis.", "Lista en 2 minutos."],
  ingresar: ["Ingresa a tu tienda.", "Con tu número de WhatsApp."],
} as const;

/** O1 / OD1 · Registro con WhatsApp o Google. */
export function StepRegistro() {
  const { state, set, linksEjemplo } = useOnboarding();
  const [digitos, setDigitos] = useState(state.celular);
  const [error, setError] = useState<string>();
  const [enviando, setEnviando] = useState(false);
  const crear = state.modo !== "ingresar";
  const [titulo, contexto] = TITULAR[crear ? "crear" : "ingresar"];

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
      <header className="flex flex-col gap-3 pt-2">
        <h1 className="font-display-light text-h1 tracking-tight text-balance">
          <span className="block text-fg">{titulo}</span>
          <span className="block text-fg-secondary">{contexto}</span>
        </h1>
        {crear && <p className="text-body text-pretty text-fg-secondary">Tu link para vender por WhatsApp e Instagram. Sin tarjeta.</p>}
      </header>
      <Field
        label="Tu número de WhatsApp"
        prefix="+51"
        prefixFijo
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
      <BotonGoogle />
      {/* Móvil: la vista previa compacta va después del formulario, para no empujarlo fuera de la pantalla. */}
      {crear && (
        <div className="pt-2 lg:hidden">
          <TiendasEjemplo links={linksEjemplo} compacta />
        </div>
      )}
      <div className="mt-auto flex flex-col gap-3 pt-2 text-center lg:mt-0 lg:pt-6">
        <p className="text-body-sm text-fg-secondary">
          {crear ? "¿Ya tienes tienda? " : "¿Todavía no tienes tienda? "}
          <button type="button" className="link-text inline-flex min-h-11 items-center" onClick={() => set({ modo: crear ? "ingresar" : "crear" })}>
            {crear ? "Ingresar" : "Crear una"}
          </button>
        </p>
        <p className="text-label text-fg-secondary">
          Al continuar aceptas los{" "}
          <a href="#" className="link-text">Términos</a> y la{" "}
          <a href="#" className="link-text">Política de privacidad</a>.
        </p>
      </div>
    </form>
  );
}
