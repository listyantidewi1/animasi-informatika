import sys, time, subprocess; sys.path.insert(0, "/home/user/pinjam/alat")
from tulis import Bab, CACAT, P, sh, acuan, siapkan
siapkan("bab-04", "skema")
subprocess.run("""mysql sipinjam -e "INSERT INTO kategori (nama) VALUES ('Kamera dan Foto'), ('Audio'); INSERT INTO alat (kategori_id, kode, nama, jumlah_total, stok) VALUES (1, 'KAM-01', 'Kamera DSLR', 2, 2), (2, 'MIC-01', 'Mikrofon wireless', 3, 3);" """, shell=True)
b = Bab("/home/user/pinjam/P05/rek"); r = b.r
F = "database/02_fungsi.sql"; PENUH = acuan(F)
i1, i2, i3 = PENUH.index("-- Denda ="), PENUH.index("-- Mengajukan pinjaman"), PENUH.index("-- Mencatat pengembalian")
KEP = "-- SiPinjam: function dan stored procedure.\n-- Jalankan sebagai root:  mysql -u root sipinjam < database/02_fungsi.sql\n\nDROP FUNCTION IF EXISTS hitung_denda;\n"
FN, PR = PENUH[i1:i2], PENUH[i2:i3]
HANDLER = "    DECLARE EXIT HANDLER FOR SQLEXCEPTION\n    BEGIN\n        ROLLBACK;\n        RESIGNAL;\n    END;\n\n"
assert HANDLER in PR
V1 = KEP + "\nDELIMITER //\n\n" + FN.rstrip() + "\n\nDELIMITER ;\n"
V3 = KEP + "DROP PROCEDURE IF EXISTS ajukan_pinjam;\n\nDELIMITER //\n\n" + FN + PR.rstrip() + "\n\nDELIMITER ;\n"
V2 = V3.replace(HANDLER, "")
JALAN = "mysql -u root sipinjam < database/02_fungsi.sql"
def masuk(): r.terminal("mysql -u root sipinjam", cps=16, tunggu=0.5); b.tunggu("mysql>"); time.sleep(1.0); r.tekan("Control+l", 0.4)
r.mulai(); r.kamera(None); time.sleep(0.8)
# b03 function hitung_denda
r.tanda("b03"); b.ubah(F, V1, cps=15); time.sleep(0.6)
b.sorot(F, "DELIMITER //", "Tanda akhir perintah diganti menjadi //", 9.5, tanda="b03_delim"); b.sorot(F, "CREATE FUNCTION", "Tiga masukan: jatuh tempo, tanggal kembali, jumlah", 7.0, tanda="b03_masukan", zoom=1.2)
b.sorot(F, "DECLARE v_tarif", "Dua variabel", 3.0, tanda="b03_declare", n=2); b.sorot(F, "SELECT nilai INTO", "Tarif diambil dari tabel pengaturan", 5.0, tanda="b03_select", zoom=1.25)
b.sorot(F, "SET v_hari", "Selisih hari, paling kecil nol", 12.0, tanda="b03_hari", zoom=1.25); b.sorot(F, "RETURN v_hari", "hari x tarif x jumlah", 5.0, tanda="b03_return"); r.tanda("b03_akhir")
# b04 coba function
b.term(); r.tanda("b04"); b.jalan(JALAN, tunggu=1.5, cps=14); b.besar(); masuk()
r.tanda("b04_a"); b.sql("SELECT hitung_denda('2026-11-10', '2026-11-10', 1);", "Tepat waktu: denda 0", 4.0, cps=16)
r.tanda("b04_b"); b.sql("SELECT hitung_denda('2026-11-10', '2026-11-13', 1);", "Terlambat 3 hari: Rp6.000", 5.0, cps=18)
r.tanda("b04_c"); b.sql("SELECT hitung_denda('2026-11-10', '2026-11-08', 1);", "Lebih awal: tetap 0, bukan minus", 5.0, cps=18); r.tanda("b04_akhir")
b.sql("exit", tunggu=1.0); r.tekan("Control+l", 0.3); b.kecil()
# b07 prosedur ajukan_pinjam (belum ada handler)
r.kamera(None); r.tanda("b07"); b.ubah(F, V2, cps=22); time.sleep(0.6)
b.sorot(F, "CREATE PROCEDURE ajukan_pinjam", "Empat masukan: siapa, alat, jumlah, hari", 8.0, tanda="b07_masukan", zoom=1.2); b.sorot(F, "START TRANSACTION", "Paket dibuka", 3.5, tanda="b07_start")
b.sorot(F, "SELECT stok INTO v_stok", "Baca stok sekaligus kunci barisnya", 6.5, tanda="b07_kunci", n=3); b.sorot(F, "IF v_stok IS NULL", "Stok kurang: lempar error", 6.0, tanda="b07_signal", n=3, zoom=1.25)
b.sorot(F, "UPDATE alat SET stok", "Kurangi stok", 2.5, tanda="b07_update"); b.sorot(F, "INSERT INTO peminjaman", "Catat pinjaman: hari ini sampai hari ini + jumlah hari", 8.5, tanda="b07_insert", n=2, zoom=1.2)
b.sorot(F, "    COMMIT;", "Simpan semuanya, lepas kunci", 5.0, tanda="b07_commit"); r.tanda("b07_akhir")
# b08 handler
r.kamera(None); r.tanda("b08"); b.ubah(F, V3, cps=16); time.sleep(0.5)
b.sorot(F, "DECLARE EXIT HANDLER", "Error apa pun: batalkan semua, lalu teruskan errornya", 16.0, tanda="b08_handler", n=5); r.tanda("b08_akhir")
# b09 coba prosedur
b.term(); r.tanda("b09"); b.jalan(JALAN, tunggu=1.5, cps=16); b.besar(); masuk()
r.tanda("b09_pengguna"); b.sql(["INSERT INTO pengguna (nama, username, sandi_hash, peran, kelas) VALUES", "('Rafi', 'rafi', 'belum', 'peminjam', 'XI RPL 1'),", "('Nadia', 'nadia', 'belum', 'peminjam', 'XI DKV 2'),", "('Pak Yusuf', 'yusuf', 'belum', 'petugas', NULL);"], "Rafi nomor 1, Nadia nomor 2, Pak Yusuf nomor 3", 4.0, cps=30)
r.tanda("b09_stok"); b.sql("SELECT id, nama, stok FROM alat;", "Stok kamera: 2", 3.0, cps=18)
r.tekan("Control+l", 0.4); r.tanda("b09_rafi"); b.sql("CALL ajukan_pinjam(1, 1, 1, 3);", "Rafi, kamera, 1 unit, 3 hari", 4.0, cps=14)
r.tanda("b09_hasil"); b.sql("SELECT nama, stok FROM alat WHERE id = 1;", tunggu=1.0, cps=22); b.sql("SELECT pengguna_id, alat_id, jumlah, jatuh_tempo, status FROM peminjaman;", "Stok 1, pinjaman tercatat: diajukan", 5.0, cps=28)
r.tekan("Control+l", 0.4); r.tanda("b09_nadia"); b.sql("CALL ajukan_pinjam(2, 1, 2, 3);", "Nadia minta 2 kamera: ditolak", 4.5, cps=14)
r.tanda("b09_tetap"); b.sql("SELECT nama, stok FROM alat WHERE id = 1;", "Stok tetap 1", 3.5, cps=22); r.tanda("b09_akhir")
b.sql("exit", tunggu=1.0); r.tekan("Control+l", 0.4)
# b10 sepuluh pengajuan bersamaan
CEK = 'mysql -u root sipinjam -e "SELECT nama, stok FROM alat WHERE id = 1"'
r.tanda("b10"); b.jalan(CEK, tunggu=1.2, cps=24, label="Stok kamera tinggal 1", dur=3.0)
r.tanda("b10_seru"); r.terminal('(for i in $(seq 10); do mysql -u root sipinjam -e "CALL ajukan_pinjam(1, 1, 1, 3)" & done; wait)', cps=13, tunggu=0.3); r.tanda("b10_jalan"); time.sleep(3.0)
r.label("9 ditolak, hanya 1 yang berhasil", 6.0); time.sleep(6.5)
r.tanda("b10_nol"); b.jalan(CEK, tunggu=1.2, cps=30, label="Stok 0, bukan minus sembilan", dur=5.0); time.sleep(1.0); r.tanda("b10_akhir")
b.kecil()
# b12 salin kembalikan_pinjam, commit
r.kamera(None); r.tanda("b12_salin"); b.taruh(F, PENUH); b.lihat(F, "CREATE PROCEDURE kembalikan_pinjam", jeda=0.5); r.label("kembalikan_pinjam: salin dari GitHub", 5.0); time.sleep(6.0); r.tanda("b12_salin_akhir")
sh(JALAN.replace("-u root ", ""))
b.term(); b.commit("function dan prosedur", "b12_commit"); time.sleep(1.0); r.tanda("b12_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
sh("git tag -f bab-05"); print("CACAT", CACAT); print(sh("git status --short | head; git log --oneline | head -3; mysql sipinjam -e 'select id,nama,stok from alat; select count(*) from peminjaman'").stdout)
