# C1 Schema Review

This review captures what was delivered in C1 and what is intentionally deferred.

## Delivered in C1

Core migration added:

- `supabase/migrations/20260320133500_c1_core_schema.sql`

Objects created:

- Enums:
  - `plan_tier`
  - `subscription_status`
  - `pack_source_type`
  - `asset_type`
- Tables:
  - `user_preferences`
  - `app_settings`
  - `subscriptions`
  - `usage_counters`
  - `content_packs`
  - `content_items`
  - `media_assets`
  - `library_items`
  - `audit_events`
- Utility:
  - `set_updated_at()` trigger function
  - update triggers for mutable tables
- Performance:
  - user/pack/asset/audit/settings indexes
  - uniqueness constraints for key integrity paths

## Review conclusions

1. The schema is additive and safe for incremental rollout (`IF NOT EXISTS` patterns used across core objects).
2. Relationships are normalized around `auth.users` and `content_packs`.
3. The migration introduces full persistence primitives needed by current frontend flows:
   - profile preferences
   - generated packs and platform items
   - media artifacts
   - library records
   - subscriptions/usage
   - immutable audit events
4. Stage C2 is still required before production usage because RLS policies and role boundaries are not included in C1 by design.

## Deferred to C2

- Row Level Security enablement and policies.
- Admin role model (`owner`, `admin`, `support`, `readonly`) enforcement.
- Service-role policy boundaries for privileged writes.
