
// Membuat elemen. Isinya selalu lewat textContent, tidak pernah innerHTML.
function el(tag, kelas, teks) {
  const e = document.createElement(tag);
  if (kelas) e.className = kelas;
  if (teks !== undefined) e.textContent = teks;
  return e;
}

// Mendengarkan siaran server; setiap kali tersambung (lagi), ambil keadaan terbaru
function dengarkan(jenis, aksi) {
  const sumber = new EventSource('/api/siaran');
  jenis.forEach((j) => sumber.addEventListener(j, (e) => aksi(j, JSON.parse(e.data))));
  sumber.onopen = () => aksi('buka', {});
  sumber.onerror = () => aksi('putus', {});
  return sumber;
}

const STATUS = { waiting: 'Menunggu', called: 'Dipanggil! Silakan menuju loket', serving: 'Sedang dilayani',
  done: 'Selesai. Terima kasih!', skipped: 'Terlewat. Hubungi petugas', cancelled: 'Dibatalkan' };
