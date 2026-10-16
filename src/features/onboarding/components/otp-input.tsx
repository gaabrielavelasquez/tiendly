"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type OtpInputProps = { value: string; onChange: (v: string) => void; error?: boolean; disabled?: boolean };

/**
 * Un solo campo real (autocomplete="one-time-code") debajo de 4 cajas visuales:
 * el celular puede autocompletar el código y el lector de pantalla lee un único campo.
 */
export function OtpInput({ value, onChange, error, disabled }: OtpInputProps) {
  const [foco, setFoco] = useState(false);
  const activo = Math.min(value.length, 3);
  return (
    <div className="relative">
      <input
        aria-label="Código de 4 dígitos"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={4}
        autoFocus
        disabled={disabled}
        value={value}
        onFocus={() => setFoco(true)}
        onBlur={() => setFoco(false)}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 4))}
        className="absolute inset-0 z-10 w-full opacity-0"
      />
      <div aria-hidden className="grid grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "flex h-18 items-center justify-center rounded-button border bg-surface font-display-title text-h1 transition-colors",
              error ? "border-error" : "border-line-strong",
              !error && foco && i === activo && "border-selected-border outline-2 outline-offset-2 outline-focus",
            )}
          >
            {value[i] ?? (foco && i === activo ? <span className="h-7 w-0.5 bg-fg motion-safe:animate-pulse" /> : null)}
          </div>
        ))}
      </div>
    </div>
  );
}
