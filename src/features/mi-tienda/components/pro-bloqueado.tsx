"use client";
import { useRef } from "react";
import { LockKeyhole, Sparkles } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";

const EXTRAS = ["Banner de alto impacto", "Ocultar el sello de Tiendly", "Badges de stock personalizados", "Mensajes dinámicos de WhatsApp", "Avisos de stock bajo por WhatsApp"];
export function ProBloqueado() {
  const dialog = useRef<HTMLDialogElement>(null);
  return <>
    <Card as="section" className="flex flex-col gap-4 bg-highlight p-5 lg:p-6">
      <h2 className="flex items-center gap-2 font-display-title text-h3"><Sparkles aria-hidden className="size-5" />Más posibilidades <Badge>PRO</Badge></h2>
      <p className="text-body-sm text-fg-secondary">Tu tienda ya se ve profesional. Con Pro, dale tu toque propio.</p>
      {["Color personalizado", "Tipografías exclusivas", "Dominio propio"].map(t => <div key={t} className="flex items-center justify-between gap-3 rounded-button border border-line-subtle bg-surface/60 p-3 text-body-sm text-fg-secondary">
        <span>{t}</span><LockKeyhole aria-label="Disponible en Pro" className="size-4" />
      </div>)}
      <Button variant="secondary" onClick={() => dialog.current?.showModal()}>Ver planes</Button>
    </Card>
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
