import sys, time, subprocess, datetime; sys.path.insert(0, "/home/user/pinjam/alat")
from tulis import Bab, CACAT, P, sh, acuan, siapkan
siapkan("bab-05", "skema")
subprocess.run("""mysql sipinjam -e "INSERT INTO kategori (nama) VALUES ('Kamera dan Foto'), ('Audio'); INSERT INTO alat (kategori_id, kode, nama, jumlah_total, stok) VALUES (1, 'KAM-01', 'Kamera DSLR', 2, 2), (2, 'MIC-01', 'Mikrofon wireless', 3, 3); INSERT INTO pengguna (nama, username, sandi_hash, peran, kelas) VALUES ('Rafi', 'rafi', 'belum', 'peminjam', 'XI RPL 1'), ('Nadia', 'nadia', 'belum', 'peminjam', 'XI DKV 2'), ('Pak Yusuf', 'yusuf', 'belum', 'petugas', NULL); CALL ajukan_pinjam(1, 1, 1, 3);" """, shell=True)
tempo = subprocess.run("mysql -N sipinjam -e 'SELECT jatuh_tempo FROM peminjaman WHERE id = 1'", shell=True, capture_output=True, text=True).stdout.strip()
TELAT = str(datetime.date.fromisoformat(tempo) + datetime.timedelta(days=4)); print("tempo", tempo, "kembali", TELAT)
b = Bab("/home/user/pinjam/P06/rek"); r = b.r
F = "database/03_trigger.sql"; PENUH = acuan(F)
i2, i3 = PENUH.index("-- Setiap perubahan status"), PENUH.index("-- Saat pengembalian dicatat")
V1 = PENUH[:i2].rstrip() + "\n\nDELIMITER ;\n"; V2 = PENUH[:i3].rstrip() + "\n\nDELIMITER ;\n"
AI = """-- Trigger buatan AI: menandai pinjaman yang terlambat
DELIMITER //

CREATE TRIGGER tandai_terlambat AFTER UPDATE ON peminjaman
FOR EACH ROW
BEGIN
    UPDATE peminjaman SET status = 'terlambat'
    WHERE jatuh_tempo < CURDATE() AND status = 'disetujui';
END //

DELIMITER ;
"""
def masuk(): r.terminal("mysql -u root sipinjam", cps=16, tunggu=0.5); b.tunggu("mysql>"); time.sleep(1.0); r.tekan("Control+l", 0.4)
r.mulai(); r.kamera(None); time.sleep(0.8)
# b03 trigger log_ajukan
r.tanda("b03"); b.ubah(F, V1, cps=16); time.sleep(0.6)
b.sorot(F, "CREATE TRIGGER log_ajukan", "Setelah ada pengajuan baru", 8.0, tanda="b03_after", zoom=1.25); b.sorot(F, "FOR EACH ROW", "Satu kali untuk setiap baris", 4.0, tanda="b03_each")
b.sorot(F, "INSERT INTO log_aktivitas", "Satu baris log, keterangannya dirangkai CONCAT", 9.0, tanda="b03_isi", n=2, zoom=1.0); r.tanda("b03_akhir")
# b04 trigger ubah_status
r.kamera(None); r.tanda("b04"); b.ubah(F, V2, cps=24); time.sleep(0.6)
b.sorot(F, "CREATE TRIGGER ubah_status", "Setelah peminjaman diubah", 5.0, tanda="b04_after", zoom=1.25); b.sorot(F, "IF NEW.status <> OLD.status", "Status berubah: catat di log", 6.0, tanda="b04_beda", n=3, zoom=1.0)
b.sorot(F, "IF NEW.status IN", "Ditolak atau dibatalkan: stok dikembalikan", 13.0, tanda="b04_stok", n=3, zoom=1.2); r.tanda("b04_akhir")
# b05 trigger setelah_kembali
r.kamera(None); r.tanda("b05"); b.ubah(F, PENUH, cps=24); time.sleep(0.6)
b.sorot(F, "CREATE TRIGGER setelah_kembali", "Setelah ada baris baru di pengembalian", 6.0, tanda="b05_after", zoom=1.25); b.sorot(F, "UPDATE alat a", "Stok bertambah sebanyak yang dipinjam", 5.0, tanda="b05_stok", n=4)
b.sorot(F, "UPDATE peminjaman SET status = 'dikembalikan'", "Status menjadi dikembalikan, trigger kedua ikut berjalan", 12.0, tanda="b05_status", zoom=1.2); r.tanda("b05_akhir")
# b06 coba
b.term(); r.tanda("b06"); b.jalan("mysql -u root sipinjam < database/03_trigger.sql", tunggu=1.5, cps=16); b.besar(); masuk()
r.tanda("b06_ajukan"); b.sql("CALL ajukan_pinjam(1, 2, 1, 3);", "Rafi mengajukan 1 mikrofon", 3.0, cps=14)
r.tanda("b06_log"); b.sql("SELECT aksi, keterangan, waktu FROM log_aktivitas;", "Log terisi sendiri oleh trigger", 5.0, cps=18)
r.tekan("Control+l", 0.4); r.tanda("b06_tolak"); b.sql("UPDATE peminjaman SET status = 'ditolak' WHERE id = 2;", "Pengajuan nomor 2 ditolak", 3.5, cps=16)
r.tanda("b06_stok"); b.sql("SELECT nama, stok FROM alat;", tunggu=1.0, cps=20); b.sql("SELECT aksi, keterangan FROM log_aktivitas;", "Stok mikrofon kembali 3, log bertambah", 6.0, cps=22); r.tanda("b06_akhir")
# b07 pengembalian
r.tekan("Control+l", 0.4); r.tanda("b07"); b.sql("UPDATE peminjaman SET status = 'disetujui', petugas_id = 3 WHERE id = 1;", tunggu=1.0, cps=22)
b.sql("SELECT id, alat_id, jatuh_tempo, status FROM peminjaman WHERE id = 1;", "Pinjaman kamera Rafi: disetujui", 3.5, cps=26)
r.tanda("b07_call"); b.sql(f"CALL kembalikan_pinjam(1, 3, '{TELAT}');", "Dikembalikan 4 hari setelah jatuh tempo", 5.0, cps=14)
r.tekan("Control+l", 0.4); r.tanda("b07_denda"); b.sql("SELECT * FROM pengembalian;", "Denda: 4 hari x Rp2.000 = Rp8.000", 5.0, cps=18)
r.tanda("b07_stok"); b.sql("SELECT nama, stok FROM alat WHERE id = 1;", tunggu=1.0, cps=22); b.sql("SELECT id, status FROM peminjaman WHERE id = 1;", "Stok bertambah, status dikembalikan", 5.0, cps=22); r.tanda("b07_akhir")
b.sql("exit", tunggu=1.0); r.tekan("Control+l", 0.3); b.kecil()
# b09 trigger AI sungguhan
r.kamera(None); r.tanda("b09"); b.taruh("database/trigger_ai.sql", AI); b.lihat("database/trigger_ai.sql", jeda=0.5); r.label("Trigger buatan AI, kita pasang untuk dicoba", 4.0); time.sleep(4.0)
b.term(); r.tanda("b09_pasang"); b.jalan("mysql -u root sipinjam < database/trigger_ai.sql", tunggu=1.2, cps=18)
r.tanda("b09_ubah"); b.jalan('mysql -u root sipinjam -e "UPDATE peminjaman SET jumlah = 1 WHERE id = 1"', tunggu=1.5, cps=18, label="ERROR 1442: trigger mengubah tabel pemicunya sendiri", dur=8.0); time.sleep(14.0); r.tanda("b09_error_akhir")
r.tekan("Control+l", 0.3); r.tanda("b09_hapus"); b.jalan('mysql -u root sipinjam -e "DROP TRIGGER tandai_terlambat"', tunggu=1.0, cps=20); b.jalan("rm database/trigger_ai.sql", tunggu=1.0, cps=18, label="Trigger AI dihapus", dur=2.5)
b.commit("trigger", "b09_commit"); time.sleep(1.0); r.tanda("b09_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
sh("git tag -f bab-06"); print("CACAT", CACAT); print(sh("git status --short | head; git log --oneline | head -3; mysql sipinjam -e 'show triggers' | cut -c1-40").stdout)
