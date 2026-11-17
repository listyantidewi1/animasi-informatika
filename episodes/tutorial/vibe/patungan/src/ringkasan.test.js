import { describe, it, expect } from 'vitest';
import { buatTeksRingkasan } from './ringkasan.js';

const contoh = {
  tempat: 'Kafe Senja',
  tanggal: new Date(2026, 10, 17),
  total: 187110,
  kelebihan: 290,
  bagian: { Andi: 50300, Bela: 50300, Citra: 47100, Dimas: 39700 },
  penalang: 'Andi',
};

describe('buatTeksRingkasan', () => {
  it('sama persis dengan format contoh', () => {
    expect(buatTeksRingkasan(contoh)).toBe(
      [
        'Patungan Kafe Senja, 17 Nov',
        'Total struk Rp187.110 (ditalangi Andi)',
        '',
        'Bela  Rp50.300',
        'Citra Rp47.100',
        'Dimas Rp39.700',
        '',
        'Bagian Andi Rp50.300. Kelebihan Rp290 karena pembulatan ke atas.',
        'Transfer ke Andi ya.',
      ].join('\n'),
    );
  });

  it('menaruh penalang yang bukan orang pertama dengan benar', () => {
    const teks = buatTeksRingkasan({ ...contoh, penalang: 'Dimas' });
    expect(teks).toContain('(ditalangi Dimas)');
    expect(teks).toContain('Andi  Rp50.300\nBela  Rp50.300\nCitra Rp47.100\n');
    expect(teks).toContain('Bagian Dimas Rp39.700.');
    expect(teks).toContain('Transfer ke Dimas ya.');
    expect(teks).not.toMatch(/^Dimas /m);
  });

  it('menghilangkan kalimat kelebihan kalau tidak ada kelebihan', () => {
    const teks = buatTeksRingkasan({ ...contoh, kelebihan: 0 });
    expect(teks).toContain('Bagian Andi Rp50.300.\nTransfer ke Andi ya.');
    expect(teks).not.toContain('Kelebihan');
  });

  it('tetap rapi kalau nama tempat kosong', () => {
    const teks = buatTeksRingkasan({ ...contoh, tempat: '  ' });
    expect(teks.split('\n')[0]).toBe('Patungan 17 Nov');
  });

  it('tetap rapi kalau penalang makan sendirian', () => {
    const teks = buatTeksRingkasan({
      ...contoh,
      total: 20000,
      kelebihan: 0,
      bagian: { Andi: 20000 },
    });
    expect(teks).toBe(
      [
        'Patungan Kafe Senja, 17 Nov',
        'Total struk Rp20.000 (ditalangi Andi)',
        '',
        'Bagian Andi Rp20.000.',
        'Transfer ke Andi ya.',
      ].join('\n'),
    );
  });

  it('memakai singkatan bulan bahasa Indonesia', () => {
    const teks = (bulan) => buatTeksRingkasan({ ...contoh, tanggal: new Date(2026, bulan, 3) });
    expect(teks(4)).toMatch(/, 3 Mei\n/);
    expect(teks(7)).toMatch(/, 3 Agu\n/);
    expect(teks(11)).toMatch(/, 3 Des\n/);
  });

  it('melempar galat kalau penalang bukan salah satu orang', () => {
    expect(() => buatTeksRingkasan({ ...contoh, penalang: 'Eka' })).toThrow('Penalang');
  });
});
