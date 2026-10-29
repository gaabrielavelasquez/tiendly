# Tiendly

Tiendas online para quien vende por Instagram y WhatsApp en Perú: panel de la tienda, vitrina y compra.

| Carpeta | Qué hay |
|---|---|
| [`frontend/`](frontend/README.md) | La app Next.js: panel, vitrina, checkout y onboarding. Su sistema visual está en [`frontend/DESIGN.md`](frontend/DESIGN.md). Los comandos `npm` se corren aquí. |
| [`backend/`](backend/README.md) | Base de datos, Workers y scripts. Todavía sin código: ver [`docs/plan-backend.md`](docs/plan-backend.md). |
| [`docs/`](docs/) | Decisiones, traspaso, planes y capturas. |

`.vercelignore` está en la raíz, no en `frontend/`: Vercel construye desde `frontend/` (Root Directory), pero solo aplica el `.vercelignore` de la raíz. Ahí se excluyen las fotos de Heather, que no dio su permiso para publicarlas.

Antes de cambiar algo, lee [`AGENTS.md`](AGENTS.md) y [`CLAUDE.md`](CLAUDE.md).

```bash
cd frontend
npm install
npm run dev
```
