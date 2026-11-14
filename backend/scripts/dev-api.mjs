import { createServer } from 'node:net';
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parseEnv } from 'node:util';
const root = resolve(import.meta.dirname, '..');
const path = resolve(root, '.dev.vars');
const check = createServer();
await new Promise((done, reject) => { check.once('error', reject); check.listen(3221, '127.0.0.1', done); });
await new Promise(done => check.close(done));
try { await writeFile(path, `BETTER_AUTH_SECRET=${randomBytes(48).toString('base64url')}\nGOOGLE_CLIENT_ID=\nGOOGLE_CLIENT_SECRET=\n`, { flag: 'wx', mode: 0o600 }); }
catch (error) { if (error.code !== 'EEXIST') throw error; }
const vars = parseEnv(await readFile(path, 'utf8'));
if (!vars.BETTER_AUTH_SECRET || vars.BETTER_AUTH_SECRET.length < 32 || Boolean(vars.GOOGLE_CLIENT_ID) !== Boolean(vars.GOOGLE_CLIENT_SECRET)) throw new Error('Revisa la configuración local de la API.');
const wrangler = resolve(root, '../node_modules/wrangler/bin/wrangler.js');
const env = { ...process.env, CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV: 'false', CLOUDFLARE_INCLUDE_PROCESS_ENV: 'false' };
const migration = spawn(process.execPath, [wrangler, 'd1', 'migrations', 'apply', 'DB', '--local'], { cwd: root, stdio: 'inherit', env: { ...env, CI: 'true' } });
const code = await new Promise((done, reject) => { migration.once('exit', done); migration.once('error', reject); });
if (code !== 0) throw new Error('Fallaron las migraciones locales de la API.');
const server = spawn(process.execPath, [wrangler, 'dev', '--local'], { cwd: root, stdio: 'inherit', env });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.kill(signal));
server.on('exit', code => { process.exitCode = code ?? 1; });
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
