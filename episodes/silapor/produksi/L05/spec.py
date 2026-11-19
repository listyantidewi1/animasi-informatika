NAMA = "L05_login"
REKAMAN = ["rek", "web"]
def A(nama, **k): return dict(k='adegan', nama=nama, **k)
def R(a, b, **k): return dict(k='rek', a=a, b=b, **k)
def W(a, b, **k): return dict(k='rek', r='web', a=a, b=b, **k)
def E(a, b, speed=1.0): return dict(k='rek', a=a, b=b, asli=True, ekor=True, speed=speed)
KODE = ["function login($email, $password) {", "    $hash = md5($password);", "    $sql = \"SELECT * FROM users WHERE email = '$email'", "            AND password = '$hash'\";", "    return mysqli_query($db, $sql);", "}"]
BEATS = {
 1: [A('kartuBab', min=6, a=dict(bab='BAB 5', judul='Login dan peran', sub='Siapa kamu, dan apa yang boleh kamu lakukan', lapis='server')),
     A('poin', a=dict(judul='Dua pertanyaan', warna='#a78bfa', kol=2, tinggi=380, item=[
        dict(k=2, d=1.5, besar='Siapa kamu?', judul='Login', isi='Email dan kata sandi membuktikan identitas.'),
        dict(k=2, d=3.5, besar='Boleh apa?', judul='Peran', isi='Siswa melapor, petugas mengelola.')]))],
 2: [A('hash', min=14), R('b02', 'b02_akhir', kalimat=3, maks=1.2)],
 3: [R('b03', 'b03_layout', maks=1.2), R('b03_layout', 'b03_yield', kalimat=2, maks=7), R('b03_yield', 'b03_akhir', kalimat=4), E('b04', 'b04_post', 3)],
 4: [R('b04_post', 'b04_csrf', kalimat=1), R('b04_csrf', 'b04_akhir', kalimat=2), E('b05', 'b05_ketik'), E('b05_ketik', 'b05_valid', 3)],
 5: [R('b05_valid', 'b05_attempt', kalimat=1), R('b05_attempt', 'b05_pesan', kalimat=2), R('b05_pesan', 'b05_akhir', kalimat=3)],
 6: [R('b06', 'b06_akhir', maks=1.2), A('sesi', min=14)],
 7: [R('b07', 'b07_akhir', maks=4), W('b07', 'b07_salah', kalimat=1, maks=2.8), W('b07_salah', 'b07_benar'), W('b07_benar', 'b07_akhir', kalimat=2), E('b08', 'b08_ctrl', 4), E('b08_ctrl', 'b08_valid', 3)],
 8: [R('b08_valid', 'b08_create', kalimat=1), R('b08_create', 'b08_fill', kalimat=2), R('b08_fill', 'b08_route', kalimat=3), R('b08_route', 'b08_akhir', kalimat=6, maks=3), E('b09', 'b09_logout', 3), E('b09_logout', 'b09_form', 1.5)],
 9: [R('b09_form', 'b09_akhir'), A('keluarGet', min=10, a=dict())],
 10: [R('b10', 'b10_auth', maks=6), R('b10_auth', 'b10_guest', kalimat=1), A('middleware', min=10, a=dict(k1=2, k2=3))],
 11: [R('b11', 'b11_ketik', maks=1.3), R('b11_ketik', 'b11_abort', maks=3), R('b11_abort', 'b11_route', kalimat=1), R('b11_route', 'b11_akhir', maks=3), W('b11', 'b11_403', kalimat=3, maks=1.3), W('b11_403', 'b11_hendra', kalimat=5, maks=4.5), W('b11_hendra', 'b11_akhir')],
 12: [R('b12', 'b12_akhir', kalimat=1, maks=1.5), W('b12', 'b12_429', kalimat=2, maks=5), W('b12_429', 'b12_akhir', kalimat=3)],
 13: [A('cekAI', tambah=3.5, a=dict(perintah='buatkan login dengan PHP', kode=KODE, size=30, w=1500))],
 14: [A('masalahAI', a=dict(kode=KODE, size=26, w=1640, masalah=[
        dict(k=0, judul='md5 terlalu cepat', isi='Komputer biasa bisa mencoba miliaran tebakan per detik. bcrypt sengaja dibuat lambat.', sorot=[1]),
        dict(k=2, judul='Input disambung ke teks query: SQL injection', isi="Email diisi  ' OR 1=1 --  dan maknanya berubah: masuk tanpa kata sandi.", sorot=[2, 3])])),
      R('b14_commit', 'b14_commit_akhir', kalimat=5, maks=1.5), A('tantangan', min=9, a=dict(tantangan='Buat halaman supaya pengguna bisa mengganti kata sandinya sendiri.', berikut='Bab 6: Kirim laporan dan foto'))],
}
