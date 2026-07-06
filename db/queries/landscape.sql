-- Verify seeded data for Ajay → Synovus
-- psql $DATABASE_URL -f db/queries/landscape.sql

\echo '=== User ==='
SELECT id, email, full_name, role FROM users;

\echo '=== Subscribed accounts ==='
SELECT user_id, full_name, account_id, account_name, total_opportunities
FROM v_user_accounts;

\echo '=== Opportunities ==='
SELECT id, rank, title, deal_size
FROM v_opportunity_details
WHERE account_id = 'A00001'
ORDER BY rank;
