NAMA = "P07_kerangka"
REKAMAN = ["rek", "web", "web_ai"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
def WA(a, b, **k): return dict(k='rek', r='web_ai', a=a, b=b, **k)
KODE = ["$username = $_POST['username'];", "$sandi = $_POST['sandi'];", "",
        "$sql = \"SELECT * FROM pengguna", "        WHERE username = '$username' AND sandi = '$sandi'\";", "$u = db()->query($sql)->fetch();", "",
        "if ($u) {", "    $_SESSION['pengguna'] = $u;", "}"]
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 7', judul='Kerangka PHP', sub='PHP tersambung ke database dengan cara yang aman', lapis='server'))],
 2: [A('poin', a=dict(judul='Tiga folder, tiga tugas', warna='#38bdf8', kol=2, tinggi=290, item=[
        dict(k=1, besar='public/', mono=True, judul='Halaman yang dibuka browser'),
        dict(k=2, besar='app/', mono=True, judul='Kode bersama', isi='koneksi, bantu, auth, dan awal'),
        dict(k=3, besar='database/', mono=True, judul='Semua SQL kita'),
        dict(k=4, besar='-t public', mono=True, judul='Server hanya membuka folder public', isi='Folder app dan berkas .env tidak bisa diminta dari browser.', warna='#a3e635')]))],
 3: [R('b03', 'b03_env', kalimat=0, maks=8), R('b03_env', 'b03_static', kalimat=1), R('b03_static', 'b03_tiga', kalimat=2), R('b03_err', 'b03_fetch', kalimat=4), R('b03_fetch', 'b03_emul', kalimat=5), R('b03_emul', 'b03_akhir', kalimat=6)],
 4: [R('b04', 'b04_q', kalimat=0, maks=8), R('b04_q', 'b04_prepare', kalimat=1), R('b04_prepare', 'b04_e', kalimat=3), R('b04_e', 'b04_akhir', kalimat=6)],
 5: [R('b05', 'b05_csrf', kalimat=0), R('b05_csrf', 'b05_awal', kalimat=1), R('b05_awal', 'b05_akhir', kalimat=2, maks=2)],
 6: [R('b06', 'b06_jalan', kalimat=1), R('b06_jalan', 'b06_akhir', maks=1.5)],
 7: [R('b07', 'b07_awal', kalimat=0, maks=10), R('b07_awal', 'b07_q', kalimat=1), R('b07_q', 'b07_foreach', kalimat=2), R('b07_foreach', 'b07_server', kalimat=3), R('b07_server', 'b07_jalan', kalimat=4, maks=2.5), W('mulai', 'muncul', kalimat=5, maks=4), W('muncul', 'akhir', maks=1.5)],
 8: [A('cekAI', tambah=3.5, a=dict(perintah='buat proses login dengan PHP dan MySQL', kode=KODE, size=30, w=1500))],
 9: [WA('mulai', 'ketik', maks=1.5), WA('ketik', 'sandi', kalimat=1), WA('sandi', 'masuk', kalimat=2), WA('masuk', 'akhir', kalimat=3), A('injeksi', kalimat=4, min=20),
     R('b09_commit', 'b09_akhir', kalimat=9, maks=1.5), A('lanjut', kalimat=10, min=10, a=dict(selesai='PHP tersambung dengan aman, dan daftar alat tampil dari database.', berikut='Bab 8: Login dan hak akses'))],
}
