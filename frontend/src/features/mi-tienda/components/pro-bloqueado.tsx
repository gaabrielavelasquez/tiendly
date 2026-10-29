"use client";
import { useRef } from "react";
import { Check, LockKeyhole } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { Seccion } from "./seccion";

const EXTRAS = ["Banner de alto impacto", "Ocultar el sello de Tiendly", "Badges de stock personalizados", "Mensajes dinámicos de WhatsApp", "Avisos de stock bajo por WhatsApp"];
const OPCIONES = [{ titulo: "Color personalizado", ayuda: "Cualquier color, con validador de contraste." }, { titulo: "Tipografías exclusivas", ayuda: "Elige entre una lista curada." }, { titulo: "Dominio propio", ayuda: "Por ejemplo, tutienda.pe." }];

/**
 * Opciones Pro de Mi tienda (todavía no funcionan: llegan en V1.1). Tienda Pro (Heather, 0030): incluidas en
 * el plan y cada una con «Muy pronto», sin candado ni «Ver planes». Tienda Free: candado, badge PRO y «Ver planes».
 */
export function ProBloqueado({ plan }: { plan: "free" | "pro" }) {
  const dialog = useRef<HTMLDialogElement>(null);
  if (plan === "pro") {
    return <Seccion titulo="Opciones de tu plan Pro">
      <p className="text-body-sm text-fg-secondary">Están incluidas en tu plan. Todavía no funcionan: llegan muy pronto.</p>
      <div className="divide-y divide-line-subtle">{OPCIONES.map(t => <div key={t.titulo} className="flex min-h-12 items-start gap-3 py-2 text-body-sm">
        <Check aria-hidden strokeWidth={1.5} className="mt-0.5 size-5 shrink-0 text-icon" /><div className="min-w-0 flex-1"><p className="font-semibold text-fg">{t.titulo}</p><p className="mt-1 text-caption text-fg-secondary">{t.ayuda}</p></div><Badge tone="warning">Muy pronto</Badge>
      </div>)}</div>
    </Seccion>;
  }
  return <>
    <Seccion titulo="Más opciones con Pro">
      <p className="text-body-sm text-fg-secondary">Haz que tu tienda sea 100 % tuya.</p>
      <div className="divide-y divide-line-subtle">{OPCIONES.map(t => <div key={t.titulo} className="flex min-h-12 items-center gap-3 py-2 text-body-sm">
        <LockKeyhole aria-hidden className="size-5 shrink-0 text-icon" /><div className="min-w-0 flex-1"><p className="font-semibold text-fg">{t.titulo}</p><p className="mt-1 text-caption text-fg-secondary">{t.ayuda}</p></div><Badge>PRO</Badge>
      </div>)}</div>
      <Button variant="secondary" onClick={() => dialog.current?.showModal()}>Ver planes</Button>
    </Seccion>
    <dialog ref={dialog} aria-labelledby="planes-titulo" className="fixed inset-0 m-auto max-h-dvh w-full max-w-lg overflow-y-auto rounded-card border border-line-subtle bg-surface p-6 text-fg shadow-overlay backdrop:bg-scrim">
      <h2 id="planes-titulo" className="font-display-title text-h2">Elige cómo crece tu tienda</h2>
      <div className="mt-5 grid gap-5">
        <section><h3 className="font-semibold">Free · Gratis para empezar</h3><p className="mt-2 text-body-sm text-fg-secondary">Tres temas, cinco acentos curados, logo, portada, bienvenida y contacto.</p></section>
        <section><h3 className="font-semibold">Pro · Tu marca, a tu manera</h3><p className="mt-2 text-body-sm text-fg-secondary">Color libre con contraste validado, tipografías exclusivas y dominio propio.</p>
          <ul className="mt-3 list-inside list-disc space-y-2 text-body-sm text-fg-secondary">{EXTRAS.map(e => <li key={e}>{e}.</li>)}</ul>
          <p className="mt-3 text-caption text-fg-secondary">El precio y la contratación de Pro todavía no están disponibles.</p>
        </section>
        <Button variant="secondary" onClick={() => dialog.current?.close()}>Volver a Mi tienda</Button>
      </div>
    </dialog>
  </>;
}
