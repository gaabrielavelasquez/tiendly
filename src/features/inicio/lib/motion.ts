import { motionTokens } from "@/styles/tokens";

// Movimiento de Inicio: duración y curva salen de motionTokens (150 ms ease-out).
export const ease = [...motionTokens.easing] as [number, number, number, number];
export const rapido = { duration: motionTokens.durationFast, ease };
/** Barras y barra de progreso: un poco más largas para que se lea el crecimiento. */
export const crecer = { duration: motionTokens.durationFast * 2, ease };
/** Separación entre elementos escalonados. */
export const ESCALON = 0.06;
