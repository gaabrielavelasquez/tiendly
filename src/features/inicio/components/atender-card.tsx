"use client";

import { Check, Clock3, PackageX, Truck, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { Badge, buttonVariants, Card } from "@/components/ui";
import { cn } from "@/lib/cn";
import { ESCALON, rapido } from "../lib/motion";
import type { Pendiente } from "../lib/reglas";

// Cada tipo tiene su ícono: el color nunca es la única señal.
const ICONO: Record<Pendiente["id"], LucideIcon> = { "por-enviar": Truck, reservas: Clock3, agotados: PackageX };
const TILE: Record<Pendiente["tono"], string> = {
  info: "border-info-border bg-info-surface text-info",
  warning: "border-warning-border bg-warning-surface text-warning",
  error: "border-error-border bg-error-surface text-error",
};

type AtenderCardProps = { filas: Pendiente[]; className?: string };

/**
 * "Para atender hoy": atajos a las listas ya filtradas, con ícono por tipo y acción explícita
 * "Ver detalle". Toda la fila sigue siendo tocable: el link se estira con ::after.
 * Entrada escalonada (fade + y).
 */
export function AtenderCard({ filas, className }: AtenderCardProps) {
  const reduce = useReducedMotion();
  return (
    <Card as="section" aria-labelledby="atender-titulo" className={cn("flex flex-col", className)}>
      <h2 id="atender-titulo" className="pb-2 text-body font-bold text-fg">
        Para atender hoy
      </h2>
      {filas.length === 0 ? (
        <div className="flex min-h-16 items-center gap-3 py-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-success-border bg-success-surface">
            <Check aria-hidden strokeWidth={2} className="size-5 text-success" />
          </span>
          <p className="text-body-sm text-fg-secondary">
            <strong className="font-bold text-fg">Todo al día.</strong> No tienes pendientes.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-1">
          {filas.map((f, i) => {
            const Icono = ICONO[f.id];
            return (
              <motion.li
                key={f.id}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...rapido, delay: i * ESCALON }}
              >
                <div className="relative -mx-2 flex min-h-16 flex-wrap items-center gap-x-3 gap-y-1 rounded-theme px-2 py-2.5 transition-colors hover:bg-sunken lg:flex-nowrap">
                  <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-sm border", TILE[f.tono])}>
                    <Icono aria-hidden strokeWidth={1.8} className="size-5" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-body-sm font-bold text-fg">{f.titulo}</span>
                      {f.etiqueta && <Badge tone="warning">{f.etiqueta}</Badge>}
                    </span>
                    <span className="text-caption text-fg-secondary">{f.detalle}</span>
                  </span>
                  {/* Móvil: la acción baja debajo del texto (alineada con él) para no apretarlo. */}
                  <div className="basis-full pl-9 lg:basis-auto lg:pl-0">
                    <Link
                      href={f.href}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "static px-3 transition after:absolute after:inset-0 after:content-[''] active:scale-98",
                      )}
                    >
                      Ver detalle<span className="sr-only">: {f.titulo}</span>
                    </Link>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
