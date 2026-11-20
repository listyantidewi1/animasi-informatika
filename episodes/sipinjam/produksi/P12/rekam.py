import sys, time, subprocess; sys.path.insert(0, "/home/user/pinjam/alat")
from tulis import Bab, CACAT, P, sh, acuan, siapkan
from webbantu import server, matikan
siapkan("bab-11", "contoh"); server()
b = Bab("/home/user/pinjam/P12/rek"); r = b.r
U, F = "tes/uji.php", "database/02_fungsi.sql"; PENUH = acuan(U); ATAS = PENUH[:PENUH.index("function token")].rstrip() + "\n"
BENAR = "GREATEST(DATEDIFF(p_kembali, p_jatuh_tempo), 0)"; SALAH = "GREATEST(DATEDIFF(p_kembali, p_jatuh_tempo) + 1, 0)"
JALAN = "mysql -u root sipinjam < database/02_fungsi.sql"
r.mulai(); r.kamera(None); time.sleep(0.8)
# b03 kerangka uji
r.tanda("b03"); b.ubah(U, ATAS, cps=38); time.sleep(0.5)
b.sorot(U, "function uji(", "uji(nama, benar atau salah): cetak LULUS atau GAGAL", 8.0, tanda="b03_uji", n=6, zoom=1.15)
b.sorot(U, "function buka(", "buka(): browser tiruan dengan curl, menyimpan cookie sesi", 12.0, tanda="b03_buka", n=16, zoom=1.0)
r.kamera(None); r.tanda("b03_salin"); b.taruh(U, PENUH); b.lihat(U, 'echo "\\n1. Login', jeda=0.5); r.label("Lima skenario: salin dari GitHub", 6.0); time.sleep(7.0); r.tanda("b03_akhir")
# b04 batas denda
r.tanda("b04"); b.sorot(U, "Kembali tepat di jatuh tempo", "Tepat di jatuh tempo: harus 0", 5.5, tanda="b04_tepat", zoom=1.0); b.sorot(U, "Kembali sehari lebih awal", "Sehari lebih awal: juga 0", 3.5, tanda="b04_awal", zoom=1.0)
b.sorot(U, "Terlambat 3 hari", "Terlambat 3 hari: harus Rp6.000", 10.0, tanda="b04_telat", zoom=1.0); r.tanda("b04_akhir")
# b05 sepuluh bersamaan
r.tanda("b05"); b.sorot(U, "UPDATE alat SET stok = 1 WHERE kode = 'LGT-01'", "Stok lampu studio diatur menjadi 1", 6.0, tanda="b05_stok", zoom=1.1)
b.sorot(U, "$multi = curl_multi_init()", "curl_multi: sepuluh pengajuan pada saat yang sama", 6.5, tanda="b05_multi", n=8, zoom=1.0)
b.sorot(U, "10 pengajuan bersamaan untuk 1 unit", "Lulus kalau yang diterima tepat 1 dan stok tepat 0", 7.0, tanda="b05_syarat", zoom=1.0); r.tanda("b05_akhir")
# b06 jalankan
b.besar(); r.tanda("b06"); r.label("Server php -S masih menyala di terminal lain", 4.5); time.sleep(4.5)
r.tanda("b06_jalan"); b.jalan("php tes/uji.php", tunggu=1.5, cps=12, sampai="Hasil:", label="21 pemeriksaan, semuanya lulus", dur=5.0); time.sleep(6.0); r.tanda("b06_akhir")
b.kecil()
# b07 sengaja salah
isi = b.isi(F); assert BENAR in isi
r.kamera(None); r.tanda("b07"); b.lihat(F, "SET v_hari", jeda=1.0); b.ubah(F, isi.replace(BENAR, SALAH), cps=6); b.sorot(F, "SET v_hari", "Sengaja salah: + 1 di rumus denda", 4.0, tanda="b07_salah", zoom=1.25)
b.besar(); r.tanda("b07_jalan"); b.jalan(JALAN, tunggu=1.2, cps=24); b.jalan("php tes/uji.php", tunggu=1.5, cps=20, sampai="Hasil:", label="2 GAGAL, dan namanya menunjukkan letak salahnya", dur=7.0); time.sleep(3.0); r.tanda("b07_gagal_akhir")
b.kecil(); r.kamera(None); r.tanda("b07_balik"); b.ubah(F, isi, cps=6); b.sorot(F, "SET v_hari", "Rumus dikembalikan", 2.5, zoom=1.25)
b.besar(); b.jalan(JALAN, tunggu=1.2, cps=30); b.jalan("php tes/uji.php", tunggu=1.5, cps=30, sampai="Hasil:", label="Semua lulus lagi", dur=4.0); r.tanda("b07_akhir")
r.tekan("Control+l", 0.3); b.kecil()
# b09 commit
b.term(); b.commit("skenario uji", "b09_commit"); time.sleep(1.0); r.tanda("b09_akhir")
r.kamera(None); time.sleep(0.8); r.selesai(); matikan()
sh("git tag -f bab-12"); print("CACAT", CACAT); print(sh("git status --short | head; git log --oneline | head -3").stdout)
