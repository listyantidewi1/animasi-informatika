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

test('tiket selesai tidak bisa dipanggil ulang: 409', async () => {
  const petugas = request.agent(app);
  await petugas.post('/api/login').send({ username: 'uji', password: 'rahasia123' }).expect(200);
  const { body: t } = await petugas.post('/api/loket/1/panggil').expect(200);
  await petugas.post(`/api/tiket-loket/${t.id}/layani`).expect(200);
  await petugas.post(`/api/tiket-loket/${t.id}/selesai`).expect(200);
  const r = await petugas.post(`/api/tiket-loket/${t.id}/ulang`);
  assert.strictEqual(r.status, 409);
});

test('20 request bersamaan: 20 nomor berbeda', async () => {
  const semua = await Promise.all(
    Array.from({ length: 20 }, () => request(app).post('/api/tiket').send({ service_id: 2 }))
  );
  semua.forEach((r) => assert.strictEqual(r.status, 201));
  const label = new Set(semua.map((r) => r.body.label));
  assert.strictEqual(label.size, 20);
});