-- Buat database asset_fumindo terlebih dahulu melalui pgAdmin.
-- Jalankan skrip ini pada database asset_fumindo yang belum memiliki tabel asset.
-- Struktur tabel dibuat secara manual karena TypeORM memakai synchronize: false.
-- Skrip ini untuk inisialisasi sekali, bukan migration atau reset database.

BEGIN;

CREATE TYPE public.asset_category AS ENUM (
    'Consumable',
    'Non-Consumable'
);

CREATE TABLE public.asset (
    asset_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    asset_name TEXT NOT NULL
        CHECK (length(trim(asset_name)) > 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0
        CHECK (stock_quantity >= 0),
    category public.asset_category NOT NULL
);

COMMIT;
