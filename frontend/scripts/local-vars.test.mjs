import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { prepareLocalVars } from "./local-vars.mjs";

test("el secreto local es privado y estable al repetir el arranque", async () => {
  const dir = await mkdtemp(join(tmpdir(), "tiendly-local-"));
  try {
    const path = join(dir, ".dev.vars");
    assert.deepEqual(await prepareLocalVars(path), { google: false });
    const first = await readFile(path, "utf8");
    await prepareLocalVars(path);
    assert.equal(await readFile(path, "utf8"), first);
    if (process.platform !== "win32") assert.equal((await stat(path)).mode & 0o777, 0o600);
  } finally { await rm(dir, { recursive: true }); }
});

test("rechaza origen remoto, secreto vacío, Google incompleto y entorno distinto", async () => {
  const dir = await mkdtemp(join(tmpdir(), "tiendly-local-"));
  try {
    const path = join(dir, ".dev.vars");
    const valid = `BETTER_AUTH_URL=http://localhost:3215\nBETTER_AUTH_SECRET=${"a".repeat(48)}\n`;
    for (const invalid of [valid.replace("http://localhost:3215", "https://preview.tiendly.workers.dev"), valid.replace("a".repeat(48), ""), valid + "GOOGLE_CLIENT_ID=partial\n", valid + "TIENDLY_ENTORNO=production\n"]) {
      await writeFile(path, invalid);
      await assert.rejects(prepareLocalVars(path));
      assert.equal(await readFile(path, "utf8"), invalid);
    }
  } finally { await rm(dir, { recursive: true }); }
});
