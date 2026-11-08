# Stores remote proof

Use only the disposable D1 configured in `wrangler.jsonc`. Apply `backend/db/migrations/` to it, then run from the repository root:

```sh
npx --no-install wrangler dev --remote --port 3218 --config backend/probes/stores/wrangler.jsonc
curl --fail-with-body http://localhost:3218/
```

The probe invokes the actual stores application commands and D1 adapter. It races creates for one owner and edits for one expected version, verifies foreign ownership rejection and checks empty delivery settings. Its generated synthetic store/user are deleted after successful execution. This Worker has privileged test access; it must never be deployed with application data. Run requests sequentially.
