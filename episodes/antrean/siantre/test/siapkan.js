// Membuat ulang database test dari schema.sql dan seed.sql, supaya setiap test mulai dari keadaan yang sama
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { pool } = require('../src/db');
const baca = (berkas) => fs.readFileSync(path.join(__dirname, '..', 'db', berkas), 'utf8');

async function siapkan() {
  await pool.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
  await pool.query(baca('schema.sql'));
  await pool.query(baca('seed.sql'));
  await pool.query('TRUNCATE tickets, ticket_events RESTART IDENTITY CASCADE'); // mulai tanpa tiket
  const hash = await bcrypt.hash('rahasia123', 4);
  await pool.query("INSERT INTO users (username, password_hash, role, counter_id) VALUES ('uji', $1, 'petugas', 1)", [hash]);
}

async function tutup() {
  await pool.end();
}

module.exports = { siapkan, tutup };