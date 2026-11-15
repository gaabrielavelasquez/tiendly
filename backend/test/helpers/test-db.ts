import { readFile, readdir } from 'node:fs/promises';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import type { D1Database, R2Bucket } from '@cloudflare/workers-types';
import { BusinessError } from '../../src/identity/domain/access.ts';

export async function applyMigrations(db: D1Database): Promise<void> {
  for (const file of (await readdir(new URL('../../db/migrations', import.meta.url))).filter(name => name.endsWith('.sql')).sort()) {
    const sql = await readFile(new URL(`../../db/migrations/${file}`, import.meta.url), 'utf8');
    for (const statement of sql.replace(/^--.*$/gm, '').split(';').filter(x => x.trim())) await db.prepare(statement).run();
  }
}

export async function createTestMiniflare(options: { r2?: boolean; persist?: string } = {}): Promise<{ mf: Miniflare; db: D1Database; bucket: R2Bucket }> {
  const mf = new Miniflare({
    ...convertV4MiniflareOptions({
      modules: true,
      script: 'export default { fetch() { return new Response("ok") } }',
      compatibilityDate: '2026-11-08',
      d1Databases: ['DB'],
      ...(options.r2 ? { r2Buckets: ['UPLOADS'] } : {}),
    }),
    ...(options.persist ? { resourcePersistencePath: options.persist } : {}),
  });
  const db = (await mf.getD1Database('DB')) as unknown as D1Database;
  await applyMigrations(db);
  const bucket = options.r2 ? ((await mf.getR2Bucket('UPLOADS')) as unknown as R2Bucket) : (undefined as unknown as R2Bucket);
  return { mf, db, bucket };
}

export async function insertTestUser(db: D1Database, id: string): Promise<void> {
  await db.prepare('INSERT INTO user(id,name,email,emailVerified,createdAt,updatedAt) VALUES(?,?,?,1,?,?)').bind(id, 'Test', `${id}@example.invalid`, Date.now(), Date.now()).run();
}

export const errorCode = (code: string) => (e: unknown) => e instanceof BusinessError && e.code === code;
