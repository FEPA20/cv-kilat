-- CK-DOC-05A-SAFE
-- Activate all current KilatDocs content.
-- Only ACTIVE / COMING_SOON rows are affected; ARCHIVED rows remain archived.

begin;

update public.document_categories
set status = 'ACTIVE',
    updated_at = now()
where status in ('ACTIVE', 'COMING_SOON');

update public.document_subcategories
set status = 'ACTIVE',
    updated_at = now()
where status in ('ACTIVE', 'COMING_SOON');

update public.document_catalog
set status = 'ACTIVE',
    updated_at = now()
where status in ('ACTIVE', 'COMING_SOON');

comment on table public.document_catalog is
  'CK-DOC-05A: All current KilatDocs catalog content is ACTIVE. ARCHIVED content remains archived.';

commit;
