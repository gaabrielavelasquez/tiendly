import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

// Badge compacto: 24 px de alto, pill (decisión 0018). Sin cobalto (decisión 0019).
const badge = cva("inline-flex h-6 items-center gap-1 rounded-chip px-2 text-label font-semibold", {
  variants: {
    tone: {
      neutral: "bg-sunken text-fg",
      selected: "bg-selected text-on-selected",
      success: "border border-success-border bg-success-surface text-success",
      warning: "border border-warning-border bg-warning-surface text-warning",
      error: "border border-error-border bg-error-surface text-error",
      info: "border border-info-border bg-info-surface text-info",
    },
  },
  defaultVariants: { tone: "neutral" },
});

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badge>;

export function Badge({ tone, className, ...rest }: BadgeProps) {
  return <span className={cn(badge({ tone }), className)} {...rest} />;
}
