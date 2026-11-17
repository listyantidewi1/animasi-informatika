// Membaca data dari localStorage dengan aman. Data bisa rusak: bukan JSON,
// dari versi lama, atau diubah tangan. Entri yang rusak dilewati, bukan
// membuat aplikasi berhenti.

export const KUNCI_DRAFT = 'patungan:draf';
export const KUNCI_RIWAYAT = 'patungan:riwayat';

// Hasil: { ada: false } | { ada: true, rusak: true } | { ada: true, nilai }
function bacaJson(storage, kunci) {
  try {
    const teks = storage.getItem(kunci);
    if (teks === null || teks === undefined) return { ada: false };
    return { ada: true, nilai: JSON.parse(teks) };
  } catch {
    return { ada: true, rusak: true };
  }
}

const adalahObjek = (x) => x !== null && typeof x === 'object' && !Array.isArray(x);
const rupiahValid = (n) => Number.isSafeInteger(n) && n >= 0;

function entriRiwayatValid(r) {
  return (
    adalahObjek(r) &&
    typeof r.tanggal === 'string' &&
    !Number.isNaN(new Date(r.tanggal).getTime()) &&
    rupiahValid(r.total)
  );
}

/** Mengembalikan { entri, dilewati }. Tidak pernah melempar galat. */
export function muatRiwayat(storage) {
  const baca = bacaJson(storage, KUNCI_RIWAYAT);
  if (!baca.ada) return { entri: [], dilewati: 0 };
  if (baca.rusak || !Array.isArray(baca.nilai)) return { entri: [], dilewati: 1 };
  const entri = baca.nilai
    .filter(entriRiwayatValid)
    .map((r) => ({ ...r, tempat: typeof r.tempat === 'string' ? r.tempat : '' }));
  return { entri, dilewati: baca.nilai.length - entri.length };
}

const teksAtauAngka = (v) =>
  typeof v === 'string' ? v : typeof v === 'number' && Number.isFinite(v) ? String(v) : undefined;

/**
 * Mengembalikan { menu, orang, tempat, voucher, service, pajak, dilewati }.
 * Kolom yang tidak valid bernilai undefined (tidak mengubah isian awal).
 */
export function muatDraf(storage) {
  const kosong = { menu: [], orang: [], dilewati: 0 };
  const baca = bacaJson(storage, KUNCI_DRAFT);
  if (!baca.ada) return kosong;
  if (baca.rusak || !adalahObjek(baca.nilai)) return { ...kosong, dilewati: 1 };
  const d = baca.nilai;

  let dilewati = 0;
  const orangMentah = Array.isArray(d.orang) ? d.orang : [];
  const orang = orangMentah.filter((n) => typeof n === 'string' && n.trim() !== '');
  dilewati += orangMentah.length - orang.length;

  const menuMentah = Array.isArray(d.menu) ? d.menu : [];
  const menu = menuMentah
    .filter((m) => adalahObjek(m) && typeof m.nama === 'string' && rupiahValid(m.harga))
    .map((m) => ({
      nama: m.nama,
      harga: m.harga,
      pemakan: Array.isArray(m.pemakan) ? m.pemakan.filter((n) => orang.includes(n)) : [],
    }));
  dilewati += menuMentah.length - menu.length;

  return {
    menu,
    orang,
    tempat: typeof d.tempat === 'string' ? d.tempat : undefined,
    voucher: teksAtauAngka(d.voucher),
    service: teksAtauAngka(d.service),
    pajak: teksAtauAngka(d.pajak),
    dilewati,
  };
}

export function tulis(storage, kunci, nilai) {
  try {
    storage.setItem(kunci, JSON.stringify(nilai));
  } catch {
    // Penyimpanan penuh atau diblokir: aplikasi tetap jalan tanpa simpanan.
  }
}
