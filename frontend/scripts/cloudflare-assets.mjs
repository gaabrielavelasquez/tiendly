import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { resolve, relative, sep } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const safe = resolve(root, '.cloudflare-public');
const excluded = new Set(['heather', 'mi-tienda']);
const mode = process.argv[2];
if (mode === 'prepare') {
  await rm(safe, { recursive: true, force: true });
  await mkdir(safe, { recursive: true });
  await cp(resolve(root, 'public'), safe, {
    recursive: true,
    filter: (source) => !excluded.has(relative(resolve(root, 'public'), source).split(sep)[0]),
  });
} else if (mode === 'verify') {
  const assets = resolve(root, '.cloudflare/output/v0/workers/default/assets');
  const entries = new Set(await readdir(assets));
  for (const name of excluded) {
    if (entries.has(name)) throw new Error(`Private assets found in Cloudflare output: ${name}`);
  }
  console.log('Cloudflare asset exclusions verified.');
} else {
  throw new Error('Expected prepare or verify.');
}
