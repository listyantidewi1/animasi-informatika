NAMA = "A09_realtime"
REKAMAN = ["rek", "web"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
BEATS = {
 1: [A('kartuBab', a=dict(bab='BAB 9', judul='Layar TV yang\nbergerak sendiri', sub='Server-Sent Events dan suara panggilan', lapis='server')), A('janji3detik', min=8)],
 2: [A('serverDiam')], 3: [A('tigaCara')], 4: [A('pilihSSE')],
 5: [A('pipaSiaran', min=12), R('b05', 'b05_akhir', speed=2.5, maks=4)],
 6: [A('formatPesan', min=12), R('b06', 'b06_server', maks=1.4), R('b06_server', 'b06_akhir', speed=2, maks=3)],
 7: [A('urutanCommit', min=8), R('b07', 'b07_uji', speed=3, maks=6)],
 8: [A('tandaFetch', min=10), R('b08', 'b08_akhir', speed=3, maks=6)],
 9: [W('uji', 'suara', maks=1.8, kalimat=1)],
 10: [A('ejaNomor', min=12), R('b10', 'b10_akhir', speed=2.5, maks=4)],
 11: [A('tombolSuara', min=8), R('b11', 'b11_akhir', maks=1.5, kalimat=3), W('suara', 'akhir', maks=1.5)],
 12: [A('wifiPutus', min=12), R('b12', 'b12_akhir', maks=1.5)],
 13: [A('cekAI09')],
 14: [A('hitungRequest', min=12), R('b13_akhir', 'b14_akhir', maks=1.8, kalimat=4)],
 15: [R('b15', 'b15_akhir', maks=1.5), A('tantangan', min=8, a=dict(tantangan='Buat HP pelanggan bergetar saat nomornya dipanggil, dengan navigator.vibrate.', berikut='Bab 10: Halaman pelanggan, petugas, dan TV'))],
}
