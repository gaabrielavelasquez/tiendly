"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { OtpInput } from "./otp-input";
import { useCountdown } from "../hooks/use-countdown";
import { useOnboarding } from "../hooks/use-onboarding";
import { formatear } from "../lib/phone";

// Simulación: cualquier código de 4 dígitos pasa, salvo 0000 (para ver el estado de error).
const CODIGO_INVALIDO = "0000";

/** O2 / OD2 · Código de verificación. Se verifica solo al completar el 4.º dígito. */
export function StepCodigo() {
  const router = useRouter();
  const { state, set } = useOnboarding();
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState<string>();
  const [verificando, setVerificando] = useState(false);
  const [aviso, setAviso] = useState("");
  const { restante, texto, reiniciar } = useCountdown(60);

  async function verificar(valor = codigo) {
    if (valor.length < 4 || verificando) return;
    setVerificando(true);
    setError(undefined);
    await new Promise((r) => setTimeout(r, 700));
    setVerificando(false);
    if (valor === CODIGO_INVALIDO) {
      setError("El código no coincide. Revisa el mensaje de WhatsApp e inténtalo otra vez.");
      setCodigo("");
      return;
    }
    if (state.modo === "ingresar") router.push("/panel");
    else set({ paso: "datos" });
  }

  useEffect(() => {
    if (codigo.length === 4) verificar(codigo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codigo]);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <button
        type="button"
        aria-label="Volver"
        onClick={() => set({ paso: "registro" })}
        className="-ml-3 flex size-12 items-center justify-center rounded-full text-icon hover:bg-sunken"
      >
        <ChevronLeft aria-hidden className="size-6" />
      </button>
      <header className="flex flex-col gap-2">
        <h1 className="font-display-hero text-h1">Escribe el código</h1>
        <p className="text-body text-fg-secondary">
          Te lo mandamos por WhatsApp al +51 {formatear(state.celular)}.
        </p>
        <button
          type="button"
          onClick={() => set({ paso: "registro" })}
          className="inline-flex min-h-11 items-center self-start text-body-sm font-semibold text-accent-text"
        >
          Cambiar número
        </button>
      </header>
      <OtpInput value={codigo} onChange={setCodigo} error={!!error} disabled={verificando} />
      <div aria-live="polite" className="flex flex-col gap-1 text-body-sm">
        {error && <p className="text-error">{error}</p>}
        {aviso && !error && <p className="text-fg-secondary">{aviso}</p>}
        {restante > 0 ? (
          <p className="text-fg-secondary">Reenviar código en {texto}</p>
        ) : (
          <button
            type="button"
            className="inline-flex min-h-11 items-center self-start font-semibold text-accent-text"
            onClick={() => {
              reiniciar();
              setAviso("Te mandamos un código nuevo.");
            }}
          >
            Reenviar código
          </button>
        )}
      </div>
      <Button className="mt-auto lg:mt-2" block loading={verificando} disabled={codigo.length < 4} onClick={() => verificar()}>
        Verificar
      </Button>
    </div>
  );
}
