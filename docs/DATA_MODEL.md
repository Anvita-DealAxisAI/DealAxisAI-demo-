# DealAxis — data model

Schema source of truth: **`db/schema.sql`**. Seed: **`db/seed.sql`** (1 user · Synovus · 10 opportunities).

---

## 3.1 users

| Column | Type | Notes |
|--------|------|-------|
| id | text | PK — `U00001`, `U00002`, … |
| email | text | Login email |
| full_name | text | Display name |
| role | text | `admin` \| `analyst` |

---

## 3.2 accounts

| Column | Type | Notes |
|--------|------|-------|
| id | text | PK — `A00001`, `A00002`, … |
| sector | text | e.g. Banking |
| heat_score | integer | 0–100 priority score |
| logo_url | text | Supabase Storage URL or app path |
| opportunity_range | text | e.g. $19M–$65M |
| total_opportunities | integer | Count of active plays (auto-synced) |
| strategic_fit | text | High / Medium / Low |

---

## 3.3 user_account_subscriptions

Single source of truth for who sees which accounts.

| Column | Type | Notes |
|--------|------|-------|
| id | text | PK — `S00001`, `S00002`, … |
| account_id | text | FK → accounts.id |
| subscribed_at | timestamptz | When access was granted |

---

## 3.4 opportunities

| Column | Type | Notes |
|--------|------|-------|
| id | text | PK — `O00001`, `O00002`, … |
| title | text | Opportunity name |
| priority | text | High \| Medium-High \| Medium \| Low |
| opportunity_type | text | Confirmed Opportunity \| Inferred \| … |
| deal_size | text | e.g. $3M–$10M |
| timeline | text | e.g. 2026 through early 2027 |
| buyer | text | Primary buyer persona |
| project_scope | text[] | Scope bullet points |
| business_driver | text | Business driver narrative |
| confidence | integer | 1–5 confidence score |
| sales_readiness | text | High \| Medium \| Low |
| tech_stack_confirmed | text[] | Confirmed technologies |
| tech_stack_inferred | text[] | Inferred categories |
| entry_wedge | text | SI entry wedge |
| first_meeting_theme | text | First meeting angle |
| why_strong | text | Why this is a strong entry play |
| first_buyer | text | Likely first buyer contact |
| created_at | timestamptz | Row creation timestamp |

---

## Entity diagram

```
users
  └── user_account_subscriptions
        └── accounts
              └── opportunities[]
```

---

## UI mapping

| App surface | Query |
|-------------|--------|
| Portfolio (scoped) | `v_user_portfolio_summary` + `v_user_accounts` |
| Accounts cards | `v_user_accounts` or `accounts` JOIN subscriptions |
| Opportunities tab | `v_opportunity_details` WHERE `account_id` = … ORDER BY rank |
| Opportunity detail | Single row from `opportunities` / `v_opportunity_details` |
| Settings profile | `users` (when wired to Supabase Auth) |

---

## API shape (future Supabase)

```json
{
  "user": { "id", "email", "full_name", "role" },
  "accounts": [
    {
      "id", "name", "sector", "heat_score", "opportunity_range",
      "total_opportunities", "strategic_fit",
      "opportunities": [ "…all opportunity columns…" ]
    }
  ]
}
```

Access filter: only accounts in `user_account_subscriptions` for `auth.uid()`.
