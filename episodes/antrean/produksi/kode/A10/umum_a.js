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
