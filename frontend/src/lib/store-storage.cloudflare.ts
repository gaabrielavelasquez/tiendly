import 'server-only';
import { env } from 'cloudflare:workers';
export async function storeStorage() {
 if(!env.DB)throw new Error('D1 unavailable');
 return env;
}
