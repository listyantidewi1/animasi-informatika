-- Data contoh untuk Bengkel Maju Jaya
INSERT INTO services (code, name, avg_minutes) VALUES
  ('A', 'Ganti oli cepat', 10),
  ('B', 'Servis ringan', 30),
  ('C', 'Servis besar', 90);

INSERT INTO counters (name) VALUES ('Loket 1'), ('Loket 2');

-- Loket 1 melayani A dan B, Loket 2 melayani A dan C
INSERT INTO counter_services VALUES (1, 1), (1, 2), (2, 1), (2, 3);
