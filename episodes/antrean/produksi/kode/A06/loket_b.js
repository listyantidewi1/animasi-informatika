// Perpindahan status yang diizinkan (diagram status di bab 1)
const BOLEH = {
  ulang:   { dari: ['called', 'skipped'], ke: 'called' },
  lewati:  { dari: ['called'],            ke: 'skipped' },
  layani:  { dari: ['called'],            ke: 'serving' },
  selesai: { dari: ['serving'],           ke: 'done' },
};

// Ubah status satu tiket: ulang, lewati, layani, atau selesai
router.post('/tiket-loket/:id/:aksi', async (req, res) => {
  const aturan = BOLEH[req.params.aksi];
  if (!aturan) return res.status(400).json({ error: 'Aksi tidak dikenal' });
  const hasil = await transaksi(async (db) => {
    const { rows } = await db.query(
      `UPDATE tickets SET status = $1 WHERE id = $2 AND status = ANY($3) RETURNING id, label`,
      [aturan.ke, Number(req.params.id), aturan.dari]
    );
    if (rows.length === 0) return null;
    await db.query('INSERT INTO ticket_events (ticket_id, status) VALUES ($1, $2)', [rows[0].id, aturan.ke]);
    return rows[0];
  });
  if (!hasil) return res.status(409).json({ error: 'Status tiket tidak bisa diubah dengan aksi ini' });
  res.json(hasil);
});

module.exports = router;
