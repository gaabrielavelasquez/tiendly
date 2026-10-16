import type { LucideIcon } from "lucide-react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  /** Termina con punto (regla de micro-copy). */
  description: string;
  action?: React.ReactNode;
};

/** Estado vacío accesible (CLAUDE.md §5): qué va a aparecer y cuál es el primer paso. */
export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-sunken">
        <Icon aria-hidden className="size-7 text-icon" />
      </div>
      <h2 className="font-display-title text-h3 text-fg">{title}</h2>
      <p className="max-w-sm text-body text-fg-secondary">{description}</p>
      {action}
    </div>
  );
}
