// Test API SiAntre. Jalankan: npm test
process.env.DATABASE_URL = 'postgres://postgres@localhost/antrean_test';
process.env.SESSION_SECRET = 'rahasia-test';
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const app = require('../src/server');
const { siapkan, tutup } = require('./siapkan');

before(siapkan);
after(tutup);

test('ambil nomor: A-001 lalu A-002', async () => {
  const r1 = await request(app).post('/api/tiket').send({ service_id: 1 });
  assert.strictEqual(r1.status, 201);
  assert.strictEqual(r1.body.label, 'A-001');
  const r2 = await request(app).post('/api/tiket').send({ service_id: 1 });
  assert.strictEqual(r2.body.label, 'A-002');
});

test('validasi: huruf 400, layanan tidak ada 404', async () => {
  const r1 = await request(app).post('/api/tiket').send({ service_id: 'abc' });
  assert.strictEqual(r1.status, 400);
  const r2 = await request(app).post('/api/tiket').send({ service_id: 99 });
  assert.strictEqual(r2.status, 404);
});
