import { cva } from "class-variance-authority";

// DESIGN.md §4 · El degradado cobalto es exclusivo del CTA (decisión 0019).
export const buttonVariants = cva(
  "group relative isolate inline-flex aria-busy:pointer-events-none items-center justify-center gap-2 overflow-hidden rounded-button font-body font-semibold transition-colors disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-cta text-on-accent disabled:bg-none disabled:bg-sunken disabled:text-fg-tertiary",
        secondary: "border border-line-strong bg-surface text-fg hover:bg-sunken disabled:text-fg-tertiary",
        ghost: "text-accent-text hover:bg-accent-subtle disabled:text-fg-tertiary",
        danger: "bg-danger text-on-danger hover:bg-danger-hover disabled:bg-sunken disabled:text-fg-tertiary",
      },
      size: {
        md: "h-12 px-5 text-body",
        sm: "h-10 px-4 text-body-sm",
      },
      block: { true: "w-full" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);
