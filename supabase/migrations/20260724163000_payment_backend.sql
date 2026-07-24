create extension if not exists pgcrypto;

create table if not exists public.payment_orders (
  id uuid primary key default gen_random_uuid(),
  order_id text not null unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  cv_id uuid null,
  plan_code text not null check (
    plan_code in ('SINGLE_CV', 'THREE_CV', 'CAREER_ACCESS')
  ),
  amount integer not null check (amount > 0),
  status text not null default 'pending' check (
    status in (
      'pending',
      'paid',
      'failed',
      'expired',
      'cancelled',
      'refunded'
    )
  ),
  snap_token text null,
  redirect_url text null,
  midtrans_transaction_id text null,
  transaction_status text null,
  payment_type text null,
  fraud_status text null,
  paid_at timestamptz null,
  expires_at timestamptz null,
  raw_notification jsonb null,
  raw_status_response jsonb null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payment_orders_user_id_idx
  on public.payment_orders(user_id);

create index if not exists payment_orders_order_id_idx
  on public.payment_orders(order_id);

create index if not exists payment_orders_status_idx
  on public.payment_orders(status);

create table if not exists public.user_entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  payment_order_id uuid not null
    references public.payment_orders(id) on delete cascade,
  plan_code text not null check (
    plan_code in ('SINGLE_CV', 'THREE_CV', 'CAREER_ACCESS')
  ),
  credits_total integer null,
  credits_remaining integer null,
  starts_at timestamptz not null default now(),
  expires_at timestamptz not null,
  status text not null default 'active' check (
    status in ('active', 'expired', 'cancelled')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(payment_order_id)
);

create index if not exists user_entitlements_user_id_idx
  on public.user_entitlements(user_id);

create index if not exists user_entitlements_active_idx
  on public.user_entitlements(user_id, status, expires_at);

create table if not exists public.cv_unlocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cv_id uuid not null,
  entitlement_id uuid not null
    references public.user_entitlements(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  access_until timestamptz not null,
  download_count integer not null default 0,
  last_downloaded_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, cv_id)
);

create index if not exists cv_unlocks_user_cv_idx
  on public.cv_unlocks(user_id, cv_id);

create index if not exists cv_unlocks_access_idx
  on public.cv_unlocks(user_id, access_until);

create table if not exists public.cv_download_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cv_id uuid not null,
  unlock_id uuid null
    references public.cv_unlocks(id) on delete set null,
  document_name text null,
  file_format text not null default 'pdf',
  downloaded_at timestamptz not null default now(),
  user_agent text null,
  metadata jsonb null
);

create index if not exists cv_download_history_user_idx
  on public.cv_download_history(user_id);

create index if not exists cv_download_history_cv_idx
  on public.cv_download_history(user_id, cv_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists payment_orders_set_updated_at
  on public.payment_orders;

create trigger payment_orders_set_updated_at
before update on public.payment_orders
for each row execute function public.set_updated_at();

drop trigger if exists user_entitlements_set_updated_at
  on public.user_entitlements;

create trigger user_entitlements_set_updated_at
before update on public.user_entitlements
for each row execute function public.set_updated_at();

drop trigger if exists cv_unlocks_set_updated_at
  on public.cv_unlocks;

create trigger cv_unlocks_set_updated_at
before update on public.cv_unlocks
for each row execute function public.set_updated_at();

alter table public.payment_orders enable row level security;
alter table public.user_entitlements enable row level security;
alter table public.cv_unlocks enable row level security;
alter table public.cv_download_history enable row level security;

drop policy if exists "Users read own payment orders"
  on public.payment_orders;

create policy "Users read own payment orders"
on public.payment_orders
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users read own entitlements"
  on public.user_entitlements;

create policy "Users read own entitlements"
on public.user_entitlements
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users read own CV unlocks"
  on public.cv_unlocks;

create policy "Users read own CV unlocks"
on public.cv_unlocks
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users read own download history"
  on public.cv_download_history;

create policy "Users read own download history"
on public.cv_download_history
for select
to authenticated
using (auth.uid() = user_id);

grant select on public.payment_orders to authenticated;
grant select on public.user_entitlements to authenticated;
grant select on public.cv_unlocks to authenticated;
grant select on public.cv_download_history to authenticated;

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

  if round(v_order.amount::numeric, 2) <> round(p_gross_amount, 2) then
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

create or replace function public.check_cv_download_access(
  p_user_id uuid,
  p_cv_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_unlock public.cv_unlocks%rowtype;
  v_entitlement public.user_entitlements%rowtype;
begin
  select *
  into v_unlock
  from public.cv_unlocks
  where user_id = p_user_id
    and cv_id = p_cv_id
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
      or coalesce(credits_remaining, 0) > 0
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
      'credits_remaining', v_entitlement.credits_remaining,
      'expires_at', v_entitlement.expires_at
    );
  end if;

  return jsonb_build_object(
    'can_download', false,
    'reason', 'PAYMENT_REQUIRED'
  );
end;
$$;

create or replace function public.consume_cv_download_access(
  p_user_id uuid,
  p_cv_id uuid,
  p_document_name text default null,
  p_user_agent text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_unlock public.cv_unlocks%rowtype;
  v_entitlement public.user_entitlements%rowtype;
  v_unlock_id uuid;
  v_access_until timestamptz;
begin
  perform pg_advisory_xact_lock(
    hashtextextended(p_user_id::text || ':' || p_cv_id::text, 0)
  );

  select *
  into v_unlock
  from public.cv_unlocks
  where user_id = p_user_id
    and cv_id = p_cv_id
    and access_until > now()
  order by access_until desc
  limit 1
  for update;

  if found then
    update public.cv_unlocks
    set
      download_count = download_count + 1,
      last_downloaded_at = now(),
      updated_at = now()
    where id = v_unlock.id;

    insert into public.cv_download_history (
      user_id,
      cv_id,
      unlock_id,
      document_name,
      file_format,
      user_agent
    )
    values (
      p_user_id,
      p_cv_id,
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
      or coalesce(credits_remaining, 0) > 0
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
      credits_remaining = credits_remaining - 1,
      updated_at = now()
    where id = v_entitlement.id;
  end if;

  v_access_until := v_entitlement.expires_at;

  insert into public.cv_unlocks (
    user_id,
    cv_id,
    entitlement_id,
    unlocked_at,
    access_until,
    download_count,
    last_downloaded_at
  )
  values (
    p_user_id,
    p_cv_id,
    v_entitlement.id,
    now(),
    v_access_until,
    1,
    now()
  )
  on conflict (user_id, cv_id)
  do update set
    entitlement_id = excluded.entitlement_id,
    unlocked_at = now(),
    access_until = excluded.access_until,
    download_count = public.cv_unlocks.download_count + 1,
    last_downloaded_at = now(),
    updated_at = now()
  returning id into v_unlock_id;

  insert into public.cv_download_history (
    user_id,
    cv_id,
    unlock_id,
    document_name,
    file_format,
    user_agent
  )
  values (
    p_user_id,
    p_cv_id,
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
        when v_entitlement.plan_code = 'CAREER_ACCESS' then null
        else v_entitlement.credits_remaining - 1
      end
  );
end;
$$;

revoke all on function public.activate_payment_order(
  text, text, text, text, text, numeric, jsonb
) from public, anon, authenticated;

revoke all on function public.check_cv_download_access(
  uuid, uuid
) from public, anon, authenticated;

revoke all on function public.consume_cv_download_access(
  uuid, uuid, text, text
) from public, anon, authenticated;

grant execute on function public.activate_payment_order(
  text, text, text, text, text, numeric, jsonb
) to service_role;

grant execute on function public.check_cv_download_access(
  uuid, uuid
) to service_role;

grant execute on function public.consume_cv_download_access(
  uuid, uuid, text, text
) to service_role;
