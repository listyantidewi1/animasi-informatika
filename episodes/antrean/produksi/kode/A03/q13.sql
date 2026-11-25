SELECT s.name, avg(p.pertama - t.created_at) AS rata_tunggu
FROM tickets t
JOIN services s ON s.id = t.service_id
JOIN (SELECT ticket_id, min(created_at) AS pertama
      FROM ticket_events WHERE status = 'called'
      GROUP BY ticket_id) p ON p.ticket_id = t.id
GROUP BY s.name;
