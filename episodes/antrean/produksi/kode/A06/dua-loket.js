// Uji: dua loket menekan "Panggil" 50 kali secara bersamaan
const alamat = process.argv[2] || 'http://localhost:3000';
const panggil = (loket) => fetch(`${alamat}/api/loket/${loket}/panggil`, { method: 'POST' });

const semua = [];
for (let i = 0; i < 50; i++) semua.push(panggil(1), panggil(2));
Promise.all(semua).then((h) => console.log('Request selesai:', h.length));
