import type { ConfigCompra } from "../types";

// Configuración de Heather (tienda de demo local).

export const CONFIG_HEATHER: ConfigCompra = {
  pagos: {
    whatsapp: { activo: true, celular: "987654321" },
    cobros: { estado: "activo", tarjeta: true, yape: true, cuenta: { banco: "BCP", tipo: "Cuenta corriente", ultimos4: "9012", titular: "HEATHER CALZADO E.I.R.L." } },
  },
  entregas: {
    delivery: {
      activo: true,
      zonas: [
        { id: "lima", activa: true, costo: "15", plazo: "2 a 3 días hábiles" },
        { id: "callao", activa: true, costo: "18", plazo: "2 a 3 días hábiles" },
        { id: "provincias", activa: true, costo: "25", plazo: "3 a 6 días hábiles" },
      ],
      envioGratis: { activo: true, desde: "700" },
    },
    recojo: { activo: true, direccion: "Calle Los Pinos 245", distrito: "Santiago de Surco", horario: "Lunes a sábado, 10 a. m. a 7 p. m.", nota: "Te escribo por WhatsApp para coordinar el día y la hora." },
  },
};

