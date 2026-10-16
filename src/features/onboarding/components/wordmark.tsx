/** Logo de texto. Es la única pieza en cobalto fuera del CTA, porque es la marca (decisión 0019). */
export function Wordmark({ className }: { className?: string }) {
  return <p className={`font-display-title text-h1 text-accent ${className ?? ""}`}>tiendly</p>;
}
