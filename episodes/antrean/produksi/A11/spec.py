NAMA = "A11_laporan_test"
REKAMAN = ["rek", "web"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
BEATS = {
 1: [A('kartuBab', a=dict(bab='BAB 11', judul='Laporan dan pengujian', sub='Menjawab Pak Rahmat, lalu membuktikan aplikasinya tetap benar', lapis='database')), A('duaPertanyaan', min=8)],
 2: [A('withDua', min=16), R('b02', 'b02_akhir', speed=3, maks=6)],
 3: [A('jamZona', min=10), R('b03', 'b03_akhir', speed=2.5, maks=4)],
 4: [R('b04', 'b04_akhir', speed=4, maks=2.5), W('laporan', 'akhir', maks=1.3, kalimat=2)],
 5: [A('ujiOtomatis')],
 6: [A('supertest', min=10), R('b06', 'b06_akhir', speed=2.5, maks=5)],
 7: [A('dbTest', min=8), R('b07', 'b07_akhir', speed=3, maks=6)],
 8: [R('b08', 'b08_jalan', speed=3, maks=6), R('b08_jalan', 'b08_akhir', maks=1.6, kalimat=3)],
 9: [A('panahTerlarang', min=8), R('b09', 'b09_akhir', speed=3, maks=5)],
 10: [R('b10', 'b10_rusak', speed=3, maks=5), R('b10_rusak', 'b10_akhir', speed=1.6, maks=2.2, kalimat=3)],
 11: [R('b11', 'b11_akhir', speed=1.4, maks=1.8, kalimat=1), A('bacaJejak', min=12)],
 12: [A('cekAI11', min=8), R('b12', 'b12_akhir', speed=2, maks=4, kalimat=2)],
 13: [A('testPalsu', min=8, a=dict(awal=True)), R('b13', 'b13_akhir', maks=2, kalimat=2), A('testPalsu', min=10)],
 14: [R('b14', 'b14_akhir', maks=1.5), A('tantangan', min=8, a=dict(tantangan='Tulis test untuk kuota slot: lima pemesanan bersamaan untuk slot berkuota dua. Pastikan tepat dua yang berhasil.', berikut='Bab 12: Online dengan Docker dan HTTPS'))],
}

# --- Sorot baris: potongan pada kecepatan asli, mulai tepat pada kalimat ke-k (0 = kalimat pertama), ditahan sampai bagian berikutnya
def S(h, d, k=None):
    p = dict(k='rek', a=h, b=h, da=-0.15, db=d - 0.45, asli=True)  # h = tanda 'sorotN' (otomatis dari rekam_vs.kamera_editor(zoom=...))
    if k is not None: p['kalimat'] = k
    return p
BEATS[3] = [A('jamZona', min=10), R('b03', 'sorot1', db=-0.1, speed=2.5, maks=4), S('sorot1', 3)]
BEATS[4] = [R('b04', 'sorot2', db=-0.1, speed=4, maks=2.5), S('sorot2', 3, 1), W('laporan', 'akhir', maks=1.3, kalimat=2)]
BEATS[10] = [R('b10', 'b10_rusak', speed=3, maks=5), R('b10_rusak', 'sorot3', db=-0.1, speed=3, maks=4, kalimat=2), S('sorot3', 3, 3), R('sorot3', 'b10_akhir', da=3.1, speed=1.6, maks=2.2, kalimat=4)]
BEATS[11] = [R('b11', 'sorot5', db=-0.1, speed=3, maks=3), S('sorot5', 3, 1), R('sorot5', 'b11_akhir', da=3.1, speed=1.4, maks=1.8, kalimat=2), A('bacaJejak', min=12)]
BEATS[12] = [A('cekAI11', min=8), R('b12', 'sorot6', db=-0.1, speed=2, maks=4, kalimat=2), S('sorot6', 3), R('sorot6', 'b12_akhir', da=3.1, speed=2, maks=4)]
BEATS[13] = [A('testPalsu', min=8, a=dict(awal=True)), R('b13', 'sorot7', db=-0.1, speed=2, maks=2, kalimat=2), S('sorot7', 2.5), R('sorot7', 'b13_akhir', da=2.6, maks=2), A('testPalsu', min=10)]
