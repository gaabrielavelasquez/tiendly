"use client";

import { CloudOff } from "lucide-react";
import { Button, EmptyState } from "@/components/ui";

/** Error de la vitrina (CLAUDE.md §5). Copy pensado para el cliente, no para la tienda. */
export default function TiendaError({ retry }: { error: Error; retry: () => void }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl items-center px-4">
      <EmptyState
        icon={CloudOff}
        title="No pudimos cargar la tienda"
        description="Revisa tu conexión e inténtalo de nuevo en unos segundos."
        action={<Button onClick={() => retry()}>Reintentar</Button>}
      />
    </main>
  );
}
