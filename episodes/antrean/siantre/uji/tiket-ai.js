// Contoh kode bergaya hasil AI: "buatkan halaman untuk pelanggan melihat tiketnya" (data fiktif)
const express = require('express');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgres://postgres@localhost/antrean_ai' });
const app = express();

app.get('/tiket/:id', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM tiket_pelanggan WHERE id = $1', [req.params.id]);
  if (!rows[0]) return res.status(404).send('Tidak ditemukan');
  const t = rows[0];
  res.send(`<h1>Tiket ${t.label}</h1><p>Nama: ${t.nama}</p><p>HP: ${t.hp}</p><p>Status: ${t.status}</p>`);
});

app.listen(4003);