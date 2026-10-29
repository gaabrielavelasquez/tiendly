import { put } from "@vercel/blob";

// Fotos de productos. Con Vercel Blob (BLOB_READ_WRITE_TOKEN) se suben y quedan con una URL pública que
// se ve desde cualquier dispositivo. Sin token (desarrollo local), la foto queda como data URL.

/** Sube las fotos nuevas (data URL) y devuelve las URL definitivas; las demás quedan igual. */
export async function subirFotos(slug: string, urls: string[]): Promise<string[]> {
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
