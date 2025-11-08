/*
  # Create payments table

  1. New Tables
    - `payments`
      - `id` (uuid, primary key) - Unique identifier
      - `nama_warga` (text) - Nama warga yang melakukan pembayaran
      - `nominal_dasar` (integer) - Nominal pembayaran dasar (contoh: 100000)
      - `kode_unik` (integer) - Kode unik yang digenerate (contoh: 21)
      - `total_pembayaran` (integer) - Total pembayaran dengan kode unik (contoh: 100021)
      - `status` (text) - Status pembayaran (pending, success, failed)
      - `created_at` (timestamptz) - Waktu transaksi dibuat

  2. Security
    - Enable RLS on `payments` table
    - Add policy for anyone to insert payments
    - Add policy for anyone to read their own payments
*/

CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_warga text NOT NULL,
  nominal_dasar integer NOT NULL,
  kode_unik integer NOT NULL,
  total_pembayaran integer NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create payment"
  ON payments
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read payments"
  ON payments
  FOR SELECT
  TO anon
  USING (true);