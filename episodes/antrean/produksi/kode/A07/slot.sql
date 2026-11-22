-- Jadwal servis besar seminggu ke depan: setiap 2 jam, 08.00-16.00 WIB
INSERT INTO slots (service_id, starts_at, quota)
SELECT 3, (hari + jam * interval '1 hour') AT TIME ZONE 'Asia/Jakarta', 2
  FROM generate_series((current_date + 1)::timestamp, (current_date + 7)::timestamp, interval '1 day') AS hari,
       generate_series(8, 16, 2) AS jam
 WHERE extract(isodow FROM hari) <> 7                       -- Minggu libur
   AND hari::date <> ALL (ARRAY['2026-12-25']::date[])      -- tanggal libur
ON CONFLICT (service_id, starts_at) DO NOTHING;
