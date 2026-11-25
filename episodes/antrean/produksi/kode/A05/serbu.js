// Uji: 20 pelanggan menekan "Ambil nomor" dalam satu detik yang sama
const alamat = process.argv[2] || 'http://localhost:3000/api/tiket';
const tunggu = ms => new Promise(r => setTimeout(r, ms));
const kirim = () => tunggu(Math.random() * 1000).then(() => fetch(alamat, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ service_id: 1 }),
})).then(async r => ({ ok: r.ok, data: await r.json() }));

Promise.all(Array.from({ length: 20 }, kirim)).then(hasil => {
  const nomor = hasil.filter(h => h.ok).map(h => h.data.label || h.data.nomor).sort();
  const ganda = nomor.filter((n, i) => nomor.indexOf(n) !== i);
  console.log('Nomor yang dibagikan:', nomor.join(' '));
  console.log('Nomor ganda:', ganda.length ? [...new Set(ganda)].join(', ') : 'tidak ada');
  console.log('Gagal (error):', hasil.filter(h => !h.ok).length);
});
