# D1 correctness proof

This Worker runs against the **disposable** database named in `wrangler.jsonc`. Never bind it to application data. It resets only `probe_*` tables. Run one HTTP request at a time; the suite itself races competing writes.

From the repository root:

```sh
npx --no-install wrangler dev --remote --port 3218 --config backend/probes/d1/wrangler.jsonc
curl --fail-with-body http://localhost:3218/
```

Use `--remote`: `--local` disables remote bindings. A local PASS is insufficient. Each response field must be `true`. The suite verifies the last unit, last coupon, stale version, competing version updates, and rollback of order, allocation, redemption, coupon counter and history. `changes()` is checked in a subsequent constrained insert: a zero-row conditional update alone does not fail a batch.

Evidence from the remote run and an independent remote SQL read is in `docs/verificacion/cloudflare/d1-remote.json`. This is a platform proof; application migrations and command concurrency tests must still verify the final schema. The proof config is not an application deployment config.
