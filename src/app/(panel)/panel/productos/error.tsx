"use client";

import { CloudOff } from "lucide-react";
import { PanelMain } from "@/components/panel";
import { Button, Card, EmptyState } from "@/components/ui";

/** Error de Productos (CLAUDE.md §5). `retry` vuelve a pedir los datos al servidor (Next 16). */
export default function ProductosError({ retry }: { error: Error; retry: () => void }) {
  return (
    <PanelMain>
      <Card>
        <EmptyState
          icon={CloudOff}
          title="No pudimos cargar tus productos"
          description="Revisa tu conexión e inténtalo de nuevo. Tu catálogo está a salvo."
          action={<Button onClick={() => retry()}>Reintentar</Button>}
        />
      </Card>
    </PanelMain>
  );
}
