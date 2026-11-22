NAMA = "A10_halaman"
REKAMAN = ["rek", "web"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
BEATS = {
 1: [A('kartuBab', a=dict(bab='BAB 10', judul='Halaman pelanggan,\npetugas, dan TV', sub='HTML, CSS, dan JavaScript murni', lapis='browser')), A('empatHalaman', min=8)],
 2: [A('mobileFirst')],
 3: [A('apiBungkus', min=10), R('b03', 'b03_akhir', speed=2.5, maks=4)],
 4: [R('b04', 'b04_akhir', speed=2.5, maks=4), A('teksAman', min=6)],
 5: [R('b05', 'b05_akhir', speed=4, maks=8), W('hp', 'hp_akhir', maks=1.0, kalimat=1)],
 6: [A('duaKlik', min=10), W('lambat', 'lambat_akhir', maks=1.3, kalimat=3), R('b06', 'b06_akhir', speed=2, maks=3)],
 7: [R('b07', 'b07_sorot', speed=5, maks=10), R('b07_sorot', 'b07_akhir', maks=1.5), W('tiket', 'tiket_akhir', maks=2)],
 8: [A('tanpaKosong', min=7), R('b08', 'b08_akhir', maks=1.6), W('putus', 'putus_akhir', maks=2)],
 9: [R('b09', 'b09_api', speed=5, maks=10), R('b09_api', 'b09_akhir', speed=3, maks=6), W('petugas', 'petugas_akhir', maks=1.8)],
 10: [R('b10', 'b10_npm', speed=5, maks=10), R('b10_npm', 'b10_akhir', speed=2, maks=4), W('tv', 'tv_akhir', maks=1.6)],
 11: [A('devtoolsTiga')],
 12: [R('b12', 'b12_akhir', speed=3, maks=6), A('cekAI10', min=12)],
 13: [W('xss', 'akhir', maks=1.4), A('xss', min=14)],
 14: [R('b14', 'b14_akhir', maks=1.5), A('tantangan', min=8, a=dict(tantangan='Tambahkan tombol "Batalkan antrean" di halaman tiket, lengkap dengan pertanyaan konfirmasi, supaya tidak terpencet tanpa sengaja.', berikut='Bab 11: Laporan dan pengujian'))],
}

# --- Sorot baris: potongan pada kecepatan asli, mulai tepat pada kalimat ke-k (0 = kalimat pertama), ditahan sampai bagian berikutnya
def S(h, d, k=None):
    p = dict(k='rek', a=h - 0.15, b=h + d - 0.45, asli=True)
    if k is not None: p['kalimat'] = k
    return p
BEATS[4] = [R('b04', 83.7, speed=2.5, maks=4), S(83.8, 3, 2), A('teksAman', min=6)]
BEATS[7] = [R('b07', 'b07_sorot', speed=5, maks=10), S(346.2, 3, 1), W('tiket', 'tiket_akhir', maks=2, kalimat=2)]
BEATS[8] = [A('tanpaKosong', min=4), S(350.6, 3, 1), S(354.8, 3, 2), W('putus', 'putus_akhir', maks=2, kalimat=3)]
BEATS[9] = [R('b09', 'b09_api', speed=5, maks=10), R('b09_api', 563.4, speed=3, maks=6), S(563.5, 3, 2), W('petugas', 'petugas_akhir', maks=1.8, kalimat=3)]
BEATS[12] = [R('b12', 800.7, speed=3, maks=6), S(800.8, 3, 2), A('cekAI10', min=12)]

# --- Adegan persiapan sisipan (naskah_sisip.json, beat bernomor pecahan)
SKRIP = ["/home/user/antre/alat/web/siap.js"]
BEATS[10.5] = [A('cobaHP', a=dict(img='/home/user/antre/A10/hp_ambil.png'))]
