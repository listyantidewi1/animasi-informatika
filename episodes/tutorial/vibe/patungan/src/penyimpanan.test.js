import { describe, it, expect } from 'vitest';
import { KUNCI_DRAFT, KUNCI_RIWAYAT, muatDraf, muatRiwayat, tulis } from './penyimpanan.js';

// Penyimpanan palsu berbentuk localStorage.
const palsu = (isi = {}) => ({
  getItem: (k) => (k in isi ? isi[k] : null),
  setItem: (k, v) => {
    isi[k] = v;
  },
});

const entriBaik = { tanggal: '2026-11-17T09:00:00.000Z', tempat: 'Warung', total: 187110, kelebihan: 290, bagian: {} };

describe('muatRiwayat', () => {
  it('kosong tanpa pesan kalau belum ada data', () => {
    expect(muatRiwayat(palsu())).toEqual({ entri: [], dilewati: 0 });
  });

  it('memuat entri yang baik', () => {
    const s = palsu({ [KUNCI_RIWAYAT]: JSON.stringify([entriBaik]) });
    expect(muatRiwayat(s)).toEqual({ entri: [entriBaik], dilewati: 0 });
  });

  it('melewati entri versi lama tanpa total, tidak melempar galat', () => {
    const lama = { tanggal: '2026-11-01T00:00:00.000Z', tempat: 'Kafe' };
    const s = palsu({ [KUNCI_RIWAYAT]: JSON.stringify([lama, entriBaik]) });
    expect(muatRiwayat(s)).toEqual({ entri: [entriBaik], dilewati: 1 });
  });

  it('melewati entri dengan tipe salah atau tanggal tidak valid', () => {
    const rusak = [null, 5, 'x', [], { ...entriBaik, total: '100' }, { ...entriBaik, total: 1.5 },
      { ...entriBaik, total: -1 }, { ...entriBaik, tanggal: 'bukan tanggal' }, { ...entriBaik, tanggal: 123 }];
    const s = palsu({ [KUNCI_RIWAYAT]: JSON.stringify([...rusak, entriBaik]) });
    const hasil = muatRiwayat(s);
    expect(hasil.entri).toEqual([entriBaik]);
    expect(hasil.dilewati).toBe(rusak.length);
  });

  it('tempat bukan teks diganti teks kosong', () => {
    const s = palsu({ [KUNCI_RIWAYAT]: JSON.stringify([{ ...entriBaik, tempat: 42 }]) });
    expect(muatRiwayat(s).entri[0].tempat).toBe('');
  });

  it('teks bukan JSON dilaporkan rusak, bukan melempar galat', () => {
    expect(muatRiwayat(palsu({ [KUNCI_RIWAYAT]: '{bukan json' }))).toEqual({ entri: [], dilewati: 1 });
  });

  it('JSON yang bukan larik dilaporkan rusak', () => {
    expect(muatRiwayat(palsu({ [KUNCI_RIWAYAT]: '{"a":1}' })).dilewati).toBe(1);
    expect(muatRiwayat(palsu({ [KUNCI_RIWAYAT]: 'null' })).dilewati).toBe(1);
  });

  it('getItem yang melempar galat tidak menghentikan aplikasi', () => {
    const s = { getItem: () => { throw new Error('diblokir'); } };
    expect(muatRiwayat(s)).toEqual({ entri: [], dilewati: 1 });
  });
});

describe('muatDraf', () => {
  it('kosong kalau belum ada data', () => {
    expect(muatDraf(palsu())).toMatchObject({ menu: [], orang: [], dilewati: 0 });
  });

  it('memuat draf yang baik dan membuang pemakan yang bukan orang terdaftar', () => {
    const draf = {
      orang: ['Andi', 'Bela'],
      menu: [{ nama: 'Nasi', harga: 32000, pemakan: ['Andi', 'Hantu'] }],
      tempat: 'Warung', voucher: '15000', service: 5, pajak: '10',
    };
    const hasil = muatDraf(palsu({ [KUNCI_DRAFT]: JSON.stringify(draf) }));
    expect(hasil.orang).toEqual(['Andi', 'Bela']);
    expect(hasil.menu).toEqual([{ nama: 'Nasi', harga: 32000, pemakan: ['Andi'] }]);
    expect(hasil).toMatchObject({ tempat: 'Warung', voucher: '15000', service: '5', pajak: '10', dilewati: 0 });
  });

  it('melewati menu dan orang yang rusak', () => {
    const draf = {
      orang: ['Andi', 7, ''],
      menu: [null, { nama: 'Tanpa harga' }, { nama: 'Desimal', harga: 10.5 }, { nama: 'Baik', harga: 1000 }],
    };
    const hasil = muatDraf(palsu({ [KUNCI_DRAFT]: JSON.stringify(draf) }));
    expect(hasil.orang).toEqual(['Andi']);
    expect(hasil.menu).toEqual([{ nama: 'Baik', harga: 1000, pemakan: [] }]);
    expect(hasil.dilewati).toBe(2 + 3);
  });

  it('nilai kolom yang aneh diabaikan', () => {
    const draf = { voucher: { a: 1 }, service: null, pajak: Infinity, tempat: 5 };
    const hasil = muatDraf(palsu({ [KUNCI_DRAFT]: JSON.stringify(draf) }));
    expect(hasil.voucher).toBeUndefined();
    expect(hasil.service).toBeUndefined();
    expect(hasil.pajak).toBeUndefined();
    expect(hasil.tempat).toBeUndefined();
  });

  it('teks bukan JSON atau bukan objek dilaporkan rusak', () => {
    for (const mentah of ['%%%', '[1,2]', '"teks"', '12', 'null']) {
      const hasil = muatDraf(palsu({ [KUNCI_DRAFT]: mentah }));
      expect(hasil).toMatchObject({ menu: [], orang: [], dilewati: 1 });
    }
  });
});

describe('tulis', () => {
  it('menyimpan JSON', () => {
    const isi = {};
    tulis(palsu(isi), 'k', { a: 1 });
    expect(isi.k).toBe('{"a":1}');
  });

  it('tidak melempar galat kalau penyimpanan penuh', () => {
    const penuh = { setItem: () => { throw new Error('QuotaExceededError'); } };
    expect(() => tulis(penuh, 'k', 1)).not.toThrow();
  });
});
