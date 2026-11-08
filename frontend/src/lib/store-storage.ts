import 'server-only';
import type { Bindings } from '@tiendly/backend/server';
/** Legacy Next runtime is retained during transition; Cloudflare uses the binding implementation. */
export async function storeStorage():Promise<Bindings|null> { return null; }
