# Database — PostgreSQL on Supabase

DealAxis uses **standard PostgreSQL** hosted on **Supabase**. You do not need Neon or a second database host.

**Start here:** [GETTING_STARTED.md](./GETTING_STARTED.md) (phased checklist).

---

## Stack

```
Supabase
├── PostgreSQL     ← organizations, accounts, opportunities, stakeholders
├── Auth           ← Phase 4 (built-in)
├── Storage        ← Phase 5+ (signal PDFs, exports)
└── Dashboard      ← SQL editor, Table Editor, backups
```

Frontend (later): `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`  
Migrations / seed (now): `DATABASE_URL` (direct Postgres connection, server/CLI only)

---

## Apply schema & seed

### SQL Editor (recommended first time)

1. Supabase → **SQL Editor** → New query  
2. Run `db/schema.sql`  
3. Run `db/seed.sql`  

### Terminal

```bash
export DATABASE_URL="postgresql://..."   # from Settings → Database → URI
psql "$DATABASE_URL" -f db/schema.sql
psql "$DATABASE_URL" -f db/seed.sql
```

### npm (loads `.env` if you use dotenv-cli — or export DATABASE_URL first)

```bash
npm run db:schema
npm run db:seed
```

---

## Data model

Full field list: **[DATA_MODEL.md](./DATA_MODEL.md)**. Table ↔ UI map: **`db/README.md`**.

```
users
  └── user_account_subscriptions
        └── accounts
              └── opportunities
```

Views: `v_user_accounts`, `v_account_landscape_summary`, `v_opportunity_details`, `v_user_portfolio_summary`.

---

## Verify

```sql
SELECT * FROM v_account_landscape_summary;
```

```sql
SELECT rank, title, deal_size, confidence
FROM v_opportunity_details
WHERE account_name = 'Synovus'
ORDER BY rank;
```

---

## Phase 3 — React queries (preview)

Install:

```bash
npm install @supabase/supabase-js
```

Example landscape fetch (same contract as `fetchAccountLandscape`):

```javascript
// Summary
const { data: summary } = await supabase
  .from('v_account_landscape_summary')
  .select('*')
  .eq('slug', accountSlug)
  .single();

// Opportunities
const { data: opps } = await supabase
  .from('opportunities')
  .select('*, accounts!inner(slug)')
  .eq('accounts.slug', accountSlug)
  .order('rank');
```

Map `summary` → four `StatCard` values; map `opps` → grid (same field names as `mockData.js`).

**Note:** Views may need to be exposed via API or granted to `anon`/`authenticated` when RLS is on. Alternative: Postgres function `get_account_landscape(slug)` — add in a later migration.

---

## Phase 4 — Auth & RLS

Before external users:

1. Enable Supabase Auth providers.  
2. Link users to `organizations`.  
3. Enable RLS on `accounts`, `opportunities`, `stakeholders`.  
4. Policies: `organization_id` matches the logged-in user’s org.

Starter policies will live in `db/rls.sql` (run after auth tables exist).

---

## Environment variables

| Variable | Where | Secret? |
|----------|--------|---------|
| `DATABASE_URL` | Local CLI, CI, one-off scripts | **Yes** |
| `VITE_SUPABASE_URL` | React (Netlify env) | Public |
| `VITE_SUPABASE_ANON_KEY` | React (Netlify env) | Public (RLS protects data) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only, never Vite | **Yes** |

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `extension pgcrypto` fails | Supabase enables it; re-run or use dashboard |
| Seed fails “relation does not exist” | Run `schema.sql` first |
| Duplicate key on re-seed | `seed.sql` truncates tables — run whole file |
| Can’t see view in client | Grant SELECT on view to `authenticated` or use RPC |

---

## Files

| File | Purpose |
|------|---------|
| `db/schema.sql` | Source of truth for tables + views |
| `db/seed.sql` | Synovus MVP sample data |
| `db/README.md` | UI → table map, how to extend fields |
| `db/queries/landscape.sql` | CLI test |
| `db/rls.sql` | Row Level Security (Phase 4) |
| `.env.example` | Variable template |

---

## Cost (honest)

- **Free tier:** fine for build + internal demo.  
- **Pro (~$25/mo):** when you need production backups, support, higher limits.  
- One Supabase project = one Postgres; no Neon required.
