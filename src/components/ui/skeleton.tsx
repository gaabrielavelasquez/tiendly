import { cn } from "@/lib/cn";

type SkeletonProps = { shape?: "line" | "block" | "circle"; className?: string };

const shapes = {
  line: "h-3 w-full rounded-sm",
  block: "h-40 w-full rounded-card",
  circle: "size-12 rounded-full",
} as const;

/** Estado de carga (CLAUDE.md §5). Respeta "reducir movimiento". */
export function Skeleton({ shape = "line", className }: SkeletonProps) {
  return <div aria-hidden className={cn("bg-sunken motion-safe:animate-pulse", shapes[shape], className)} />;
}
