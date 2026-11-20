import sys, time; sys.path.insert(0, "/home/user/baca/alat")
from tulis import Bab, CACAT, sh, matikan, siapkan, acuan, server
import tahap as T
siapkan("bab-03", "skema")
b = Bab("/home/user/baca/B04/rek"); r = b.r
D = "server/db.js"; BK = "server/buku.js"; AP = "server/app.js"
r.mulai(); r.kamera(None); time.sleep(1.0)
# b03 sambungan
r.tanda("b03"); b.ubah(D, acuan(D), cps=15); time.sleep(0.6)
b.sorot(D, "mysql.createPool", "Pool: beberapa sambungan, dipakai bergantian", 9.0, tanda="b03_pool")
b.sorot(D, "host: process.env.DB_HOST", "Dibaca dari berkas .env", 6.5, tanda="b03_env", n=4)
r.tanda("b03_rahasia"); r.label("Tidak ada rahasia yang tertulis di kode", 3.5); time.sleep(4.0)
b.sorot(D, "dateStrings", "Tanggal sebagai teks, hasil hitungan sebagai angka", 6.5, tanda="b03_opsi", n=2); r.tanda("b03_akhir")
# b04 data contoh
r.kamera(None); r.tanda("b04"); b.salin("database/daftar-buku.js"); b.salin("database/isi-contoh.js"); b.lihat("database/isi-contoh.js", jeda=0.8)
r.label("Dua berkas dari GitHub, disalin ke folder database", 4.0); time.sleep(4.5)
b.sorot("database/isi-contoh.js", "import bcrypt", "bcryptjs: mengacak kata sandi akun contoh", 5.5, tanda="b04_bcrypt")
b.term(); r.tanda("b04_pasang"); b.jalan("npm install bcryptjs", tunggu=1.5, sampai="added", maks=120, label="Memasang bcryptjs", dur=2.5)
pj = b.isi("package.json"); DEV = '    "dev": "node --env-file=.env --watch server/app.js"'
assert pj.count(DEV + "\n") == 1
pj2 = pj.replace(DEV + "\n", DEV + ',\n    "contoh": "node --env-file=.env database/isi-contoh.js"\n')
r.kamera(None); r.tanda("b04_skrip"); b.ubah("package.json", pj2, cps=14); b.sorot("package.json", '"contoh"', "Perintah baru: npm run contoh", 3.0)
b.term(); r.tanda("b04_jalan"); b.jalan("npm run contoh", tunggu=1.5, sampai="Data contoh siap", maks=90, label="525 judul buku dan 6 akun contoh", dur=5.0); r.tanda("b04_akhir")
# b05 router buku
i = T.BUKU[4].index("  const [rows]"); B5a = T.BUKU[4][:i] + "})\n"
r.kamera(None); r.tanda("b05"); b.ubah(BK, B5a, cps=15); time.sleep(0.6)
b.sorot(BK, "export const buku = Router()", "Router: kumpulan alamat yang berhubungan", 3.5, tanda="b05_router")
b.sorot(BK, "buku.get('/'", "get: menjawab permintaan membaca data", 7.0, tanda="b05_get")
b.sorot(BK, "req.query.q", "/api/buku?q=bumi   maka q berisi bumi", 7.5, tanda="b05_q"); r.tanda("b05_akhir")
# b06 query
r.kamera(None); r.tanda("b06"); b.ubah(BK, T.BUKU[4], cps=15); time.sleep(0.6)
b.sorot(BK, "`SELECT b.id", "Query dari Bab 3", 5.5, tanda="b06_query", n=3)
b.sorot(BK, "WHERE b.judul LIKE ?", "Tanda tanya: tempat kosong", 5.0, tanda="b06_where")
b.sorot(BK, "['%' + q + '%']", "Nilainya dikirim terpisah", 4.5, tanda="b06_nilai")
r.tanda("b06_pisah"); r.label("Kiriman pengguna hanya dianggap teks, bukan perintah", 9.0); time.sleep(10.0)
r.tanda("b06_persen"); r.label("% di kiri dan kanan: boleh ada teks lain di sekitarnya", 5.0); time.sleep(5.5); r.tanda("b06_akhir")
# b07 memasang router
HALO = "app.get('/api/halo', (req, res) => {\n  res.json({ pesan: 'Halo dari SiBaca' })\n})\n\n"
A7 = T.APP[4].replace("const port", HALO + "const port"); assert A7.count("halo") == 1
r.kamera(None); r.tanda("b07"); b.ubah(AP, A7, cps=14); time.sleep(0.6); b.lihat(AP, "const app", jeda=1.0); r.tanda("b07_lihat"); time.sleep(3.0)
b.sorot(AP, "app.use(express.json())", "Supaya server bisa membaca JSON kiriman browser", 6.0, tanda="b07_json")
b.sorot(AP, "app.use('/api/buku', buku)", "Semua alamat di router buku berawalan /api/buku", 8.5, tanda="b07_use")
r.tanda("b07_hapus"); b.ubah(AP, T.APP[4], cps=14); time.sleep(0.8); b.lihat(AP, "const app", jeda=1.5); r.tanda("b07_akhir")
# b10 commit
b.term(); b.commit("API buku", tanda="b10_commit"); time.sleep(1.0); r.tanda("b10_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
matikan(); sh("git tag -f bab-04"); print("CACAT", CACAT); print(sh("git status --short | head; git log --oneline | head -3").stdout)
