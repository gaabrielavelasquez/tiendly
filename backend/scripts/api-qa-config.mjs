import assert from 'node:assert/strict';

export function assertApiQaConfig(config) {
  assert.deepEqual(Object.keys(config).sort(), ['$schema', 'name', 'account_id', 'main', 'compatibility_date', 'compatibility_flags', 'workers_dev', 'vars', 'd1_databases', 'r2_buckets'].sort());
  assert.equal(config.main, 'src/runtime/api.ts');
  assert.equal(config.workers_dev, true);
  assert.equal(config.name, 'api-preview');
  assert.equal(config.account_id, '59f2586c7dd8a0467d1f9e444129e03a');
  assert.deepEqual(config.vars, { TIENDLY_ENTORNO: 'preview', BETTER_AUTH_URL: 'https://preview.tiendly.workers.dev' });
  assert.deepEqual(config.d1_databases, [{ binding: 'DB', database_name: 'tiendly-preview', database_id: '9fcfd54b-56a2-4cb9-af11-800e5191e93d', migrations_dir: 'db/migrations' }]);
  assert.deepEqual(config.r2_buckets, [{ binding: 'UPLOADS', bucket_name: 'tiendly-preview-images' }]);
}
