-- CK-DOC-04A-SAFE
-- KilatDocs user draft database foundation.
-- Scope:
-- - Create document_drafts table for saved user drafts.
-- - Enable RLS.
-- - Add authenticated user-only policies.
-- - Does not change frontend, payment, Midtrans, PDF/DOCX, CV export, or existing catalog rows.

begin;

create table if not exists public.document_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_id text not null references public.document_catalog(id) on delete restrict,
  title text not null default 'Draft Dokumen',
  form_data jsonb not null default '{}'::jsonb,
  draft_content text not null default '',
  status text not null default 'DRAFT',
  last_opened_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint document_drafts_status_check
    check (status in ('DRAFT', 'FINALIZED', 'ARCHIVED'))
);

create index if not exists document_drafts_user_id_idx
  on public.document_drafts(user_id);

create index if not exists document_drafts_document_id_idx
  on public.document_drafts(document_id);

create index if not exists document_drafts_user_updated_at_idx
  on public.document_drafts(user_id, updated_at desc);

drop trigger if exists trg_document_drafts_updated_at on public.document_drafts;

create trigger trg_document_drafts_updated_at
before update on public.document_drafts
for each row
execute function public.set_kilatdocs_updated_at();

alter table public.document_drafts enable row level security;

drop policy if exists document_drafts_select_own on public.document_drafts;
drop policy if exists document_drafts_insert_own on public.document_drafts;
drop policy if exists document_drafts_update_own on public.document_drafts;
drop policy if exists document_drafts_delete_own on public.document_drafts;

create policy document_drafts_select_own
on public.document_drafts
for select
to authenticated
using (auth.uid() = user_id);

create policy document_drafts_insert_own
on public.document_drafts
for insert
to authenticated
with check (auth.uid() = user_id);

create policy document_drafts_update_own
on public.document_drafts
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy document_drafts_delete_own
on public.document_drafts
for delete
to authenticated
using (auth.uid() = user_id);

comment on table public.document_drafts is 'CK-DOC-04A: Saved KilatDocs document drafts per authenticated user.';
comment on column public.document_drafts.form_data is 'JSON data from KilatDocs builder form inputs.';
comment on column public.document_drafts.draft_content is 'Rendered draft text generated from the builder preview.';

commit;
