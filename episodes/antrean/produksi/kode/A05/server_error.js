// Penanganan error terakhir: catat di server, kirim pesan umum ke pengguna
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Terjadi kesalahan di server' });
});

