"use client";

import { useState } from "react";
import { Button, Field } from "@/components/ui";
import { RubroChips } from "./rubro-chips";
import { SlugStatus } from "./slug-status";
import { useOnboarding } from "../hooks/use-onboarding";
import { crearTienda } from "../lib/acciones";
import { useSlugCheck } from "../hooks/use-slug-check";
import { errorCelular, formatear, soloDigitos } from "../lib/phone";

type Errores = { nombre?: string; rubro?: string; celular?: string };

/** O3 / OD3 · Nombre + rubro + WhatsApp de ventas. La vista previa de desktop se arma en vivo. */
export function StepDatos() {
  const { state, set } = useOnboarding();
  const slug = useSlugCheck(state.nombre);
  const [errores, setErrores] = useState<Errores>({});
  const [creando, setCreando] = useState(false);

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    const nuevos: Errores = {
      nombre: state.nombre.trim().length < 2 ? "Escribe el nombre de tu negocio." : undefined,
      rubro: state.rubros.length ? undefined : "Elige al menos una opción para armar tu tienda.",
      celular: errorCelular(state.celularVentas),
    };
    setErrores(nuevos);
    if (Object.values(nuevos).some(Boolean) || slug.estado !== "listo") return;
    setCreando(true);
    const final = slug.libre ? slug.slug : slug.sugerencia ?? slug.slug;
    // La tienda pasa a ser la de la sesión (panel y vitrina) y guarda sus rubros (Afiliación los precarga).
    const r = await crearTienda({ nombre: state.nombre, slug: final, celularVentas: state.celularVentas, rubros: state.rubros }).catch(() => ({
      error: "No pudimos crear tu tienda. Revisa tu conexión e inténtalo de nuevo.",
    }));
    setCreando(false);
    if ("error" in r) return setErrores({ nombre: r.error });
    set({ slug: r.slug, paso: "lista" }); // el servidor puede ajustar el link si alguien lo tomó recién
  }

  return (
    <form onSubmit={crear} noValidate className="flex flex-1 flex-col gap-6">
      <header className="flex flex-col gap-2">
        <p className="text-label font-semibold tracking-wide text-fg-secondary uppercase">Último paso</p>
        <h1 className="font-display-hero text-h1">Cuéntanos de tu negocio</h1>
        <p className="text-body text-fg-secondary">Con esto armamos tu tienda. Todo se puede cambiar después.</p>
      </header>
      <div className="flex flex-col gap-3">
        <Field
          label="Nombre de tu negocio"
          placeholder="Ej. Heather"
          autoComplete="organization"
          value={state.nombre}
          onChange={(e) => set({ nombre: e.target.value })}
          error={errores.nombre}
        />
        <SlugStatus estado={slug} />
      </div>
      <RubroChips value={state.rubros} onChange={(rubros) => set({ rubros })} error={errores.rubro} />
      <Field
        label="WhatsApp de ventas"
        prefix="+51"
        type="tel"
        inputMode="numeric"
        value={formatear(state.celularVentas)}
        onChange={(e) => set({ celularVentas: soloDigitos(e.target.value) })}
        hint="Es el número con el que te registraste. Puedes poner otro."
        error={errores.celular}
      />
      <Button type="submit" className="mt-auto lg:mt-2" block loading={creando}>
        Crear mi tienda
      </Button>
    </form>
  );
}
