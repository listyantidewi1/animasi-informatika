// Contoh kode bergaya hasil AI: "buatkan API ambil nomor antrean"
const express = require('express');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgres://postgres@localhost/antrean_ai' });
const app = express();
app.use(express.json());

app.post('/api/tiket', async (req, res) => {
  // Ambil nomor terakhir, lalu tambah satu
  const { rows } = await pool.query('SELECT COALESCE(MAX(nomor), 0) AS terakhir FROM tiket');
  const nomor = rows[0].terakhir + 1;
  await pool.query('INSERT INTO tiket (nomor) VALUES ($1)', [nomor]);
  res.status(201).json({ nomor });
});

app.listen(4000, () => console.log('Server berjalan di port 4000'));
