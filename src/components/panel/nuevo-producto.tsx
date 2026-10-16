import { Plus } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui";
import { cn } from "@/lib/cn";

/** "+ Nuevo producto": el CTA del panel (negro sólido, uno por vista, decisión 0023). */
export function NuevoProducto({ className }: { className?: string }) {
  return (
    <Link
      href="/panel/productos/nuevo"
      className={cn(buttonVariants({ variant: "primary" }), "transition active:scale-98", className)}
    >
      <Plus aria-hidden strokeWidth={2} className="size-4" />
      <span>Nuevo producto</span>
    </Link>
  );
}
