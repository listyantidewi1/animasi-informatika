  const hasil = await transaksi(async (db) => {
    // Kunci slot: pemesan lain menunggu sampai kita selesai menghitung kuota
    const slot = await db.query('SELECT quota FROM slots WHERE id = $1 AND starts_at > now() FOR UPDATE', [slotId]);
    if (slot.rowCount === 0) return { status: 404, error: 'Slot tidak ditemukan' };
    const { rows } = await db.query(
      "SELECT count(*)::int AS terisi FROM bookings WHERE slot_id = $1 AND status <> 'cancelled'", [slotId]);
    if (rows[0].terisi >= slot.rows[0].quota) return { status: 409, error: 'Slot sudah penuh' };
    const kode = crypto.randomBytes(6).toString('base64url');
    await db.query('INSERT INTO bookings (slot_id, name, phone, code) VALUES ($1, $2, $3, $4)', [slotId, nama, hp, kode]);
    return { status: 201, code: kode };
  });
  res.status(hasil.status).json(hasil);
});

