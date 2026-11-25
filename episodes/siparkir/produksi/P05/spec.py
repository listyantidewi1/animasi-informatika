NAMA = "P05_login"
REKAMAN = ["rek", "web"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
def E(a, b, speed=1.0): return dict(k='rek', a=a, b=b, asli=True, ekor=True, speed=speed)
KODE = ["{{-- resources/views/layouts/app.blade.php --}}", "@if (auth()->user()->role === 'admin')", "    <a href=\"/admin/tarif\">Tarif</a>", "    <a href=\"/admin/pengguna\">Pengguna</a>", "@endif", "", "// routes/web.php", "Route::middleware('auth')->group(function () {", "    Route::get('/parkir', [ParkirController::class, 'index']);", "    Route::resource('/admin/tarif', TarifController::class);", "});"]
BEATS = {
 1: [A('kartuBab', min=5, a=dict(bab='BAB 5', judul='Login dan tiga peran', sub='Siapa kamu, dan apa yang boleh kamu lakukan', lapis='server')),
     A('poin', kalimat=1, a=dict(judul='Dua pertanyaan', warna='#a78bfa', kol=2, tinggi=380, item=[
        dict(k=1, d=2.2, besar='Siapa kamu?', judul='Login', isi='Email dan kata sandi membuktikan identitas.'),
        dict(k=1, d=3.6, besar='Boleh apa?', judul='Peran', isi='Petugas, admin, dan owner punya halamannya masing-masing.')]))],
 2: [A('poin', a=dict(judul='Tampilan: salin dari GitHub', warna='#38bdf8', kol=2, tinggi=340, item=[
        dict(k=1, besar='gaya.css', mono=True, judul='Warna dan tata letak', isi='Tidak kita bahas di video ini.'),
        dict(k=2, besar='public/css', mono=True, judul='Tempat menaruhnya', isi='Salin berkasnya dari GitHub ke folder ini.')], repo=dict(k=2, ket='Berkas: public/css/gaya.css'))),
     R('b02_layout', 'b02_yield', kalimat=3, maks=7), R('b02_yield', 'b02_akhir', kalimat=4)],
 3: [R('b03', 'b03_post', maks=6), R('b03_post', 'b03_csrf', kalimat=1), R('b03_csrf', 'b03_akhir', kalimat=2)],
 4: [R('b04', 'b04_ketik', maks=1.3), R('b04_ketik', 'b04_valid', maks=7), R('b04_valid', 'b04_attempt', kalimat=1), R('b04_attempt', 'b04_pesan', kalimat=2), R('b04_pesan', 'b04_akhir', kalimat=3)],
 5: [R('b05_regen', 'b05_arah'), R('b05_arah', 'b05_user', kalimat=2), R('b05_user', 'b05_match', kalimat=3, maks=4), R('b05_match', 'b05_akhir')],
 6: [A('pos', min=12), R('b06', 'b06_ketik', kalimat=2, maks=1.3), R('b06_ketik', 'b06_abort', kalimat=3, maks=3), R('b06_abort', 'b06_titik', kalimat=4), R('b06_titik', 'b06_akhir', kalimat=5)],
 7: [R('b07', 'b07_alias', maks=3), R('b07_alias', 'b07_routes'), R('b07_routes', 'b07_ketik', kalimat=1), R('b07_ketik', 'b07_throttle', maks=7), R('b07_throttle', 'b07_auth', kalimat=2), R('b07_auth', 'b07_petugas', kalimat=3), R('b07_petugas', 'b07_akhir', kalimat=5)],
 8: [R('b08', 'b08_cmd'), R('b08_cmd', 'b08_akhir', kalimat=1, maks=1.5), W('b08', 'b08_joko', maks=1.5), W('b08_joko', 'b08_ketik', kalimat=2, maks=2.5), W('b08_ketik', 'b08_403', kalimat=3, maks=1.3), W('b08_403', 'b08_tahu', kalimat=4), W('b08_tahu', 'b08_keluar', kalimat=5), W('b08_keluar', 'b08_sinta', kalimat=6, maks=3), W('b08_sinta', 'b08_akhir')],
 9: [A('cekAI', tambah=3.5, a=dict(perintah='buatkan menu admin yang hanya terlihat oleh admin', kode=KODE, size=26, w=1500))],
 10: [A('masalahAI', a=dict(kode=KODE, size=22, w=1640, masalah=[
        dict(k=0, judul='Yang disembunyikan hanya tautannya', isi='Alamatnya tetap terbuka bagi siapa pun yang sudah login.', sorot=[1, 2, 3, 4]),
        dict(k=2, judul='Petugas cukup mengetik alamatnya', isi='Route /admin/tarif hanya dijaga auth, jadi petugas bisa mengubah tarif.', sorot=[7, 9]),
        dict(k=3, judul='Tampilan menyembunyikan, server menjaga', isi='Menjaga halaman adalah tugas middleware, bukan tugas @if di tampilan.', sorot=[7])])),
      R('b10_commit', 'b10_commit_akhir', kalimat=5, maks=1.5),
      A('tantangan', kalimat=6, min=9, a=dict(tantangan='Tambahkan peran keempat bernama satpam, yang hanya boleh melihat daftar kendaraan yang sedang parkir.', berikut='Bab 6: Halaman admin'))],
}
