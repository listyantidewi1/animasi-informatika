// Contoh kode bergaya hasil AI: "buatkan test untuk API ambil nomor"
process.env.DATABASE_URL = 'postgres://postgres@localhost/antrean_test';
process.env.SESSION_SECRET = 'rahasia-test';
const { test, after } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/server');
const { pool } = require('../src/db');

after(() => pool.end());

test('POST /api/tiket membuat tiket baru', async () => {
  const res = await request(app).post('/api/tiket').send({ service_id: 1 });
  assert.ok(res);
});
