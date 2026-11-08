import 'server-only';
import { env } from 'cloudflare:workers';
export async function imageStorage() { if(!env.UPLOADS)throw new Error('R2 unavailable');return env.UPLOADS; }
