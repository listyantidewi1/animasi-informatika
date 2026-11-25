import sys, time; sys.path.insert(0, "/home/user/baca/alat")
from tulis import Bab, CACAT, sh, matikan, siapkan, acuan
import tahap as T
siapkan("bab-10", "contoh")
b = Bab("/home/user/baca/B11/rek"); r = b.r
U = "uji/sibaca.test.js"; F = acuan(U); atas = F[:F.index("test('pendaftar")].rstrip() + "\n"
r.mulai(); r.kamera(None); time.sleep(1.0)
# b02 berkas uji
r.tanda("b02"); b.ubah(U, atas, cps=24); time.sleep(0.4)
b.sorot(U, "import test from 'node:test'", "node:test: alat uji bawaan Node.js", 6.0, tanda="b02_node", n=2)
b.sorot(U, "async function kirim", "kirim: mengirim permintaan ke server", 4.0, tanda="b02_bantu")
b.sorot(U, "async function masuk", "masuk: login, lalu menyimpan cookie-nya", 4.5); r.tanda("b02_akhir")
# b03 empat test
r.kamera(None); r.tanda("b03"); b.ubah(U, F, cps=26); time.sleep(0.4)
b.sorot(U, "test('pendaftar tidak bisa", "1. Mengirim peran petugas: tetap tidak bisa login", 6.3, tanda="b03_satu", n=6, zoom=1.3)
b.sorot(U, "test('anggota tidak bisa", "2. Anggota membuka data petugas: 403", 5.8, tanda="b03_dua", n=5, zoom=1.3)
b.sorot(U, "test('pinjaman keempat", "3. Pinjaman keempat: ditolak server", 4.0, tanda="b03_tiga", n=7, zoom=1.3)
b.sorot(U, "test('tanda persen", "4. Mencari %: tepat satu buku", 4.8, tanda="b03_empat", n=5, zoom=1.3)
b.sorot(U, "assert.equal(hasil.data.length, 1)", "assert: hasil yang seharusnya", 5.5, tanda="b03_assert", zoom=1.3); r.tanda("b03_akhir")
# b04 npm test
pj = b.isi("package.json"); ST = '    "start": "node --env-file=.env server/app.js"'; assert pj.count(ST + "\n") == 1
pj2 = pj.replace(ST + "\n", ST + ',\n    "test": "node --test"\n')
r.kamera(None); r.tanda("b04"); b.ubah("package.json", pj2, cps=12); b.sorot("package.json", '"test"', "Perintah baru: npm test", 2.5)
b.besar(); r.tanda("b04_jalan"); b.jalan("npm run contoh", tunggu=1.2, sampai="Data contoh siap", maks=90); b.jalan("npm test", tunggu=1.5, sampai="duration_ms", maks=90); r.kamera(r.kotak(".part.panel"), pad=0)
r.tanda("b04_lulus"); r.label("Empat test lulus", 2.5); time.sleep(2.8)
r.tanda("b04_tiap"); r.label("Jalankan setiap kali kamu atau AI mengubah kode", 8.5); time.sleep(9.5); r.tanda("b04_akhir")
# b05 cadangan
r.tekan("Control+l", 0.4); r.kamera_terminal(); r.tanda("b05"); b.jalan("mkdir backup", tunggu=0.8)
r.terminal("mysqldump -u sibaca -p --no-tablespaces sibaca > backup/sibaca.sql", cps=16, tunggu=0.5); b.tunggu("Enter password"); time.sleep(0.8); r.ketik("gantiSandiIni!", 9); time.sleep(0.5); r.tekan("Enter", 1.5)
r.tanda("b05_opsi"); r.label("--no-tablespaces: sibaca hanya punya hak atas satu database", 6.5); time.sleep(7.0)
b.kecil(); r.kamera(None); r.tanda("b05_isi"); b.lihat("backup/sibaca.sql", "CREATE TABLE", jeda=1.0); r.label("Perintah SQL untuk membuat ulang tabel beserta isinya", 5.0); time.sleep(5.6)
b.besar(); r.tanda("b05_pulih"); r.terminal("mysql -u sibaca -p sibaca < backup/sibaca.sql", cps=16, tunggu=0.5); b.tunggu("Enter password"); time.sleep(0.8); r.ketik("gantiSandiIni!", 9); time.sleep(0.5); r.tekan("Enter", 2.0)
r.label("Memulihkan: sama seperti menjalankan schema di Bab 3", 5.5); time.sleep(6.0); r.tanda("b05_akhir")
b.kecil(); r.kamera(None); r.tanda("b05_ignore"); b.taruh("backup/.gitkeep", ""); b.ubah(".gitignore", T.GITIGNORE[11], cps=12); b.sorot(".gitignore", "backup/*.sql", "Berkas cadangan tidak ikut ke GitHub", 3.5); r.tanda("b05_ignore_akhir")
# b07 panduan
r.kamera(None); r.tanda("b07"); b.salin("PANDUAN.md"); b.lihat("PANDUAN.md", jeda=1.5); r.label("PANDUAN.md: satu halaman untuk Bu Ratih", 3.0); time.sleep(3.0)
P = "PANDUAN.md"
b.sorot(P, "## Setiap pagi", "Cara menyalakan aplikasi di pagi hari", 3.2, tanda="b07_pagi", n=4, zoom=1.3)
b.sorot(P, "## Siswa mau meminjam", "Alamat yang ditulis di papan untuk siswa", 3.2, n=4, zoom=1.3)
b.sorot(P, "## Setiap sore", "Cara mencadangkan", 2.6, n=3, zoom=1.3)
b.sorot(P, "## Kalau HP siswa tidak bisa membuka", "Kalau halamannya tidak terbuka", 3.5, n=4, zoom=1.3); r.tanda("b07_akhir")
# b09 commit
b.term(); b.commit("Uji, backup, dan panduan", tanda="b09_commit"); time.sleep(1.0); r.tanda("b09_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
matikan(); sh("git tag -f bab-11"); print("CACAT", CACAT); print(sh("git status --short | head; git log --oneline | head -3; git ls-files | head -60").stdout)
