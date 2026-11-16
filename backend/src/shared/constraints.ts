/** Detecta los choques de negocio de SQLite: UNIQUE y CHECK. La FK u otros códigos no son conflicto de la tienda. */
export function asConstraintConflict(error: unknown): boolean {
  // D1 moderno trae el subcódigo estructurado: se decide por código y no por texto.
  const code = (error as { code?: unknown } | null)?.code;
  if (typeof code === 'string') return code === 'SQLITE_CONSTRAINT_UNIQUE' || code === 'SQLITE_CONSTRAINT_CHECK';
  // Miniflare y D1 viejo solo dejan mensaje: misma unión de patrones que usaban los adaptadores
  // ('guard' cubre el CHECK(ok) de write_guards, la falla de sobrevenda y de versión esperada).
  return /CHECK constraint failed|UNIQUE constraint failed|guard/i.test(String(error));
}
