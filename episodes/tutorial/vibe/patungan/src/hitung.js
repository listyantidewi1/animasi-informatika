const KELIPATAN = 100;

function fpb(a, b) {
  return b === 0 ? a : fpb(b, a % b);
}

function kpk(a, b) {
  return (a / fpb(a, b)) * b;
}

// Pembagian bulat ke atas untuk bilangan bulat non-negatif.
function bagiKeAtas(a, b) {
  return Math.floor((a + b - 1) / b);
}

/**
 * Menghitung bagian tiap orang (SPEK.md bagian 5).
 *
 * struk: { voucher, service, pajak, menu: [{ nama, harga, pemakan: [...] }] }
 *   voucher dalam rupiah, service dan pajak dalam persen.
 * Mengembalikan { bagian: { nama: rupiah }, kelebihan, total }.
 */
export function hitungPatungan(struk) {
  const { menu, voucher = 0, service = 0, pajak = 0 } = struk;

  // Aturan 6: jangan menghitung kalau ada menu tanpa pemakan.
  if (menu.some((m) => !m.pemakan || m.pemakan.length === 0)) {
    throw new Error('Ada menu yang belum dipilih pemakannya');
  }

  const subtotal = menu.reduce((jumlah, m) => jumlah + m.harga, 0);
  // Voucher paling besar sama dengan subtotal, jadi total tidak pernah minus.
  const setelahVoucher = subtotal - Math.min(voucher, subtotal);
  const biayaService = Math.round((setelahVoucher * service) / 100);
  const biayaPajak = Math.round(((setelahVoucher + biayaService) * pajak) / 100);
  const total = setelahVoucher + biayaService + biayaPajak;

  // Porsi tiap orang dihitung dengan penyebut bersama (kpk jumlah pemakan)
  // supaya tetap bilangan bulat dan tidak kena galat desimal.
  const skala = menu.reduce((k, m) => kpk(k, m.pemakan.length), 1);
  const porsi = {};
  for (const m of menu) {
    const bagianMenu = m.harga * (skala / m.pemakan.length);
    for (const orang of m.pemakan) {
      porsi[orang] = (porsi[orang] ?? 0) + bagianMenu;
    }
  }

  // Voucher, service, dan pajak sebanding dengan porsi, sehingga bagian tepat
  // = porsi / subtotal * total. Lalu dibulatkan ke atas ke kelipatan Rp100.
  const bagian = {};
  let jumlahDibayar = 0;
  for (const [orang, p] of Object.entries(porsi)) {
    // Subtotal 0 berarti tidak ada yang dibayar; hindari pembagian dengan nol.
    const kelipatan =
      subtotal === 0 ? 0 : bagiKeAtas(p * total, subtotal * skala * KELIPATAN);
    bagian[orang] = kelipatan * KELIPATAN;
    jumlahDibayar += bagian[orang];
  }

  return { bagian, kelebihan: jumlahDibayar - total, total };
}
