import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { pool, query, getDemoUserId } from './db.js';
import { getAccountOverview } from './overviews.js';
import {
  mapAccount,
  mapOpportunity,
  buildSummaryStats,
} from './mappers.js';

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json());

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, database: 'connected' });
  } catch (err) {
    res.status(503).json({ ok: false, error: err.message });
  }
});

/** Subscribed accounts for the demo user */
app.get('/api/accounts', async (_req, res) => {
  try {
    const userId = await getDemoUserId();
    const { rows } = await query(
      `SELECT a.*
       FROM accounts a
       JOIN user_account_subscriptions s ON s.account_id = a.id
       WHERE s.user_id = $1
       ORDER BY a.name`,
      [userId]
    );

    const accounts = rows.map((row) => {
      const overviewExtra = getAccountOverview(row.id);
      return mapAccount(row, [], overviewExtra);
    });

    res.json({ accounts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/** Full account with opportunities (landscape + overview) */
app.get('/api/accounts/:accountId', async (req, res) => {
  try {
    const userId = await getDemoUserId();
    const { accountId } = req.params;

    const { rows: accountRows } = await query(
      `SELECT a.*
       FROM accounts a
       JOIN user_account_subscriptions s ON s.account_id = a.id
       WHERE s.user_id = $1 AND a.id = $2`,
      [userId, accountId]
    );

    if (!accountRows.length) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }

    const { rows: oppRows } = await query(
      `SELECT *
       FROM opportunities
       WHERE account_id = $1
       ORDER BY rank ASC`,
      [accountId]
    );

    const opportunities = oppRows.map(mapOpportunity);
    const overviewExtra = getAccountOverview(accountId);
    const account = mapAccount(accountRows[0], opportunities, overviewExtra);

    res.json({ account });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/** Single opportunity detail */
app.get('/api/accounts/:accountId/opportunities/:opportunityId', async (req, res) => {
  try {
    const userId = await getDemoUserId();
    const { accountId, opportunityId } = req.params;

    const { rows } = await query(
      `SELECT o.*
       FROM opportunities o
       JOIN user_account_subscriptions s ON s.account_id = o.account_id
       WHERE s.user_id = $1 AND o.account_id = $2 AND o.id = $3`,
      [userId, accountId, opportunityId]
    );

    if (!rows.length) {
      res.status(404).json({ error: 'Opportunity not found' });
      return;
    }

    res.json({ opportunity: mapOpportunity(rows[0]) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/** Portfolio page — subscribed accounts with opportunities */
app.get('/api/portfolio', async (_req, res) => {
  try {
    const userId = await getDemoUserId();

    const { rows: accountRows } = await query(
      `SELECT a.*
       FROM accounts a
       JOIN user_account_subscriptions s ON s.account_id = a.id
       WHERE s.user_id = $1
       ORDER BY a.name`,
      [userId]
    );

    const accounts = [];

    for (const row of accountRows) {
      const { rows: oppRows } = await query(
        `SELECT * FROM opportunities WHERE account_id = $1 ORDER BY rank ASC`,
        [row.id]
      );
      const opportunities = oppRows.map(mapOpportunity);
      const overviewExtra = getAccountOverview(row.id);
      accounts.push(mapAccount(row, opportunities, overviewExtra));
    }

    res.json({ accounts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// Signals — GET /api/accounts/:accountId/signals
// ---------------------------------------------------------------------------
app.get('/api/accounts/:accountId/signals', async (req, res) => {
  try {
    const userId = await getDemoUserId();
    const { accountId } = req.params;

    const { rows: access } = await query(
      `SELECT 1 FROM user_account_subscriptions WHERE user_id = $1 AND account_id = $2`,
      [userId, accountId]
    );
    if (access.length === 0) return res.status(403).json({ error: 'Access denied' });

    const { rows } = await query(
      `SELECT * FROM account_signals WHERE account_id = $1 ORDER BY sort_order ASC`,
      [accountId]
    );
    res.json({ signals: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// Organisation — GET /api/accounts/:accountId/org
// ---------------------------------------------------------------------------
app.get('/api/accounts/:accountId/org', async (req, res) => {
  try {
    const userId = await getDemoUserId();
    const { accountId } = req.params;

    const { rows: access } = await query(
      `SELECT 1 FROM user_account_subscriptions WHERE user_id = $1 AND account_id = $2`,
      [userId, accountId]
    );
    if (access.length === 0) return res.status(403).json({ error: 'Access denied' });

    const { rows } = await query(
      `SELECT * FROM account_org WHERE account_id = $1 ORDER BY sort_order ASC`,
      [accountId]
    );
    res.json({ org: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// News — GET /api/accounts/:accountId/news
// ---------------------------------------------------------------------------
app.get('/api/accounts/:accountId/news', async (req, res) => {
  try {
    const userId = await getDemoUserId();
    const { accountId } = req.params;

    const { rows: access } = await query(
      `SELECT 1 FROM user_account_subscriptions WHERE user_id = $1 AND account_id = $2`,
      [userId, accountId]
    );
    if (access.length === 0) return res.status(403).json({ error: 'Access denied' });

    const { rows } = await query(
      `SELECT * FROM account_news WHERE account_id = $1 ORDER BY sort_order ASC`,
      [accountId]
    );
    res.json({ news: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`DealAxis API listening on http://localhost:${PORT}`);
});
