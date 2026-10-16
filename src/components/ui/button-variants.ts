import { cva } from "class-variance-authority";

// DESIGN.md §4 · Calibrado (decisión 0024): el CTA vuelve al degradado cobalto → marino, en tipo oración.
export const buttonVariants = cva(
  // Sleek & Crisp (0020): se ve de 40/36 px; el ::after estira la zona táctil a 48/44 px.
  "group relative isolate inline-flex aria-busy:pointer-events-none items-center justify-center gap-2 rounded-button font-body font-semibold transition-colors disabled:cursor-not-allowed after:absolute after:inset-x-0 after:-inset-y-1 after:content-['']",
  {
    variants: {
      variant: {
        primary: "bg-cta text-on-accent disabled:bg-none disabled:bg-sunken disabled:text-fg-tertiary",
        secondary: "border border-line-strong bg-surface text-fg hover:bg-sunken disabled:text-fg-tertiary",
        ghost: "text-accent-text hover:bg-accent-subtle disabled:text-fg-tertiary",
        danger: "bg-danger text-on-danger hover:bg-danger-hover disabled:bg-sunken disabled:text-fg-tertiary",
      },
      size: {
        md: "h-10 px-4 text-body-sm",
        sm: "h-9 px-3 text-body-sm",
      },
      block: { true: "w-full" },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);
