NAMA = "A07_reservasi"
REKAMAN = ["rek", "web"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
BEATS = {
 1: [A('kartuBab', a=dict(bab='BAB 7', judul='Reservasi slot\ntanpa dobel booking', sub='Kuota, zona waktu, dan kunci baris', lapis='database'))],
 2: [A('slotKuota')],
 3: [R('b03', 'b03_jalan', speed=2.5, maks=4), R('b03_jalan', 'b03_akhir', maks=1.6, kalimat=3)],
 4: [A('duaKota')],
 5: [R('b05', 'b05_pasang', speed=2.5, maks=4), R('b05_pasang', 'b05_akhir', speed=2, maks=3), W('mulai', 'akhir', maks=1.6)],
 6: [R('b06', 'b06_akhir', speed=2.5, maks=4)],
 7: [A('duaHP')], 8: [A('uniqueKunci')],
 9: [R('b09', 'b09_sorot', speed=2.5, maks=4), R('b09_sorot', 'b09_akhir', maks=1.6)],
 10: [R('b10', 'b10_jalan', speed=8, maks=1.0), R('b10_jalan', 'b10_akhir', maks=1.3)],
 11: [A('jadiTiket', min=8), R('b11', 'b11_uji', speed=2.5, maks=4), R('b11_uji', 'b11_akhir', maks=1.6)],
 12: [A('cekAI07')],
 13: [A('celah', min=7), R('b13', 'b13_jalan', speed=6, maks=1.0, kalimat=1), R('b13_jalan', 'b13_akhir', maks=1.8)],
 14: [R('b14', 'b14_akhir', maks=1.5), A('tantangan', min=8, a=dict(tantangan='Buat route untuk membatalkan pemesanan dengan kodenya. Pastikan pemesanan yang sudah check-in tidak bisa dibatalkan.', berikut='Bab 8: Login dan keamanan'))],
}

# --- Sorot baris: potongan pada kecepatan asli, mulai tepat pada kalimat ke-k (0 = kalimat pertama), ditahan sampai bagian berikutnya
def S(h, d, k=None):
    p = dict(k='rek', a=h, b=h, da=-0.15, db=d - 0.45, asli=True)  # h = tanda 'sorotN' (otomatis dari rekam_vs.kamera_editor(zoom=...))
    if k is not None: p['kalimat'] = k
    return p
BEATS[9] = [R('b09', 'b09_sorot', speed=2.5, maks=4), S('sorot1', 3, 1), S('sorot2', 3, 3)]
