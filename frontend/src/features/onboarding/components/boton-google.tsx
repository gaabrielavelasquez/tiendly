import { Button } from "@/components/ui";

/**
 * "Continuar con Google" según las guías de marca de Google (Sign in with Google): botón neutro con borde, el logo
 * "G" oficial a todo color y sin alterar (public/icons/google-g.svg, a la izquierda del texto) y el texto
 * localizado oficial. Con backend: conectar al flujo de Google Identity Services.
 */
export function BotonGoogle() {
  return (
    <Button type="button" variant="secondary" block>
      <span className="inline-flex items-center gap-3">
        {/* SVG estático de 18 px: next/image no aporta nada. */}
        <img src="/icons/google-g.svg" alt="" aria-hidden className="size-4.5 shrink-0" />
        Continuar con Google
      </span>
    </Button>
  );
}
