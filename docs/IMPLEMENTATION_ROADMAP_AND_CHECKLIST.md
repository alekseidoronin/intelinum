# Intelinum Implementation Roadmap and Execution Checklist

This document is the working contract for implementation.
It defines architecture, phased delivery, acceptance criteria, and reporting protocol.

## Project context (current state)

- Frontend routes and UX flows are already implemented (`onboarding`, `auth`, `home`, `rail-a`, `rail-b`, `result`, `library`, `profile`, `pricing`).
- There is no dedicated admin route/module yet.
- Supabase is integrated for auth and one edge function call (`rewrite-text`), but most product logic is still UI/local-state based.
- Database types currently expose only `profiles` as product table.

## Architecture decision (approved baseline)

Use a **Supabase-first architecture**:

1. Supabase Auth for identity and sessions.
2. Postgres as source of truth for all product and admin-managed settings.
3. Row Level Security (RLS) on all user-scoped data.
4. Edge Functions for privileged logic (generation orchestration, billing, moderation, admin actions).
5. Storage buckets for media and generated artifacts.
6. Optional worker service later for heavy jobs (ASR/image render/export).

Why this baseline:

- It matches the existing codebase integrations.
- It reduces migration risk and implementation time.
- It enables strict security and auditability from day one.

## Stage 0 objectives (this stage)

Stage 0 is architecture and implementation alignment only.

Deliverables:

- Approved architecture baseline.
- Implementation phases with clear acceptance criteria.
- Global execution checklist (C0-C10).
- Reporting protocol for iterative execution.

Out of scope:

- No production schema migration yet.
- No endpoint implementation yet.
- No admin UI implementation yet.

## Phased implementation plan

### Stage 1 — Data foundation and security

- Create core schema:
  - `user_preferences`
  - `content_packs`
  - `content_items`
  - `media_assets`
  - `library_items`
  - `subscriptions`
  - `usage_counters`
  - `app_settings`
  - `audit_events`
- Add indexes and foreign keys.
- Add RLS policies and role boundaries.

Acceptance criteria:

- All user-scoped tables protected by RLS.
- No critical flow depends on `localStorage` as source of truth.
- Migration set is reproducible in clean environments.

### Stage 2 — Admin backend core

- Implement role model (`owner`, `admin`, `support`, `readonly`).
- Implement settings API with draft/publish model.
- Implement audit API with immutable event log.
- Implement rollback/version restore for settings.

Acceptance criteria:

- Any global behavior change is persisted in DB and auditable.
- Unauthorized roles cannot mutate protected resources.

### Stage 3 — Admin panel v1

- Admin auth guard and RBAC gates.
- Modules:
  - Users and roles
  - Plans and limits
  - Feature flags and global settings
  - Content templates/prompts/rules
  - Audit viewer
  - System health snapshot

Acceptance criteria:

- Admin can change project-wide behavior without code edits.
- Changes are applied through backend APIs only.

### Stage 4 — Frontend migration off mocks

- Replace hardcoded content in:
  - Home
  - Library
  - Pricing/limits
  - Result pack lifecycle
- Replace `localStorage` profile fallbacks with DB-backed reads/writes.

Acceptance criteria:

- End-user core pages read server-backed state.
- UI state and server state are consistent after refresh/relogin.

### Stage 5 — Generation pipeline MVP (Rail B first)

- Topic selection -> generation request -> content pack persisted -> result page loaded by `pack_id`.
- Regenerate action performs real server operation.

Acceptance criteria:

- Complete Rail B happy path works end-to-end with persisted data.

### Stage 6 — Rail A ingestion and transcription

- File upload to storage.
- ASR job orchestration and status tracking.
- Transcript persistence and pack generation from transcript.

Acceptance criteria:

- Rail A flow works end-to-end for supported file formats.

### Stage 7 — Production hardening

- Rate limits, retries, idempotency keys.
- Error monitoring and alerting.
- Backup/restore runbook.
- Operational dashboards and SLIs.

Acceptance criteria:

- Critical flows are observable and recoverable.

## Global execution checklist (single source of delivery truth)

- [x] C0. Stage 0 architecture and execution contract documented.
- [x] C1. Core schema migrations created and reviewed.
- [x] C2. RLS policies and role model implemented.
- [ ] C3. Admin backend (settings, roles, audit) implemented.
- [ ] C4. Admin panel v1 implemented.
- [ ] C5. Home connected to backend data.
- [ ] C6. Library connected to backend data.
- [ ] C7. Pricing and usage connected to backend data.
- [ ] C8. Rail B generation pipeline implemented end-to-end.
- [ ] C9. Rail A upload/transcription pipeline implemented end-to-end.
- [ ] C10. Production hardening and operations baseline completed.

## Iteration protocol (how work will be executed)

For each checkpoint (`C1`, `C2`, ...):

1. Implement the scoped changes.
2. Run focused validation (tests/commands/manual checks).
3. Publish a concise checkpoint report:
   - What was done
   - Evidence from tests/checks
   - Risks/open issues
   - Next checkpoint to execute

## Task request template (for future user prompts)

Use this format for precise execution requests:

- Objective:
- Scope (files/modules/environments):
- Constraints (what must not be changed):
- Acceptance criteria:
- Priority:

## Current next step

Next execution checkpoint is **C3** (admin backend for settings, roles, and audit).
