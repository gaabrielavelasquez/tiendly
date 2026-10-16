import { cn } from "@/lib/cn";

type CardProps = React.HTMLAttributes<HTMLDivElement> & { as?: "div" | "section" | "article" };

/** Tarjeta: blanco sobre el lienzo (bg/page), radio 12 px (0020), borde plano de 1 px (border/subtle, negro al 10 %), sin sombra (editorial, 0023) y aire generoso (24 · 32 px). */
export function Card({ as: Tag = "div", className, ...rest }: CardProps) {
  return (
    <Tag
      className={cn("rounded-card border border-line-subtle bg-surface p-6 lg:p-8", className)}
      {...rest}
    />
  );
}
