import { cn } from "@/lib/cn";

type CardProps = React.HTMLAttributes<HTMLDivElement> & { as?: "div" | "section" | "article" };

/** Tarjeta: blanco sobre el lienzo, radio 16 px, sombra suave + halo cálido (DESIGN.md §4). */
export function Card({ as: Tag = "div", className, ...rest }: CardProps) {
  return (
    <Tag
      className={cn("rounded-card border border-line-subtle bg-surface p-4 shadow-card lg:p-5", className)}
      {...rest}
    />
  );
}
