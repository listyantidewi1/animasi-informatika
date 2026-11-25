// Contoh kode bergaya hasil AI: "tampilkan nama pelanggan booking di layar TV saat dipanggil"
const express = require('express');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgres://postgres@localhost/antrean' });
const app = express();

app.get('/api/terakhir', async (req, res) => {
  const { rows } = await pool.query('SELECT name FROM bookings ORDER BY id DESC LIMIT 1');
  res.json(rows[0]);
});

app.get('/', (req, res) => res.send(`<body style="background:#0b1736;color:#fff;font:48px sans-serif;text-align:center">
<div style="font-size:160px;font-weight:900">B-007</div><div id="sambutan"></div>
<script>
  fetch('/api/terakhir').then((r) => r.json()).then((b) => {
    document.getElementById('sambutan').innerHTML = 'Selamat datang, ' + b.name + '!';
  });
</script></body>`));

app.listen(4005);