"use client";
import { useId, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui";

export function CampoImagen({ label, valor, onChange }: { label: string; valor: string; onChange: (valor: string) => void }) {
  const id = useId();
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const version = useRef(0);
  async function elegir(file?: File) {
    if (!file) return;
    setError("");
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 1024 * 1024) {
      setError("Elige una imagen JPG, PNG o WebP de hasta 1 MB."); return;
    }
    const actual = ++version.current;
    setCargando(true);
    try {
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      await new Promise<void>((resolve, reject) => { const img = new Image(); img.onload = () => resolve(); img.onerror = reject; img.src = data; });
      if (actual === version.current) onChange(data);
    } catch { setError("No pudimos leer esa imagen. Prueba con otra."); }
    finally { setCargando(false); }
  }
  return <div className="flex flex-col gap-2">
    <p className="text-body-sm font-semibold">{label}</p>
    <div className="flex items-center gap-4">
      <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-card border border-line-subtle bg-sunken">
        {valor ? <img src={valor} alt={label} className="size-full object-contain" /> : <ImagePlus aria-hidden className="size-6 text-icon-subtle" />}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor={id} className="relative flex min-h-11 cursor-pointer items-center rounded-button border border-line-strong bg-surface px-3 text-body-sm font-semibold focus-within:outline-2 focus-within:outline-focus">
          {cargando ? "Leyendo imagen…" : valor ? "Cambiar imagen" : "Elegir imagen"}
          <input id={id} type="file" accept="image/png,image/jpeg,image/webp" disabled={cargando} aria-describedby={`${id}-ayuda`}
            className="absolute inset-0 w-full cursor-pointer opacity-0" onChange={e => { void elegir(e.target.files?.[0]); e.target.value = ""; }} />
        </label>
        {valor && <Button variant="ghost" disabled={cargando} onClick={() => { version.current++; onChange(""); }}>Quitar</Button>}
      </div>
    </div>
    <p id={`${id}-ayuda`} className="text-caption text-fg-secondary">JPG, PNG o WebP. Hasta 1 MB.</p>
    {error && <p role="alert" className="text-caption text-error">{error}</p>}
  </div>;
}
