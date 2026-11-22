// API untuk petugas loket: memanggil dan mengubah status tiket.
const express = require('express');
const { transaksi } = require('../db');

const router = express.Router();

// Panggil berikutnya. SKIP LOCKED: tiket yang sedang diambil loket lain dilompati, bukan ditunggu.
router.post('/loket/:id/panggil', async (req, res) => {
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
        RETURNING id, label`,
      [loket]
    );
    if (rows.length === 0) return null;
    await db.query("INSERT INTO ticket_events (ticket_id, status) VALUES ($1, 'called')", [rows[0].id]);
    return rows[0];
  });
  if (!tiket) return res.status(404).json({ error: 'Antrean kosong' });
  res.json(tiket);
});

