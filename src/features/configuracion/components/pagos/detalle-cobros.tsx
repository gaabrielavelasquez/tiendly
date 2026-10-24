import type { Cobros } from "../../types";

const PASOS = [
  ["Tu cliente paga en tu tienda", "Con tarjeta o Yape, sin salir de tu web."],
  ["La venta se confirma sola", "Te avisamos al instante. No revisas capturas."],
  ["El dinero llega a tu cuenta", "A la cuenta a nombre de tu RUC, en los plazos de tu proveedor de pagos."],
];

/** "Así funcionan los cobros automáticos" (Figma E4), desplegado en la misma tarjeta. */
export function ComoFunciona() {
  return (
    <div className="flex flex-col gap-4 text-body-sm">
      <ol className="flex flex-col gap-3">
        {PASOS.map(([t, d], i) => (
          <li key={t} className="flex gap-3">
            <span aria-hidden className="flex size-6 shrink-0 items-center justify-center text-body-sm text-fg-secondary tabular-nums">{i + 1}</span>
            <span className="flex flex-col"><span className="font-semibold text-fg">{t}</span><span className="text-fg-secondary">{d}</span></span>
          </li>
        ))}
      </ol>
      <p className="flex flex-col"><span className="font-semibold text-fg">¿Cuánto cuesta?</span><span className="text-fg-secondary">Una comisión por cada venta. No pagas nada por adelantado y la ves antes de aceptar.</span></p>
      <p className="flex flex-col"><span className="font-semibold text-fg">¿Y mi Yape de siempre?</span><span className="text-fg-secondary">Sigue funcionando en Pedidos por WhatsApp. Puedes tener los dos activos.</span></p>
    </div>
  );
}

const fila = "flex justify-between gap-3 text-body-sm";

/** "Cuenta y comisiones" (Figma E7). */
export function CuentaYComisiones({ cuenta }: { cuenta: NonNullable<Cobros["cuenta"]> }) {
  return (
    <div className="flex flex-col gap-4">
      <dl className="flex flex-col gap-2">
        <dt className="text-label font-semibold tracking-widest text-fg-secondary uppercase">Cuenta de depósito</dt>
        {[["Banco", cuenta.banco], ["Tipo", cuenta.tipo], ["Número", `···· ${cuenta.ultimos4}`], ["A nombre de", cuenta.titular]].map(([k, v]) => (
          <div key={k} className={fila}><dt className="text-fg-secondary">{k}</dt><dd className="text-right font-semibold text-fg">{v}</dd></div>
        ))}
      </dl>
      <dl className="flex flex-col gap-2">
        <dt className="text-label font-semibold tracking-widest text-fg-secondary uppercase">Comisión por cada venta</dt>
        {[["Tarjeta de crédito", "3.45% + S/ 0.30"], ["Tarjeta de débito", "2.99% + S/ 0.30"], ["Yape", "1.50%"]].map(([k, v]) => (
          <div key={k} className={fila}><dt className="text-fg-secondary">{k}</dt><dd className="font-normal text-fg tabular-nums">{v}</dd></div>
        ))}
        <dd className="text-caption text-fg-secondary">Más IGV. Se descuenta de cada venta.</dd>
      </dl>
      <p className="text-caption text-fg-secondary">Para cambiar la cuenta de depósito, escríbenos: el proveedor de pagos vuelve a revisar tus datos antes de depositar.</p>
    </div>
  );
}
