"use client";

import { ChartNoAxesColumn, Image, Percent, ShoppingBag, Tag, User, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

type Item = { href: string; label: string; icon: LucideIcon };

// Íconos del sistema (trazo 1.6, como Icono/* en Figma).
const ITEMS: Item[] = [
  { href: "/panel", label: "Inicio", icon: ChartNoAxesColumn },
  { href: "/panel/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/panel/productos", label: "Productos", icon: Tag },
  { href: "/panel/cupones", label: "Cupones", icon: Percent },
  { href: "/panel/mi-tienda", label: "Mi tienda", icon: Image },
  { href: "/panel/configuracion", label: "Configuración", icon: User },
];

type PanelNavProps = { colapsada?: boolean; onNavigate?: () => void };

/** Ítems de menú del panel. Activo: bg/sunken + text/primary (DESIGN.md §4, sin cobalto). */
export function PanelNav({ colapsada = false, onNavigate }: PanelNavProps) {
  const path = usePathname();
  return (
    <nav aria-label="Panel">
      <ul className="flex flex-col gap-1">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const activo = href === "/panel" ? path === href : path.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onNavigate}
                aria-current={activo ? "page" : undefined}
                title={colapsada ? label : undefined}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-sm px-3 text-body-sm transition-colors lg:h-9",
                  activo ? "bg-sunken font-bold text-fg" : "text-fg-secondary hover:bg-sunken hover:text-fg",
                  colapsada && "justify-center px-0",
                )}
              >
                <Icon aria-hidden strokeWidth={1.6} className="size-6 shrink-0 text-icon" />
                <span className={cn("flex-1", colapsada && "sr-only")}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
