#!/usr/bin/env python3
"""Apply SQL migrations to the running local Worker, never to a remote database."""
import argparse
import json
from pathlib import Path
import sqlite3
from urllib.parse import quote, urlsplit
from urllib.request import Request, urlopen


def statements(source):
    current = ""
    for character in source:
        current += character
        if character == ";" and sqlite3.complete_statement(current):
            yield current
            current = ""
    # A non-comment tail without a terminator is an incomplete migration.
    tail = "\n".join(line for line in current.splitlines() if not line.lstrip().startswith("--"))
    if tail.strip():
        raise ValueError("La migración contiene una sentencia incompleta.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--origin", default="http://localhost:3215")
    args = parser.parse_args()
    origin = args.origin.rstrip("/")
    url = urlsplit(origin)
    if url.scheme != "http" or url.hostname not in ("localhost", "127.0.0.1") or url.username or url.password or url.path or url.query or url.fragment:
        parser.error("Solo se admite un origen HTTP local, sin rutas ni credenciales.")
    api = origin + "/cdn-cgi/local/explorer/api"

    def request(path, body=None):
        payload = None if body is None else json.dumps(body).encode()
        req = Request(api + path, data=payload, headers={"Content-Type": "application/json"})
        with urlopen(req, timeout=30) as response:
            result = json.load(response)
        if not result.get("success") or any(not entry.get("success", True) for entry in result.get("result", [])):
            raise RuntimeError("La API D1 local rechazó la operación.")
        return result["result"]

    databases = [db for db in request("/d1/database") if db["name"] == "DB"]
    if len(databases) != 1:
        raise RuntimeError("Inicia el Worker local con un único binding DB antes de migrar.")
    endpoint = "/d1/database/" + quote(databases[0]["uuid"], safe="") + "/raw"
    request(endpoint, {"sql": "CREATE TABLE IF NOT EXISTS d1_migrations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"})
    rows = request(endpoint, {"sql": "SELECT name FROM d1_migrations"})[0]["results"]["rows"]
    applied = {row[0] for row in rows}
    for migration in sorted((Path(__file__).resolve().parents[1] / "db/migrations").glob("*.sql")):
        if migration.name in applied:
            continue
        batch = [{"sql": sql} for sql in statements(migration.read_text())]
        batch.append({"sql": "INSERT INTO d1_migrations(name) VALUES(?)", "params": [migration.name]})
        request(endpoint, {"batch": batch})
        print("Aplicada localmente: " + migration.name)
    print("Migraciones locales al día. No se accedió a Cloudflare remoto.")


if __name__ == "__main__":
    main()
