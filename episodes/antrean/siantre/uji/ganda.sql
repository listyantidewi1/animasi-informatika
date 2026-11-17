SELECT ticket_id, count(*) FROM ticket_events
WHERE status = 'called' GROUP BY ticket_id HAVING count(*) > 1;