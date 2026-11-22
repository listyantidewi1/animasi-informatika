
test('20 request bersamaan: 20 nomor berbeda', async () => {
  const semua = await Promise.all(
    Array.from({ length: 20 }, () => request(app).post('/api/tiket').send({ service_id: 2 }))
  );
  semua.forEach((r) => assert.strictEqual(r.status, 201));
  const label = new Set(semua.map((r) => r.body.label));
  assert.strictEqual(label.size, 20);
});
