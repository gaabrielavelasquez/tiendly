"use client";
import { CloudOff } from "lucide-react";
import { PanelMain } from "@/components/panel";
import { Button, Card, EmptyState } from "@/components/ui";
export default function Error({ retry }: { error: Error; retry: () => void }) {
  return <PanelMain><Card><EmptyState icon={CloudOff} title="No pudimos abrir Mi tienda" description="Inténtalo de nuevo. Tus cambios guardados siguen en este navegador." action={<Button onClick={retry}>Reintentar</Button>} /></Card></PanelMain>;
}
