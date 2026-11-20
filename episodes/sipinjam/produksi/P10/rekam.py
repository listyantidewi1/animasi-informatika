import sys, time, subprocess; sys.path.insert(0, "/home/user/pinjam/alat")
from tulis import Bab, CACAT, P, sh, acuan, siapkan
siapkan("bab-09", "contoh")
b = Bab("/home/user/pinjam/P10/rek"); r = b.r
D = "public/peminjam/"; IX, AJ, PJ, BT = D + "index.php", D + "ajukan.php", D + "pinjaman.php", D + "batalkan.php"
r.mulai(); r.kamera(None); time.sleep(0.8)
# b02 daftar alat lengkap
r.tanda("b02"); b.lihat(IX, jeda=1.5); r.tanda("b02_ketik"); b.ubah(IX, acuan(IX), cps=40); time.sleep(0.6)
b.sorot(IX, "WHERE a.aktif = TRUE AND a.nama LIKE ?", "Hanya alat aktif, bisa dicari berdasarkan nama", 6.0, tanda="b02_query", zoom=1.0)
b.sorot(IX, '<form method="post" action="ajukan.php"', "Form kecil di setiap kartu: jumlah dan lama pinjam", 5.5, tanda="b02_form", n=7, zoom=1.0)
b.sorot(IX, 'name="jumlah"', "max jumlah = stok, max lama = dari tabel pengaturan", 9.0, tanda="b02_max", n=2, zoom=1.0); b.sorot(IX, "Sedang habis", "Stok nol: form diganti tulisan", 5.5, tanda="b02_habis", zoom=1.2); r.tanda("b02_akhir")
# b03 ajukan.php
r.kamera(None); r.tanda("b03"); b.ubah(AJ, acuan(AJ), cps=30); time.sleep(0.6)
b.sorot(AJ, "if ($jumlah < 1", "Diperiksa lagi di server: max di browser mudah dilewati", 11.0, tanda="b03_cek", n=4, zoom=1.0)
b.sorot(AJ, "q('CALL ajukan_pinjam", "Satu baris. Id peminjam dari sesi, bukan dari form", 10.0, tanda="b03_call", zoom=1.0)
b.sorot(AJ, "catch (PDOException", "SIGNAL dari prosedur tiba sebagai exception 45000", 8.0, tanda="b03_catch", n=3, zoom=1.1); b.sorot(AJ, "pesan($ex->errorInfo[2]", "Pesannya ditampilkan: Stok tidak cukup.", 7.0, tanda="b03_pesan", n=2, zoom=1.1); r.tanda("b03_akhir")
# b04 pinjaman.php
r.kamera(None); r.tanda("b04"); b.ubah(PJ, acuan(PJ), cps=40); time.sleep(0.6); b.lihat(PJ, "$daftar = q(", jeda=0.3)
b.sorot(PJ, "WHERE p.pengguna_id = ?", "Hanya pinjaman milik yang sedang login", 6.5, tanda="b04_where", zoom=1.1)
b.sorot(PJ, "LEFT JOIN pengembalian", "LEFT JOIN: yang belum kembali tetap tampil", 8.5, tanda="b04_left", zoom=1.1); b.sorot(PJ, "if ($p['status'] === 'diajukan')", "Tombol Batalkan hanya untuk status diajukan", 5.5, tanda="b04_batal", n=7, zoom=1.1); r.tanda("b04_akhir")
# b05 batalkan.php
r.kamera(None); r.tanda("b05"); b.ubah(BT, acuan(BT), cps=26); time.sleep(0.6)
b.sorot(BT, "$st = q(\"UPDATE peminjaman", "Tiga syarat: id, pemilik, dan status", 14.0, tanda="b05_update", n=2, zoom=1.0); b.sorot(BT, "if ($st->rowCount() === 1)", "Tidak ada baris berubah: rowCount 0", 8.0, tanda="b05_row", n=5, zoom=1.15)
r.tanda("b05_trigger"); b.sorot(BT, "$st = q(\"UPDATE peminjaman", "Stok diurus trigger ubah_status", 7.0, n=2, zoom=1.0); r.tanda("b05_akhir")
# b08 penutup: tiga syarat, commit
r.kamera(None); r.tanda("b08"); b.sorot(BT, "$st = q(\"UPDATE peminjaman", "Pemilik, status, dan form POST dengan token", 6.0, tanda="b08_syarat", n=2, zoom=1.0)
b.term(); b.commit("halaman peminjam", "b08_commit"); time.sleep(1.0); r.tanda("b08_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
sh("git tag -f bab-10"); print("CACAT", CACAT); print(sh("git status --short | head; git log --oneline | head -3").stdout)
