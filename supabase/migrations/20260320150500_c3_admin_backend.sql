-- C3: Admin backend primitives for settings, roles, and audit.
-- Notes:
-- 1) This migration extends C1/C2 and assumes those migrations are applied.
-- 2) RLS is enabled for the new revision table with explicit policies.

create table if not exists public.app_setting_revisions (
  id uuid primary key default gen_random_uuid(),
  setting_id uuid not null references public.app_settings(id) on delete cascade,
  scope text not null,
  key text not null,
  version integer not null,
  state text not null default 'draft' check (state in ('draft', 'published', 'discarded')),
  value jsonb not null default '{}'::jsonb,
  description text,
  is_enabled boolean not null default true,
  change_note text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  published_by uuid references auth.users(id) on delete set null,
  published_at timestamptz,
  unique (setting_id, version)
);

create index if not exists app_setting_revisions_setting_id_idx
  on public.app_setting_revisions (setting_id);

create index if not exists app_setting_revisions_scope_key_idx
  on public.app_setting_revisions (scope, key);

create index if not exists app_setting_revisions_state_idx
  on public.app_setting_revisions (state);

create index if not exists app_setting_revisions_created_at_idx
  on public.app_setting_revisions (created_at desc);

create or replace function public.admin_log_event(
  _action text,
  _target_type text,
  _target_id text,
  _before_state jsonb default null,
  _after_state jsonb default null,
  _metadata jsonb default '{}'::jsonb
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id bigint;
begin
  if not public.current_user_has_any_role(array['owner','admin','support']) then
    raise exception 'Insufficient privileges';
  end if;

  if _action is null or _target_type is null or _target_id is null then
    raise exception 'action, target_type and target_id are required';
  end if;

  insert into public.audit_events (
    actor_user_id,
    actor_role,
    action,
    target_type,
    target_id,
    before_state,
    after_state,
    metadata
  )
  values (
    auth.uid(),
    (
      select ur.role
      from public.user_roles ur
      where ur.user_id = auth.uid()
        and ur.revoked_at is null
      order by case ur.role
        when 'owner' then 1
        when 'admin' then 2
        when 'support' then 3
        when 'readonly' then 4
        else 5
      end
      limit 1
    ),
    _action,
    _target_type,
    _target_id,
    _before_state,
    _after_state,
    coalesce(_metadata, '{}'::jsonb)
  )
  returning id into v_id;

  return v_id;
end;
$$;

create or replace function public.admin_create_setting_draft(
  _scope text,
  _key text,
  _value jsonb,
  _description text default null,
  _is_enabled boolean default true,
  _change_note text default null
)
returns public.app_setting_revisions
language plpgsql
security definer
set search_path = public
as $$
declare
  v_setting public.app_settings%rowtype;
  v_revision public.app_setting_revisions%rowtype;
  v_before jsonb;
  v_next_version integer;
begin
  if not public.current_user_has_any_role(array['owner','admin']) then
    raise exception 'Insufficient privileges';
  end if;

  if _scope is null or _key is null then
    raise exception 'scope and key are required';
  end if;

  select *
  into v_setting
  from public.app_settings
  where scope = _scope
    and key = _key
  limit 1;

  if not found then
    insert into public.app_settings (
      scope,
      key,
      value,
      description,
      is_enabled,
      version,
      created_by,
      updated_by
    )
    values (
      _scope,
      _key,
      coalesce(_value, '{}'::jsonb),
      _description,
      coalesce(_is_enabled, true),
      1,
      auth.uid(),
      auth.uid()
    )
    returning * into v_setting;
  end if;

  v_before := to_jsonb(v_setting);
  v_next_version := greatest(
    v_setting.version,
    coalesce(
      (
        select max(r.version)
        from public.app_setting_revisions r
        where r.setting_id = v_setting.id
      ),
      0
    )
  ) + 1;

  insert into public.app_setting_revisions (
    setting_id,
    scope,
    key,
    version,
    state,
    value,
    description,
    is_enabled,
    change_note,
    created_by
  )
  values (
    v_setting.id,
    v_setting.scope,
    v_setting.key,
    v_next_version,
    'draft',
    coalesce(_value, v_setting.value),
    coalesce(_description, v_setting.description),
    coalesce(_is_enabled, v_setting.is_enabled),
    _change_note,
    auth.uid()
  )
  returning * into v_revision;

  perform public.admin_log_event(
    'settings.draft.create',
    'app_settings',
    v_setting.id::text,
    v_before,
    to_jsonb(v_revision),
    jsonb_build_object('scope', _scope, 'key', _key)
  );

  return v_revision;
end;
$$;

create or replace function public.admin_publish_setting_revision(
  _revision_id uuid,
  _publish_note text default null
)
returns public.app_settings
language plpgsql
security definer
set search_path = public
as $$
declare
  v_revision public.app_setting_revisions%rowtype;
  v_setting public.app_settings%rowtype;
  v_before jsonb;
begin
  if not public.current_user_has_any_role(array['owner','admin']) then
    raise exception 'Insufficient privileges';
  end if;

  select *
  into v_revision
  from public.app_setting_revisions
  where id = _revision_id
    and state = 'draft'
  limit 1;

  if not found then
    raise exception 'Draft revision not found: %', _revision_id;
  end if;

  select *
  into v_setting
  from public.app_settings
  where id = v_revision.setting_id
  for update;

  if not found then
    raise exception 'Setting not found for revision: %', _revision_id;
  end if;

  v_before := to_jsonb(v_setting);

  update public.app_settings
  set
    value = v_revision.value,
    description = v_revision.description,
    is_enabled = v_revision.is_enabled,
    version = greatest(v_setting.version, v_revision.version),
    updated_by = auth.uid(),
    updated_at = now()
  where id = v_setting.id
  returning * into v_setting;

  update public.app_setting_revisions
  set
    state = 'published',
    published_by = auth.uid(),
    published_at = now(),
    change_note = coalesce(_publish_note, change_note)
  where id = _revision_id;

  update public.app_setting_revisions
  set state = 'discarded'
  where setting_id = v_setting.id
    and state = 'draft'
    and id <> _revision_id;

  perform public.admin_log_event(
    'settings.publish',
    'app_settings',
    v_setting.id::text,
    v_before,
    to_jsonb(v_setting),
    jsonb_build_object('revision_id', _revision_id, 'publish_note', _publish_note)
  );

  return v_setting;
end;
$$;

create or replace function public.assign_user_role(_target_user_id uuid, _role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_before jsonb;
  v_after jsonb;
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

  select jsonb_agg(to_jsonb(ur))
  into v_before
  from public.user_roles ur
  where ur.user_id = _target_user_id
    and ur.role = _role
    and ur.revoked_at is null;

  update public.user_roles
  set revoked_at = now()
  where user_id = _target_user_id
    and role = _role
    and revoked_at is null;

  insert into public.user_roles (user_id, role, granted_by)
  values (_target_user_id, _role, auth.uid());

  select jsonb_agg(to_jsonb(ur))
  into v_after
  from public.user_roles ur
  where ur.user_id = _target_user_id
    and ur.role = _role
    and ur.revoked_at is null;

  perform public.admin_log_event(
    'roles.assign',
    'user_roles',
    _target_user_id::text,
    coalesce(v_before, '[]'::jsonb),
    coalesce(v_after, '[]'::jsonb),
    jsonb_build_object('role', _role)
  );
end;
$$;

create or replace function public.admin_revoke_user_role(
  _target_user_id uuid,
  _role text,
  _reason text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_before jsonb;
  v_after jsonb;
begin
  if _target_user_id is null then
    raise exception 'admin_revoke_user_role requires target user id';
  end if;

  if _role not in ('owner', 'admin', 'support', 'readonly') then
    raise exception 'Invalid role: %', _role;
  end if;

  if not public.current_user_has_any_role(array['owner','admin']) then
    raise exception 'Insufficient privileges';
  end if;

  select jsonb_agg(to_jsonb(ur))
  into v_before
  from public.user_roles ur
  where ur.user_id = _target_user_id
    and ur.role = _role
    and ur.revoked_at is null;

  if v_before is null then
    raise exception 'Active role not found for user % and role %', _target_user_id, _role;
  end if;

  update public.user_roles
  set
    revoked_at = now(),
    metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
      'revoked_by', auth.uid(),
      'reason', _reason
    )
  where user_id = _target_user_id
    and role = _role
    and revoked_at is null;

  select jsonb_agg(to_jsonb(ur))
  into v_after
  from public.user_roles ur
  where ur.user_id = _target_user_id
    and ur.role = _role
    and ur.revoked_at is null;

  perform public.admin_log_event(
    'roles.revoke',
    'user_roles',
    _target_user_id::text,
    coalesce(v_before, '[]'::jsonb),
    coalesce(v_after, '[]'::jsonb),
    jsonb_build_object('role', _role, 'reason', _reason)
  );
end;
$$;

alter table public.app_setting_revisions enable row level security;

do $$
declare
  p text;
begin
  for p in
    select polname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'app_setting_revisions'
  loop
    execute format('drop policy if exists %I on public.app_setting_revisions', p);
  end loop;
end
$$;

create policy app_setting_revisions_select_privileged
  on public.app_setting_revisions
  for select
  using (public.current_user_has_any_role(array['owner','admin','support','readonly']));

create policy app_setting_revisions_insert_owner_admin
  on public.app_setting_revisions
  for insert
  with check (public.current_user_has_any_role(array['owner','admin']));

create policy app_setting_revisions_update_owner_admin
  on public.app_setting_revisions
  for update
  using (public.current_user_has_any_role(array['owner','admin']))
  with check (public.current_user_has_any_role(array['owner','admin']));

create policy app_setting_revisions_delete_owner_admin
  on public.app_setting_revisions
  for delete
  using (public.current_user_has_any_role(array['owner','admin']));
