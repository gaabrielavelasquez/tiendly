import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const server = spawn(process.execPath, [resolve(root, '../node_modules/next/dist/bin/next'), 'dev', '--hostname', 'localhost', '--port', '3220'], {
  cwd: root, stdio: 'inherit', env: { ...process.env, TIENDLY_API_URL: process.env.TIENDLY_API_URL ?? 'http://127.0.0.1:3221', TIENDLY_ENTORNO: 'local', TIENDLY_TIENDA_DEMO: 'muna' },
});
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.kill(signal));
server.on('exit', code => { process.exitCode = code ?? 1; });
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
