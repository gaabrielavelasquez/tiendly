// Hasta tener un servicio de imágenes: la foto elegida se achica en el navegador (lado mayor de 1200 px,
// JPEG) y viaja con el producto. Así se ve en la vitrina desde cualquier dispositivo.

const LADO = 1200;

export async function fotoParaGuardar(url: string): Promise<string> {
  if (!url.startsWith("blob:")) return url;
  const img = new Image();
  img.src = url;
  await img.decode();
  const escala = Math.min(1, LADO / Math.max(img.naturalWidth, img.naturalHeight));
  const lienzo = document.createElement("canvas");
  lienzo.width = Math.round(img.naturalWidth * escala);
  lienzo.height = Math.round(img.naturalHeight * escala);
  const ctx = lienzo.getContext("2d");
  if (!ctx) throw new Error("Sin canvas.");
  ctx.fillStyle = "white"; // las PNG transparentes quedan sobre blanco, como el fondo de la vitrina
  ctx.fillRect(0, 0, lienzo.width, lienzo.height);
  ctx.drawImage(img, 0, 0, lienzo.width, lienzo.height);
  return lienzo.toDataURL("image/jpeg", 0.82);
}
