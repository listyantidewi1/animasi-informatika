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

