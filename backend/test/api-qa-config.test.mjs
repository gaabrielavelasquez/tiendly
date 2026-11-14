import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { assertApiQaConfig } from '../scripts/api-qa-config.mjs';
const original = JSON.parse(await readFile(new URL('../wrangler.preview.jsonc', import.meta.url), 'utf8'));
test('API release target rejects production resources, extra routes and frontend Worker replacement', () => {
  assert.doesNotThrow(() => assertApiQaConfig(original));
  for (const change of [
    config => { config.name = 'preview'; },
    config => { config.account_id = 'another-account'; },
    config => { config.vars.TIENDLY_ENTORNO = 'production'; },
    config => { config.vars.BETTER_AUTH_URL = 'https://production.example'; },
    config => { config.d1_databases[0].database_id = 'production-id'; },
    config => { config.r2_buckets[0].bucket_name = 'production-images'; },
    config => { config.routes = ['production.example/*']; },
    config => { config.env = { production: {} }; },
    config => { config.main = '../frontend/entry.js'; },
  ]) {
    const config = structuredClone(original); change(config);
    assert.throws(() => assertApiQaConfig(config));
  }
});
