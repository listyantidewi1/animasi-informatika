-- Data contoh hari ini untuk laporan (tidak ditampilkan di video)
TRUNCATE tickets, ticket_events RESTART IDENTITY CASCADE;
DO $$
DECLARE
  per_jam int[] := ARRAY[4, 9, 14, 11, 7, 6, 8, 10, 7, 3]; -- jam 07.00 .. 16.00 WIB
  j int; k int; s int; t0 timestamptz; tid int; n int; st text; r float;
BEGIN
  FOR j IN 1..array_length(per_jam, 1) LOOP
    FOR k IN 1..per_jam[j] LOOP
      s := 1 + ((j * 7 + k) % 3);
      t0 := ((current_date + time '07:00') + (j - 1) * interval '1 hour' + (k * 53 % 60) * interval '1 minute') AT TIME ZONE 'Asia/Jakarta';
      SELECT coalesce(max(number), 0) + 1 INTO n FROM tickets WHERE service_id = s AND service_date = current_date;
      r := random();
      st := CASE WHEN j >= 9 AND r < .5 THEN 'waiting' WHEN r < .12 THEN 'cancelled' ELSE 'done' END;
      INSERT INTO tickets (service_id, number, label, status, code, created_at)
        VALUES (s, n, (SELECT code FROM services WHERE id = s) || '-' || lpad(n::text, 3, '0'), st, md5(random()::text), t0)
        RETURNING id INTO tid;
      INSERT INTO ticket_events (ticket_id, status, created_at) VALUES (tid, 'waiting', t0);
      IF st = 'done' THEN
        INSERT INTO ticket_events (ticket_id, status, created_at) VALUES (tid, 'called', t0 + (8 + (k * 11 + j * 5) % 30) * interval '1 minute');
        INSERT INTO ticket_events (ticket_id, status, created_at) VALUES (tid, 'done', t0 + (40 + k % 20) * interval '1 minute');
      ELSIF st = 'cancelled' THEN
        INSERT INTO ticket_events (ticket_id, status, created_at) VALUES (tid, 'cancelled', t0 + (35 + k * 3 % 25) * interval '1 minute');
      END IF;
    END LOOP;
  END LOOP;
END $$;
