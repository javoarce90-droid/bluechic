-- Blue Chic — Configuración de la tienda (medios de pago)
-- Datos de transferencia y alias de Mercado Pago, editables desde el panel
-- Run this in your Supabase SQL editor

create table if not exists store_settings (
  id int primary key default 1 check (id = 1),
  transfer_cbu text default '',
  transfer_alias text default '',
  transfer_holder text default '',
  transfer_bank text default '',
  mp_alias text default '',
  updated_at timestamptz default now()
);

-- Única fila de configuración
insert into store_settings (id) values (1) on conflict do nothing;

alter table store_settings enable row level security;

-- Lectura pública (el checkout necesita mostrar CBU/alias al cliente)
create policy "Public can view settings" on store_settings for select using (true);
-- Escritura solo admin
create policy "Admins manage settings" on store_settings for all using (auth.role() = 'authenticated');
