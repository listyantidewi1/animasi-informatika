// Contoh kode bergaya hasil AI: "buatkan fitur booking dengan kuota"
const express = require('express');
const crypto = require('crypto');
const { pool } = require('../src/db');
const app = express();
app.use(express.json());

app.post('/api/booking', async (req, res) => {
  const { slot_id, name, phone } = req.body;
  const slot = await pool.query('SELECT quota FROM slots WHERE id = $1', [slot_id]);
  const count = await pool.query("SELECT count(*)::int AS n FROM bookings WHERE slot_id = $1 AND status <> 'cancelled'", [slot_id]);
  if (count.rows[0].n < slot.rows[0].quota) {
    const code = crypto.randomBytes(6).toString('base64url');
    await pool.query('INSERT INTO bookings (slot_id, name, phone, code) VALUES ($1, $2, $3, $4)', [slot_id, name, phone, code]);
    return res.status(201).json({ code });
  }
  res.status(409).json({ error: 'Slot full' });
});

app.listen(4002);