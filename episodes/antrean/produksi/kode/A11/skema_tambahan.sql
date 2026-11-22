
-- Kolom yang kita tambahkan di bab 5 sampai 7
ALTER TABLE tickets  ADD COLUMN code text UNIQUE;
ALTER TABLE tickets  ADD COLUMN counter_id integer REFERENCES counters;
ALTER TABLE bookings ADD COLUMN code text UNIQUE;
