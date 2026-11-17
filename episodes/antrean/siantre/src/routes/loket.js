// API untuk petugas loket: lihat antrean dan ubah status tiket.
const express = require('express');
const { pool, transaksi } = require('../db');
const { siarkan } = require('../siaran');
const { wajib } = require('./auth');

const router = express.Router();
const petugas = wajib('petugas', 'admin');

// Perpindahan status yang diizinkan (diagram status di bab 1)
const BOLEH = {
  ulang:   { dari: ['called', 'skipped'], ke: 'called' },
  lewati:  { dari: ['called'],            ke: 'skipped' },
  layani:  { dari: ['called'],            ke: 'serving' },
  selesai: { dari: ['serving'],           ke: 'done' },
};

router.get('/loket', petugas, async (req, res) => {
  const { rows } = await pool.query(
    `SELECT c.id, c.name, array_agg(s.code ORDER BY s.code) AS layanan
       FROM counters c JOIN counter_services cs ON cs.counter_id = c.id
       JOIN services s ON s.id = cs.service_id GROUP BY c.id ORDER BY c.id`
  );
  res.json(rows);
});

// Antrean yang bisa dilayani loket ini, ditambah tiket yang sedang ditangani
router.get('/loket/:id/antrean', petugas, async (req, res) => {
  const loket = Number(req.params.id);
  const menunggu = await pool.query(
    `SELECT t.id, t.label, s.name AS layanan, t.created_at
       FROM tickets t JOIN services s ON s.id = t.service_id
      WHERE t.service_date = current_date AND t.status = 'waiting'
        AND t.service_id IN (SELECT service_id FROM counter_services WHERE counter_id = $1)
      ORDER BY t.created_at, t.id LIMIT 50`,
    [loket]
  );
  const aktif = await pool.query(
    `SELECT t.id, t.label, t.status, s.name AS layanan FROM tickets t JOIN services s ON s.id = t.service_id
      WHERE t.service_date = current_date AND t.counter_id = $1 AND t.status IN ('called', 'serving', 'skipped')
      ORDER BY t.id DESC`,
    [loket]
  );
  res.json({ menunggu: menunggu.rows, aktif: aktif.rows });
});

// Panggil berikutnya. SKIP LOCKED: tiket yang sedang diambil loket lain dilompati, bukan ditunggu.
router.post('/loket/:id/panggil', petugas, async (req, res) => {
  const loket = Number(req.params.id);
  const tiket = await transaksi(async (db) => {
    const { rows } = await db.query(
      `UPDATE tickets SET status = 'called', counter_id = $1
        WHERE id = (
          SELECT id FROM tickets
           WHERE service_date = current_date AND status = 'waiting'
             AND service_id IN (SELECT service_id FROM counter_services WHERE counter_id = $1)
           ORDER BY created_at, id
           LIMIT 1
           FOR UPDATE SKIP LOCKED
        )
        RETURNING id, label, service_id`,
      [loket]
    );
    if (rows.length === 0) return null;
    await db.query("INSERT INTO ticket_events (ticket_id, status, user_id) VALUES ($1, 'called', $2)",
      [rows[0].id, req.session.user.id]);
    return rows[0];
  });
  if (!tiket) return res.status(404).json({ error: 'Antrean kosong' });
  const { rows } = await pool.query('SELECT name FROM counters WHERE id = $1', [loket]);
  siarkan('panggil', { label: tiket.label, loket: rows[0].name, service_id: tiket.service_id });
  res.json(tiket);
});

// Ubah status satu tiket: ulang, lewati, layani, atau selesai
router.post('/tiket-loket/:id/:aksi', petugas, async (req, res) => {
  const aturan = BOLEH[req.params.aksi];
  if (!aturan) return res.status(400).json({ error: 'Aksi tidak dikenal' });
  const hasil = await transaksi(async (db) => {
    const { rows } = await db.query(
      `UPDATE tickets SET status = $1 WHERE id = $2 AND status = ANY($3) AND counter_id = $4
       RETURNING id, label, service_id`,
      [aturan.ke, Number(req.params.id), aturan.dari, req.session.user.counter_id || Number(req.body.loket)]
    );
    if (rows.length === 0) return null;
    await db.query('INSERT INTO ticket_events (ticket_id, status, user_id) VALUES ($1, $2, $3)',
      [rows[0].id, aturan.ke, req.session.user.id]);
    return rows[0];
  });
  if (!hasil) return res.status(409).json({ error: 'Status tiket tidak bisa diubah dengan aksi ini' });
  if (req.params.aksi === 'ulang') {
    const { rows } = await pool.query('SELECT c.name FROM tickets t JOIN counters c ON c.id = t.counter_id WHERE t.id = $1', [hasil.id]);
    siarkan('panggil', { label: hasil.label, loket: rows[0].name, service_id: hasil.service_id, ulang: true });
  }
  siarkan('antrean', { service_id: hasil.service_id });
  res.json(hasil);
});

module.exports = router;
