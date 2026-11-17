NAMA = "A06_konkurensi"
SKRIP = ["/home/user/antre/A01/adegan.js"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
BEATS = {
 1: [A('kartuBab', a=dict(bab='BAB 6', judul='Dua petugas menekan\n"Panggil" bersamaan', sub='Konkurensi: transaksi dan penguncian', lapis='database'))],
 2: [A('balapan')], 3: [A('jamPasir')], 4: [A('amplopTransaksi')],
 5: [R('b04', 'b04_akhir', maks=2.2)],
 6: [R('b05', 'b05_uji', speed=3, maks=5), R('b05_uji', 'b05_akhir', maks=1.6), A('balapanTransaksi', min=8)],
 7: [A('gembokLayanan', min=10), R('b06', 'b06_uji', maks=1.8, kalimat=1), R('b06_uji', 'b06_akhir', maks=1.5, kalimat=5)],
 8: [A('duaPetugas')], 9: [A('tungguGembok')],
 10: [A('skipLocked', min=10), R('b10_kolom', 'b10', speed=3, maks=1.0, kalimat=5)],
 11: [R('b10', 'b10_sorot', speed=5, maks=1.0), R('b10_sorot', 'b10_akhir', maks=1.6, kalimat=2)],
 12: [A('dariDiagram', min=10), R('b11', 'b11_uji', speed=2.5, maks=4, kalimat=2), R('b11_uji', 'b11_akhir', maks=1.6, kalimat=5)],
 13: [R('b12', 'b12_jalan', speed=2.5, maks=4), R('b12_jalan', 'b12_akhir', maks=1.8)],
 14: [A('cekAI06')],
 15: [A('masalahAI06', min=8), R('b14_jalan', 'b14_akhir', maks=1.8, kalimat=2)],
 16: [R('b16', 'b16_akhir', maks=1.5), A('tantangan', min=8, a=dict(tantangan='Buka dua terminal, lalu kirim aksi selesai untuk tiket yang sama dari keduanya pada waktu yang hampir sama. Apa jawaban server untuk request kedua, dan kenapa?', berikut='Bab 7: Reservasi slot tanpa dobel booking'))],
}
