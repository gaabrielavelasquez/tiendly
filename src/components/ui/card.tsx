import { cn } from "@/lib/cn";

type CardProps = React.HTMLAttributes<HTMLDivElement> & { as?: "div" | "section" | "article" };

/** Tarjeta: blanco sobre el lienzo (bg/page), radio 12 px (0020), borde border/subtle y sombra nítida elevation/card (0021) y aire generoso (24 · 32 px). */
export function Card({ as: Tag = "div", className, ...rest }: CardProps) {
  return (
    <Tag
      className={cn("rounded-card border border-line-subtle bg-surface p-6 shadow-card lg:p-8", className)}
      {...rest}
    />
  );
}
