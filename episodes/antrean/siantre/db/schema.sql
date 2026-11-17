-- SiAntre: skema database
-- Jalankan di psql: \i db/schema.sql

DROP TABLE IF EXISTS bookings, slots, ticket_events, tickets, users,
  counter_services, counters, services CASCADE;

-- Layanan yang ditawarkan, misalnya A = ganti oli cepat
CREATE TABLE services (
  id          serial PRIMARY KEY,
  code        char(1) NOT NULL UNIQUE,
  name        text    NOT NULL,
  avg_minutes integer NOT NULL CHECK (avg_minutes > 0)
);

-- Loket tempat pelanggan dilayani
CREATE TABLE counters (
  id   serial PRIMARY KEY,
  name text NOT NULL UNIQUE
);

-- Banyak ke banyak: satu loket bisa melayani beberapa layanan
CREATE TABLE counter_services (
  counter_id integer NOT NULL REFERENCES counters ON DELETE CASCADE,
  service_id integer NOT NULL REFERENCES services ON DELETE CASCADE,
  PRIMARY KEY (counter_id, service_id)
);

-- Admin dan petugas loket
CREATE TABLE users (
  id            serial PRIMARY KEY,
  username      text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  role          text NOT NULL CHECK (role IN ('admin', 'petugas')),
  counter_id    integer REFERENCES counters
);

-- Satu tiket = satu nomor antrean
CREATE TABLE tickets (
  id           serial PRIMARY KEY,
  service_id   integer NOT NULL REFERENCES services,
  service_date date    NOT NULL DEFAULT current_date,
  number       integer NOT NULL CHECK (number > 0),
  label        text    NOT NULL,             -- teks yang dicetak, misalnya A-012
  status       text    NOT NULL DEFAULT 'waiting'
               CHECK (status IN ('waiting', 'called', 'serving', 'done', 'skipped', 'cancelled')),
  code         text    NOT NULL UNIQUE,      -- kode acak untuk halaman pelanggan
  counter_id   integer REFERENCES counters,  -- loket yang memanggil
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (service_id, service_date, number)  -- tidak boleh ada nomor ganda
);

-- Riwayat perubahan status; baris lama tidak pernah diubah
CREATE TABLE ticket_events (
  id         serial PRIMARY KEY,
  ticket_id  integer NOT NULL REFERENCES tickets ON DELETE CASCADE,
  status     text    NOT NULL,
  user_id    integer REFERENCES users,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON ticket_events (ticket_id, created_at);

-- Jadwal yang bisa dipesan
CREATE TABLE slots (
  id         serial PRIMARY KEY,
  service_id integer NOT NULL REFERENCES services,
  starts_at  timestamptz NOT NULL,
  quota      integer NOT NULL CHECK (quota > 0),
  UNIQUE (service_id, starts_at)
);

-- Pemesanan slot oleh pelanggan
CREATE TABLE bookings (
  id         serial PRIMARY KEY,
  slot_id    integer NOT NULL REFERENCES slots,
  name       text    NOT NULL,
  phone      text    NOT NULL,
  code       text    NOT NULL UNIQUE,
  status     text    NOT NULL DEFAULT 'booked' CHECK (status IN ('booked', 'cancelled', 'checked_in')),
  created_at timestamptz NOT NULL DEFAULT now()
);
