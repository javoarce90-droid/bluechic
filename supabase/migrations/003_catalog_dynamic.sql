-- Blue Chic — Catálogo dinámico
-- Categorías, colecciones y colores administrables + talles libres
-- Run this in your Supabase SQL editor

-- ─── NUEVAS TABLAS DE TAXONOMÍA ──────────────────────────────────────────────
create table if not exists categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  sort integer not null default 0,
  created_at timestamptz default now()
);

create table if not exists collections (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  sort integer not null default 0,
  created_at timestamptz default now()
);

create table if not exists colors (
  id uuid primary key default uuid_generate_v4(),
  name text unique not null,
  hex text,
  created_at timestamptz default now()
);

-- ─── AFLOJAR CHECKS FIJOS ────────────────────────────────────────────────────
-- category / collection ahora guardan un slug libre; size queda texto libre (36, 38, S, M...)
alter table products drop constraint if exists products_category_check;
alter table products drop constraint if exists products_collection_check;
alter table product_variants drop constraint if exists product_variants_size_check;

-- ─── ROW LEVEL SECURITY (espeja productos) ───────────────────────────────────
alter table categories enable row level security;
alter table collections enable row level security;
alter table colors enable row level security;

create policy "Public can view categories" on categories for select using (true);
create policy "Admins manage categories" on categories for all using (auth.role() = 'authenticated');

create policy "Public can view collections" on collections for select using (true);
create policy "Admins manage collections" on collections for all using (auth.role() = 'authenticated');

create policy "Public can view colors" on colors for select using (true);
create policy "Admins manage colors" on colors for all using (auth.role() = 'authenticated');

-- ─── SEED (valores actuales para no romper el seed 002) ──────────────────────
insert into categories (name, slug, sort) values
  ('Blazers', 'blazers', 1),
  ('Bodies', 'bodies', 2),
  ('Remeras', 'remeras', 3),
  ('Pantalones', 'pantalones', 4),
  ('Vestidos', 'vestidos', 5)
on conflict (slug) do nothing;

insert into collections (name, slug, sort) values
  ('Juvenil', 'juvenil', 1),
  ('+30', 'plus30', 2)
on conflict (slug) do nothing;

insert into colors (name, hex) values
  ('Negro', '#000000'),
  ('Blanco', '#ffffff'),
  ('Marrón', '#5c4033'),
  ('Beige', '#d8c3a5'),
  ('Gris', '#808080'),
  ('Azul', '#1e3a8a')
on conflict (name) do nothing;
