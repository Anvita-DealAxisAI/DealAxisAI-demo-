# Local database (Docker Postgres)

Run the full stack locally — database lives in Docker, schema + seed are in `db/`.

## First-time setup

```bash
cp .env.example .env
npm install
```

**Option A — Docker (recommended)**

```bash
npm run db:up          # Postgres + schema + seed
```

**Option B — Postgres.app / local Postgres**

```bash
# One-time: create role + database (if not using Docker)
createuser dealaxis -P   # password: dealaxis
createdb dealaxis -O dealaxis

npm run db:init          # apply schema + seed
```

**Run the app**

```bash
npm run dev:api        # terminal 1 — API on :3001
npm run dev            # terminal 2 — Vite on :5173
```

Or reset everything:

```bash
npm run db:reset       # wipe volume and re-seed
```

## What's seeded

| Entity | Details |
|--------|---------|
| User | Ajay · `ajay@dealaxis.ai` · admin |
| Account | Synovus · 10 opportunities · heat 94 |
| Subscription | Ajay → Synovus |

## Verify

```bash
curl http://localhost:3001/api/health
curl http://localhost:3001/api/accounts
```

## App wiring

- Vite proxies `/api/*` → `http://localhost:3001`
- Accounts, Portfolio, Overview, and Opportunity detail pages read from the API
- Overview extras (snapshot, timeline) live in `server/overviews.js` until added to the DB

## Change data

Edit `db/seed.sql`, then:

```bash
npm run db:reset
```

Or connect directly:

```bash
psql postgresql://dealaxis:dealaxis@localhost:5432/dealaxis
```

## Files

| Path | Role |
|------|------|
| `docker-compose.yml` | Local Postgres |
| `db/schema.sql` | Tables + views |
| `db/seed.sql` | Synovus data |
| `server/index.js` | REST API |
| `src/api/client.js` | Frontend fetch helpers |
