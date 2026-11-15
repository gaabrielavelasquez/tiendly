import { usingApi, apiJson } from '@/lib/api-client';
import { headers } from "next/headers";
import { businessRuntime } from "@/lib/business-runtime";
import { storeStorage } from "@/lib/store-storage";
import { ownedStore, uploadImage } from "@tiendly/backend/server";
import { put } from "@vercel/blob";

// Fotos de productos. Con Vercel Blob (BLOB_READ_WRITE_TOKEN) se suben y quedan con una URL pública que
// se ve desde cualquier dispositivo. Sin token (desarrollo local), la foto queda como data URL.

/** Sube las fotos nuevas (data URL) y devuelve las URL definitivas; las demás quedan igual. */
function parseDataImage(url: string): { contentType: string; bytes: Uint8Array<ArrayBuffer> } | null {
  if (!url.startsWith('data:')) return null;
  const match = url.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!match) throw new Error('Revisa el formato de la imagen.');
  return { contentType: match[1], bytes: new Uint8Array(Buffer.from(match[2], 'base64')) };
}

export async function subirFotos(slug: string, urls: string[]): Promise<string[]> {
  if (usingApi()) return Promise.all(urls.map(async url => {
    const parsed = parseDataImage(url);
    if (!parsed) return url;
    return (await apiJson<{ url: string }>('/api/business/images', { method: 'POST', headers: { 'content-type': parsed.contentType }, body: parsed.bytes })).url;
  }));
  if (await storeStorage()) {
    const { runtime, uploads } = await businessRuntime();
    const actor = await runtime.actor(await headers());
    if (!uploads || !actor || (await ownedStore(runtime.stores, actor))?.slug !== slug) throw new Error("No se pudieron guardar las imágenes.");
    return Promise.all(urls.map(async url => {
      const parsed = parseDataImage(url);
      return parsed ? uploadImage(runtime.stores, uploads, actor, parsed.bytes, parsed.contentType) : url;
    }));
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) return urls;
  return Promise.all(
    urls.map(async (url) => {
      const m = url.match(/^data:(image\/[a-z+]+);base64,(.+)$/);
      if (!m) return url;
      const blob = await put(`productos/${slug}/${crypto.randomUUID()}.jpg`, Buffer.from(m[2], "base64"), { access: "public", contentType: m[1] });
      return blob.url;
    }),
  );
}
