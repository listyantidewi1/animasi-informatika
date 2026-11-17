// Fungsi bantu yang dipakai semua halaman
async function api(alamat, opsi = {}) {
  const res = await fetch('/api' + alamat, {
    method: opsi.method || 'GET',
    headers: opsi.body ? { 'Content-Type': 'application/json' } : {},
    body: opsi.body ? JSON.stringify(opsi.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Gagal menghubungi server');
  return data;
}

// Membuat elemen dengan teks yang aman (tidak pernah memakai innerHTML untuk data pengguna)
function el(tag, kelas, teks) {
  const e = document.createElement(tag);
  if (kelas) e.className = kelas;
  if (teks !== undefined) e.textContent = teks;
  return e;
}

// Mendengarkan siaran server; otomatis tersambung ulang bila koneksi putus
function dengarkan(jenis, aksi) {
  const sumber = new EventSource('/api/siaran');
  jenis.forEach((j) => sumber.addEventListener(j, (e) => aksi(j, JSON.parse(e.data))));
  return sumber;
}

const STATUS = { waiting: 'Menunggu', called: 'Dipanggil! Silakan menuju loket', serving: 'Sedang dilayani',
  done: 'Selesai. Terima kasih!', skipped: 'Terlewat. Hubungi petugas', cancelled: 'Dibatalkan' };
