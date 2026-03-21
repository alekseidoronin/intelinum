# C2 RLS and Role Model Review

This review captures the security baseline delivered in C2.

## Delivered in C2

Migration added:

- `supabase/migrations/20260320142000_c2_rls_and_roles.sql`

### Role model

- Added `public.user_roles` table with active-role uniqueness.
- Role values:
  - `owner`
  - `admin`
  - `support`
  - `readonly`
- Added helper functions:
  - `current_user_has_any_role(text[])`
  - `can_access_pack(uuid)`
  - `can_modify_pack(uuid)`
  - `bootstrap_owner(uuid)`
  - `assign_user_role(uuid, text)`

### RLS baseline

RLS enabled on:

- `user_roles`
- `profiles`
- `user_preferences`
- `content_packs`
- `content_items`
- `media_assets`
- `library_items`
- `subscriptions`
- `usage_counters`
- `app_settings`
- `audit_events`

Policies implemented:

- User-owned data readable/mutable by owner user.
- Privileged read access for support/admin/owner where required.
- Admin/owner mutation boundaries for sensitive tables.
- Public-safe read path for enabled global app settings.
- Append-only protections for `audit_events`.

## Review conclusions

1. C2 establishes enforceable role and data boundaries for user-facing and admin-facing tables.
2. Pack-scoped objects (`content_items`) are protected through pack-access helper functions.
3. Audit log is protected from update/delete mutation via trigger guards.
4. Bootstrapping path for first owner is explicit and controlled (`bootstrap_owner`).

## Deferred to C3

- Admin backend endpoints and workflows that consume role functions.
- Admin UI role-management screens and operational tooling.
- End-to-end role assignment and settings publish flows from application code.
