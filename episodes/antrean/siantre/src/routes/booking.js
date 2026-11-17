// Pemesanan slot jam: lihat slot, pesan, dan check-in saat datang.
const express = require('express');
const crypto = require('crypto');
const { pool, transaksi } = require('../db');
const { buatTiket } = require('./tiket');

const router = express.Router();

// Slot yang belum lewat, beserta jumlah pemesanan yang masih aktif
router.get('/slot', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT sl.id, sl.starts_at, sl.quota, s.name AS layanan,
            (SELECT count(*) FROM bookings b WHERE b.slot_id = sl.id AND b.status <> 'cancelled')::int AS terisi
       FROM slots sl JOIN services s ON s.id = sl.service_id
      WHERE sl.starts_at > now()
      ORDER BY sl.starts_at LIMIT 40`
  );
  res.json(rows);
});

router.post('/booking', async (req, res) => {
  const slotId = Number(req.body.slot_id);
  const nama = String(req.body.name || '').trim();
  const hp = String(req.body.phone || '').replace(/[^0-9+]/g, '');
  if (!slotId || nama.length < 2 || hp.length < 9) {
    return res.status(400).json({ error: 'Nama dan nomor HP wajib diisi dengan benar' });
  }
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

module.exports = router;