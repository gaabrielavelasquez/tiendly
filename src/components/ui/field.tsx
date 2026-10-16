import { CircleAlert } from "lucide-react";
import { useId } from "react";
import { cn } from "@/lib/cn";

type FieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label: string;
  /** Texto de ayuda. Termina con punto (regla de micro-copy). */
  hint?: string;
  /** Mensaje de error. Termina con punto. */
  error?: string;
  prefix?: string;
};

/** Campo (componente Campo de Figma): etiqueta, caja de 48 px, ayuda o error. */
export function Field({ label, hint, error, prefix, className, id, ...rest }: FieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const msgId = `${inputId}-msg`;
  const message = error ?? hint;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={inputId} className="text-body-sm font-semibold text-fg">
        {label}
      </label>
      <div
        className={cn(
          "flex h-12 items-center gap-2 rounded-button border bg-surface px-3 transition-colors",
          "focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-focus",
          error ? "border-error" : "border-line-strong",
        )}
      >
        {prefix && <span className="text-body text-fg-secondary">{prefix}</span>}
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? msgId : undefined}
          className="h-full w-full bg-transparent text-body text-fg outline-none placeholder:text-fg-tertiary"
          {...rest}
        />
      </div>
      {message && (
        <p id={msgId} className={cn("flex items-start gap-1 text-caption", error ? "text-error" : "text-fg-secondary")}>
          {error && <CircleAlert aria-hidden className="mt-px size-4 shrink-0" />}
          {message}
        </p>
      )}
    </div>
  );
}
