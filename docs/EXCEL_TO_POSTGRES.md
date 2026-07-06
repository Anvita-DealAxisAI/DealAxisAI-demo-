# Excel first → Postgres later

Use Excel (or Google Sheets) to **design and fill data**. When it looks right, **import the same columns** into Supabase Postgres.

---

## Workflow

```
1. Open CSV templates in Excel     (data/excel-templates/)
2. Fill rows — one bank, many opps, many stakeholders
3. Review with team / stakeholders
4. Create Supabase project → run db/schema.sql
5. Import CSVs (Table Editor → Import) OR convert to seed SQL
6. Wire React app to Supabase (Phase 3)
```

**Do not** treat Excel as the live database long term — only as the **staging** format until Postgres is loaded.

---

## Workbook structure (3 sheets)

Use **three tabs** in one `.xlsx`, or three CSV files (provided in repo):

| Sheet / file | One row = | Links to |
|--------------|-----------|----------|
| **accounts** | One bank | — |
| **opportunities** | One revenue play | `account_id` → accounts |
| **stakeholders** | One person at a bank | `account_id` → accounts |

Linking is by **`account_id`** (e.g. `1`) on every sheet — must match `accounts.account_id`.  
Optional **`account_name`** on other sheets is for readability in Excel only (not imported to Postgres).

When moving to Postgres, map `account_id` → `accounts.slug` (e.g. `1` → `synovus`) or keep numeric IDs in a column.

---

## Sheet 1: `accounts`

| Column | Required | Example | Maps to Postgres |
|--------|----------|---------|------------------|
| account_id | Yes | 1 | `accounts.slug` or external id |
| account_name | Yes | Synovus | `accounts.name` |
| total_opportunities | Yes | 4 | Cross-check: should match row count in `opportunities.csv` for this bank |
| opportunity_range | Yes | $8M-$15M | `opportunity_range_label` |

**Not in `accounts.csv` for now:** `top_service_line_themes`.  
**Stakeholders count:** from `stakeholders.csv` row count (12 for Synovus).

---

## Sheet 2: `opportunities`

**Only these columns** (row order = display order on the page):

| Column | Required | Example | Maps to Postgres |
|--------|----------|---------|------------------|
| account_id | Yes | 1 | → `accounts` row |
| account_name | No | Synovus | Excel only |
| priority | No | High | `priority` |
| opportunity_type | No | Confirmed | `opportunity_type` |
| opportunity_title | Yes | Regulatory Reporting Automation | `title` |
| deal_size | Yes | $3M-$8M | `deal_size` |
| timeline | Yes | 6-9 months | `timeline` |
| buyer | Yes | Risk + Finance Tech | `buyer` |

**Also in CSV (added):** `project_scope`, `business_driver`, `technology_stack`.  
**Not in Excel for now:** `rank`, `priority_tone`, `service_line_theme`.

---

## Sheet 3: `stakeholders`

| Column | Required | Example | Maps to Postgres |
|--------|----------|---------|------------------|
| account_id | Yes | 1 | → `accounts` row |
| account_name | No | Synovus | Excel only |
| full_name | Yes | Jane Smith | `full_name` |
| title | No | VP Risk Technology | `title` |
| department | No | Risk | `department` |

---

## Rules while editing in Excel

1. **One account_id per bank** — same id on accounts, opportunities, and stakeholders (`1` for Synovus).
2. **opportunity_type** — Confirmed, Validated, Emerging, Watch (stay consistent).
3. **priority** — leave empty if not applicable (e.g. some Emerging plays).
4. Leave cells **empty** instead of `N/A` for optional fields.
5. Save as **CSV UTF-8** before import if using Google Sheets.

---

## Later: push to Postgres

### Option A — Supabase UI (easiest)

1. Run `db/schema.sql` once.
2. Table Editor → **accounts** → Import CSV → map columns.
3. Import **stakeholders**, then **opportunities** (order matters for FK: accounts first).

You may need a one-time SQL script to resolve `account_slug` → `account_id` if the UI expects UUIDs — see `db/import/from_excel.sql` (when added).

### Option B — Keep using `db/seed.sql`

Once Excel is final, copy values into `db/seed.sql` or ask to generate seed SQL from your CSVs.

### Option C — Script (later)

Small Node/Python script: read CSV → `INSERT` via `DATABASE_URL`.

---

## Templates in this repo

Open in Excel: **File → Open** → `data/excel-templates/*.csv`

| File | Purpose |
|------|---------|
| `accounts.csv` | Banks + range + themes |
| `opportunities.csv` | All card + expanded fields |
| `stakeholders.csv` | People per bank |

Sample rows match Citizens / Wells Fargo demo data.

---

## When to move off Excel

Move to Postgres when:

- [ ] Column list is stable (no renames every week)
- [ ] At least one bank fully filled (opps + stakeholders)
- [ ] You want the **live app** to read real data

Until then, the React app can keep using `src/data/mockData.js` in parallel with your workbook.
