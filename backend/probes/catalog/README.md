# Catalog remote proof

Use only the disposable D1 in `wrangler.jsonc`, after applying `db/migrations/` there. From the repository root:

```sh
npx --no-install wrangler dev --remote --port 3218 --config backend/probes/catalog/wrangler.jsonc
curl --fail-with-body http://localhost:3218/
```

Each result must be true: concurrent expected-version edits, complete rollback on an invalid child row, rejection of a foreign owner, and preservation of product IDs/cents/empty gallery/no-table/no-option variant. The probe removes its synthetic store and user in `finally`. Never bind it to application data. R2 remote delivery is outside this proof.
