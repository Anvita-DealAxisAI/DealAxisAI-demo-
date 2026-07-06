# Supabase folder

DealAxis keeps SQL in **`db/`** as the source of truth.

- **Now:** run `db/schema.sql` and `db/seed.sql` in the [Supabase SQL Editor](https://supabase.com/dashboard) or via `psql` + `DATABASE_URL`.
- **Later (optional):** install [Supabase CLI](https://supabase.com/docs/guides/cli) and link this project to sync migrations from `db/schema.sql`.

No separate migration duplicate is required for Phase 1.
