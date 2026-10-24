"use client";
import { useId, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui";

export function CampoImagen({ label, ayuda, valor, onChange }: { label: string; ayuda: string; valor: string; onChange: (valor: string) => void }) {
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
    <div className="flex items-center gap-3">
      <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden">
        {valor ? <img src={valor} alt={label} className="size-full object-contain" /> : <ImagePlus aria-hidden strokeWidth={1.5} className="size-6 text-icon" />}
      </div>
      <div className="min-w-0 flex-1"><p className="text-body-sm font-semibold">{label}</p><p id={`${id}-ayuda`} className="mt-1 text-caption text-fg-secondary">{ayuda}</p>
        {valor && <Button variant="ghost" size="sm" disabled={cargando} aria-label={`Quitar ${label.toLowerCase()}`} onClick={() => { version.current++; onChange(""); }}>Quitar</Button>}
      </div>
      <div className="flex shrink-0 items-center">
        <label htmlFor={id} className="relative flex min-h-11 cursor-pointer items-center rounded-button px-2 text-body-sm font-semibold text-accent-text focus-within:outline-2 focus-within:outline-focus">
          {cargando ? "Leyendo…" : valor ? "Cambiar" : "Elegir"}
          <input id={id} type="file" accept="image/png,image/jpeg,image/webp" disabled={cargando} aria-describedby={`${id}-ayuda`}
            aria-label={`${valor ? "Cambiar" : "Elegir"} ${label.toLowerCase()}`}
            className="absolute inset-0 w-full cursor-pointer opacity-0" onChange={e => { void elegir(e.target.files?.[0]); e.target.value = ""; }} />
        </label>
      </div>
    </div>
    {error && <p role="alert" className="text-caption text-error">{error}</p>}
  </div>;
}
