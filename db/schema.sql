-- DealAxis — core schema (PostgreSQL 15+ / Supabase)
-- Sections 3.1–3.4: users, accounts, user_account_subscriptions, opportunities
-- IDs: prefixed 5-digit text — U00001, A00001, S00001, O00001
--
-- Run:  psql $DATABASE_URL -f db/schema.sql
-- Seed: psql $DATABASE_URL -f db/seed.sql

-- ---------------------------------------------------------------------------
-- Drop legacy tables from earlier schema versions (safe on fresh Supabase)
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS opportunity_stakeholders CASCADE;
DROP TABLE IF EXISTS account_signal_timeline CASCADE;
DROP TABLE IF EXISTS account_weekly_actions CASCADE;
DROP TABLE IF EXISTS account_service_line_themes CASCADE;
DROP TABLE IF EXISTS account_tags CASCADE;
DROP TABLE IF EXISTS account_intelligence CASCADE;
DROP TABLE IF EXISTS stakeholders CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

DROP VIEW IF EXISTS v_opportunity_details CASCADE;
DROP VIEW IF EXISTS v_portfolio_summary CASCADE;
DROP VIEW IF EXISTS v_ranked_plays CASCADE;
DROP VIEW IF EXISTS v_account_landscape_summary CASCADE;
DROP VIEW IF EXISTS v_user_accounts CASCADE;

DROP TABLE IF EXISTS user_account_subscriptions CASCADE;
DROP TABLE IF EXISTS opportunities CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ---------------------------------------------------------------------------
-- 3.1 users
-- ---------------------------------------------------------------------------
CREATE TABLE users (
  id          TEXT PRIMARY KEY CHECK (id ~ '^U[0-9]{5}$'),
  email       TEXT NOT NULL UNIQUE,
  full_name   TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('admin', 'analyst')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE users IS 'Application users.';
COMMENT ON COLUMN users.id IS 'User id: U00001, U00002, …';
COMMENT ON COLUMN users.role IS 'admin | analyst';

-- ---------------------------------------------------------------------------
-- 3.2 accounts
-- ---------------------------------------------------------------------------
CREATE TABLE accounts (
  id                   TEXT PRIMARY KEY CHECK (id ~ '^A[0-9]{5}$'),
  name                 TEXT NOT NULL,
  sector               TEXT,
  heat_score           INTEGER CHECK (heat_score BETWEEN 0 AND 100),
  logo_url             TEXT,
  opportunity_range    TEXT,
  total_opportunities  INTEGER NOT NULL DEFAULT 0 CHECK (total_opportunities >= 0),
  strategic_fit        TEXT CHECK (strategic_fit IN ('High', 'Medium', 'Low') OR strategic_fit IS NULL),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_accounts_name ON accounts (name);

COMMENT ON TABLE accounts IS 'Bank / account records (e.g. Synovus).';
COMMENT ON COLUMN accounts.heat_score IS '0–100 priority score for portfolio ranking.';
COMMENT ON COLUMN accounts.opportunity_range IS 'Aggregate SI pipeline label, e.g. $19M–$65M.';
COMMENT ON COLUMN accounts.total_opportunities IS 'Count of active ranked plays on the account.';

-- ---------------------------------------------------------------------------
-- 3.3 user_account_subscriptions — who sees which accounts
-- ---------------------------------------------------------------------------
CREATE TABLE user_account_subscriptions (
  id             TEXT PRIMARY KEY CHECK (id ~ '^S[0-9]{5}$'),
  user_id        TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  account_id     TEXT NOT NULL REFERENCES accounts (id) ON DELETE CASCADE,
  subscribed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, account_id)
);

CREATE INDEX idx_subscriptions_user ON user_account_subscriptions (user_id);
CREATE INDEX idx_subscriptions_account ON user_account_subscriptions (account_id);

COMMENT ON TABLE user_account_subscriptions IS 'Single source of truth for account access per user.';

-- ---------------------------------------------------------------------------
-- 3.4 opportunities
-- ---------------------------------------------------------------------------
CREATE TABLE opportunities (
  id                    TEXT PRIMARY KEY CHECK (id ~ '^O[0-9]{5}$'),
  account_id            TEXT NOT NULL REFERENCES accounts (id) ON DELETE CASCADE,
  rank                  INTEGER NOT NULL CHECK (rank > 0),
  title                 TEXT NOT NULL,
  priority              TEXT,
  opportunity_type      TEXT,
  deal_size             TEXT,
  timeline              TEXT,
  buyer                 TEXT,
  project_scope         TEXT[] NOT NULL DEFAULT '{}',
  business_driver       TEXT,
  confidence            INTEGER CHECK (confidence BETWEEN 1 AND 5),
  sales_readiness       TEXT,
  tech_stack_confirmed  TEXT[] NOT NULL DEFAULT '{}',
  tech_stack_inferred   TEXT[] NOT NULL DEFAULT '{}',
  entry_wedge           TEXT,
  first_meeting_theme   TEXT,
  why_strong            TEXT,
  first_buyer           TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (account_id, rank)
);

CREATE INDEX idx_opportunities_account ON opportunities (account_id);
CREATE INDEX idx_opportunities_account_rank ON opportunities (account_id, rank);

COMMENT ON TABLE opportunities IS 'Ranked revenue plays for an account (rank 1 = highest priority).';
COMMENT ON COLUMN opportunities.confidence IS '1–5 confidence score.';
COMMENT ON COLUMN opportunities.project_scope IS 'Scope bullet points.';
COMMENT ON COLUMN opportunities.tech_stack_confirmed IS 'Confirmed technologies.';
COMMENT ON COLUMN opportunities.tech_stack_inferred IS 'Inferred service-line / capability categories.';

-- ---------------------------------------------------------------------------
-- updated_at on accounts
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_accounts_updated_at
  BEFORE UPDATE ON accounts
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Keep total_opportunities in sync when opportunities change
CREATE OR REPLACE FUNCTION sync_account_opportunity_count()
RETURNS TRIGGER AS $$
DECLARE
  target_account_id TEXT;
BEGIN
  target_account_id := COALESCE(NEW.account_id, OLD.account_id);

  UPDATE accounts
  SET total_opportunities = (
    SELECT COUNT(*)::INTEGER FROM opportunities WHERE account_id = target_account_id
  )
  WHERE id = target_account_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_opportunities_count_insert
  AFTER INSERT ON opportunities
  FOR EACH ROW
  EXECUTE FUNCTION sync_account_opportunity_count();

CREATE TRIGGER trg_opportunities_count_delete
  AFTER DELETE ON opportunities
  FOR EACH ROW
  EXECUTE FUNCTION sync_account_opportunity_count();

CREATE TRIGGER trg_opportunities_count_update
  AFTER UPDATE OF account_id ON opportunities
  FOR EACH ROW
  EXECUTE FUNCTION sync_account_opportunity_count();

-- ---------------------------------------------------------------------------
-- Views — shapes the app reads today
-- ---------------------------------------------------------------------------

-- Accounts visible to a user (via subscription)
CREATE OR REPLACE VIEW v_user_accounts AS
SELECT
  u.id AS user_id,
  u.email,
  u.full_name,
  u.role,
  a.id AS account_id,
  a.name AS account_name,
  a.sector,
  a.heat_score,
  a.logo_url,
  a.opportunity_range,
  a.total_opportunities,
  a.strategic_fit,
  s.subscribed_at
FROM users u
JOIN user_account_subscriptions s ON s.user_id = u.id
JOIN accounts a ON a.id = s.account_id;

COMMENT ON VIEW v_user_accounts IS 'Portfolio + Accounts: only subscribed banks for each user.';

-- Stat cards on Accounts / Opportunities landscape
CREATE OR REPLACE VIEW v_account_landscape_summary AS
SELECT
  a.id AS account_id,
  a.name,
  a.sector,
  a.heat_score,
  a.logo_url,
  a.opportunity_range,
  a.total_opportunities,
  a.strategic_fit,
  COUNT(DISTINCT s.user_id)::INT AS subscribed_users
FROM accounts a
LEFT JOIN user_account_subscriptions s ON s.account_id = a.id
GROUP BY
  a.id,
  a.name,
  a.sector,
  a.heat_score,
  a.logo_url,
  a.opportunity_range,
  a.total_opportunities,
  a.strategic_fit;

COMMENT ON VIEW v_account_landscape_summary IS 'Account summary row for stat cards and portfolio table.';

-- Ranked plays chart + opportunity list/detail
CREATE OR REPLACE VIEW v_opportunity_details AS
SELECT
  o.id,
  o.account_id,
  a.name AS account_name,
  o.rank,
  o.title,
  o.priority,
  o.opportunity_type,
  o.deal_size,
  o.timeline,
  o.buyer,
  o.project_scope,
  o.business_driver,
  o.confidence,
  o.sales_readiness,
  o.tech_stack_confirmed,
  o.tech_stack_inferred,
  o.entry_wedge,
  o.first_meeting_theme,
  o.why_strong,
  o.first_buyer,
  o.created_at
FROM opportunities o
JOIN accounts a ON a.id = o.account_id
ORDER BY o.account_id, o.rank;

COMMENT ON VIEW v_opportunity_details IS 'Full opportunity payload for cards and detail pages.';

-- Portfolio KPIs for a user (subscribed accounts only)
CREATE OR REPLACE VIEW v_user_portfolio_summary AS
SELECT
  u.id AS user_id,
  COUNT(DISTINCT a.id)::INT AS account_count,
  COALESCE(SUM(a.total_opportunities), 0)::INT AS opportunity_count,
  COUNT(DISTINCT o.id) FILTER (WHERE o.priority = 'High')::INT AS high_priority_opportunity_count,
  COUNT(DISTINCT o.id) FILTER (
    WHERE o.deal_size ~ '\$[0-9]+M.*\$([5-9]|[1-9][0-9])M'
       OR o.deal_size ~ '\$[5-9][0-9]M'
  )::INT AS high_value_opportunity_count
FROM users u
JOIN user_account_subscriptions s ON s.user_id = u.id
JOIN accounts a ON a.id = s.account_id
LEFT JOIN opportunities o ON o.account_id = a.id
GROUP BY u.id;

COMMENT ON VIEW v_user_portfolio_summary IS 'Portfolio KPI cards scoped to user subscriptions.';

-- ---------------------------------------------------------------------------
-- 3.5 account_signals — business, technology and market signals per account
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS account_signals CASCADE;
CREATE TABLE account_signals (
  id           TEXT PRIMARY KEY CHECK (id ~ '^SIG[0-9]{5}$'),
  account_id   TEXT NOT NULL REFERENCES accounts (id) ON DELETE CASCADE,
  category     TEXT NOT NULL,
  signal_title TEXT NOT NULL,
  detail       TEXT,
  evidence     TEXT,
  priority     TEXT CHECK (priority IN ('High', 'Medium', 'Low')),
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_signals_account ON account_signals (account_id);
COMMENT ON TABLE account_signals IS 'Business, technology and strategic signals per account.';

-- ---------------------------------------------------------------------------
-- 3.6 account_org — org chart / stakeholder hierarchy per account
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS account_org CASCADE;
CREATE TABLE account_org (
  id            TEXT PRIMARY KEY CHECK (id ~ '^ORG[0-9]{5}$'),
  account_id    TEXT NOT NULL REFERENCES accounts (id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  title         TEXT NOT NULL,
  level         TEXT NOT NULL CHECK (level IN ('CXO', 'CXO-1', 'CXO-2')),
  department    TEXT,
  is_key_buyer  BOOLEAN NOT NULL DEFAULT false,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_org_account ON account_org (account_id);
COMMENT ON TABLE account_org IS 'Executive org chart hierarchy per account.';

-- ---------------------------------------------------------------------------
-- 3.7 account_news — news and market intelligence per account
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS account_news CASCADE;
CREATE TABLE account_news (
  id           TEXT PRIMARY KEY CHECK (id ~ '^NEWS[0-9]{4}$'),
  account_id   TEXT NOT NULL REFERENCES accounts (id) ON DELETE CASCADE,
  headline     TEXT NOT NULL,
  summary      TEXT,
  source       TEXT,
  published_at DATE,
  category     TEXT,
  relevance    TEXT CHECK (relevance IN ('High', 'Medium', 'Low')),
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_news_account ON account_news (account_id);
COMMENT ON TABLE account_news IS 'News and market intelligence signals per account.';
