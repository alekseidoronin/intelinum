-- C1: Core schema foundation for Intelinum product backend.
-- Notes:
-- 1) This migration is additive and uses IF NOT EXISTS patterns.
-- 2) RLS policies are intentionally deferred to C2.

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'plan_tier' and typnamespace = 'public'::regnamespace) then
    create type public.plan_tier as enum ('free', 'start', 'pro', 'business');
  end if;

  if not exists (select 1 from pg_type where typname = 'subscription_status' and typnamespace = 'public'::regnamespace) then
    create type public.subscription_status as enum ('trial', 'active', 'past_due', 'canceled', 'expired');
  end if;

  if not exists (select 1 from pg_type where typname = 'pack_source_type' and typnamespace = 'public'::regnamespace) then
    create type public.pack_source_type as enum ('topic', 'transcript', 'manual');
  end if;

  if not exists (select 1 from pg_type where typname = 'asset_type' and typnamespace = 'public'::regnamespace) then
    create type public.asset_type as enum ('image', 'carousel', 'pdf', 'audio', 'video', 'other');
  end if;
end
$$;

create table if not exists public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  writing_style_samples text,
  visual_style_id text,
  locale text not null default 'ru',
  timezone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.app_settings (
  id uuid primary key default gen_random_uuid(),
  scope text not null default 'global',
  key text not null,
  value jsonb not null default '{}'::jsonb,
  description text,
  is_enabled boolean not null default true,
  version integer not null default 1,
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (scope, key)
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tier public.plan_tier not null default 'free',
  status public.subscription_status not null default 'active',
  is_current boolean not null default true,
  period_start timestamptz,
  period_end timestamptz,
  external_customer_id text,
  external_subscription_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (external_subscription_id)
);

create table if not exists public.usage_counters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  metric text not null,
  period_start date not null,
  period_end date not null,
  used_count integer not null default 0,
  limit_count integer,
  source text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, metric, period_start, period_end)
);

create table if not exists public.content_packs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_type public.pack_source_type not null,
  source_ref text,
  topic text,
  transcript text,
  status text not null default 'ready' check (status in ('queued', 'processing', 'ready', 'failed', 'archived')),
  title text,
  theme_summary text,
  language_code text not null default 'ru',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  pack_id uuid not null references public.content_packs(id) on delete cascade,
  platform text not null,
  char_limit integer,
  text_content text not null,
  version integer not null default 1,
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pack_id uuid references public.content_packs(id) on delete set null,
  asset_type public.asset_type not null,
  storage_bucket text not null,
  storage_path text not null,
  mime_type text,
  size_bytes bigint,
  checksum_sha256 text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  unique (storage_bucket, storage_path)
);

create table if not exists public.library_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  pack_id uuid references public.content_packs(id) on delete set null,
  asset_id uuid references public.media_assets(id) on delete set null,
  item_type text not null check (item_type in ('pack', 'transcript', 'pdf', 'image', 'carousel', 'audio', 'video', 'other')),
  title text not null,
  is_starred boolean not null default false,
  visibility text not null default 'private' check (visibility in ('private', 'shared')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.audit_events (
  id bigint generated always as identity primary key,
  actor_user_id uuid references auth.users(id) on delete set null,
  actor_role text,
  action text not null,
  target_type text not null,
  target_id text not null,
  before_state jsonb,
  after_state jsonb,
  metadata jsonb not null default '{}'::jsonb,
  ip inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create unique index if not exists subscriptions_one_current_per_user_idx
  on public.subscriptions (user_id)
  where is_current = true;

create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create index if not exists usage_counters_user_metric_idx on public.usage_counters (user_id, metric);
create index if not exists usage_counters_period_idx on public.usage_counters (period_start, period_end);
create index if not exists content_packs_user_id_idx on public.content_packs (user_id);
create index if not exists content_packs_status_idx on public.content_packs (status);
create index if not exists content_items_pack_id_idx on public.content_items (pack_id);
create unique index if not exists content_items_active_platform_idx
  on public.content_items (pack_id, platform)
  where is_active = true;
create index if not exists media_assets_user_id_idx on public.media_assets (user_id);
create index if not exists media_assets_pack_id_idx on public.media_assets (pack_id);
create index if not exists library_items_user_id_idx on public.library_items (user_id);
create index if not exists library_items_pack_id_idx on public.library_items (pack_id);
create index if not exists library_items_asset_id_idx on public.library_items (asset_id);
create index if not exists audit_events_actor_user_id_idx on public.audit_events (actor_user_id);
create index if not exists audit_events_target_idx on public.audit_events (target_type, target_id);
create index if not exists audit_events_created_at_idx on public.audit_events (created_at desc);
create index if not exists app_settings_scope_key_idx on public.app_settings (scope, key);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
begin
  if not exists (select 1 from pg_trigger where tgname = 'set_user_preferences_updated_at') then
    create trigger set_user_preferences_updated_at before update on public.user_preferences
      for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'set_app_settings_updated_at') then
    create trigger set_app_settings_updated_at before update on public.app_settings
      for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'set_subscriptions_updated_at') then
    create trigger set_subscriptions_updated_at before update on public.subscriptions
      for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'set_usage_counters_updated_at') then
    create trigger set_usage_counters_updated_at before update on public.usage_counters
      for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'set_content_packs_updated_at') then
    create trigger set_content_packs_updated_at before update on public.content_packs
      for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'set_content_items_updated_at') then
    create trigger set_content_items_updated_at before update on public.content_items
      for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'set_media_assets_updated_at') then
    create trigger set_media_assets_updated_at before update on public.media_assets
      for each row execute function public.set_updated_at();
  end if;

  if not exists (select 1 from pg_trigger where tgname = 'set_library_items_updated_at') then
    create trigger set_library_items_updated_at before update on public.library_items
      for each row execute function public.set_updated_at();
  end if;
end
$$;
