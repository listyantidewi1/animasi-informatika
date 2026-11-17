  const baru = await pool.query(
    `INSERT INTO tickets (service_id, number, label, code)
     VALUES ($1, $2, $3, $4) RETURNING id, label, code, status`,
    [serviceId, nomor, label, kode]
  );
  await pool.query("INSERT INTO ticket_events (ticket_id, status) VALUES ($1, 'waiting')", [baru.rows[0].id]);
  res.status(201).json(baru.rows[0]);
});

module.exports = router;
