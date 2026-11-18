NAMA = "A08_keamanan"
REKAMAN = ["rek", "web"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
BEATS = {
 1: [A('kartuBab', min=3, a=dict(bab='BAB 8', judul='Login dan keamanan', sub='Siapa kamu, dan apa yang boleh kamu lakukan?', lapis='server')), R('b01', 'b01_akhir', maks=1.0, kalimat=1)],
 2: [A('penggiling')],
 3: [R('b03', 'b03_repl', speed=3, maks=6), R('b03_repl', 'b03_akhir', maks=1.6)],
 4: [R('b04', 'b04_sorot', speed=2.5, maks=4), R('b04_sorot', 'b04_akhir', maks=1.4)],
 5: [A('gelang')],
 6: [R('b06', 'b06_pengguna', speed=2.5, maks=1.5), W('kue', 'kue_akhir', maks=1.3, kalimat=1), R('b06_pengguna', 'b06_akhir', speed=3, maks=1.0, kalimat=5)],
 7: [A('satpam', min=10), R('b07', 'b07_akhir', speed=2.5, maks=4)],
 8: [R('b08', 'b08_uji', speed=3, maks=5), R('b08_uji', 'b08_akhir', maks=1.6)],
 9: [A('gembokAngka')],
 10: [A('injeksi', min=14), R('b10', 'b10_jalan', speed=2.5, maks=4), R('b10_jalan', 'b10_akhir', maks=1.6)],
 11: [R('b11', 'b11_akhir', maks=1.4)],
 12: [A('cekAI08', min=12)],
 13: [W('idor', 'idor_ganti', maks=1.4), W('idor_ganti', 'akhir', maks=1.6)],
 14: [R('b14', 'b14_akhir', maks=1.5), A('tantangan', min=8, a=dict(tantangan='Batasi percobaan login: lima kali salah dalam satu menit, lalu harus menunggu. Di mana kamu menyimpan hitungannya?', berikut='Bab 9: Layar TV yang bergerak sendiri'))],
}

# --- Sorot baris: potongan pada kecepatan asli, mulai tepat pada kalimat ke-k (0 = kalimat pertama), ditahan sampai bagian berikutnya
def S(h, d, k=None):
    p = dict(k='rek', a=h - 0.15, b=h + d - 0.45, asli=True)
    if k is not None: p['kalimat'] = k
    return p
BEATS[4] = [R('b04', 'b04_sorot', speed=2.5, maks=4), S(124.3, 3.5, 2)]
BEATS[11] = [S(412.1, 4, 1)]

# --- Adegan persiapan sisipan (naskah_sisip.json, beat bernomor pecahan)
SKRIP = ["/home/user/antre/alat/web/siap.js"]
BEATS[6.5] = [A('akunContoh')]
