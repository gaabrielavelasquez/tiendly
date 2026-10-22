import { cn } from "@/lib/cn";

type CardProps = React.HTMLAttributes<HTMLDivElement> & { as?: "div" | "section" | "article" };

/** Tarjeta (decisión 0024): blanco sobre el lienzo cálido, radio de 8 px, borde border/subtle, sombra elevation/card y aire generoso (24 · 32 px). */
export function Card({ as: Tag = "div", className, ...rest }: CardProps) {
  return (
    <Tag
      className={cn("rounded-card border border-line-subtle bg-surface p-6 shadow-card lg:p-8", className)}
      {...rest}
    />
  );
}
