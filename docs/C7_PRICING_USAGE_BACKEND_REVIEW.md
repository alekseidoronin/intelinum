# C7 Pricing and Usage Backend Integration Review

This review captures the C7 milestone where `Pricing` and usage indicators are connected to backend APIs.

## Delivered in C7

### 1) Pricing backend function

Added:

- `supabase/functions/pricing-dashboard/index.ts`

Function capabilities:

- Returns plan catalog with `current` marker based on active user subscription.
- Reads optional backend-managed plan catalog from `app_settings` (`scope=pricing`, `key=plans_catalog`).
- Returns current subscription snapshot (`tier`, `status`, `periodEnd`).
- Returns usage metrics from `usage_counters` for current billing period.
- Falls back to safe defaults for plans/usage when user is unauthenticated or data is unavailable.
- Returns granular source flags (`plans`, `subscription`, `usage`) for runtime diagnostics.

### 2) Supabase function config

Updated:

- `supabase/config.toml`
  - `functions.pricing-dashboard` with `verify_jwt = false`.

### 3) Pricing page integration

Updated:

- `src/pages/Pricing.tsx`

Changes:

- Pricing now fetches all pricing/usage data via `supabase.functions.invoke("pricing-dashboard")`.
- Current subscription card is backend-backed (`tier`, `status`, `periodEnd`).
- Usage bars are backend-backed using `usage_counters`.
- Plans are rendered from API response and include dynamic `current` marker.
- Added source diagnostics and loading state.

## Review conclusions

1. Pricing page no longer depends on static hardcoded billing state as source of truth.
2. Usage visibility is now aligned with persisted backend counters.
3. C7 completes the Stage-4 migration target for pricing/limits screens.
