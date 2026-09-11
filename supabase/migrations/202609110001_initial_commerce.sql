create extension if not exists pgcrypto;

create type public.product_status as enum ('draft', 'active', 'archived');
create type public.order_status as enum ('draft', 'awaiting_payment', 'paid', 'processing', 'shipped', 'delivered', 'payment_failed', 'cancelled', 'refunded', 'partially_refunded', 'manual_review');
create type public.payment_status as enum ('created', 'pending', 'approved', 'declined', 'voided', 'error');
create type public.reservation_status as enum ('reserved', 'consumed', 'released', 'manual_review');
create type public.media_kind as enum ('image', 'video');

create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 1 and 160),
  short_description text not null check (char_length(short_description) between 1 and 500),
  description text not null,
  category text not null check (category in ('t-shirt', 'hoodie')),
  status public.product_status not null default 'draft',
  material text,
  fit text,
  care text,
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique,
  color text,
  size text,
  price_cents bigint not null check (price_cents >= 0),
  compare_at_cents bigint check (compare_at_cents is null or compare_at_cents >= price_cents),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique nulls not distinct (product_id, color, size)
);

create table public.product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete set null,
  storage_key text not null unique,
  kind public.media_kind not null default 'image',
  width integer check (width is null or width > 0),
  height integer check (height is null or height > 0),
  alt_text text not null check (char_length(alt_text) between 1 and 500),
  position integer not null default 0 check (position >= 0),
  focal_x numeric(4,3) check (focal_x is null or focal_x between 0 and 1),
  focal_y numeric(4,3) check (focal_y is null or focal_y between 0 and 1),
  created_at timestamptz not null default now()
);

create table public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  name text not null,
  description text,
  status public.product_status not null default 'draft',
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.collection_products (
  collection_id uuid not null references public.collections(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  position integer not null default 0 check (position >= 0),
  primary key (collection_id, product_id)
);

create table public.inventory_levels (
  variant_id uuid primary key references public.product_variants(id) on delete cascade,
  on_hand integer not null default 0 check (on_hand >= 0),
  reserved integer not null default 0 check (reserved >= 0 and reserved <= on_hand),
  version bigint not null default 1,
  updated_at timestamptz not null default now()
);

create table public.carts (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique,
  currency text not null default 'COP' check (currency = 'COP'),
  expires_at timestamptz not null,
  checked_out_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  variant_id uuid not null references public.product_variants(id) on delete restrict,
  quantity integer not null check (quantity between 1 and 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (cart_id, variant_id)
);

create table public.shipping_methods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  active boolean not null default false,
  flat_rate_cents bigint not null check (flat_rate_cents >= 0),
  free_from_subtotal_cents bigint check (free_from_subtotal_cents is null or free_from_subtotal_cents >= 0),
  min_business_days integer check (min_business_days is null or min_business_days >= 0),
  max_business_days integer check (max_business_days is null or max_business_days >= min_business_days),
  coverage jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  public_number text not null unique,
  access_token_hash text not null unique,
  cart_id uuid references public.carts(id) on delete set null,
  status public.order_status not null default 'draft',
  currency text not null default 'COP' check (currency = 'COP'),
  subtotal_cents bigint not null check (subtotal_cents >= 0),
  discount_cents bigint not null default 0 check (discount_cents >= 0),
  shipping_cents bigint not null check (shipping_cents >= 0),
  tax_cents bigint not null check (tax_cents >= 0),
  tax_included boolean not null default false,
  total_cents bigint not null check (total_cents >= 0),
  contact_email text not null,
  contact_phone text not null,
  shipping_address jsonb not null,
  shipping_method_name text not null,
  terms_version text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz,
  check (total_cents = subtotal_cents - discount_cents + shipping_cents + case when tax_included then 0 else tax_cents end)
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  sku text not null,
  product_name text not null,
  option_snapshot jsonb not null default '{}'::jsonb,
  unit_price_cents bigint not null check (unit_price_cents >= 0),
  tax_cents bigint not null default 0 check (tax_cents >= 0),
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);

create table public.payment_attempts (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  provider text not null default 'wompi' check (provider = 'wompi'),
  reference text not null unique,
  transaction_id text unique,
  amount_cents bigint not null check (amount_cents >= 0),
  currency text not null default 'COP' check (currency = 'COP'),
  status public.payment_status not null default 'created',
  provider_status text,
  idempotency_key text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inventory_reservations (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete restrict,
  payment_attempt_id uuid not null references public.payment_attempts(id) on delete restrict,
  variant_id uuid not null references public.product_variants(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  status public.reservation_status not null default 'reserved',
  expires_at timestamptz not null,
  idempotency_key text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.payment_events (
  id uuid primary key default gen_random_uuid(),
  event_key text not null unique,
  provider text not null default 'wompi',
  reference text,
  transaction_id text,
  signature_valid boolean not null,
  payload jsonb not null,
  processed_at timestamptz,
  processing_error text,
  created_at timestamptz not null default now()
);

create table public.outbox_events (
  id uuid primary key default gen_random_uuid(),
  aggregate_type text not null,
  aggregate_id uuid not null,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  idempotency_key text not null unique,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'failed')),
  attempts integer not null default 0 check (attempts >= 0),
  next_attempt_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin', 'catalog_manager', 'order_manager')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_state jsonb,
  after_state jsonb,
  created_at timestamptz not null default now()
);

create index product_media_product_position_idx on public.product_media(product_id, position);
create index product_variants_product_active_idx on public.product_variants(product_id, active);
create index cart_items_cart_idx on public.cart_items(cart_id);
create index orders_access_token_hash_idx on public.orders(access_token_hash);
create index payment_attempts_order_idx on public.payment_attempts(order_id);
create index inventory_reservations_expiry_idx on public.inventory_reservations(status, expires_at);
create index payment_events_reference_idx on public.payment_events(reference);
create index outbox_ready_idx on public.outbox_events(status, next_attempt_at);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_touch_updated_at before update on public.products for each row execute function public.touch_updated_at();
create trigger product_variants_touch_updated_at before update on public.product_variants for each row execute function public.touch_updated_at();
create trigger collections_touch_updated_at before update on public.collections for each row execute function public.touch_updated_at();
create trigger carts_touch_updated_at before update on public.carts for each row execute function public.touch_updated_at();
create trigger cart_items_touch_updated_at before update on public.cart_items for each row execute function public.touch_updated_at();
create trigger shipping_methods_touch_updated_at before update on public.shipping_methods for each row execute function public.touch_updated_at();
create trigger orders_touch_updated_at before update on public.orders for each row execute function public.touch_updated_at();
create trigger payment_attempts_touch_updated_at before update on public.payment_attempts for each row execute function public.touch_updated_at();
create trigger inventory_reservations_touch_updated_at before update on public.inventory_reservations for each row execute function public.touch_updated_at();
create trigger outbox_events_touch_updated_at before update on public.outbox_events for each row execute function public.touch_updated_at();
create trigger admin_profiles_touch_updated_at before update on public.admin_profiles for each row execute function public.touch_updated_at();

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-media', 'product-media', true, 10485760, array['image/avif', 'image/jpeg', 'image/png', 'image/webp', 'video/mp4'])
on conflict (id) do nothing;

alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_media enable row level security;
alter table public.collections enable row level security;
alter table public.collection_products enable row level security;
alter table public.inventory_levels enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.shipping_methods enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payment_attempts enable row level security;
alter table public.inventory_reservations enable row level security;
alter table public.payment_events enable row level security;
alter table public.outbox_events enable row level security;
alter table public.app_settings enable row level security;
alter table public.admin_profiles enable row level security;
alter table public.audit_log enable row level security;

create policy products_public_read on public.products for select to anon, authenticated using (status = 'active');
create policy variants_public_read on public.product_variants for select to anon, authenticated using (
  active and exists (select 1 from public.products p where p.id = product_id and p.status = 'active')
);
create policy media_public_read on public.product_media for select to anon, authenticated using (
  exists (select 1 from public.products p where p.id = product_id and p.status = 'active')
);
create policy collections_public_read on public.collections for select to anon, authenticated using (status = 'active');
create policy collection_products_public_read on public.collection_products for select to anon, authenticated using (
  exists (select 1 from public.collections c where c.id = collection_id and c.status = 'active')
  and exists (select 1 from public.products p where p.id = product_id and p.status = 'active')
);
create policy shipping_methods_public_read on public.shipping_methods for select to anon, authenticated using (active);
create policy product_media_storage_read on storage.objects for select to anon, authenticated using (bucket_id = 'product-media');

-- The storefront gets an availability flag, never inventory quantities. This function
-- deliberately runs with table access but exposes only the safe derived result.
create or replace function public.variant_availability(p_variant_ids uuid[])
returns table (variant_id uuid, available boolean)
language sql
security definer
stable
set search_path = public
as $$
  select
    v.id,
    v.active and p.status = 'active' and coalesce(i.on_hand - i.reserved, 0) > 0
  from public.product_variants v
  join public.products p on p.id = v.product_id
  left join public.inventory_levels i on i.variant_id = v.id
  where v.id = any(p_variant_ids)
$$;

insert into public.app_settings(key, value)
values
  ('checkout', '{"configured": false, "reservation_ttl_minutes": 20}'::jsonb),
  ('tax', '{"configured": false}'::jsonb)
on conflict (key) do nothing;

create or replace function public.create_guest_cart(p_token_hash text, p_expires_at timestamptz)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cart_id uuid;
begin
  if char_length(p_token_hash) < 32 then raise exception 'invalid cart token'; end if;

  insert into public.carts(token_hash, expires_at)
  values (p_token_hash, p_expires_at)
  on conflict (token_hash) do update
    set expires_at = greatest(public.carts.expires_at, excluded.expires_at)
  returning id into v_cart_id;

  return v_cart_id;
end;
$$;

create or replace function public.cart_id_from_token(p_token_hash text)
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select id from public.carts
  where token_hash = p_token_hash and expires_at > now() and checked_out_at is null
$$;

create or replace function public.set_cart_item(p_token_hash text, p_variant_id uuid, p_quantity integer)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cart_id uuid;
  v_available integer;
begin
  select public.cart_id_from_token(p_token_hash) into v_cart_id;
  if v_cart_id is null then raise exception 'cart not found or expired'; end if;
  if p_quantity < 0 or p_quantity > 10 then raise exception 'invalid quantity'; end if;

  if p_quantity = 0 then
    delete from public.cart_items where cart_id = v_cart_id and variant_id = p_variant_id;
    return;
  end if;

  select i.on_hand - i.reserved into v_available
  from public.product_variants v
  join public.products p on p.id = v.product_id
  join public.inventory_levels i on i.variant_id = v.id
  where v.id = p_variant_id and v.active and p.status = 'active';

  if v_available is null or v_available < p_quantity then
    raise exception 'variant unavailable';
  end if;

  insert into public.cart_items(cart_id, variant_id, quantity)
  values (v_cart_id, p_variant_id, p_quantity)
  on conflict (cart_id, variant_id) do update set quantity = excluded.quantity;
end;
$$;

create or replace function public.cart_snapshot(p_token_hash text)
returns table (
  cart_id uuid,
  cart_item_id uuid,
  variant_id uuid,
  product_slug text,
  product_name text,
  color text,
  size text,
  image_key text,
  image_alt text,
  quantity integer,
  unit_price_cents bigint,
  available boolean
)
language sql
security definer
stable
set search_path = public
as $$
  select
    c.id,
    ci.id,
    v.id,
    p.slug,
    p.name,
    v.color,
    v.size,
    media.storage_key,
    coalesce(media.alt_text, p.name),
    ci.quantity,
    v.price_cents,
    v.active and p.status = 'active' and coalesce(i.on_hand - i.reserved, 0) >= ci.quantity
  from public.carts c
  join public.cart_items ci on ci.cart_id = c.id
  join public.product_variants v on v.id = ci.variant_id
  join public.products p on p.id = v.product_id
  left join public.inventory_levels i on i.variant_id = v.id
  left join lateral (
    select pm.storage_key, pm.alt_text
    from public.product_media pm
    where pm.product_id = p.id and pm.kind = 'image' and (pm.variant_id is null or pm.variant_id = v.id)
    order by pm.variant_id desc nulls last, pm.position asc
    limit 1
  ) media on true
  where c.token_hash = p_token_hash and c.expires_at > now() and c.checked_out_at is null
  order by ci.created_at asc
$$;

create or replace function public.prepare_checkout(
  p_token_hash text,
  p_idempotency_key text,
  p_contact jsonb,
  p_shipping_address jsonb,
  p_shipping_method_id uuid
)
returns table (
  order_id uuid,
  access_token text,
  reference text,
  total_cents bigint,
  currency text,
  expires_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_cart_id uuid;
  v_order_id uuid;
  v_existing_order uuid;
  v_existing_token text;
  v_reference text;
  v_access_token text;
  v_subtotal bigint := 0;
  v_shipping bigint := 0;
  v_tax bigint := 0;
  v_total bigint := 0;
  v_ttl integer;
  v_expires_at timestamptz;
  v_tax_rate integer;
  v_tax_included boolean;
  v_terms_version text;
  v_shipping_method record;
  v_item record;
  v_inventory record;
  v_payment_id uuid;
begin
  if coalesce(p_contact->>'email', '') = '' or coalesce(p_contact->>'phone', '') = '' then
    raise exception 'contact data is incomplete';
  end if;
  if coalesce(p_shipping_address->>'address_line_1', '') = ''
    or coalesce(p_shipping_address->>'city', '') = ''
    or coalesce(p_shipping_address->>'region', '') = '' then
    raise exception 'shipping address is incomplete';
  end if;

  select public.cart_id_from_token(p_token_hash) into v_cart_id;
  if v_cart_id is null then raise exception 'cart not found or expired'; end if;

  select o.id into v_existing_order
  from public.payment_attempts pa
  join public.orders o on o.id = pa.order_id
  where pa.idempotency_key = p_idempotency_key;
  if v_existing_order is not null then
    raise exception 'checkout key already used';
  end if;

  select (value->>'reservation_ttl_minutes')::integer, nullif(value->>'terms_version', '')
  into v_ttl, v_terms_version
  from public.app_settings where key = 'checkout' and coalesce((value->>'configured')::boolean, false);
  if v_ttl is null or v_ttl < 5 or v_ttl > 120 or v_terms_version is null then raise exception 'checkout configuration incomplete'; end if;

  select (value->>'tax_rate_basis_points')::integer, coalesce((value->>'prices_include_tax')::boolean, false)
  into v_tax_rate, v_tax_included
  from public.app_settings where key = 'tax' and coalesce((value->>'configured')::boolean, false);
  if v_tax_rate is null or v_tax_rate < 0 or v_tax_rate > 10000 then raise exception 'tax configuration incomplete'; end if;

  select * into v_shipping_method from public.shipping_methods
  where id = p_shipping_method_id and active
  for update;
  if not found then raise exception 'shipping method unavailable'; end if;
  if jsonb_typeof(v_shipping_method.coverage->'countries') = 'array'
    and not (v_shipping_method.coverage->'countries' ? (p_shipping_address->>'country')) then
    raise exception 'shipping method does not cover this country';
  end if;
  if jsonb_typeof(v_shipping_method.coverage->'regions') = 'array'
    and not (v_shipping_method.coverage->'regions' ? (p_shipping_address->>'region')) then
    raise exception 'shipping method does not cover this region';
  end if;
  if jsonb_typeof(v_shipping_method.coverage->'cities') = 'array'
    and not (v_shipping_method.coverage->'cities' ? (p_shipping_address->>'city')) then
    raise exception 'shipping method does not cover this city';
  end if;

  for v_item in
    select ci.variant_id, ci.quantity, v.sku, v.color, v.size, v.price_cents, v.active, p.id as product_id, p.name as product_name, p.status
    from public.cart_items ci
    join public.product_variants v on v.id = ci.variant_id
    join public.products p on p.id = v.product_id
    where ci.cart_id = v_cart_id
    for update of ci, v, p
  loop
    select * into v_inventory from public.inventory_levels where variant_id = v_item.variant_id for update;
    if v_inventory.variant_id is null or not v_item.active or v_item.status <> 'active' or v_inventory.on_hand - v_inventory.reserved < v_item.quantity then
      raise exception 'stock changed for variant %', v_item.variant_id;
    end if;
    v_subtotal := v_subtotal + v_item.price_cents * v_item.quantity;
  end loop;

  if v_subtotal = 0 then raise exception 'cart is empty'; end if;
  if v_shipping_method.free_from_subtotal_cents is not null and v_subtotal >= v_shipping_method.free_from_subtotal_cents then
    v_shipping := 0;
  else
    v_shipping := v_shipping_method.flat_rate_cents;
  end if;
  if v_tax_included then
    v_tax := round(v_subtotal * v_tax_rate::numeric / (10000 + v_tax_rate));
  else
    v_tax := round(v_subtotal * v_tax_rate::numeric / 10000);
  end if;
  v_total := v_subtotal + v_shipping + case when v_tax_included then 0 else v_tax end;
  v_expires_at := now() + make_interval(mins => v_ttl);
  v_access_token := encode(gen_random_bytes(32), 'hex');
  v_reference := 'UC-' || to_char(now(), 'YYMM') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12));

  insert into public.orders(
    public_number, access_token_hash, cart_id, status, subtotal_cents, shipping_cents, tax_cents, tax_included, total_cents,
    contact_email, contact_phone, shipping_address, shipping_method_name, terms_version
  ) values (
    v_reference, encode(digest(v_access_token, 'sha256'), 'hex'), v_cart_id, 'awaiting_payment', v_subtotal, v_shipping, v_tax, v_tax_included, v_total,
    p_contact->>'email', p_contact->>'phone', p_shipping_address, v_shipping_method.name, v_terms_version
  ) returning id into v_order_id;

  insert into public.payment_attempts(order_id, reference, amount_cents, status, idempotency_key, expires_at)
  values (v_order_id, v_reference, v_total, 'created', p_idempotency_key, v_expires_at)
  returning id into v_payment_id;

  for v_item in
    select ci.variant_id, ci.quantity, v.sku, v.color, v.size, v.price_cents, p.id as product_id, p.name as product_name
    from public.cart_items ci
    join public.product_variants v on v.id = ci.variant_id
    join public.products p on p.id = v.product_id
    where ci.cart_id = v_cart_id
  loop
    insert into public.order_items(order_id, product_id, variant_id, sku, product_name, option_snapshot, unit_price_cents, tax_cents, quantity)
    values (v_order_id, v_item.product_id, v_item.variant_id, v_item.sku, v_item.product_name,
      jsonb_strip_nulls(jsonb_build_object('color', v_item.color, 'size', v_item.size)), v_item.price_cents,
      case when v_tax_included then round(v_item.price_cents * v_item.quantity * v_tax_rate::numeric / (10000 + v_tax_rate)) else round(v_item.price_cents * v_item.quantity * v_tax_rate::numeric / 10000) end,
      v_item.quantity);
    insert into public.inventory_reservations(order_id, payment_attempt_id, variant_id, quantity, expires_at, idempotency_key)
    values (v_order_id, v_payment_id, v_item.variant_id, v_item.quantity, v_expires_at, 'reserve:' || v_payment_id || ':' || v_item.variant_id);
    update public.inventory_levels set reserved = reserved + v_item.quantity, version = version + 1 where variant_id = v_item.variant_id;
  end loop;

  update public.carts set checked_out_at = now() where id = v_cart_id;
  return query select v_order_id, v_access_token, v_reference, v_total, 'COP'::text, v_expires_at;
end;
$$;

create or replace function public.apply_wompi_payment_event(
  p_event_key text,
  p_reference text,
  p_transaction_id text,
  p_provider_status text,
  p_amount_cents bigint,
  p_currency text,
  p_payload jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_attempt public.payment_attempts%rowtype;
  v_reservation record;
begin
  insert into public.payment_events(event_key, reference, transaction_id, signature_valid, payload)
  values (p_event_key, p_reference, p_transaction_id, true, p_payload)
  on conflict (event_key) do nothing;
  if not found then return; end if;

  select * into v_attempt from public.payment_attempts where reference = p_reference for update;
  if not found then
    update public.payment_events set processing_error = 'payment reference not found' where event_key = p_event_key;
    return;
  end if;
  if v_attempt.amount_cents <> p_amount_cents or v_attempt.currency <> p_currency then
    update public.payment_events set processing_error = 'amount or currency mismatch' where event_key = p_event_key;
    raise exception 'payment amount or currency mismatch';
  end if;
  if v_attempt.transaction_id is not null and v_attempt.transaction_id <> p_transaction_id then
    update public.payment_events set processing_error = 'transaction id mismatch' where event_key = p_event_key;
    raise exception 'payment transaction mismatch';
  end if;
  if v_attempt.status = 'approved' then
    update public.payment_events set processed_at = now() where event_key = p_event_key;
    return;
  end if;

  if p_provider_status = 'APPROVED' then
    update public.payment_attempts set status = 'approved', provider_status = p_provider_status, transaction_id = p_transaction_id where id = v_attempt.id;
    if exists (
      select 1 from public.inventory_reservations
      where payment_attempt_id = v_attempt.id and status <> 'reserved'
    ) then
      update public.orders set status = 'manual_review' where id = v_attempt.order_id and status <> 'paid';
      insert into public.outbox_events(aggregate_type, aggregate_id, type, payload, idempotency_key)
      values ('order', v_attempt.order_id, 'payment.approved_after_reservation', jsonb_build_object('reference', p_reference), 'late-approved:' || v_attempt.order_id)
      on conflict (idempotency_key) do nothing;
      update public.payment_events set processed_at = now() where event_key = p_event_key;
      return;
    end if;
    update public.orders set status = 'paid', paid_at = coalesce(paid_at, now()) where id = v_attempt.order_id;
    for v_reservation in select * from public.inventory_reservations where payment_attempt_id = v_attempt.id and status = 'reserved' for update loop
      update public.inventory_levels
      set on_hand = on_hand - v_reservation.quantity, reserved = reserved - v_reservation.quantity, version = version + 1
      where variant_id = v_reservation.variant_id and on_hand >= v_reservation.quantity and reserved >= v_reservation.quantity;
      if not found then raise exception 'inventory could not be consumed'; end if;
      update public.inventory_reservations set status = 'consumed' where id = v_reservation.id;
    end loop;
    insert into public.outbox_events(aggregate_type, aggregate_id, type, payload, idempotency_key)
    values ('order', v_attempt.order_id, 'order.paid', jsonb_build_object('reference', p_reference), 'order-paid:' || v_attempt.order_id)
    on conflict (idempotency_key) do nothing;
  elsif p_provider_status in ('DECLINED', 'VOIDED', 'ERROR') then
    update public.payment_attempts
    set status = case p_provider_status when 'DECLINED' then 'declined'::public.payment_status when 'VOIDED' then 'voided'::public.payment_status else 'error'::public.payment_status end,
      provider_status = p_provider_status, transaction_id = coalesce(transaction_id, p_transaction_id)
    where id = v_attempt.id;
    update public.orders set status = 'payment_failed' where id = v_attempt.order_id and status <> 'paid';
    for v_reservation in select * from public.inventory_reservations where payment_attempt_id = v_attempt.id and status = 'reserved' for update loop
      update public.inventory_levels set reserved = reserved - v_reservation.quantity, version = version + 1
      where variant_id = v_reservation.variant_id and reserved >= v_reservation.quantity;
      if not found then raise exception 'inventory reservation could not be released'; end if;
      update public.inventory_reservations set status = 'released' where id = v_reservation.id;
    end loop;
  else
    update public.payment_attempts set status = 'pending', provider_status = p_provider_status, transaction_id = coalesce(transaction_id, p_transaction_id) where id = v_attempt.id;
  end if;

  update public.payment_events set processed_at = now() where event_key = p_event_key;
end;
$$;

create or replace function public.release_expired_reservations()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reservation record;
  v_released integer := 0;
begin
  for v_reservation in
    select r.*, pa.status as payment_status
    from public.inventory_reservations r
    join public.payment_attempts pa on pa.id = r.payment_attempt_id
    where r.status = 'reserved' and r.expires_at < now()
    for update of r, pa skip locked
  loop
    if v_reservation.payment_status = 'created' then
      update public.inventory_levels set reserved = reserved - v_reservation.quantity, version = version + 1
      where variant_id = v_reservation.variant_id and reserved >= v_reservation.quantity;
      update public.inventory_reservations set status = 'released' where id = v_reservation.id;
      update public.payment_attempts set status = 'error', provider_status = 'EXPIRED' where id = v_reservation.payment_attempt_id;
      update public.orders set status = 'payment_failed' where id = v_reservation.order_id and status = 'awaiting_payment';
      v_released := v_released + 1;
    elsif v_reservation.payment_status = 'pending' then
      update public.inventory_reservations set status = 'manual_review' where id = v_reservation.id;
      update public.orders set status = 'manual_review' where id = v_reservation.order_id and status <> 'paid';
      insert into public.outbox_events(aggregate_type, aggregate_id, type, payload, idempotency_key)
      values ('order', v_reservation.order_id, 'payment.pending_after_reservation', '{}'::jsonb, 'pending-reservation:' || v_reservation.id)
      on conflict (idempotency_key) do nothing;
    end if;
  end loop;
  return v_released;
end;
$$;

revoke all on function public.create_guest_cart(text, timestamptz) from public;
revoke all on function public.cart_id_from_token(text) from public;
revoke all on function public.set_cart_item(text, uuid, integer) from public;
revoke all on function public.cart_snapshot(text) from public;
revoke all on function public.prepare_checkout(text, text, jsonb, jsonb, uuid) from public;
revoke all on function public.apply_wompi_payment_event(text, text, text, text, bigint, text, jsonb) from public;
revoke all on function public.release_expired_reservations() from public;
revoke all on function public.variant_availability(uuid[]) from public;

grant execute on function public.variant_availability(uuid[]) to anon, authenticated;
grant execute on function public.create_guest_cart(text, timestamptz) to service_role;
grant execute on function public.cart_id_from_token(text) to service_role;
grant execute on function public.set_cart_item(text, uuid, integer) to service_role;
grant execute on function public.cart_snapshot(text) to service_role;
grant execute on function public.prepare_checkout(text, text, jsonb, jsonb, uuid) to service_role;
grant execute on function public.apply_wompi_payment_event(text, text, text, text, bigint, text, jsonb) to service_role;
grant execute on function public.release_expired_reservations() to service_role;
