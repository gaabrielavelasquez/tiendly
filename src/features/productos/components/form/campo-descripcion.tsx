type CampoProps = { valor: string; onCambio: (v: string) => void };

/** Descripción en texto simple (decisión 0027): sin barra de formato. La tienda respeta los saltos de línea. */
export function CampoDescripcion({ valor, onCambio }: CampoProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="campo-descripcion" className="text-body-sm font-semibold text-fg">
        Descripción
      </label>
      <textarea
        id="campo-descripcion"
        value={valor}
        onChange={(e) => onCambio(e.target.value)}
        rows={6}
        placeholder="Cuenta de qué está hecho, cómo queda y cómo cuidarlo."
        aria-describedby="ayuda-descripcion"
        className="block w-full resize-y rounded-button border border-line-strong bg-surface px-3 py-2.5 text-body text-fg transition outline-2 outline-offset-2 outline-transparent placeholder:text-fg-tertiary focus:outline-focus"
      />
      <p id="ayuda-descripcion" className="text-caption text-fg-secondary">
        Tus clientes la ven en la página del producto.
      </p>
    </div>
  );
}
