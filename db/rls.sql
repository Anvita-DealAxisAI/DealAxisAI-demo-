-- DealAxis — Row Level Security (run after Supabase Auth is configured)
-- Prerequisites: auth.users populated; users.id = auth.users.id
--
-- Run: psql $DATABASE_URL -f db/rls.sql

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_account_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY users_select_self ON users
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY users_update_self ON users
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Subscriptions: users see only their own rows
CREATE POLICY subscriptions_select_self ON user_account_subscriptions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Accounts: only subscribed accounts
CREATE POLICY accounts_select_subscribed ON accounts
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT account_id
      FROM user_account_subscriptions
      WHERE user_id = auth.uid()
    )
  );

-- Opportunities: only on subscribed accounts
CREATE POLICY opportunities_select_subscribed ON opportunities
  FOR SELECT
  TO authenticated
  USING (
    account_id IN (
      SELECT account_id
      FROM user_account_subscriptions
      WHERE user_id = auth.uid()
    )
  );

-- Admins manage subscriptions (optional — tighten as needed)
CREATE POLICY subscriptions_admin_all ON user_account_subscriptions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );
