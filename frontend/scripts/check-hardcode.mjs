// Regla de CLAUDE.md: cero hardcoding. Falla si un componente usa hex, rgb/hsl o px sueltos.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../src", import.meta.url));
const SKIP = new Set(["tokens.css", "tokens.ts"]);
const RULES = [
  [/#[0-9a-fA-F]{3,8}\b/, "color hex"],
  [/\b(rgba?|hsla?|oklch)\(/, "color literal"],
  [/\[[^\]]*\d+(px|rem|em)[^\]]*\]/, "valor arbitrario de Tailwind con medida fija"],
  [/:\s*\d+(\.\d+)?px\b/, "px directo en CSS"],
];
const files = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|css)$/.test(f) && !SKIP.has(f)) files.push(p);
  }
})(ROOT);
const errors = [];
for (const f of files) {
  readFileSync(f, "utf8").split("\n").forEach((line, i) => {
    if (line.includes("hardcode-ok")) return;
    for (const [re, why] of RULES) if (re.test(line)) errors.push(`${f.replace(ROOT, "src")}:${i + 1}  ${why}  →  ${line.trim()}`);
  });
}
if (errors.length) {
  console.error(`✖ ${errors.length} valores escritos a mano (usa tokens de DESIGN.md):\n` + errors.join("\n"));
  process.exit(1);
}
console.log(`✓ sin valores escritos a mano en ${files.length} archivos`);
