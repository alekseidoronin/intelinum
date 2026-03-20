-- C2: RLS policies and role model baseline.
-- Notes:
-- 1) Deterministic policy setup: existing policies on target tables are dropped first.
-- 2) Admin role model is implemented via public.user_roles.
-- 3) First owner bootstrap is intentionally explicit (bootstrap_owner function).

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'support', 'readonly')),
  granted_by uuid references auth.users(id) on delete set null,
  granted_at timestamptz not null default now(),
  revoked_at timestamptz,
  metadata jsonb not null default '{}'::jsonb
);

create unique index if not exists user_roles_active_unique_idx
  on public.user_roles (user_id, role)
  where revoked_at is null;

create index if not exists user_roles_user_id_idx on public.user_roles (user_id);
create index if not exists user_roles_role_idx on public.user_roles (role);

create or replace function public.current_user_has_any_role(_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles ur
    where ur.user_id = auth.uid()
      and ur.revoked_at is null
      and ur.role = any(_roles)
  );
$$;

create or replace function public.can_access_pack(_pack_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.content_packs cp
    where cp.id = _pack_id
      and (
        cp.user_id = auth.uid()
        or public.current_user_has_any_role(array['owner','admin','support'])
      )
  );
$$;

create or replace function public.can_modify_pack(_pack_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.content_packs cp
    where cp.id = _pack_id
      and (
        cp.user_id = auth.uid()
        or public.current_user_has_any_role(array['owner','admin'])
      )
  );
$$;

create or replace function public.bootstrap_owner(_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if _user_id is null then
    raise exception 'bootstrap_owner requires a valid user_id';
  end if;

  if exists (
    select 1
    from public.user_roles
    where role = 'owner'
      and revoked_at is null
  ) then
    raise exception 'Active owner already exists';
  end if;

  insert into public.user_roles (user_id, role, granted_by)
  values (_user_id, 'owner', _user_id);
end;
$$;

create or replace function public.assign_user_role(_target_user_id uuid, _role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if _target_user_id is null then
    raise exception 'assign_user_role requires target user id';
  end if;

  if _role not in ('owner', 'admin', 'support', 'readonly') then
    raise exception 'Invalid role: %', _role;
  end if;

  if not public.current_user_has_any_role(array['owner','admin']) then
    raise exception 'Insufficient privileges';
  end if;

  update public.user_roles
  set revoked_at = now()
  where user_id = _target_user_id
    and role = _role
    and revoked_at is null;

  insert into public.user_roles (user_id, role, granted_by)
  values (_target_user_id, _role, auth.uid());
end;
$$;

alter table public.user_roles enable row level security;
alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.content_packs enable row level security;
alter table public.content_items enable row level security;
alter table public.media_assets enable row level security;
alter table public.library_items enable row level security;
alter table public.subscriptions enable row level security;
alter table public.usage_counters enable row level security;
alter table public.app_settings enable row level security;
alter table public.audit_events enable row level security;

do $$
declare
  t text;
  p text;
begin
  foreach t in array array[
    'user_roles',
    'profiles',
    'user_preferences',
    'content_packs',
    'content_items',
    'media_assets',
    'library_items',
    'subscriptions',
    'usage_counters',
    'app_settings',
    'audit_events'
  ]
  loop
    for p in
      select polname
      from pg_policies
      where schemaname = 'public'
        and tablename = t
    loop
      execute format('drop policy if exists %I on public.%I', p, t);
    end loop;
  end loop;
end
$$;

-- user_roles policies
create policy user_roles_select_own_or_privileged
  on public.user_roles
  for select
  using (
    user_id = auth.uid()
    or public.current_user_has_any_role(array['owner','admin','support'])
  );

create policy user_roles_insert_owner_admin
  on public.user_roles
  for insert
  with check (public.current_user_has_any_role(array['owner','admin']));

create policy user_roles_update_owner_admin
  on public.user_roles
  for update
  using (public.current_user_has_any_role(array['owner','admin']))
  with check (public.current_user_has_any_role(array['owner','admin']));

create policy user_roles_delete_owner_admin
  on public.user_roles
  for delete
  using (public.current_user_has_any_role(array['owner','admin']));

-- profiles policies
create policy profiles_select_own_or_privileged
  on public.profiles
  for select
  using (
    user_id = auth.uid()
    or public.current_user_has_any_role(array['owner','admin','support'])
  );

create policy profiles_insert_own_or_admin
  on public.profiles
  for insert
  with check (
    user_id = auth.uid()
    or public.current_user_has_any_role(array['owner','admin'])
  );

create policy profiles_update_own_or_admin
  on public.profiles
  for update
  using (
    user_id = auth.uid()
    or public.current_user_has_any_role(array['owner','admin'])
  )
  with check (
    user_id = auth.uid()
    or public.current_user_has_any_role(array['owner','admin'])
  );

-- user_preferences policies
create policy user_preferences_select_own_or_privileged
  on public.user_preferences
  for select
  using (
    user_id = auth.uid()
    or public.current_user_has_any_role(array['owner','admin','support'])
  );

create policy user_preferences_insert_own_or_admin
  on public.user_preferences
  for insert
  with check (
    user_id = auth.uid()
    or public.current_user_has_any_role(array['owner','admin'])
  );

create policy user_preferences_update_own_or_admin
  on public.user_preferences
  for update
  using (
    user_id = auth.uid()
    or public.current_user_has_any_role(array['owner','admin'])
  )
  with check (
    user_id = auth.uid()
    or public.current_user_has_any_role(array['owner','admin'])
  );

create policy user_preferences_delete_admin
  on public.user_preferences
  for delete
  using (public.current_user_has_any_role(array['owner','admin']));

-- content_packs policies
create policy content_packs_select_own_or_privileged
  on public.content_packs
  for select
  using (
    user_id = auth.uid()
    or public.current_user_has_any_role(array['owner','admin','support'])
  );

create policy content_packs_insert_own_or_admin
  on public.content_packs
  for insert
  with check (
    user_id = auth.uid()
    or public.current_user_has_any_role(array['owner','admin'])
  );

create policy content_packs_update_own_or_admin
  on public.content_packs
  for update
  using (
    user_id = auth.uid()
    or public.current_user_has_any_role(array['owner','admin'])
  )
  with check (
    user_id = auth.uid()
    or public.current_user_has_any_role(array['owner','admin'])
  );

create policy content_packs_delete_own_or_admin
  on public.content_packs
  for delete
  using (
    user_id = auth.uid()
    or public.current_user_has_any_role(array['owner','admin'])
  );

-- content_items policies
create policy content_items_select_pack_access
  on public.content_items
  for select
  using (public.can_access_pack(pack_id));

create policy content_items_insert_pack_modify
  on public.content_items
  for insert
  with check (public.can_modify_pack(pack_id));

create policy content_items_update_pack_modify
  on public.content_items
  for update
  using (public.can_modify_pack(pack_id))
  with check (public.can_modify_pack(pack_id));

create policy content_items_delete_pack_modify
  on public.content_items
  for delete
  using (public.can_modify_pack(pack_id));

-- media_assets policies
create policy media_assets_select_own_or_privileged
  on public.media_assets
  for select
  using (
    user_id = auth.uid()
    or public.current_user_has_any_role(array['owner','admin','support'])
  );

create policy media_assets_insert_own_or_admin
  on public.media_assets
  for insert
  with check (
    user_id = auth.uid()
    or public.current_user_has_any_role(array['owner','admin'])
  );

create policy media_assets_update_own_or_admin
  on public.media_assets
  for update
  using (
    user_id = auth.uid()
    or public.current_user_has_any_role(array['owner','admin'])
  )
  with check (
    user_id = auth.uid()
    or public.current_user_has_any_role(array['owner','admin'])
  );

create policy media_assets_delete_own_or_admin
  on public.media_assets
  for delete
  using (
    user_id = auth.uid()
    or public.current_user_has_any_role(array['owner','admin'])
  );

-- library_items policies
create policy library_items_select_own_or_privileged
  on public.library_items
  for select
  using (
    user_id = auth.uid()
    or public.current_user_has_any_role(array['owner','admin','support'])
  );

create policy library_items_insert_own_or_admin
  on public.library_items
  for insert
  with check (
    user_id = auth.uid()
    or public.current_user_has_any_role(array['owner','admin'])
  );

create policy library_items_update_own_or_admin
  on public.library_items
  for update
  using (
    user_id = auth.uid()
    or public.current_user_has_any_role(array['owner','admin'])
  )
  with check (
    user_id = auth.uid()
    or public.current_user_has_any_role(array['owner','admin'])
  );

create policy library_items_delete_own_or_admin
  on public.library_items
  for delete
  using (
    user_id = auth.uid()
    or public.current_user_has_any_role(array['owner','admin'])
  );

-- subscriptions policies
create policy subscriptions_select_own_or_privileged
  on public.subscriptions
  for select
  using (
    user_id = auth.uid()
    or public.current_user_has_any_role(array['owner','admin','support'])
  );

create policy subscriptions_mutate_admin
  on public.subscriptions
  for all
  using (public.current_user_has_any_role(array['owner','admin']))
  with check (public.current_user_has_any_role(array['owner','admin']));

-- usage_counters policies
create policy usage_counters_select_own_or_privileged
  on public.usage_counters
  for select
  using (
    user_id = auth.uid()
    or public.current_user_has_any_role(array['owner','admin','support'])
  );

create policy usage_counters_mutate_admin
  on public.usage_counters
  for all
  using (public.current_user_has_any_role(array['owner','admin']))
  with check (public.current_user_has_any_role(array['owner','admin']));

-- app_settings policies
create policy app_settings_select_public_or_privileged
  on public.app_settings
  for select
  using (
    (scope = 'global' and is_enabled = true)
    or public.current_user_has_any_role(array['owner','admin','support','readonly'])
  );

create policy app_settings_mutate_admin
  on public.app_settings
  for all
  using (public.current_user_has_any_role(array['owner','admin']))
  with check (public.current_user_has_any_role(array['owner','admin']));

-- audit_events policies
create policy audit_events_select_privileged
  on public.audit_events
  for select
  using (public.current_user_has_any_role(array['owner','admin','support']));

create policy audit_events_insert_admin
  on public.audit_events
  for insert
  with check (public.current_user_has_any_role(array['owner','admin']));

create or replace function public.prevent_audit_events_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'audit_events is append-only';
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_trigger where tgname = 'prevent_audit_events_update'
  ) then
    create trigger prevent_audit_events_update
      before update on public.audit_events
      for each row execute function public.prevent_audit_events_mutation();
  end if;

  if not exists (
    select 1 from pg_trigger where tgname = 'prevent_audit_events_delete'
  ) then
    create trigger prevent_audit_events_delete
      before delete on public.audit_events
      for each row execute function public.prevent_audit_events_mutation();
  end if;
end
$$;
