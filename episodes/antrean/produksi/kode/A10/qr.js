// Kode QR menuju halaman ambil nomor, dibuat dari alamat aplikasi
app.get('/api/qr.svg', async (req, res) => {
  const QRCode = require('qrcode');
  const alamat = process.env.ALAMAT_PUBLIK || `${req.protocol}://${req.get('host')}/`;
  res.type('image/svg+xml').send(await QRCode.toString(alamat, { type: 'svg', margin: 1 }));
});
