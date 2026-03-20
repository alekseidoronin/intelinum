# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Intelinum.ai is a single-page React/TypeScript application (Vite + shadcn/ui + Tailwind CSS) for AI-powered content creation. It connects to a hosted Supabase backend (auth, database, edge functions) — no local database setup is needed.

### Key commands

See `package.json` scripts for the canonical list:

| Task | Command |
|------|---------|
| Dev server | `npm run dev` (port 8080) |
| Lint | `npm run lint` |
| Tests | `npm run test` |
| Build | `npm run build` |

### Non-obvious notes

- The dev server binds to `::` (all interfaces) on **port 8080**, configured in `vite.config.ts`.
- Supabase credentials are in `.env` (public anon key). The app talks to a remote hosted Supabase instance — there is no local Supabase to start.
- ESLint has pre-existing errors (6 errors, 8 warnings) in generated shadcn/ui components and some pages. These are not regressions; the codebase ships with them.
- The project has both `package-lock.json` (npm) and `bun.lock`/`bun.lockb` (bun). Use **npm** as the primary package manager since `package-lock.json` is authoritative.
- The Supabase Edge Function (`supabase/functions/rewrite-text/`) requires the Supabase CLI and a `LOVABLE_API_KEY` secret to test locally; it is deployed remotely and not needed for frontend development.
