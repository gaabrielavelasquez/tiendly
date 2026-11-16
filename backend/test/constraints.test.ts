import { test } from 'node:test';
import assert from 'node:assert/strict';
import { asConstraintConflict } from '../src/shared/constraints.ts';

test('constraint conflicts recognize UNIQUE and CHECK codes and legacy messages only', () => {
  // D1 y miniflare modernos traen el subcódigo estructurado: UNIQUE y CHECK son conflicto, la FK no.
  assert.equal(asConstraintConflict({ code: 'SQLITE_CONSTRAINT_UNIQUE' }), true);
  assert.equal(asConstraintConflict({ code: 'SQLITE_CONSTRAINT_CHECK' }), true);
  assert.equal(asConstraintConflict({ code: 'SQLITE_CONSTRAINT_FOREIGN_KEY' }), false);
  // Sin código (SQLite viejo/miniflare): el mensaje textual decide, igual que antes.
  assert.equal(asConstraintConflict(new Error('UNIQUE constraint failed: stores.slug')), true);
  // Una falla ajena al esquema nunca es conflicto de negocio.
  assert.equal(asConstraintConflict(new TypeError('x is not a function')), false);
});
