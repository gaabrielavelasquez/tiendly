import { migrarItemStock } from "@/features/productos/lib/inventario";
import { migrarProducto } from "@/features/productos/lib/variantes";
import type { DatosTienda } from "./tienda";

// Migración en lectura (decisión 0032): las tiendas guardadas con variantes color × talla se leen con
// opciones genéricas. No escribe: la tienda queda guardada en el formato nuevo la próxima vez que cambie.
// Idempotente. Se quita cuando todas las tiendas se hayan guardado al menos una vez (ver auditoría §11).

type ItemGuardado = Parameters<typeof migrarItemStock>[0];

export function migrarDatos(d: DatosTienda): DatosTienda {
  const items = (xs: ItemGuardado[]) => xs.map(migrarItemStock);
  return {
    ...d,
    productos: d.productos.map(migrarProducto),
    inventario: Object.fromEntries(Object.entries(d.inventario).map(([id, a]) => [id, { ...a, items: items(a.items) }])),
    pedidos: { ...d.pedidos, creados: d.pedidos.creados.map((c) => ({ ...c, stock: items(c.stock) })) },
  };
}
