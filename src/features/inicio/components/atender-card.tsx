"use client";

import { Check, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { Card } from "@/components/ui";
import { cn } from "@/lib/cn";
import { ESCALON, rapido } from "../lib/motion";
import type { Pendiente } from "../lib/reglas";

// El punto de color siempre va acompañado de texto: nunca es la única señal.
const PUNTO: Record<Pendiente["tono"], string> = { success: "bg-success", warning: "bg-warning", error: "bg-error" };

type AtenderCardProps = { filas: Pendiente[]; className?: string };

/** "Para atender hoy": atajos a las listas ya filtradas. Entrada escalonada (fade + y). */
export function AtenderCard({ filas, className }: AtenderCardProps) {
  const reduce = useReducedMotion();
  return (
    <Card as="section" aria-labelledby="atender-titulo" className={cn("flex flex-col", className)}>
      <h2 id="atender-titulo" className="pb-2 text-body font-bold text-fg">
        Para atender hoy
      </h2>
      {filas.length === 0 ? (
        <div className="flex min-h-14 items-center gap-3 border-t border-line-subtle py-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-success-surface">
            <Check aria-hidden strokeWidth={2} className="size-4 text-success" />
          </span>
          <p className="text-body-sm text-fg-secondary">
            <strong className="font-bold text-fg">Todo al día.</strong> No tienes pendientes.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col">
          {filas.map((f, i) => (
            <motion.li
              key={f.id}
              className="border-t border-line-subtle"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...rapido, delay: i * ESCALON }}
            >
              <Link
                href={f.href}
                className="group -mx-2 flex min-h-14 items-center gap-3 rounded-sm px-2 py-3 transition-colors hover:bg-sunken"
              >
                <span aria-hidden className={cn("size-2.5 shrink-0 rounded-full", PUNTO[f.tono])} />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-body-sm font-bold text-fg">{f.titulo}</span>
                  <span className="text-caption text-fg-secondary">{f.detalle}</span>
                </span>
                <ChevronRight
                  aria-hidden
                  strokeWidth={1.6}
                  className="size-6 shrink-0 text-icon transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </motion.li>
          ))}
        </ul>
      )}
    </Card>
  );
}
