import sys, time; sys.path.insert(0, "/home/user/baca/alat")
from tulis import Bab, CACAT, sh, matikan, siapkan, acuan
from tahap import BUKU, APP, KAT, APPX
siapkan("bab-08", "contoh")
b = Bab("/home/user/baca/B09/rek"); r = b.r
PT = "server/petugas.js"; BK = "server/buku.js"; AP = "server/app.js"; W = "web/src/"
F = acuan(PT); pa = F[:F.index("petugas.get('/anggota'")].rstrip() + "\n"; pb = F[:F.index("petugas.post('/anggota/:id/setujui'")].rstrip() + "\n"; pc = F[:F.index("petugas.get('/peminjaman'")].rstrip() + "\n"
r.mulai(); r.kamera(None); time.sleep(1.0)
# b02 dua penjaga untuk semua alamat
r.tanda("b02"); b.ubah(PT, pa, cps=16); time.sleep(0.4)
b.sorot(PT, "petugas.use(perluLogin, perluPetugas)", "Baris terpenting di berkas ini", 7.5, tanda="b02_use")
r.tanda("b02_semua"); r.label("Semua alamat di berkas ini melewati dua penjaga", 5.0); time.sleep(5.4)
r.tanda("b02_lupa"); r.label("Tidak ada alamat yang kelupaan dijaga", 5.5); time.sleep(6.0); r.tanda("b02_akhir")
# b03 daftar anggota
r.kamera(None); r.tanda("b03"); b.ubah(PT, pb, cps=22); time.sleep(0.4)
b.sorot(PT, "petugas.get('/anggota'", "Daftar anggota", 2.8, tanda="b03_anggota")
b.sorot(PT, "COUNT(p.id) AS dipinjam", "Jumlah buku yang sedang dipinjam", 3.2)
b.sorot(PT, "LEFT JOIN peminjaman", "LEFT JOIN, bukan JOIN biasa", 4.0, tanda="b03_left", zoom=1.3); r.tanda("b03_akhir")
# b04 setujui dan nonaktifkan
r.kamera(None); r.tanda("b04"); b.ubah(PT, pc, cps=24); time.sleep(0.4)
b.sorot(PT, "UPDATE pengguna SET aktif = TRUE", "setujui: aktif menjadi TRUE", 3.8, tanda="b04_setujui", zoom=1.3)
b.sorot(PT, "petugas.post('/anggota/:id/nonaktifkan'", "nonaktifkan: lebih berhati-hati", 2.8, tanda="b04_non")
b.sorot(PT, "const [[h]]", "Masih ada pinjaman yang belum kembali? Tolak", 5.3, tanda="b04_hitung", n=4, zoom=1.3)
b.sorot(PT, "// Anggota yang masih memegang buku", "Tidak ada alamat untuk menghapus anggota", 4.0, tanda="b04_hapus", zoom=1.3)
b.sorot(PT, "UPDATE pengguna SET aktif = FALSE", "Tidak bisa login, riwayatnya tetap tersimpan", 6.0, tanda="b04_riwayat", zoom=1.3); r.tanda("b04_akhir")
# b05 peminjaman, tambah buku, pasang router
r.kamera(None); r.tanda("b05"); b.ubah(PT, F, cps=24); time.sleep(0.4)
b.sorot(PT, "petugas.get('/peminjaman'", "Semua buku yang sedang berada di luar", 4.0, tanda="b05_pinjam")
b.sorot(PT, "ORDER BY p.jatuh_tempo", "Jatuh tempo terdekat di atas", 3.8)
b.sorot(PT, "DATEDIFF", "DATEDIFF: berapa hari terlambat", 4.0, tanda="b05_diff", zoom=1.3)
r.kamera(None); r.tanda("b05_buku"); b.ubah(BK, BUKU[9], cps=30); time.sleep(0.4)
b.sorot(BK, "await kon.beginTransaction()", "Judul dan eksemplar dalam satu transaksi", 3.5, tanda="b05_trans")
b.sorot(BK, "kode.push(", "Kode label dibuat otomatis: B0526-1, B0526-2", 3.8, zoom=1.3)
r.kamera(None); r.tanda("b05_app"); b.ubah(AP, APP[9], cps=14); b.sorot(AP, "app.use('/api/petugas', petugas)", "Router petugas dipasang", 2.5); r.tanda("b05_akhir")
# b06 halaman petugas
r.kamera(None); r.tanda("b06")
for f in ["Petugas.jsx", "Anggota.jsx", "TambahBuku.jsx"]: b.salin(W + "halaman/" + f)
b.lihat(W + "halaman/Petugas.jsx", jeda=1.5); r.label("Petugas.jsx, Anggota.jsx, TambahBuku.jsx: dari GitHub", 4.5); time.sleep(2.5); b.lihat(W + "halaman/Anggota.jsx", jeda=2.0); b.lihat(W + "halaman/TambahBuku.jsx", jeda=2.0); r.tanda("b06_salin")
r.kamera(None); r.tanda("b06_app"); b.ubah(W + "App.jsx", APPX[9], cps=24); time.sleep(0.4)
b.sorot(W + "App.jsx", "{!petugas && <NavLink", "Menu dibedakan berdasarkan peran", 3.5, tanda="b06_menu", n=3, zoom=1.3)
r.tanda("b06_ingat"); r.label("Menyembunyikan menu hanyalah kenyamanan", 5.5); time.sleep(6.0)
b.sorot(PT, "petugas.use(perluLogin, perluPetugas)", "Penjaga yang sesungguhnya ada di server", 4.5, tanda="b06_jaga"); r.tanda("b06_akhir")
r.kamera(None); r.tanda("b06_kat"); b.ubah(W + "halaman/Katalog.jsx", KAT[9], cps=20); b.sorot(W + "halaman/Katalog.jsx", "<TambahBuku", "Katalog.jsx: form Tambah Buku khusus petugas", 3.5, zoom=1.3); r.tanda("b06_kat_akhir")
# b10 commit
b.term(); b.commit("Halaman petugas", tanda="b10_commit"); time.sleep(1.0); r.tanda("b10_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
matikan(); sh("git tag -f bab-09"); print("CACAT", CACAT); print(sh("git status --short | head; git log --oneline | head -3; cd web && npx vite build 2>&1 | tail -2").stdout)
