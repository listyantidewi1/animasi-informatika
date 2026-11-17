// Pembuat teks ringkasan untuk dibagikan. Murni (tanpa DOM) supaya mudah dites.

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

// Diformat sendiri (bukan toLocaleString) supaya hasilnya sama di semua perangkat.
const rupiah = (n) => 'Rp' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

const tanggalPendek = (tanggal) => `${tanggal.getDate()} ${BULAN[tanggal.getMonth()]}`;

/**
 * Membuat teks ringkasan patungan.
 *
 * { tempat, tanggal: Date, total, kelebihan, bagian: { nama: rupiah }, penalang }
 * `penalang` harus salah satu kunci `bagian`. Bagian orang lain dicantumkan
 * satu per baris; bagian penalang disebut di kalimat penutup.
 */
export function buatTeksRingkasan({ tempat, tanggal, total, kelebihan, bagian, penalang }) {
  if (!Object.hasOwn(bagian, penalang)) {
    throw new Error('Penalang tidak ada di daftar orang');
  }

  const judul = ['Patungan', tempat?.trim()].filter(Boolean).join(' ');
  const baris = [
    `${judul}${tempat?.trim() ? ',' : ''} ${tanggalPendek(tanggal)}`,
    `Total struk ${rupiah(total)} (ditalangi ${penalang})`,
  ];

  const lain = Object.entries(bagian).filter(([nama]) => nama !== penalang);
  if (lain.length > 0) {
    const lebar = Math.max(...lain.map(([nama]) => nama.length));
    baris.push('', ...lain.map(([nama, jumlah]) => `${nama.padEnd(lebar)} ${rupiah(jumlah)}`));
  }

  const kelebihanTeks =
    kelebihan > 0 ? ` Kelebihan ${rupiah(kelebihan)} karena pembulatan ke atas.` : '';
  baris.push('', `Bagian ${penalang} ${rupiah(bagian[penalang])}.${kelebihanTeks}`);
  baris.push(`Transfer ke ${penalang} ya.`);

  return baris.join('\n');
}
