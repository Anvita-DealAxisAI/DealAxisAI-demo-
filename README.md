# DealAxis AI

B2B sales intelligence dashboard — Opportunity Landscape MVP.

## Run the UI (now)

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Data still comes from `mockData.js` until Supabase is wired (Phase 3).

---

## Database first — Supabase + Postgres

**Follow:** [`docs/GETTING_STARTED.md`](docs/GETTING_STARTED.md)

| Phase | Action |
|-------|--------|
| **1** | Create Supabase project → run `db/schema.sql` + `db/seed.sql` |
| **2** | Verify `v_account_landscape_summary` in SQL Editor |
| **3** | Connect React (`@supabase/supabase-js`) |
| **4** | Auth + RLS (`db/rls.sql`) |
| **5** | Deploy to Netlify |

Copy [`.env.example`](.env.example) → `.env` with your Supabase URL and keys.

```bash
# After DATABASE_URL is in .env (or exported):
npm run db:schema
npm run db:seed
```

More detail: [`docs/DATABASE.md`](docs/DATABASE.md) · Architecture: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

---

## Project structure

```
db/
  schema.sql          Tables + landscape view
  seed.sql            Sample banks
  queries/landscape.sql
  rls.sql             Phase 4 security
src/
  api/accounts.js     Landscape fetch (mock → Supabase in Phase 3)
  data/mockData.js
docs/
  GETTING_STARTED.md  ← start here
  DATABASE.md
  ARCHITECTURE.md
```

---

## Build

```bash
npm run build
npm run preview
```
