-- Blue Chic — Mercado Pago (Checkout Pro)
-- Guarda los identificadores de la preferencia y el pago para conciliar con el webhook
-- Run this in your Supabase SQL editor

alter table orders add column if not exists mp_preference_id text;
alter table orders add column if not exists mp_payment_id text;
