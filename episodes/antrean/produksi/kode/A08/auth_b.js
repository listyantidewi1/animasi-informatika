// Penjaga route: hanya untuk pengguna yang sudah login dengan peran tertentu
function wajib(...peran) {
  return (req, res, next) => {
    const u = req.session.user;
    if (!u) return res.status(401).json({ error: 'Silakan login dulu' });
    if (peran.length && !peran.includes(u.role)) return res.status(403).json({ error: 'Tidak punya akses' });
    next();
  };
}

module.exports = { router, wajib };
