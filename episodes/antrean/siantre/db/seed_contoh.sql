-- Tiket contoh hari ini dengan berbagai status (untuk latihan query di bab 3)
DO $$
DECLARE
  i int; s int; st text; t0 timestamptz; tid int; lbl text;
  statuses text[] := ARRAY['done','done','done','done','done','done','done','done','done','done',
                           'done','done','skipped','cancelled','cancelled','serving','called',
                           'waiting','waiting','waiting','waiting','waiting','waiting','waiting',
                           'waiting','waiting','done','done','cancelled','waiting'];
BEGIN
  FOR i IN 1..30 LOOP
    s := 1 + (i % 3);
    st := statuses[i];
    t0 := date_trunc('day', now()) + interval '7 hours 30 minutes' + (i * interval '8 minutes');
    SELECT coalesce(max(number), 0) + 1 INTO tid FROM tickets WHERE service_id = s AND service_date = current_date;
    lbl := (SELECT code FROM services WHERE id = s) || '-' || lpad(tid::text, 3, '0');
    INSERT INTO tickets (service_id, number, label, status, code, created_at)
      VALUES (s, tid, lbl, st, md5(random()::text), t0) RETURNING id INTO tid;
    INSERT INTO ticket_events (ticket_id, status, created_at) VALUES (tid, 'waiting', t0);
    IF st IN ('called','serving','done','skipped') THEN
      INSERT INTO ticket_events (ticket_id, status, created_at)
        VALUES (tid, 'called', t0 + (15 + (i * 7) % 40) * interval '1 minute');
    END IF;
    IF st IN ('serving','done') THEN
      INSERT INTO ticket_events (ticket_id, status, created_at)
        VALUES (tid, 'serving', t0 + (17 + (i * 7) % 40) * interval '1 minute');
    END IF;
    IF st = 'done' THEN
      INSERT INTO ticket_events (ticket_id, status, created_at)
        VALUES (tid, 'done', t0 + (40 + (i * 7) % 40) * interval '1 minute');
    END IF;
    IF st IN ('skipped','cancelled') THEN
      INSERT INTO ticket_events (ticket_id, status, created_at)
        VALUES (tid, st, t0 + (60 + i) * interval '1 minute');
    END IF;
  END LOOP;
END $$;
