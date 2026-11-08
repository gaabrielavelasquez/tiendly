import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { getMigrations } from 'better-auth/db/migration';
import { writeFile } from 'node:fs/promises';
const mf = new Miniflare(convertV4MiniflareOptions({ modules: true, script: 'export default { fetch() { return new Response("ok") } }', compatibilityDate: '2026-11-08', d1Databases: ['DB'] }));
try {
  const database = await mf.getD1Database('DB');
  const migration = await getMigrations({ database });
  await writeFile(new URL('../db/migrations/0001_auth.sql', import.meta.url), '-- Generated with Better Auth 1.7.18 native D1 dialect.\n'+await migration.compileMigrations()+'\n');
} finally { await mf.dispose(); }
