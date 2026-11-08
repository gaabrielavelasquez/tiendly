# Cloudflare foundation verification · 8 Nov 2026

- `d1-remote.json`: platform proof executed by a remote Worker against a disposable remote D1. An independent Wrangler remote SQL read confirms the final state. Stock, coupon limit, stale version, competing edits and full batch rollback pass.
- Next.js build, vinext build, token checks and TypeScript pass in the isolated worktree. Vinext reports 94% compatibility.
- `browser-local.json` and screenshots: local built Worker, Chromium and WebKit, 360/390/1440 widths. Coverage is limited to MUÑA, Products and Registration. This is not deployed-preview or full-flow acceptance.
- Font imports moved from nested CSS imports to layout imports, preserving the same families and weights while allowing Vite to emit their files. The experiment explicitly selects MUÑA.
- Cloudflare builds stage public assets excluding `heather` and `mi-tienda`, then verify the output. The reference `la-bodega/` clone is not in this isolated checkout or the build inputs. No app deployment occurred.

Still required: actions, cookies, redirects, revalidation, uploads, complete image-layout acceptance, four states, long inputs on deployed preview, application-schema concurrency, ownership, persistence, OAuth and end-to-end checkout. A Google OAuth client and preview origin have not been created yet. Production cutover is not approved.
