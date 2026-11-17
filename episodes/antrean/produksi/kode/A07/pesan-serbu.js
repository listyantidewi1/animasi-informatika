// Uji: 10 orang memesan slot yang sama (kuota 2) pada saat yang sama
const alamat = process.argv[2] || 'http://localhost:3000';
const slot = Number(process.argv[3] || 1);
const pesan = (i) => fetch(`${alamat}/api/booking`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ slot_id: slot, name: `Pelanggan ${i}`, phone: '081234567890' }),
}).then((r) => r.status);

Promise.all(Array.from({ length: 10 }, (_, i) => pesan(i + 1))).then((st) => {
  console.log('Status:', st.join(' '));
  console.log('Berhasil:', st.filter((s) => s === 201).length, '| Penuh:', st.filter((s) => s === 409).length);
});
