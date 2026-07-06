# DealAxis — initial steps (Postgres + Supabase)

Stack: **PostgreSQL on Supabase** · React UI (mock data for now) · Auth & Netlify later.

**Prefer Excel first?** See **[EXCEL_TO_POSTGRES.md](./EXCEL_TO_POSTGRES.md)** and `data/excel-templates/`.

---

## Roadmap at a glance

| Phase | What | When |
|-------|------|------|
| **0** | Structure data in Excel (3 sheets / CSV templates) | **Now** (optional) |
| **1** | Supabase project + run schema + seed | After Excel is stable |
| **2** | Verify data in Supabase dashboard | **Now** |
| **3** | Connect React to Supabase (`@supabase/supabase-js`) | After DB looks right |
| **4** | Supabase Auth + Row Level Security | Before real users |
| **5** | Deploy UI to Netlify | When you want a shared URL |

Phases 1–2 are database-only. The app keeps using `mockData.js` until Phase 3.

---

## Phase 1 — Create Supabase & load schema (≈15 min)

### 1.1 Create project

1. Go to [supabase.com](https://supabase.com) → sign in → **New project**.
2. Name: `dealaxis` (or similar).
3. **Database password:** generate and **save** (password manager).
4. **Region:** US (East or West — pick closest to users).
5. Wait until the project is **Active**.

### 1.2 Get connection details

In the dashboard: **Project Settings → Database**

| Key | Use |
|-----|-----|
| **Project URL** | `VITE_SUPABASE_URL` (Phase 3) |
| **anon public** | `VITE_SUPABASE_ANON_KEY` (Phase 3, browser-safe with RLS) |
| **Connection string → URI** | `DATABASE_URL` (run SQL from terminal; **secret**) |

Copy `.env.example` → `.env` and paste values. Never commit `.env`.

### 1.3 Run schema

**Option A — SQL Editor (no install)**

1. **SQL Editor → New query**
2. Paste full contents of `db/schema.sql` → **Run**
3. New query → paste `db/seed.sql` → **Run**

**Option B — Terminal (`psql`)**

```bash
cd /Users/kats/Desktop/DealAxis
# paste DATABASE_URL from Supabase (Session mode or direct URI)
export DATABASE_URL="postgresql://postgres.[ref]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres"
psql "$DATABASE_URL" -f db/schema.sql
psql "$DATABASE_URL" -f db/seed.sql
```

Or npm scripts (after `.env` is set):

```bash
npm run db:schema
npm run db:seed
```

---

## Phase 2 — Verify (≈5 min)

In **SQL Editor**, run:

```sql
SELECT slug, total_opportunities, opportunity_range_label,
       top_service_line_themes, stakeholders_count
FROM v_account_landscape_summary;
```

Expected:

| slug | total_opportunities | stakeholders_count |
|------|---------------------|--------------------|
| citizens-bank | 4 | 12 |
| wells-fargo | 3 | 9 |

**Table Editor** should show: `organizations`, `accounts`, `opportunities`, `stakeholders`.

Optional file test:

```bash
psql "$DATABASE_URL" -v account_slug=citizens-bank -f db/queries/landscape.sql
```

---

## Phase 3 — Connect the React app (next coding step)

1. Install client: `npm install @supabase/supabase-js`
2. Add `src/lib/supabaseClient.js` with `createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)`
3. Replace mock in `src/api/accounts.js` with queries to:
   - `v_account_landscape_summary` (filter by `slug`)
   - `opportunities` (join `accounts`, order by `rank`)
4. Keep shapes identical to `buildSummaryStats()` / opportunity objects so UI unchanged.

Detail: see **DATABASE.md → Phase 3**.

---

## Phase 4 — Auth & security (before production)

1. **Authentication → Providers** — enable Email (or Google for internal team).
2. Add `profiles` / `organization_members` linking `auth.users` → `organizations`.
3. Run `db/rls.sql` (when added) to enable **Row Level Security** so users only see their org’s banks.
4. Never use **service_role** key in the frontend.

---

## Phase 5 — Netlify deploy (later)

1. `npm run build` → publish `dist/`
2. Env vars on Netlify: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` only (not `service_role`, not `DATABASE_URL`)
3. SPA redirect: `/* /index.html 200`

---

## Checklist (Phase 1–2)

- [ ] Supabase project created  
- [ ] `.env` filled from `.env.example`  
- [ ] `db/schema.sql` ran without errors  
- [ ] `db/seed.sql` ran without errors  
- [ ] `v_account_landscape_summary` shows 2 banks  
- [ ] UI still runs: `npm run dev` (mock data OK for now)

---

## Repo map

| Path | Purpose |
|------|---------|
| `docs/DATA_MODEL.md` | Bank summary + opportunity fields (canonical) |
| `db/schema.sql` | Tables + landscape summary **view** |
| `db/seed.sql` | Demo banks (Citizens, Wells Fargo) |
| `db/queries/landscape.sql` | Manual API-shaped query test |
| `db/rls.sql` | RLS policies (Phase 4) |
| `docs/DATABASE.md` | Supabase reference + troubleshooting |
| `docs/ARCHITECTURE.md` | Multi-bank model & hosting notes |

---

## What you’re **not** doing yet

- Neon (not needed)  
- Netlify production deploy  
- Login screens  
- Replacing `mockData.js` in the UI  

**Focus now:** finish Phase 1–2 so Postgres on Supabase is the source of truth.

When Phase 1–2 are done, say **“wire Supabase to the app”** and we’ll implement Phase 3 in code.
