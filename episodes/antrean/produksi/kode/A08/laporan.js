// Laporan untuk pemilik (dilengkapi di bab 11)
const express = require('express');
const { pool } = require('../db');
const { wajib } = require('./auth');

const router = express.Router();
router.get('/laporan', wajib('admin'), async (req, res) => {
  const { rows } = await pool.query(
    'SELECT status, count(*)::int AS jumlah FROM tickets WHERE service_date = current_date GROUP BY status'
  );
  res.json(rows);
});

module.exports = router;
