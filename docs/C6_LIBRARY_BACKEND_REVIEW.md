# C6 Library Backend Integration Review

This review captures the C6 milestone where `Library` is connected to backend APIs.

## Delivered in C6

### 1) Library backend function

Added:

- `supabase/functions/library-dashboard/index.ts`

Function capabilities:

- Returns library items from `library_items` for authenticated users.
- Falls back to predefined demo items when user is unauthenticated, data is empty, or backend read fails.
- Normalizes item type (`pack` / `transcript` / `pdf` / `other`) and human-readable date labels (`Сегодня`, `Вчера`, `N <month>`).
- Supports star toggle action (`action = toggle_star`) for persisted items.

### 2) Supabase function config

Updated:

- `supabase/config.toml`
  - `functions.library-dashboard` with `verify_jwt = false` so page can render in both authenticated and fallback modes.

### 3) Library page integration

Updated:

- `src/pages/Library.tsx`

Changes:

- Library now fetches item list from `supabase.functions.invoke("library-dashboard")`.
- Search/filter now operate on API-backed state instead of static constants.
- Star toggle uses backend mutation when source is `db`.
- Copy action and open action are wired via toasts for predictable UX.
- Added runtime source indicator (`backend` / `fallback`) and loading state.

## Review conclusions

1. Library no longer depends on hardcoded local list as source of truth.
2. UX remains resilient if backend path is unavailable (fallback mode remains operational).
3. C6 completes the second major Stage-4 frontend migration checkpoint after C5.
