NAMA = "P08_login"
REKAMAN = ["rek", "web", "web_ai"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
def WA(a, b, **k): return dict(k='rek', r='web_ai', a=a, b=b, **k)
KODE = ["<?php  // admin/pengguna.php", "require __DIR__ . '/../../app/awal.php';", "", "if (!pengguna()) {", "    arahkan('/index.php');", "}", "",
        "// ... tampilkan daftar pengguna dan form tambah akun", "", "<?php  // menu di atas.php", "<?php if ($saya['peran'] === 'admin'): ?>", "    <a href=\"/admin/pengguna.php\">Pengguna</a>", "<?php endif ?>"]
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 8', judul='Login dan hak akses', sub='Tiga peran, tiga pintu masuk', lapis='server'))],
 2: [A('poin', min=7, a=dict(judul='Kata sandi tidak boleh disimpan apa adanya', warna='#ff6b6b', kol=2, tinggi=400, item=[
        dict(k=0, d=1.0, besar='rahasia123', mono=True, judul='Disimpan apa adanya', isi='Kalau database bocor, semua kata sandi ikut terbaca.', warna='#ff6b6b'),
        dict(k=1, d=2.5, besar='$2y$12$Qm8v...', mono=True, judul='Yang disimpan: hasil acakannya', isi='Dibuat oleh password_hash.', warna='#a3e635')])), R('b02', 'b02_lagi', kalimat=2, maks=1.5), R('b02_lagi', 'b02_verify', kalimat=4, maks=1.5), R('b02_verify', 'b02_akhir', kalimat=5)],
 3: [R('b03', 'b03_sesi', kalimat=0, maks=8), R('b03_sesi', 'b03_http', kalimat=1), R('b03_http', 'b03_pengguna', kalimat=2), R('b03_pengguna', 'b03_wajib', kalimat=3), R('b03_wajib', 'b03_belum', kalimat=4),
     R('b03_belum', 'b03_403', kalimat=5), R('b03_403', 'b03_beranda', kalimat=6), R('b03_beranda', 'b03_awal', kalimat=7), R('b03_awal', 'b03_akhir', maks=2)],
 4: [R('b04', 'b04_ketik', kalimat=0, maks=3), R('b04_ketik', 'b04_cari', kalimat=1, maks=20), R('b04_cari', 'b04_verify', kalimat=2), R('b04_verify', 'b04_regen', kalimat=3), R('b04_regen', 'b04_simpan', kalimat=4),
     R('b04_simpan', 'b04_pesan', kalimat=5), R('b04_pesan', 'b04_akhir', kalimat=6)],
 5: [R('b05', 'b05_menu', kalimat=0), R('b05_menu', 'b05_akhir', kalimat=1)],
 6: [R('b06', 'b06_wajib', kalimat=0, maks=8), R('b06_wajib', 'b06_admin', kalimat=1), R('b06_admin', 'b06_akhir', kalimat=2, maks=6),
     W('mulai', 'admin', kalimat=3, maks=2.4), W('admin', 'tolak', kalimat=5, maks=1.3), W('tolak', 'keluar', kalimat=6), W('keluar', 'akhir', kalimat=7, maks=2.6)],
 7: [A('cekAI', tambah=3.5, a=dict(perintah='buat halaman admin untuk mengelola pengguna', kode=KODE, size=27, w=1500))],
 8: [WA('mulai', 'menu', kalimat=0, maks=4), WA('menu', 'alamat', kalimat=1), WA('alamat', 'terbuka', kalimat=2, maks=1.3), WA('terbuka', 'akhir', kalimat=3), R('b08', 'b08_commit', kalimat=5, maks=2.3), R('b08_commit', 'b08_akhir', kalimat=6, maks=3),
     A('lanjut', kalimat=7, min=14, a=dict(selesai='Tiga peran punya pintunya masing-masing, dan setiap halaman dijaga.', berikut='Bab 9: Halaman admin'))],
}
