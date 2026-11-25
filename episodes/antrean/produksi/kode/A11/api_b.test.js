
test('tiket selesai tidak bisa dipanggil ulang: 409', async () => {
  const petugas = request.agent(app);
  await petugas.post('/api/login').send({ username: 'uji', password: 'rahasia123' }).expect(200);
  const { body: t } = await petugas.post('/api/loket/1/panggil').expect(200);
  await petugas.post(`/api/tiket-loket/${t.id}/layani`).expect(200);
  await petugas.post(`/api/tiket-loket/${t.id}/selesai`).expect(200);
  const r = await petugas.post(`/api/tiket-loket/${t.id}/ulang`);
  assert.strictEqual(r.status, 409);
});
