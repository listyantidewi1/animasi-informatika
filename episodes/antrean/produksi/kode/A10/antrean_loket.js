// Antrean yang bisa dilayani loket ini, ditambah tiket yang sedang ditangani
router.get('/loket/:id/antrean', petugas, async (req, res) => {
  const loket = Number(req.params.id);
  const menunggu = await pool.query(
    `SELECT t.id, t.label, s.name AS layanan
       FROM tickets t JOIN services s ON s.id = t.service_id
      WHERE t.service_date = current_date AND t.status = 'waiting'
        AND t.service_id IN (SELECT service_id FROM counter_services WHERE counter_id = $1)
      ORDER BY t.created_at, t.id LIMIT 50`,
    [loket]
  );
  const aktif = await pool.query(
    `SELECT t.id, t.label, t.status, s.name AS layanan
       FROM tickets t JOIN services s ON s.id = t.service_id
      WHERE t.service_date = current_date AND t.counter_id = $1
        AND t.status IN ('called', 'serving', 'skipped')
      ORDER BY t.id DESC`,
    [loket]
  );
  res.json({ menunggu: menunggu.rows, aktif: aktif.rows });
});

