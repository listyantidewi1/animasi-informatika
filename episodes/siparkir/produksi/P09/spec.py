NAMA = "P09_cetak"
REKAMAN = ["rek", "web"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
def E(a, b, speed=1.0): return dict(k='rek', a=a, b=b, asli=True, ekor=True, speed=speed)
KODE = ["// Setelah kendaraan dicatat keluar", "return redirect('/struk?plat='.$plat.'&lama='.$lama.'&total='.$total);", "", "{{-- resources/views/struk.blade.php --}}", "<p>Plat: {{ request('plat') }}</p>", "<p>Lama parkir: {{ request('lama') }}</p>", "<h1>Total: Rp{{ request('total') }}</h1>"]
BEATS = {
 1: [A('kartuBab', min=5, a=dict(bab='BAB 9', judul='Tiket dan struk', sub='Dicetak di kertas 58 mm, lengkap dengan kode QR', lapis='frontend')), A('kertas58', kalimat=1)],
 2: [R('b02', 'b02_cmd'), R('b02_cmd', 'b02_jalan', kalimat=1, maks=1.3), R('b02_selesai', 'b02_json', kalimat=2), R('b02_json', 'b02_qr'), R('b02_qr', 'b02_bungkus', kalimat=3, maks=5), R('b02_bungkus', 'b02_svg'), R('b02_svg', 'b02_akhir', kalimat=4)],
 3: [R('b03', 'b03_lc', maks=7), R('b03_lc', 'b03_css'), R('b03_css', 'b03_page', kalimat=1), R('b03_page', 'b03_print', kalimat=2), R('b03_print', 'b03_akhir', kalimat=4)],
 4: [R('b04', 'b04_isi', maks=7), R('b04_isi', 'b04_qr', kalimat=1), R('b04_qr', 'b04_seru', kalimat=2), R('b04_seru', 'b04_aman', kalimat=3), R('b04_aman', 'b04_akhir', kalimat=6), E('b05', 'b05_isi', 7)],
 5: [R('b05_isi', 'b05_fee'), R('b05_fee', 'b05_akhir', kalimat=1)],
 6: [W('b06', 'b06_masuk'), W('b06_masuk', 'b06_cetak', kalimat=1, maks=2), W('b06_cetak', 'b06_margin', kalimat=2), W('b06_margin', 'b06_akhir', kalimat=4)],
 7: [A('cekAI', tambah=3.5, a=dict(perintah='buatkan halaman struk', kode=KODE, size=27, w=1560))],
 8: [A('alamatPalsu', min=28, a=dict(k1=1, k2=2, k3=3, k4=4)), R('b08_commit', 'b08_commit_akhir', kalimat=5, maks=1.5),
     A('tantangan', kalimat=6, min=9, a=dict(tantangan='Tambahkan nomor telepon koperasi di bagian bawah struk, dan ambil isinya dari berkas .env.', berikut='Bab 10: Rekap pendapatan'))],
}
