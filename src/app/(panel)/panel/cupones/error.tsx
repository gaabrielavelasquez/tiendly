"use client";

import { CloudOff } from "lucide-react";
import { PanelMain } from "@/components/panel";
import { Button, Card, EmptyState } from "@/components/ui";

/** Error de Cupones (CLAUDE.md §5). `retry` vuelve a pedir los datos al servidor (Next 16). */
export default function CuponesError({ retry }: { error: Error; retry: () => void }) {
  return (
    <PanelMain>
      <Card>
        <EmptyState
          icon={CloudOff}
          title="No pudimos cargar tus cupones"
          description="Revisa tu conexión e inténtalo de nuevo. Tus cupones siguen funcionando en tu tienda."
          action={<Button onClick={() => retry()}>Reintentar</Button>}
        />
      </Card>
    </PanelMain>
  );
}
