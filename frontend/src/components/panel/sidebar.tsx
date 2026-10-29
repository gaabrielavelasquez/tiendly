"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Pressable } from "@/components/motion/pressable";
import { cn } from "@/lib/cn";
import { PanelNav } from "./panel-nav";
import { useMenuColapsado } from "./use-menu-colapsado";

/** Barra lateral de desktop (componente "Barra lateral" de Figma). */
export function Sidebar() {
  const { colapsada, alternar } = useMenuColapsado();
  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-dvh shrink-0 flex-col gap-6 border-r border-line-subtle bg-surface px-4 py-6 transition-[width] lg:flex",
        colapsada ? "w-20" : "w-62",
      )}
    >
      <Link href="/panel" aria-label="tiendly, ir a Inicio" className="font-display-hero text-h2 tracking-tight text-accent">
        {colapsada ? "t" : "tiendly"}
      </Link>
      <div className="flex-1">
        <PanelNav colapsada={colapsada} />
      </div>
      <Pressable
        type="button"
        onClick={alternar}
        aria-label={colapsada ? "Expandir menú" : "Contraer menú"}
        aria-expanded={!colapsada}
        className="flex size-12 items-center justify-center rounded-button text-icon transition-colors hover:bg-sunken"
      >
        <ChevronLeft aria-hidden strokeWidth={1.6} className={cn("size-6 transition-transform", colapsada && "rotate-180")} />
      </Pressable>
    </aside>
  );
}
