import { TiendasEjemplo } from "./tiendas-ejemplo";
import { Wordmark } from "./wordmark";
import type { Paso } from "../hooks/use-onboarding";

const BENEFICIOS = ["Pedidos directo a tu WhatsApp.", "Cobra con tarjeta y Yape cuando quieras.", "Tus productos con sus opciones, en un solo link."];
type Props = { paso: Paso; linksEjemplo: string[]; preview?: React.ReactNode; children: React.ReactNode };

/** Código enfocado en móvil; datos sin beneficios; logro centrado en una sola columna. */
export function ShellRegistro({ paso, linksEjemplo, preview, children }: Props) {
  if (paso === "lista") return <main className="flex min-h-dvh min-w-0 flex-col gap-8 bg-page px-6 py-6 lg:px-16 lg:py-10">
    <Wordmark />
    <div className="mx-auto flex w-full min-w-0 max-w-lg flex-1 flex-col justify-center py-6">{children}</div>
  </main>;
  const beneficios = paso === "registro" && <ul className="flex flex-col gap-2.5 text-body text-fg">{BENEFICIOS.map((b) => <li key={b}>{b}</li>)}</ul>;
  return (
    <div className="min-h-dvh bg-page lg:grid lg:grid-cols-[5fr_4fr]">
      <aside className="hidden min-w-0 flex-col bg-sunken px-16 py-10 lg:flex">
        <Wordmark />
        <div className="flex flex-1 flex-col items-center justify-center py-6">
          <div className="flex w-full max-w-[min(var(--container-lg),calc(100dvh_-_var(--spacing)*126))] flex-col gap-6">
            {preview ?? <TiendasEjemplo links={linksEjemplo} halo={paso === "registro"} />}
            {beneficios}
          </div>
        </div>
      </aside>
      <main className="flex min-h-dvh min-w-0 flex-col px-6 py-6 lg:justify-center lg:bg-surface lg:px-16 lg:py-12">
        <div className="flex w-full min-w-0 flex-1 flex-col gap-8 lg:mx-auto lg:max-w-100 lg:flex-none">
          <Wordmark className="lg:hidden" />
          {children}
          {paso !== "codigo" && <div className="flex min-w-0 flex-col gap-6 lg:hidden">{preview ?? <TiendasEjemplo links={linksEjemplo} compacta />}{beneficios}</div>}
        </div>
      </main>
    </div>
  );
}
