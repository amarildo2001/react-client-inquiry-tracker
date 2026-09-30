# Client Inquiry Tracker

A working React and TypeScript web app built by [Amarildo Prendi](https://amarildoprendi.com/) to demonstrate a frontend connected to a real REST API and persistent database.

## What the app does

- Loads client inquiries from the backend.
- Creates inquiries with a name, email, service, budget, and notes.
- Updates an inquiry's status: New, Contacted, or Won.
- Deletes inquiries after confirmation.
- Displays inquiry counts, open project budgets, and won projects.
- Shows the last API request, response status, and elapsed time in the expandable **Under the hood** panel.
- Saves changes across page reloads using Cloudflare D1.

The sample names and emails are fictional. Each browser receives its own demo workspace through an HttpOnly cookie. This is a portfolio demo, not a production CRM or account-based authentication system. Use sample information only. Clearing or expiring the cookie starts a new workspace.

## Technologies

| Technology | Role |
| --- | --- |
| React 19 | Interactive dashboard and form state |
| TypeScript | Typed frontend, shared models, and API handlers |
| Next.js App Router conventions + vinext | Pages and backend route handlers |
| Vite | Development and Worker-compatible builds |
| Cloudflare Workers | Server API runtime |
| Cloudflare D1 / SQLite | Persistent inquiry and workspace records |
| Drizzle Kit | Versioned database migrations |
| Zod | Server-side input validation |
| Tailwind CSS, custom CSS, shadcn/Radix UI | Responsive styling and accessible interface controls |
| Lucide React | Icons |

## API endpoints

| Method | Endpoint | Behavior |
| --- | --- | --- |
| GET | `/api/health` | Checks database connectivity |
| GET | `/api/inquiries` | Lists inquiries in the current demo workspace |
| POST | `/api/inquiries` | Creates an inquiry; returns HTTP 201 |
| PATCH | `/api/inquiries/:id` | Updates status |
| DELETE | `/api/inquiries/:id` | Deletes an inquiry |

See [API.md](API.md) for payloads, responses, and error handling. The React dashboard uses `fetch` against these same endpoints. There is no simulated API response or localStorage database.

## Run locally

Requires Node.js 22.13.0 or newer and the pnpm version specified in `package.json`.

```bash
pnpm install
pnpm build
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_sloppy_brood.sql
pnpm dev
```

A fresh clone uses the portable execution profile and defaults to port 5173. Apply the initial migration once to a new local database; do not replay it on an already initialized database. Generated migrations are also included in the deployment artifact.

To serve the production build locally:

```bash
pnpm start
```

## Verification

```bash
node node_modules/typescript/bin/tsc --noEmit
pnpm build
```

Start the built Worker with `--port 8787`, then run:

```bash
node scripts/api-smoke-test.mjs
```

The smoke test checks database connectivity, create/read/update/delete behavior, persistence between requests, input validation, isolation between workspaces, cross-origin write protection, missing records, and server page rendering. It creates and removes its own temporary inquiry. Set `TEST_BASE_URL` to test a different local port.

## Source guide

- `app/page.tsx` — React dashboard and API calls.
- `app/api/inquiries/route.ts` — list and create endpoints.
- `app/api/inquiries/[id]/route.ts` — update and delete endpoints.
- `app/api/health/route.ts` — health endpoint.
- `lib/inquiry-types.ts` — shared models and validation schemas.
- `lib/inquiry-api.ts` — workspace cookies, seed records, guards, and response helpers.
- `db/schema.ts` and `drizzle/` — database schema and generated migration.
- `app/globals.css` — responsive styles and theme.

The original runtime and hosting setup notes are retained in [DEVELOPMENT.md](DEVELOPMENT.md). The hosting manifest belongs to the demo deployment; reuse the source with your own hosting configuration for a separate deployment. No secrets, dependencies, database files, or build caches are committed.

## Client demonstration

1. Open the dashboard and explain that the initial inquiry list comes from the API.
2. Add a sample inquiry and open **Under the hood** to show the POST response.
3. Change its status to Won and show the updated summary.
4. Reload the page to demonstrate persistent storage.
5. Delete the test inquiry.
6. Open the API route files in GitHub to show the backend implementation.

No project license has been selected. Included third-party license files are retained.
