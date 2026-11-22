// Status tiket untuk halaman pelanggan (dibuka dengan kode acak, bukan id)
router.get('/tiket/:kode', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT t.label, t.status, s.name AS layanan, s.avg_minutes,
            (SELECT count(*) FROM tickets x
              WHERE x.service_id = t.service_id AND x.service_date = t.service_date
                AND x.status = 'waiting' AND x.created_at < t.created_at)::int AS di_depan
       FROM tickets t JOIN services s ON s.id = t.service_id
      WHERE t.code = $1`,
    [req.params.kode]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Tiket tidak ditemukan' });
  const t = rows[0];
  res.json({ ...t, posisi: t.di_depan + 1, perkiraan_menit: t.di_depan * t.avg_minutes });
});
