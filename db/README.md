# Database layout

PostgreSQL schema for the MVP: **one user, one subscribed account (Synovus), ten opportunities**.

## Tables (sections 3.1–3.4)

| Table | Purpose |
|-------|---------|
| `users` | Login identity (`id` = Supabase Auth UUID) |
| `accounts` | Banks (Synovus) with heat score, pipeline range, play count |
| `user_account_subscriptions` | **Access control** — who sees which accounts |
| `opportunities` | Ranked plays (1 = highest priority) |

```
users
  └── user_account_subscriptions
        └── accounts
              └── opportunities
```

## Apply

```bash
export DATABASE_URL="postgresql://..."
psql "$DATABASE_URL" -f db/schema.sql
psql "$DATABASE_URL" -f db/seed.sql
psql "$DATABASE_URL" -f db/queries/landscape.sql
```

## Seed data

| Entity | ID | Notes |
|--------|-----|-------|
| User (Ajay) | `U00001` | Next → `U00002` |
| Account (Synovus) | `A00001` | Next → `A00002` |
| Subscription | `S00001` | Links user + account |
| Opportunity rank N | `O00001`–`O00010` | Prefix `O` + 5 digits |

Format: one letter prefix + zero-padded 5-digit sequence.

When Supabase Auth is enabled, create the auth user with the **same UUID** as `users.id`, or insert into `users` after signup using `auth.users.id`.

## UI → columns

| UI | Table.column |
|----|----------------|
| Accounts card name / range / opp count | `accounts.name`, `opportunity_range`, `total_opportunities` |
| Heat score / strategic fit | `accounts.heat_score`, `strategic_fit` |
| Portfolio access scope | `user_account_subscriptions` |
| Opportunity card | `opportunities.title`, `priority`, `opportunity_type`, `deal_size`, `timeline`, `buyer` |
| Expanded scope / driver | `project_scope[]`, `business_driver` |
| Tech stack | `tech_stack_confirmed[]`, `tech_stack_inferred[]` |
| Detail page wedges | `entry_wedge`, `first_meeting_theme`, `why_strong`, `first_buyer` |
| Ranked chart | `rank`, `confidence`, `sales_readiness`, `why_strong`, `first_buyer` |

## Views

| View | Use |
|------|-----|
| `v_user_accounts` | List accounts for logged-in user |
| `v_account_landscape_summary` | Stat cards |
| `v_opportunity_details` | Opportunity list + detail |
| `v_user_portfolio_summary` | Portfolio KPIs per user |

## Adding data

1. Insert into `accounts`.
2. Insert into `user_account_subscriptions` for each user who should see it.
3. Insert into `opportunities` with sequential `rank` per account.
4. `total_opportunities` updates automatically via trigger.

## Security

Run `db/rls.sql` after Supabase Auth. Users only `SELECT` accounts/opportunities they are subscribed to.

## Files

| File | Purpose |
|------|---------|
| `schema.sql` | Tables, triggers, views |
| `seed.sql` | Ajay + Synovus + 10 opportunities |
| `rls.sql` | Row Level Security policies |
| `queries/landscape.sql` | Verification queries |
