// Laporan untuk pemilik (dilengkapi di bab 11)
const express = require('express');
const { pool } = require('../db');
const { wajib } = require('./auth');

const router = express.Router();
router.get('/laporan', wajib('admin'), async (req, res) => {
  const tanggal = req.query.tanggal || null; // YYYY-MM-DD, kosong = hari ini
  const perLayanan = await pool.query(
    `WITH panggil AS (
       SELECT ticket_id, min(created_at) AS pertama FROM ticket_events
        WHERE status = 'called' GROUP BY ticket_id
     ), batal AS (
       SELECT ticket_id, created_at FROM ticket_events WHERE status = 'cancelled'
     )
     SELECT s.code, s.name,
            count(p.ticket_id)::int AS dilayani,
            round(avg(extract(epoch FROM p.pertama - t.created_at)) / 60)::int AS rata_tunggu_menit,
            count(b.ticket_id)::int AS batal,
            round(avg(extract(epoch FROM b.created_at - t.created_at)) / 60)::int AS rata_tunggu_batal_menit
       FROM services s
       LEFT JOIN tickets t ON t.service_id = s.id AND t.service_date = coalesce($1::date, current_date)
       LEFT JOIN panggil p ON p.ticket_id = t.id
       LEFT JOIN batal b ON b.ticket_id = t.id
      GROUP BY s.id ORDER BY s.code`,
    [tanggal]
  );
  const perJam = await pool.query(
    `SELECT extract(hour FROM created_at AT TIME ZONE 'Asia/Jakarta')::int AS jam, count(*)::int AS jumlah
       FROM tickets WHERE service_date = coalesce($1::date, current_date)
      GROUP BY jam ORDER BY jam`,
    [tanggal]
  );
  res.json({ layanan: perLayanan.rows, per_jam: perJam.rows });
});
module.exports = router;