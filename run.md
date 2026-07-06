# Run DealAxis locally

Quick setup for a teammate pulling your branch for the first time (Supabase, no Docker).

## 10 steps

1. **Get the code** — clone the repo and switch to the branch.

   ```bash
   git clone <repo-url>
   cd DealAxis
   git checkout <branch-name>
   ```

2. **Install Node** — use Node 18 or 20+.

3. **Install packages**

   ```bash
   npm install
   ```

4. **Create `.env`** — copy the example file, then paste the real values from your teammate (never commit this file).

   ```bash
   cp .env.example .env
   ```

5. **Set up the database once** — run the SQL in Supabase (Dashboard → SQL Editor), or run:

   ```bash
   npm run db:schema
   npm run db:seed
   ```

6. **Start the API** (Terminal 1)

   ```bash
   npm run dev:api
   ```

7. **Start the website** (Terminal 2)

   ```bash
   npm run dev
   ```

8. **Open the app** — http://localhost:5173

9. **Log in** — any email + any password with 6+ characters (e.g. `ajay@dealaxis.ai` / `password123`).

10. **Check it worked** — you should see Synovus and its opportunities. If not, make sure Terminal 1 is still running and step 5 was done.

## Quick check

```bash
curl http://localhost:3001/api/health
curl http://localhost:3001/api/accounts
```

## Notes

- You need **both** terminals running (`dev:api` + `dev`).
- `.env` is not in Git — ask your teammate for it privately.
- More detail: `db/LOCAL.md`
