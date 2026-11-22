// Login petugas dan admin dengan sesi berbasis cookie.
const express = require('express');
const bcrypt = require('bcrypt');
const { pool } = require('../db');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const { rows } = await pool.query(
    'SELECT id, username, password_hash, role, counter_id FROM users WHERE username = $1',
    [username]
  );
  const user = rows[0];
  // Pesan sama untuk username dan password salah, supaya tidak membocorkan username yang ada
  if (!user || !(await bcrypt.compare(String(password || ''), user.password_hash))) {
    return res.status(401).json({ error: 'Username atau password salah' });
  }
  req.session.regenerate(() => {
    req.session.user = { id: user.id, username: user.username, role: user.role, counter_id: user.counter_id };
    res.json(req.session.user);
  });
});

router.post('/logout', (req, res) => req.session.destroy(() => res.json({ ok: true })));
router.get('/saya', (req, res) => res.json(req.session.user || null));

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