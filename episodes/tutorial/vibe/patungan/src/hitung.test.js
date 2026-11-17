import { describe, it, expect } from 'vitest';
import { hitungPatungan } from './hitung.js';

describe('hitungPatungan', () => {
  it('menghitung contoh SPEK.md bagian 6', () => {
    const struk = {
      voucher: 15000,
      service: 5,
      pajak: 10,
      menu: [
        { nama: 'Nasi goreng spesial', harga: 32000, pemakan: ['Andi'] },
        { nama: 'Mie ayam bakso', harga: 28000, pemakan: ['Bela'] },
        { nama: 'Ayam geprek', harga: 25000, pemakan: ['Citra'] },
        { nama: 'Kentang goreng', harga: 30000, pemakan: ['Andi', 'Bela', 'Citra', 'Dimas'] },
        { nama: 'Es teh manis (2 gelas)', harga: 16000, pemakan: ['Andi', 'Dimas'] },
        { nama: 'Kopi susu', harga: 22000, pemakan: ['Dimas'] },
        { nama: 'Pisang bakar', harga: 24000, pemakan: ['Bela', 'Citra'] },
      ],
    };

    const hasil = hitungPatungan(struk);

    expect(hasil.bagian).toEqual({
      Andi: 50300,
      Bela: 50300,
      Citra: 47100,
      Dimas: 39700,
    });
    expect(hasil.kelebihan).toBe(290);
  });

  it('membagi satu menu Rp10000 ke tiga orang tanpa voucher, service, pajak', () => {
    const hasil = hitungPatungan({
      menu: [{ nama: 'Pizza', harga: 10000, pemakan: ['Andi', 'Bela', 'Citra'] }],
    });

    expect(hasil.bagian).toEqual({ Andi: 3400, Bela: 3400, Citra: 3400 });
    expect(hasil.kelebihan).toBe(200);
  });

  it('sama dengan porsi pesanan jika tanpa voucher, service, dan pajak', () => {
    const hasil = hitungPatungan({
      menu: [
        { nama: 'Nasi goreng spesial', harga: 32000, pemakan: ['Andi'] },
        { nama: 'Mie ayam bakso', harga: 28000, pemakan: ['Bela'] },
        { nama: 'Ayam geprek', harga: 25000, pemakan: ['Citra'] },
        { nama: 'Kentang goreng', harga: 30000, pemakan: ['Andi', 'Bela', 'Citra', 'Dimas'] },
        { nama: 'Es teh manis (2 gelas)', harga: 16000, pemakan: ['Andi', 'Dimas'] },
        { nama: 'Kopi susu', harga: 22000, pemakan: ['Dimas'] },
        { nama: 'Pisang bakar', harga: 24000, pemakan: ['Bela', 'Citra'] },
      ],
    });

    expect(hasil.bagian).toEqual({
      Andi: 47500,
      Bela: 47500,
      Citra: 44500,
      Dimas: 37500,
    });
  });

  it('membatasi voucher paling besar sama dengan subtotal (voucher 999999)', () => {
    const hasil = hitungPatungan({
      voucher: 999999,
      service: 5,
      pajak: 10,
      menu: [
        { nama: 'Nasi goreng spesial', harga: 32000, pemakan: ['Andi'] },
        { nama: 'Mie ayam bakso', harga: 28000, pemakan: ['Bela'] },
        { nama: 'Kentang goreng', harga: 30000, pemakan: ['Andi', 'Bela', 'Citra'] },
      ],
    });

    expect(hasil.total).toBe(0);
    expect(hasil.bagian).toEqual({ Andi: 0, Bela: 0, Citra: 0 });
    expect(hasil.kelebihan).toBe(0);
  });

  it('menghasilkan bagian 0 jika subtotal 0 (semua menu Rp0)', () => {
    const hasil = hitungPatungan({
      service: 5,
      pajak: 10,
      menu: [
        { nama: 'Air putih', harga: 0, pemakan: ['Andi', 'Bela'] },
        { nama: 'Kerupuk', harga: 0, pemakan: ['Andi'] },
      ],
    });

    expect(hasil.total).toBe(0);
    expect(hasil.bagian).toEqual({ Andi: 0, Bela: 0 });
    expect(hasil.kelebihan).toBe(0);
  });

  it('melempar error jika ada menu tanpa pemakan', () => {
    const struk = {
      menu: [
        { nama: 'Nasi goreng', harga: 32000, pemakan: ['Andi'] },
        { nama: 'Kopi susu', harga: 22000, pemakan: [] },
      ],
    };

    expect(() => hitungPatungan(struk)).toThrow('Ada menu yang belum dipilih pemakannya');
  });
});
