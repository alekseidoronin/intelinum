# C5 Home Backend Integration Review

This review captures the C5 milestone where `Home` is connected to backend APIs.

## Delivered in C5

### 1) Home backend function

Added:

- `supabase/functions/home-dashboard/index.ts`

Function capabilities:

- Returns daily content payload (post pool + selected index).
- Reads optional backend-configured daily content from `app_settings` (`scope=home`, `key=daily_content`).
- Falls back to bundled default posts if setting is absent/unavailable.
- Returns usage snapshot from `subscriptions` and `usage_counters` for authenticated users.
- Supports refresh rotation (`action = rotate`) while preserving graceful fallback behavior.

### 2) Supabase function config

Updated:

- `supabase/config.toml`
  - `functions.home-dashboard` with `verify_jwt = false` to allow both unauthenticated and authenticated requests.

### 3) Home page integration

Updated:

- `src/pages/Home.tsx`

Changes:

- Home now invokes `supabase.functions.invoke("home-dashboard")` on load.
- Refresh action (`Контент обновлён`) now requests backend rotation before falling back to local rotation.
- Usage bar (`Пакеты в этом месяце`) is driven by backend response when available.
- Added source indicator (`backend` / `fallback`) for transparent runtime diagnostics.

## Review conclusions

1. Home is now API-connected and can consume backend-managed daily content and usage.
2. UX remains resilient when backend function is unavailable (fallback content remains operational).
3. C5 unlocks migration of additional pages (`Library`, `Pricing`, `Result`) to backend-backed state in next checkpoints.
