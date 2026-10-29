import { cn } from "@/lib/cn";

type CardProps = React.HTMLAttributes<HTMLDivElement> & { as?: "div" | "section" | "article" };

/**
 * Tarjeta (decisión 0024): blanco sobre el lienzo, radio de 8 px, sombra elevation/card y aire generoso (24 · 32 px).
 * Borde border/card casi invisible (decisión 0031): separa la sombra.
 */
export function Card({ as: Tag = "div", className, ...rest }: CardProps) {
  return (
    <Tag
      className={cn("rounded-card border border-line-card bg-surface p-6 shadow-card lg:p-8", className)}
      {...rest}
    />
  );
}
