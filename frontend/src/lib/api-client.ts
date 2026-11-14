import 'server-only';
import { headers } from 'next/headers';
import { cache } from 'react';
import type { StoreSnapshot, SessionView, ApiErrorCode } from '@tiendly/contracts';

/** Only the server knows the API origin. No infrastructure secrets belong in Next. */
export const usingApi = () => Boolean(process.env.TIENDLY_API_URL);
function endpoint(path: string): URL {
  const base = new URL(process.env.TIENDLY_API_URL ?? '');
  if (base.origin !== process.env.TIENDLY_API_URL || base.username || base.password || (base.protocol !== 'https:' && !(base.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(base.hostname)))) throw new Error('Invalid TIENDLY_API_URL');
  if (!/^\/(api\/(auth|business|public)\/|images\/)/.test(path) || path.startsWith('//')) throw new Error('Invalid API path');
  const target = new URL(path, base);
  if (target.origin !== base.origin) throw new Error('Invalid API origin');
  return target;
}
export class ApiError extends Error {
  constructor(public readonly code: ApiErrorCode, public readonly status: number) { super(code); }
}
export async function apiResponse(path: string, init: RequestInit = {}): Promise<Response> {
  const incoming = await headers();
  const forwarded = new Headers(init.headers);
  if (incoming.get('cookie')) forwarded.set('cookie', incoming.get('cookie')!);
  if (init.method && !['GET', 'HEAD'].includes(init.method)) {
    // Server Actions retain the browser origin. Never guess it from an untrusted forwarded host.
    const origin = incoming.get('origin');
    if (origin) forwarded.set('origin', origin);
  }
  try { return await fetch(endpoint(path), { ...init, headers: forwarded, cache: 'no-store', redirect: 'manual', signal: AbortSignal.timeout(15000) }); }
  catch { throw new ApiError('unavailable', 503); }
}
export async function apiJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await apiResponse(path, init);
  let result;
  try { result = await response.json(); } catch { throw new ApiError('unavailable', 503); }
  if (!response.ok) throw new ApiError(result?.error ?? 'unavailable', response.status);
  return result as T;
}
export const privateSnapshot = cache(async (): Promise<StoreSnapshot | null> => {
  try { return (await apiJson<{ snapshot: StoreSnapshot | null }>('/api/business/snapshot')).snapshot; }
  catch (error) { if (error instanceof ApiError && error.status === 401) return null; throw error; }
});
export async function apiSession(): Promise<SessionView> {
  const session = await apiJson<SessionView>('/api/auth/get-session');
  return session ? { user: { id: session.user.id, name: session.user.name } } : null;
}
export async function publicSnapshot(slug: string): Promise<StoreSnapshot | null> {
  if (!/^[a-z0-9-]{1,40}$/.test(slug)) return null;
  try { return (await apiJson<{ snapshot: StoreSnapshot }>(`/api/public/stores/${slug}`)).snapshot; }
  catch (error) { if (error instanceof ApiError && error.status === 404) return null; throw error; }
}

/** Auth and uploads keep their response bodies, redirects, and every Set-Cookie header. */
export async function proxyApi(request: Request): Promise<Response> {
  const url = new URL(request.url);
  try {
    const forwarded = new Headers(request.headers);
    forwarded.delete('host');
    forwarded.delete('connection');
    const init: RequestInit & { duplex: 'half' } = { method: request.method, headers: forwarded, body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body, duplex: 'half', redirect: 'manual', cache: 'no-store', signal: AbortSignal.timeout(15000) };
    const response = await fetch(endpoint(url.pathname + url.search), init);
    const output = new Response(response.body, response);
    // fetch decompresses upstream bodies; the downstream response must describe those bytes.
    output.headers.delete('content-encoding');
    output.headers.delete('content-length');
    if (!url.pathname.startsWith('/images/')) output.headers.set('cache-control', 'private, no-store');
    return output;
  } catch { return Response.json({ error: 'unavailable' }, { status: 503, headers: { 'Cache-Control': 'private, no-store' } }); }
}
