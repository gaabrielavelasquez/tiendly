"use client";
import { CloudOff } from "lucide-react";
import { PanelMain } from "@/components/panel";
import { Button, Card, EmptyState } from "@/components/ui";
export default function Error({ retry }: { error: Error; retry: () => void }) { return <PanelMain><Card><EmptyState icon={CloudOff} title="No pudimos abrir la solicitud" description="Inténtalo de nuevo. Tu borrador sigue en esta pestaña." action={<Button onClick={retry}>Reintentar</Button>} /></Card></PanelMain>; }
