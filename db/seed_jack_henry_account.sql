-- DealAxis — seed: Jack Henry account overview (A0011)
-- Run after schema + base seed: psql $DATABASE_URL -f db/seed_jack_henry_account.sql
-- Opportunities / signals can be added in follow-up seed files.

INSERT INTO accounts (
  id,
  name,
  sector,
  logo_url,
  opportunity_range,
  total_opportunities,
  strategic_fit
) VALUES (
  'A0011',
  'Jack Henry',
  'Core Banking Platform provider',
  '/banks/jackhenry.jpeg',
  NULL,
  0,
  NULL
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  sector = EXCLUDED.sector,
  logo_url = EXCLUDED.logo_url,
  opportunity_range = EXCLUDED.opportunity_range,
  total_opportunities = EXCLUDED.total_opportunities,
  strategic_fit = EXCLUDED.strategic_fit,
  updated_at = now();

-- Optional: subscribe Ajay so Jack Henry appears in portfolio when API is live
INSERT INTO user_account_subscriptions (id, user_id, account_id, subscribed_at)
VALUES ('S00011', 'U00001', 'A0011', '2026-08-11 09:00:00+00')
ON CONFLICT (user_id, account_id) DO NOTHING;
