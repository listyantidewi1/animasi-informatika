const express = require('express');
const { ambilNomor } = require('./antrean');

process.loadEnvFile('.env');
const JAM_BUKA = '08.00';
const app = express();
app.use(express.static('public'));

app.get('/api/info', (req, res) => {
  res.json({ jamBuka: JAM_BUKA });
});

app.post('/api/ambil', (req, res) => {
  res.json({ nomor: ambilNomor() });
});

app.listen(3001, () => console.log('SiAntre jalan di http://localhost:3001'));
