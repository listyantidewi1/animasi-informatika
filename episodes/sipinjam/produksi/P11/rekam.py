import sys, time, subprocess; sys.path.insert(0, "/home/user/pinjam/alat")
from tulis import Bab, CACAT, P, sh, acuan, siapkan
siapkan("bab-10", "contoh")
b = Bab("/home/user/pinjam/P11/rek"); r = b.r
D = "public/petugas/"; IX, PR, DP, TR, LP = D + "index.php", D + "proses.php", D + "dipinjam.php", D + "terima.php", D + "laporan.php"
r.mulai(); r.kamera(None); time.sleep(0.8)
# b02 permintaan + proses
r.tanda("b02"); b.ubah(IX, acuan(IX), cps=50); time.sleep(0.5)
b.sorot(IX, '<button name="aksi" value="setujui"', "Dua tombol: Setujui dan Tolak", 5.0, tanda="b02_tombol", n=2, zoom=1.15)
r.kamera(None); r.tanda("b02_proses"); b.ubah(PR, acuan(PR), cps=30); time.sleep(0.5)
b.sorot(PR, "$status = match", "match: aksi menjadi status, selain itu ditolak", 8.0, tanda="b02_match", n=5, zoom=1.2)
b.sorot(PR, '$st = q("UPDATE peminjaman SET status = ?, petugas_id = ?', "Syarat: statusnya masih diajukan", 16.0, tanda="b02_update", n=2, zoom=1.0); r.label("Ditolak? Stok kembali berkat trigger", 5.0); time.sleep(6.0); r.tanda("b02_akhir")
# b03 sedang dipinjam
r.kamera(None); r.tanda("b03"); b.ubah(DP, acuan(DP), cps=45); time.sleep(0.5); b.lihat(DP, "$daftar = q(", jeda=0.3)
b.sorot(DP, "ORDER BY p.jatuh_tempo", "Jatuh tempo terdekat di atas", 5.5, tanda="b03_urut", zoom=1.1)
b.sorot(DP, "hitung_denda(p.jatuh_tempo, ?, p.jumlah) AS denda", "Function dari bab 5, dipanggil di dalam SELECT", 19.0, tanda="b03_denda", zoom=1.05); r.tanda("b03_akhir")
# b04 terima kembali
r.kamera(None); r.tanda("b04"); b.ubah(TR, acuan(TR), cps=30); time.sleep(0.5)
b.sorot(TR, "q('CALL kembalikan_pinjam", "Prosedur: catat pengembalian, hitung denda. Trigger: stok, status, log", 17.0, tanda="b04_call", zoom=1.0)
b.sorot(TR, "pesan('Alat diterima kembali", "PHP hanya menampilkan pesan", 4.5, tanda="b04_pesan", n=1, zoom=1.0); r.tanda("b04_akhir")
# b06 laporan
r.kamera(None); r.tanda("b06"); b.ubah(LP, acuan(LP), cps=50); time.sleep(0.5); b.lihat(LP, "$dari = $_GET", jeda=0.3)
b.sorot(LP, "$dari = $_GET", "Tanggal awal dan tanggal akhir", 4.0, tanda="b06_tgl", n=2, zoom=1.2)
b.sorot(LP, "JOIN pengguna u ON", "Satu query, tiga JOIN: peminjam, alat, pengembalian", 11.0, tanda="b06_join", n=3, zoom=1.1)
b.sorot(LP, "WHERE p.tanggal_pinjam >= ?", ">= tanggal awal, dan < tanggal akhir + 1 hari", 14.0, tanda="b06_rentang", zoom=1.0)
b.sorot(LP, "$total_denda = array_sum", "Total denda dijumlahkan di PHP", 5.0, tanda="b06_sum", zoom=1.1); r.tanda("b06_akhir")
# b07 cetak
r.tanda("b07"); b.sorot(LP, 'onclick="print()"', "Tombol cetak: fungsi print() milik browser", 8.0, tanda="b07_print", zoom=1.15)
b.sorot("public/gaya.css", "@media print", "Saat dicetak: menu, form, dan tombol disembunyikan", 8.0, tanda="b07_css", n=6, zoom=1.1); r.tanda("b07_akhir")
# b09 penghitung query, commit
r.kamera(None); r.tanda("b09"); b.sorot("app/bantu.php", "$GLOBALS['jumlah_query']", "Setiap panggilan q() dihitung", 7.0, tanda="b09_hitung", zoom=1.1)
b.term(); b.commit("halaman petugas", "b09_commit"); time.sleep(1.0); r.tanda("b09_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
sh("git tag -f bab-11"); print("CACAT", CACAT); print(sh("git status --short | head; git log --oneline | head -3").stdout)
