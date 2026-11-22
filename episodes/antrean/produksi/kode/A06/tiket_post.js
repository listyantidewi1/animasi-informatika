// Membuat tiket baru di dalam transaksi yang sudah berjalan
async function buatTiket(db, serviceId) {
  const layanan = await db.query('SELECT code FROM services WHERE id = $1', [serviceId]);
  if (layanan.rowCount === 0) return null;
  const { rows } = await db.query(
    `SELECT coalesce(max(number), 0) + 1 AS nomor
       FROM tickets WHERE service_id = $1 AND service_date = current_date`,
    [serviceId]
  );
  const nomor = rows[0].nomor;
  const label = `${layanan.rows[0].code}-${String(nomor).padStart(3, '0')}`;
  const kode = crypto.randomBytes(9).toString('base64url'); // sulit ditebak
  const baru = await db.query(
    `INSERT INTO tickets (service_id, number, label, code)
     VALUES ($1, $2, $3, $4) RETURNING id, label, code, status`,
    [serviceId, nomor, label, kode]
  );
  await db.query("INSERT INTO ticket_events (ticket_id, status) VALUES ($1, 'waiting')", [baru.rows[0].id]);
  return baru.rows[0];
}

// Ambil nomor antrean baru
router.post('/tiket', async (req, res) => {
  const serviceId = Number(req.body.service_id);
  if (!Number.isInteger(serviceId) || serviceId <= 0) {
    return res.status(400).json({ error: 'service_id harus berupa angka' });
  }
  const tiket = await transaksi((db) => buatTiket(db, serviceId));
  if (!tiket) return res.status(404).json({ error: 'Layanan tidak ditemukan' });
  res.status(201).json(tiket);
});

