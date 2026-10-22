import { Plus } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui";
import { cn } from "@/lib/cn";

/** "+ Nuevo producto": el CTA del panel (degradado cobalto, uno por vista, decisión 0024). */
export function NuevoProducto({ className }: { className?: string }) {
  return (
    <Link
      href="/panel/productos/nuevo"
      className={cn(buttonVariants({ variant: "primary" }), "transition hover:bg-cta-hover active:scale-98", className)}
    >
      <Plus aria-hidden strokeWidth={2} className="size-4" />
      <span>Nuevo producto</span>
    </Link>
  );
}
