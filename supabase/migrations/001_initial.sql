-- Blue Chic — Initial Schema
-- Run this in your Supabase SQL editor

create extension if not exists "uuid-ossp";

-- ─── PRODUCTS ───────────────────────────────────────────────────────────────
create table products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  category text not null check (category in ('blazers','bodies','remeras','pantalones','vestidos')),
  collection text not null check (collection in ('juvenil','plus30')),
  price numeric not null,
  description text default '',
  images text[] default '{}',
  featured boolean default false,
  active boolean default true,
  created_at timestamptz default now()
);

-- ─── PRODUCT VARIANTS ───────────────────────────────────────────────────────
create table product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  size text not null check (size in ('XS','S','M','L','XL')),
  color text not null,
  stock integer not null default 0 check (stock >= 0),
  created_at timestamptz default now(),
  unique(product_id, size, color)
);

-- ─── ORDERS ─────────────────────────────────────────────────────────────────
create table orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text unique not null,
  status text not null default 'pending'
    check (status in ('pending','confirmed','shipped','delivered','cancelled')),
  customer_first_name text not null,
  customer_last_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address text not null,
  shipping_city text not null,
  shipping_province text not null,
  shipping_postal text not null,
  shipping_apt text,
  payment_method text not null check (payment_method in ('mp','transfer')),
  subtotal numeric not null,
  shipping_cost numeric not null default 0,
  total numeric not null,
  notes text,
  created_at timestamptz default now()
);

-- ─── ORDER ITEMS ────────────────────────────────────────────────────────────
create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  product_name text not null,
  size text not null,
  color text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric not null,
  created_at timestamptz default now()
);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────────
alter table products enable row level security;
alter table product_variants enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Products: public read (active only), authenticated write
create policy "Public can view active products"
  on products for select
  using (active = true);

create policy "Admins manage products"
  on products for all
  using (auth.role() = 'authenticated');

-- Variants: public read, authenticated write
create policy "Public can view variants"
  on product_variants for select
  using (true);

create policy "Admins manage variants"
  on product_variants for all
  using (auth.role() = 'authenticated');

-- Orders: public insert, authenticated full access
create policy "Anyone can create orders"
  on orders for insert
  with check (true);

create policy "Admins manage orders"
  on orders for all
  using (auth.role() = 'authenticated');

-- Order items: public insert, authenticated full access
create policy "Anyone can create order items"
  on order_items for insert
  with check (true);

create policy "Admins manage order items"
  on order_items for all
  using (auth.role() = 'authenticated');

-- ─── STORAGE BUCKET ─────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
  values ('product-images', 'product-images', true)
  on conflict do nothing;

create policy "Product images public read"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Admins upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Admins update product images"
  on storage.objects for update
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "Admins delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');
