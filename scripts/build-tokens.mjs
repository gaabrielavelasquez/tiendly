// Genera src/styles/tokens.css y src/styles/tokens.ts desde design/tokens.json (DTCG).
// Nunca edites los archivos generados: cambia los tokens en Figma, exporta y corre `npm run tokens`.
import { readFileSync, writeFileSync } from "node:fs";

const src = JSON.parse(readFileSync(new URL("../design/tokens.json", import.meta.url), "utf8"));
const P = "--tl-";
const FONT_STACKS = {
  Inter: '"Inter Variable", "Inter", ui-sans-serif, system-ui, sans-serif',
  Outfit: '"Outfit", ui-sans-serif, system-ui, sans-serif',
  "Bricolage Grotesque": '"Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif',
  "Instrument Serif": '"Instrument Serif", ui-serif, Georgia, serif',
  "Plus Jakarta Sans": '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
};
const WEIGHTS = { Regular: 400, Medium: 500, Bold: 700, ExtraBold: 800, Black: 900 };

const tokens = [];
(function walk(node, path) {
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("$")) continue;
    if (v && typeof v === "object" && "$value" in v) tokens.push({ path: [...path, k], ...v });
    else if (v && typeof v === "object") walk(v, [...path, k]);
  }
})(src, []);

const name = (path) => P + path.join("-");
const ref = (s) => s.replace(/\{([a-z0-9.\-]+)\}/gi, (_, r) => `var(${P}${r.replace(/\./g, "-")})`);
const dim = (v) => (typeof v === "object" ? `${v.value}${v.unit}` : v);

function value(t, v) {
  if (typeof v === "string" && v.startsWith("{")) return ref(v);
  switch (t.$type) {
    case "fontFamily": return FONT_STACKS[v] ?? `"${v}", sans-serif`;
    case "fontWeight": return String(typeof v === "number" ? v : WEIGHTS[v] ?? 400);
    case "duration": return dim(v);
    case "cubicBezier": return `cubic-bezier(${v.join(", ")})`;
    case "shadow": {
      const one = (s) => `${s.inset ? "inset " : ""}${s.offsetX} ${s.offsetY} ${s.blur} ${s.spread} ${ref(s.color)}`;
      return Array.isArray(v) ? v.map(one).join(", ") : one(v);
    }
    case "gradient": {
      const css = t.$extensions?.["com.tiendly"]?.css;
      if (css) return css.replace(/var\(--([a-z0-9-]+)\)/g, (_, n) => `var(${P}${n})`);
      return `linear-gradient(135deg, ${v.map((s) => `${ref(s.color)} ${s.position * 100}%`).join(", ")})`;
    }
    default: return typeof v === "number" ? String(v) : ref(String(v));
  }
}

const root = [], dark = [], desktop = [];
const themes = { neutral: [], editorial: [], suave: [], custom: [] };
for (const t of tokens) {
  const n = name(t.path);
  root.push(`  ${n}: ${value(t, t.$value)};`);
  const modes = t.$extensions?.["com.tiendly"]?.modes;
  if (!modes) continue;
  if ("Oscuro" in modes) dark.push(`  ${n}: ${value(t, modes.Oscuro)};`);
  if ("Desktop" in modes && modes.Desktop !== modes["Móvil"]) desktop.push(`  ${n}: ${value(t, modes.Desktop)};`);
  for (const th of Object.keys(themes)) {
    const key = th[0].toUpperCase() + th.slice(1);
    if (key in modes) themes[th].push(`  ${n}: ${value(t, modes[key])};`);
  }
}

let css = `/* GENERADO por scripts/build-tokens.mjs desde design/tokens.json. No editar a mano. */\n`;
css += `/* :root = modo Claro + tema Tiendly (panel) + escala Móvil. */\n:root {\n${root.join("\n")}\n}\n\n`;
css += `@media (min-width: 1024px) {\n  :root {\n${desktop.map((l) => "  " + l).join("\n")}\n  }\n}\n\n`;
for (const [th, lines] of Object.entries(themes)) css += `/* Tema de vitrina: ${th} */\n[data-theme="${th}"] {\n${lines.join("\n")}\n}\n\n`;
css += `/* Modo oscuro: fuera de la V1, se genera para no perder los valores. */\n[data-mode="dark"] {\n${dark.join("\n")}\n}\n`;
writeFileSync(new URL("../src/styles/tokens.css", import.meta.url), css);

const motion = {
  durationFast: (src.motion.duration.fast.$value.value) / 1000,
  easing: src.motion.easing.standard.$value,
  pressedScale: src.motion.scale.pressed.$value,
};
writeFileSync(
  new URL("../src/styles/tokens.ts", import.meta.url),
  `// GENERADO por scripts/build-tokens.mjs. No editar a mano.\nexport const motionTokens = ${JSON.stringify(motion, null, 2)} as const;\n`,
);
console.log(`tokens: ${tokens.length} variables → src/styles/tokens.css + tokens.ts`);
