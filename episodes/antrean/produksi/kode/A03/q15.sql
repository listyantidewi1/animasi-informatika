SELECT s.name,
  count(p.pertama) AS dilayani,
  avg(p.pertama - t.created_at) AS rata_tunggu,
  count(b.id) AS batal,
  avg(b.created_at - t.created_at) AS tunggu_batal
FROM tickets t
JOIN services s ON s.id = t.service_id
LEFT JOIN (SELECT ticket_id, min(created_at) AS pertama
           FROM ticket_events WHERE status = 'called'
           GROUP BY ticket_id) p ON p.ticket_id = t.id
LEFT JOIN ticket_events b
  ON b.ticket_id = t.id AND b.status = 'cancelled'
GROUP BY s.name;
