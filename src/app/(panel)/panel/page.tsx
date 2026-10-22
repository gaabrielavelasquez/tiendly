import { PanelMain } from "@/components/panel";
import { VistaActividad } from "@/features/inicio/components/vista-actividad";
import { VistaNueva } from "@/features/inicio/components/vista-nueva";
import { leerEscenario, obtenerInicio } from "@/features/inicio/lib/mock";
import { esTiendaNueva } from "@/features/inicio/lib/reglas";

type PageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };
import { herramientasDev } from "@/lib/entorno";

/**
 * Inicio (decisión 0012). Con datos simulados: ?escenario=actividad (por defecto), al-dia, nueva o error.
 * Carga en loading.tsx y error en error.tsx; "tienda nueva" es el estado vacío.
 */
export default async function PanelInicio({ searchParams }: PageProps) {
  const { escenario } = await searchParams;
  const datos = await obtenerInicio(leerEscenario(herramientasDev ? escenario : undefined));
  return <PanelMain className="gap-10 lg:gap-12">{esTiendaNueva(datos) ? <VistaNueva datos={datos} /> : <VistaActividad datos={datos} />}</PanelMain>;
}
