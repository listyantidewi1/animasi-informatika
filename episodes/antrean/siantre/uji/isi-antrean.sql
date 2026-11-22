-- Uji: kosongkan antrean lalu buat 120 tiket menunggu untuk layanan A
TRUNCATE tickets, ticket_events RESTART IDENTITY;
INSERT INTO tickets (service_id, number, label, code, created_at)
SELECT 1, n, 'A-' || lpad(n::text, 3, '0'), md5(random()::text), now() + n * interval '1 second'
  FROM generate_series(1, 120) AS n;