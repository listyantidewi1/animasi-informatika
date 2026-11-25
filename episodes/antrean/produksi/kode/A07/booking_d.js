// Pelanggan yang memesan datang: ubah pemesanan menjadi tiket antrean
router.post('/booking/:kode/checkin', async (req, res) => {
  const tiket = await transaksi(async (db) => {
    const { rows } = await db.query(
      `UPDATE bookings b SET status = 'checked_in' FROM slots sl
        WHERE b.code = $1 AND b.status = 'booked' AND sl.id = b.slot_id
        RETURNING sl.service_id`,
      [req.params.kode]
    );
    if (rows.length === 0) return null;
    return buatTiket(db, rows[0].service_id);
  });
  if (!tiket) return res.status(409).json({ error: 'Pemesanan tidak ditemukan atau sudah dipakai' });
  res.status(201).json({ label: tiket.label, code: tiket.code });
});
