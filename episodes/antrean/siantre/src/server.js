// SiAntre: server utama
const express = require('express');
const session = require('express-session');
const { dengarkan } = require('./siaran');
const { pool } = require('./db');

const app = express();
app.set('trust proxy', 1); // di belakang Nginx
app.use(express.json());
app.use(express.static('public'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 12 * 60 * 60 * 1000 },
}));
app.use('/api', require('./routes/tiket').router);
app.use('/api', require('./routes/booking'));
app.use('/api', require('./routes/auth').router);
app.use('/api', require('./routes/laporan'));
app.get('/api/siaran', dengarkan);
// Kode QR menuju halaman ambil nomor, dibuat dari alamat aplikasi
app.get('/api/qr.svg', async (req, res) => {
  const QRCode = require('qrcode');
  const alamat = process.env.ALAMAT_PUBLIK || `${req.protocol}://${req.get('host')}/`;
  res.type('image/svg+xml').send(await QRCode.toString(alamat, { type: 'svg', margin: 1 }));
});
app.use('/api', require('./routes/loket'));

app.get('/halo', (req, res) => {
  res.send('Halo dari SiAntre!');
});

app.get('/api/layanan', async (req, res) => {
  const { rows } = await pool.query('SELECT id, code, name, avg_minutes FROM services ORDER BY code');
  res.json(rows);
});

// Penanganan error terakhir: catat di server, kirim pesan umum ke pengguna
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Terjadi kesalahan di server' });
});

if (require.main === module) app.listen(3000, () => console.log('SiAntre berjalan'));
module.exports = app;