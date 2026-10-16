import Link from "next/link";

const rutas = [
  { href: "/kit", label: "UI Kit", detalle: "Componentes base y tokens en vivo." },
  { href: "/panel", label: "Panel de la tienda", detalle: "Inicio, Pedidos, Productos y Mi tienda." },
  { href: "/demo", label: "Vitrina", detalle: "Lo que ve el cliente, con el tema de la tienda." },
  { href: "/registro", label: "Onboarding", detalle: "Registro con WhatsApp y 3 datos." },
];

export default function Home() {
  return (
    <main className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-12">
      <h1 className="font-display-hero text-display">Tiendly</h1>
      <ul className="flex flex-col gap-3">
        {rutas.map((r) => (
          <li key={r.href}>
            <Link href={r.href} className="block rounded-card border border-line-subtle bg-surface p-4 shadow-card">
              <span className="font-display-title text-h3">{r.label}</span>
              <span className="block text-body-sm text-fg-secondary">{r.detalle}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
