// API tiket untuk pelanggan: ambil nomor dan lihat posisi.
const express = require('express');
const crypto = require('crypto');
const { pool, transaksi } = require('../db');
const { siarkan } = require('../siaran');

const router = express.Router();

// Membuat tiket baru di dalam transaksi yang sudah berjalan
async function buatTiket(db, serviceId) {
  // Kunci baris layanan ini, supaya dua orang tidak menghitung nomor bersamaan
  const layanan = await db.query('SELECT code FROM services WHERE id = $1 FOR UPDATE', [serviceId]);
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
     VALUES ($1, $2, $3, $4) RETURNING id, label, code, status, created_at`,
    [serviceId, nomor, label, kode]
  );
  await db.query("INSERT INTO ticket_events (ticket_id, status) VALUES ($1, 'waiting')", [baru.rows[0].id]);
  return baru.rows[0];
}


// Daftar layanan untuk halaman ambil nomor
router.get('/layanan', async (req, res) => {
  const { rows } = await pool.query('SELECT id, code, name, avg_minutes FROM services ORDER BY code');
  res.json(rows);
});

// Jumlah orang yang menunggu per layanan, untuk layar TV
router.get('/ringkas', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT s.code, s.name, count(t.id)::int AS menunggu
       FROM services s LEFT JOIN tickets t
         ON t.service_id = s.id AND t.service_date = current_date AND t.status = 'waiting'
      GROUP BY s.id ORDER BY s.code`
  );
  res.json(rows);
});

// Ambil nomor antrean baru
router.post('/tiket', async (req, res) => {
  const serviceId = Number(req.body.service_id);
  if (!Number.isInteger(serviceId) || serviceId <= 0) {
    return res.status(400).json({ error: 'service_id harus berupa angka' });
  }

  const tiket = await transaksi((db) => buatTiket(db, serviceId));

  if (!tiket) return res.status(404).json({ error: 'Layanan tidak ditemukan' });
  siarkan('antrean', { service_id: serviceId });
  res.status(201).json({ label: tiket.label, code: tiket.code });
});

// Status tiket untuk halaman pelanggan (dibuka dengan kode acak, bukan id)
router.get('/tiket/:kode', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT t.label, t.status, t.created_at, s.name AS layanan, s.avg_minutes, c.name AS loket,
            (SELECT count(*) FROM tickets x
              WHERE x.service_id = t.service_id AND x.service_date = t.service_date
                AND x.status = 'waiting'
                AND (x.created_at, x.id) < (t.created_at, t.id))::int AS di_depan
       FROM tickets t
       JOIN services s ON s.id = t.service_id
       LEFT JOIN counters c ON c.id = t.counter_id
      WHERE t.code = $1`,
    [req.params.kode]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Tiket tidak ditemukan' });
  const t = rows[0];
  res.json({ ...t, posisi: t.di_depan + 1, perkiraan_menit: t.di_depan * t.avg_minutes });
});

// Pelanggan membatalkan tiketnya sendiri
router.post('/tiket/:kode/batal', async (req, res) => {
  const { rows } = await pool.query(
    "UPDATE tickets SET status = 'cancelled' WHERE code = $1 AND status = 'waiting' RETURNING id, service_id",
    [req.params.kode]
  );
  if (rows.length === 0) return res.status(409).json({ error: 'Tiket tidak bisa dibatalkan' });
  await pool.query("INSERT INTO ticket_events (ticket_id, status) VALUES ($1, 'cancelled')", [rows[0].id]);
  siarkan('antrean', { service_id: rows[0].service_id });
  res.json({ ok: true });
});

module.exports = { router, buatTiket };
