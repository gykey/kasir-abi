-- ============================================================
-- MASBY SNACK — Supabase Database Schema
-- Jalankan script ini di Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: products
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama_produk TEXT NOT NULL,
  harga      INTEGER NOT NULL DEFAULT 0,
  stok       INTEGER NOT NULL DEFAULT 0,
  kategori   TEXT NOT NULL DEFAULT 'Lainnya',
  gambar_url TEXT,
  emoji      TEXT DEFAULT '📦',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: transactions
-- ============================================================
CREATE TABLE IF NOT EXISTS transactions (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID REFERENCES auth.users(id),
  tanggal           TIMESTAMPTZ DEFAULT NOW(),
  total             INTEGER NOT NULL DEFAULT 0,
  metode_pembayaran TEXT NOT NULL DEFAULT 'Tunai',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: transaction_items
-- ============================================================
CREATE TABLE IF NOT EXISTS transaction_items (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  product_id     UUID REFERENCES products(id),
  qty            INTEGER NOT NULL DEFAULT 1,
  harga_satuan   INTEGER NOT NULL DEFAULT 0,
  subtotal       INTEGER GENERATED ALWAYS AS (qty * harga_satuan) STORED,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;

-- Products: allow all authenticated users to read & write
CREATE POLICY "Allow authenticated read products" ON products
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated write products" ON products
  FOR ALL TO authenticated USING (true);

-- Transactions: allow all authenticated users
CREATE POLICY "Allow authenticated read transactions" ON transactions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated write transactions" ON transactions
  FOR ALL TO authenticated USING (true);

-- Transaction items: allow all authenticated users
CREATE POLICY "Allow authenticated read items" ON transaction_items
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated write items" ON transaction_items
  FOR ALL TO authenticated USING (true);

-- ============================================================
-- SEED DATA: Sample products (Masby Snack)
-- ============================================================
INSERT INTO products (nama_produk, harga, stok, kategori, emoji) VALUES
  ('Chitato Sapi Panggang', 8000, 50, 'Keripik', '🥔'),
  ('Taro Net Original', 5000, 30, 'Keripik', '🍟'),
  ('Indomie Goreng', 4000, 100, 'Mie Instan', '🍜'),
  ('Oreo Original', 7000, 45, 'Biskuit', '🍪'),
  ('Richeese Nabati', 2000, 80, 'Wafer', '🧇'),
  ('Good Time Choco', 9000, 25, 'Biskuit', '🍫'),
  ('Momogi Jagung Bakar', 3000, 60, 'Snack Jagung', '🌽'),
  ('Qtela Cassava Barbeque', 10000, 20, 'Keripik', '🥓'),
  ('Piattos Keju', 8000, 35, 'Keripik', '🧀'),
  ('Superstar Snack', 5000, 5, 'Snack Jagung', '⭐'),
  ('Khong Guan Asst.', 15000, 15, 'Biskuit', '🫙'),
  ('Snickers Bar', 12000, 3, 'Coklat', '🍬')
ON CONFLICT DO NOTHING;
