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

module.exports = router;
