-- CK-PAY-CL-01
-- Hak unduh surat lamaran dipisahkan dari kredit CV.

alter table public.user_entitlements
  add column if not exists cover_letter_credits_total integer null,
  add column if not exists cover_letter_credits_remaining integer null;

update public.user_entitlements
set
  cover_letter_credits_total = case
    when plan_code = 'SINGLE_CV' then 1
    when plan_code = 'THREE_CV' then 3
    when plan_code = 'CAREER_ACCESS' then null
    else cover_letter_credits_total
  end,
  cover_letter_credits_remaining = case
    when plan_code = 'SINGLE_CV' then 1
    when plan_code = 'THREE_CV' then 3
    when plan_code = 'CAREER_ACCESS' then null
    else cover_letter_credits_remaining
  end
where plan_code in ('SINGLE_CV', 'THREE_CV', 'CAREER_ACCESS')
  and cover_letter_credits_remaining is null;

create table if not exists public.cover_letter_unlocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cover_letter_id uuid not null
    references public.cover_letters(id) on delete cascade,
  entitlement_id uuid not null
    references public.user_entitlements(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  access_until timestamptz not null,
  download_count integer not null default 0,
  last_downloaded_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, cover_letter_id)
);

create index if not exists cover_letter_unlocks_user_letter_idx
  on public.cover_letter_unlocks(user_id, cover_letter_id);

create index if not exists cover_letter_unlocks_access_idx
  on public.cover_letter_unlocks(user_id, access_until);

create table if not exists public.cover_letter_download_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cover_letter_id uuid not null
    references public.cover_letters(id) on delete cascade,
  unlock_id uuid null
    references public.cover_letter_unlocks(id) on delete set null,
  document_name text null,
  file_format text not null default 'pdf',
  downloaded_at timestamptz not null default now(),
  user_agent text null,
  metadata jsonb null
);

create index if not exists cover_letter_download_history_user_idx
  on public.cover_letter_download_history(user_id);

create index if not exists cover_letter_download_history_letter_idx
  on public.cover_letter_download_history(
    user_id,
    cover_letter_id
  );

drop trigger if exists cover_letter_unlocks_set_updated_at
  on public.cover_letter_unlocks;

create trigger cover_letter_unlocks_set_updated_at
before update on public.cover_letter_unlocks
for each row execute function public.set_updated_at();

alter table public.cover_letter_unlocks enable row level security;
alter table public.cover_letter_download_history enable row level security;

drop policy if exists "Users read own cover letter unlocks"
  on public.cover_letter_unlocks;

create policy "Users read own cover letter unlocks"
on public.cover_letter_unlocks
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users read own cover letter history"
  on public.cover_letter_download_history;

create policy "Users read own cover letter history"
on public.cover_letter_download_history
for select
to authenticated
using (auth.uid() = user_id);

grant select on public.cover_letter_unlocks to authenticated;
grant select on public.cover_letter_download_history to authenticated;

create or replace function public.activate_payment_order(
  p_order_id text,
  p_midtrans_transaction_id text,
  p_transaction_status text,
  p_payment_type text,
  p_fraud_status text,
  p_gross_amount numeric,
  p_raw_notification jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order public.payment_orders%rowtype;
  v_credits integer;
  v_duration interval;
  v_entitlement_id uuid;
begin
  select *
  into v_order
  from public.payment_orders
  where order_id = p_order_id
  for update;

  if not found then
    raise exception 'Payment order tidak ditemukan.';
  end if;

  if round(v_order.amount::numeric, 2) <>
     round(p_gross_amount, 2) then
    raise exception 'Nominal pembayaran tidak sesuai.';
  end if;

  update public.payment_orders
  set
    status = 'paid',
    midtrans_transaction_id = p_midtrans_transaction_id,
    transaction_status = p_transaction_status,
    payment_type = p_payment_type,
    fraud_status = p_fraud_status,
    raw_notification = p_raw_notification,
    paid_at = coalesce(paid_at, now())
  where id = v_order.id;

  if v_order.plan_code = 'SINGLE_CV' then
    v_credits := 1;
    v_duration := interval '7 days';
  elsif v_order.plan_code = 'THREE_CV' then
    v_credits := 3;
    v_duration := interval '60 days';
  elsif v_order.plan_code = 'CAREER_ACCESS' then
    v_credits := null;
    v_duration := interval '30 days';
  else
    raise exception 'Plan code tidak valid.';
  end if;

  insert into public.user_entitlements (
    user_id,
    payment_order_id,
    plan_code,
    credits_total,
    credits_remaining,
    cover_letter_credits_total,
    cover_letter_credits_remaining,
    starts_at,
    expires_at,
    status
  )
  values (
    v_order.user_id,
    v_order.id,
    v_order.plan_code,
    v_credits,
    v_credits,
    v_credits,
    v_credits,
    now(),
    now() + v_duration,
    'active'
  )
  on conflict (payment_order_id)
  do update set
    status = 'active',
    updated_at = now()
  returning id into v_entitlement_id;

  return jsonb_build_object(
    'ok', true,
    'payment_order_id', v_order.id,
    'entitlement_id', v_entitlement_id,
    'plan_code', v_order.plan_code
  );
end;
$$;

create or replace function public.check_cover_letter_download_access(
  p_user_id uuid,
  p_cover_letter_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_letter_owner uuid;
  v_unlock public.cover_letter_unlocks%rowtype;
  v_entitlement public.user_entitlements%rowtype;
begin
  select user_id
  into v_letter_owner
  from public.cover_letters
  where id = p_cover_letter_id;

  if not found or v_letter_owner <> p_user_id then
    return jsonb_build_object(
      'can_download', false,
      'reason', 'LETTER_NOT_FOUND'
    );
  end if;

  select *
  into v_unlock
  from public.cover_letter_unlocks
  where user_id = p_user_id
    and cover_letter_id = p_cover_letter_id
    and access_until > now()
  order by access_until desc
  limit 1;

  if found then
    return jsonb_build_object(
      'can_download', true,
      'source', 'unlock',
      'access_until', v_unlock.access_until,
      'download_count', v_unlock.download_count
    );
  end if;

  select *
  into v_entitlement
  from public.user_entitlements
  where user_id = p_user_id
    and status = 'active'
    and expires_at > now()
    and (
      plan_code = 'CAREER_ACCESS'
      or coalesce(cover_letter_credits_remaining, 0) > 0
    )
  order by
    case when plan_code = 'CAREER_ACCESS' then 0 else 1 end,
    expires_at asc
  limit 1;

  if found then
    return jsonb_build_object(
      'can_download', true,
      'source', 'entitlement',
      'requires_consume', true,
      'plan_code', v_entitlement.plan_code,
      'credits_remaining',
        v_entitlement.cover_letter_credits_remaining,
      'expires_at', v_entitlement.expires_at
    );
  end if;

  return jsonb_build_object(
    'can_download', false,
    'reason', 'PAYMENT_REQUIRED'
  );
end;
$$;

create or replace function public.consume_cover_letter_download_access(
  p_user_id uuid,
  p_cover_letter_id uuid,
  p_document_name text default null,
  p_user_agent text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_letter_owner uuid;
  v_unlock public.cover_letter_unlocks%rowtype;
  v_entitlement public.user_entitlements%rowtype;
  v_unlock_id uuid;
  v_access_until timestamptz;
begin
  select user_id
  into v_letter_owner
  from public.cover_letters
  where id = p_cover_letter_id;

  if not found or v_letter_owner <> p_user_id then
    return jsonb_build_object(
      'can_download', false,
      'reason', 'LETTER_NOT_FOUND'
    );
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended(
      p_user_id::text || ':cover-letter:' ||
      p_cover_letter_id::text,
      0
    )
  );

  select *
  into v_unlock
  from public.cover_letter_unlocks
  where user_id = p_user_id
    and cover_letter_id = p_cover_letter_id
    and access_until > now()
  order by access_until desc
  limit 1
  for update;

  if found then
    update public.cover_letter_unlocks
    set
      download_count = download_count + 1,
      last_downloaded_at = now(),
      updated_at = now()
    where id = v_unlock.id;

    insert into public.cover_letter_download_history (
      user_id,
      cover_letter_id,
      unlock_id,
      document_name,
      file_format,
      user_agent
    )
    values (
      p_user_id,
      p_cover_letter_id,
      v_unlock.id,
      p_document_name,
      'pdf',
      p_user_agent
    );

    return jsonb_build_object(
      'can_download', true,
      'source', 'existing_unlock',
      'access_until', v_unlock.access_until
    );
  end if;

  select *
  into v_entitlement
  from public.user_entitlements
  where user_id = p_user_id
    and status = 'active'
    and expires_at > now()
    and (
      plan_code = 'CAREER_ACCESS'
      or coalesce(cover_letter_credits_remaining, 0) > 0
    )
  order by
    case when plan_code = 'CAREER_ACCESS' then 0 else 1 end,
    expires_at asc
  limit 1
  for update;

  if not found then
    return jsonb_build_object(
      'can_download', false,
      'reason', 'PAYMENT_REQUIRED'
    );
  end if;

  if v_entitlement.plan_code <> 'CAREER_ACCESS' then
    update public.user_entitlements
    set
      cover_letter_credits_remaining =
        cover_letter_credits_remaining - 1,
      updated_at = now()
    where id = v_entitlement.id;
  end if;

  v_access_until := v_entitlement.expires_at;

  insert into public.cover_letter_unlocks (
    user_id,
    cover_letter_id,
    entitlement_id,
    unlocked_at,
    access_until,
    download_count,
    last_downloaded_at
  )
  values (
    p_user_id,
    p_cover_letter_id,
    v_entitlement.id,
    now(),
    v_access_until,
    1,
    now()
  )
  on conflict (user_id, cover_letter_id)
  do update set
    entitlement_id = excluded.entitlement_id,
    unlocked_at = now(),
    access_until = excluded.access_until,
    download_count =
      public.cover_letter_unlocks.download_count + 1,
    last_downloaded_at = now(),
    updated_at = now()
  returning id into v_unlock_id;

  insert into public.cover_letter_download_history (
    user_id,
    cover_letter_id,
    unlock_id,
    document_name,
    file_format,
    user_agent
  )
  values (
    p_user_id,
    p_cover_letter_id,
    v_unlock_id,
    p_document_name,
    'pdf',
    p_user_agent
  );

  return jsonb_build_object(
    'can_download', true,
    'source', 'new_unlock',
    'plan_code', v_entitlement.plan_code,
    'access_until', v_access_until,
    'credits_remaining',
      case
        when v_entitlement.plan_code = 'CAREER_ACCESS'
          then null
        else
          v_entitlement.cover_letter_credits_remaining - 1
      end
  );
end;
$$;

revoke all on function public.check_cover_letter_download_access(
  uuid, uuid
) from public, anon, authenticated;

revoke all on function public.consume_cover_letter_download_access(
  uuid, uuid, text, text
) from public, anon, authenticated;

grant execute on function public.check_cover_letter_download_access(
  uuid, uuid
) to service_role;

grant execute on function public.consume_cover_letter_download_access(
  uuid, uuid, text, text
) to service_role;
