NAMA = "A04_server"
REKAMAN = ["rek", "web"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
BEATS = {
 1: [A('kartuBab', a=dict(bab='BAB 4', judul='Server pertama', sub='Apa yang terjadi saat kamu membuka website', lapis='server'))],
 2: [A('reqResp')], 3: [A('isiRequest')], 4: [A('statusWajah')],
 5: [W('b05', 'b05_akhir', maks=1.6)],
 6: [R('b06', 'b06_install', maks=1.5), R('b06_install', 'b06_pkg', speed=2.5, maks=4, kalimat=3), R('b06_pkg', 'b06_akhir', maks=1.5)],
 7: [R('b07', 'b07_akhir', maks=1.6)],
 8: [A('pohonFolder', min=7), R('b08', 'b08_akhir', maks=1.6)],
 9: [R('b09', 'b09_akhir', maks=2.2)],
 10: [R('b10', 'b10_akhir', maks=1.6), W('b10', 'b10_akhir', maks=1.6, kalimat=2)],
 11: [A('pintuPort')],
 12: [R('b12', 'b12_db', speed=2.5, maks=4), R('b12_db', 'b12_akhir', maks=2), A('kolamPool', min=7)],
 13: [R('b13', 'b13_kode', maks=2.2), R('b13_kode', 'b13_akhir', maks=1.6), W('b13', 'b13_akhir', maks=1.0, kalimat=3), A('alirData', min=5)],
 14: [A('cekAI04')], 15: [A('jawab04')],
 16: [R('b16', 'b16_akhir', maks=1.5), A('tantangan', min=8, a=dict(tantangan='Buat route GET /api/jam yang menjawab waktu server sekarang, lalu periksa jawabannya di tab Network.', berikut='Bab 5: REST API dan ambil nomor'))],
}
