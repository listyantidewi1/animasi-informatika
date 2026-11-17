// SiAntre: server utama
const express = require('express');
const session = require('express-session');
const path = require('path');
const { dengarkan } = require('./siaran');

const app = express();
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'ganti-ini-di-produksi',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 12 * 60 * 60 * 1000 },
}));

app.use(express.static(path.join(__dirname, '..', 'public')));
app.get('/api/siaran', dengarkan);

// Kode QR menuju halaman ambil nomor, untuk ditempel di meja depan
app.get('/api/qr.svg', async (req, res) => {
  const QRCode = require('qrcode');
  const alamat = process.env.ALAMAT_PUBLIK || `${req.protocol}://${req.get('host')}/`;
  res.type('image/svg+xml').send(await QRCode.toString(alamat, { type: 'svg', margin: 1 }));
});
app.use('/api', require('./routes/auth').router);
app.use('/api', require('./routes/tiket').router);
app.use('/api', require('./routes/booking'));
app.use('/api', require('./routes/laporan'));
app.use('/api', require('./routes/loket'));

// Penanganan error terakhir: catat di server, kirim pesan umum ke pengguna
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Terjadi kesalahan di server' });
});

const port = process.env.PORT || 3000;
if (require.main === module) app.listen(port, () => console.log(`SiAntre berjalan di http://localhost:${port}`));
module.exports = app;
