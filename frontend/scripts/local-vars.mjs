import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { parseEnv } from "node:util";

export async function prepareLocalVars(path) {
  try {
    await writeFile(path, [
      "# Solo desarrollo local. No compartir ni subir este archivo.",
      "BETTER_AUTH_URL=http://localhost:3215",
      `BETTER_AUTH_SECRET=${randomBytes(48).toString("base64url")}`,
      "GOOGLE_CLIENT_ID=",
      "GOOGLE_CLIENT_SECRET=",
      "",
    ].join("\n"), { flag: "wx", mode: 0o600 });
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
  }
  const vars = parseEnv(await readFile(path, "utf8"));
  assert.equal(vars.BETTER_AUTH_URL, "http://localhost:3215", ".dev.vars debe usar http://localhost:3215.");
  assert(vars.BETTER_AUTH_SECRET?.length >= 32, "Configura un secreto local de al menos 32 caracteres en .dev.vars.");
  assert.equal(Boolean(vars.GOOGLE_CLIENT_ID), Boolean(vars.GOOGLE_CLIENT_SECRET), "Configura ambos secretos de Google o deja ambos vacíos.");
  assert(!vars.TIENDLY_ENTORNO || vars.TIENDLY_ENTORNO === "local", ".dev.vars no puede cambiar el entorno local.");
  return { google: Boolean(vars.GOOGLE_CLIENT_ID) };
}
