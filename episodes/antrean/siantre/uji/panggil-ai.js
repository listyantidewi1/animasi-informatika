// Contoh kode bergaya hasil AI: "buatkan fitur panggil antrean yang aman"
const express = require('express');
const { pool } = require('../src/db');
const app = express();

app.post('/api/loket/:id/panggil', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      "SELECT id, label FROM tickets WHERE status = 'waiting' ORDER BY created_at LIMIT 1"
    );
    const ticket = result.rows[0];
    if (!ticket) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Queue empty' });
    }
    await client.query("UPDATE tickets SET status = 'called', counter_id = $1 WHERE id = $2", [req.params.id, ticket.id]);
    await client.query("INSERT INTO ticket_events (ticket_id, status) VALUES ($1, 'called')", [ticket.id]);
    await client.query('COMMIT');
    res.json(ticket);
  } finally {
    client.release();
  }
});

app.listen(4001);