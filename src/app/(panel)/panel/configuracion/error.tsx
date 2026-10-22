"use client";

import { CloudOff } from "lucide-react";
import { PanelMain } from "@/components/panel";
import { Button, Card, EmptyState } from "@/components/ui";

/** Error de Configuración (CLAUDE.md §5). `retry` vuelve a pedir los datos al servidor (Next 16). */
export default function ConfiguracionError({ retry }: { error: Error; retry: () => void }) {
  return (
    <PanelMain>
      <Card>
        <EmptyState
          icon={CloudOff}
          title="No pudimos cargar tu configuración"
          description="Revisa tu conexión e inténtalo de nuevo. Tus métodos de pago y entregas siguen igual."
          action={<Button onClick={() => retry()}>Reintentar</Button>}
        />
      </Card>
    </PanelMain>
  );
}
