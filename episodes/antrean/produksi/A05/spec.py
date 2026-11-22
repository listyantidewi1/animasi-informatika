NAMA = "A05_api"
REKAMAN = ["rek", "web"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
BEATS = {
 1: [A('kartuBab', a=dict(bab='BAB 5', judul='REST API:\nambil nomor', sub='Cara paling mudah ternyata berbahaya', lapis='server'))],
 2: [A('tabelEndpoint')], 3: [A('crud')],
 4: [R('b04', 'b04_akhir', maks=2)],
 5: [R('b05', 'b05_akhir', maks=1.6, kalimat=1), A('catatan', min=8, a=dict(judul='express.json()', baris=['Body kiriman: { "service_id": 1 }', 'Setelah express.json(): req.body.service_id', 'Tanpa itu: req.body kosong'], mono=False))],
 6: [A('saringan', min=8), R('b06', 'b06_akhir', maks=2.2, kalimat=2)],
 7: [A('rakNomor', min=8), R('b07', 'b07_akhir', maks=2.2, kalimat=2)],
 8: [R('b08', 'b08_kolom', maks=2), R('b08_kolom', 'b08_akhir', maks=1.8)],
 9: [R('b09', 'b09_akhir', maks=2.2)],
 10: [R('b10_0', 'b10_1', maks=1.8, kalimat=1), R('b10_1', 'b10_2', maks=1.8, kalimat=2), R('b10_2', 'b10_3', maks=1.8, kalimat=3), R('b10_3', 'b10_4', maks=1.8, kalimat=4), R('b10_4', 'b10_akhir', maks=1.8, kalimat=5)],
 11: [A('tabelError', min=16), R('b11', 'b11_akhir', maks=2.2, kalimat=4)],
 12: [R('b12', 'b12_kode', speed=2.5, maks=4), R('b12_kode', 'b12_akhir', maks=1.6), W('mulai', 'akhir', maks=1.5)],
 13: [A('cekAI05')],
 14: [A('masalahAI05', min=10), R('b14', 'b14_jalan', speed=3, maks=5, kalimat=3), R('b14_jalan', 'b14_akhir', maks=1.6, kalimat=4)],
 15: [R('b15', 'b15_akhir', maks=1.5), A('tantangan', min=8, a=dict(tantangan='Buat route GET /api/ringkas yang menjawab jumlah orang yang menunggu di setiap layanan.', berikut='Bab 6: Dua petugas menekan "Panggil" bersamaan'))],
}
