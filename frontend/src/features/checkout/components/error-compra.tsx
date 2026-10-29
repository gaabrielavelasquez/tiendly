"use client";
import { CloudOff } from "lucide-react";
import { Button, EmptyState } from "@/components/ui";

export function ErrorCompra({ reintentar }: { reintentar: () => void }) {
  return <div className="mx-auto w-full max-w-xl px-4 py-12"><EmptyState simple icon={CloudOff} title="No pudimos cargar tu compra" description="Revisa tu conexión e inténtalo de nuevo." action={<Button onClick={reintentar}>Reintentar</Button>} /></div>;
}
