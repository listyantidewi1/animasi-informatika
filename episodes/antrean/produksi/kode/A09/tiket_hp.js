// HP pelanggan: kabar 'antrean' hanya tanda, datanya diambil dengan fetch
const kode = new URLSearchParams(location.search).get('kode');
const PESAN = { called: 'Giliranmu! Silakan ke loket.', serving: 'Sedang dilayani', done: 'Selesai. Terima kasih!' };

async function muat() {
  const res = await fetch('/api/tiket/' + kode);
  const t = await res.json();
  document.getElementById('label').textContent = t.label;
  document.getElementById('info').textContent = t.status === 'waiting'
    ? `Posisi ${t.posisi}, sekitar ${t.perkiraan_menit} menit lagi`
    : PESAN[t.status] || t.status;
}

const sumber = new EventSource('/api/siaran');
sumber.addEventListener('antrean', muat);
sumber.onopen = muat; // tersambung (lagi)? ambil keadaan terbaru
