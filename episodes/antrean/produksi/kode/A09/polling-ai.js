// Contoh kode bergaya hasil AI: "buatkan layar TV antrean yang update otomatis"
const express = require('express');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgres://postgres@localhost/antrean' });
const app = express();

let hitung = 0;
app.get('/api/antrean', async (req, res) => {
  hitung++;
  const { rows } = await pool.query("SELECT label, status FROM tickets WHERE status = 'called' ORDER BY id DESC LIMIT 1");
  res.json(rows[0] || {});
});

app.get('/', (req, res) => res.send(`<h1 id="n">-</h1><script>
  setInterval(async () => {
    const r = await fetch('/api/antrean');
    const d = await r.json();
    document.getElementById('n').textContent = d.label || '-';
  }, 100);
</script>`));

setInterval(() => { console.log('request/detik:', hitung); hitung = 0; }, 1000);
app.listen(4004);
