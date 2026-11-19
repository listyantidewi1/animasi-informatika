import sys, time, glob, os; sys.path.insert(0, "/home/user/lapor/alat")
from tulis import Bab, CACAT, P, sh, acuan, siapkan
siapkan("bab-01", "kosong")
b = Bab("/home/user/lapor/L04/rek"); r = b.r
def mig(nama): return os.path.relpath(glob.glob(f"{P}/database/migrations/*_create_{nama}_table.php")[0], P)
r.mulai(); r.kamera(None); time.sleep(0.8)
# b03 users
U = "database/migrations/0001_01_01_000000_create_users_table.php"
r.tanda("b03"); b.lihat(U, "Schema::create('users'", jeda=2.0); r.tanda("b03_ketik")
b.ubah(U, acuan(U), cps=14); time.sleep(0.6)
b.sorot(U, "'role'", "Akun baru otomatis menjadi siswa", 4.0, tanda="b03_role"); b.sorot(U, "'classroom'", "Boleh kosong: petugas tidak punya kelas", 4.0, tanda="b03_kelas"); r.tanda("b03_akhir")
# b04 categories
b.term(); r.tanda("b04"); b.jalan("php artisan make:model Category -m", cps=16, tunggu=1.2, sampai="Migration", label="Dua berkas: model dan migration", dur=3.5)
M = mig("categories"); r.kamera(None); r.tanda("b04_mig"); b.lihat(M, "$table->timestamps()", jeda=1.2)
b.ubah(M, b.isi(M).replace("$table->timestamps();", "$table->string('name')->unique();"), cps=13); b.sorot(M, "unique", "Tidak boleh ada dua kategori bernama sama", 4.0, tanda="b04_unik"); r.tanda("b04_akhir")
# b05 reports
b.term(); r.tanda("b05"); b.jalan("php artisan make:model Report -m", cps=18, tunggu=1.5, sampai="Migration")
M = mig("reports"); r.kamera(None); r.tanda("b05_mig"); b.lihat(M, "$table->timestamps()", jeda=0.8)
kol = """$table->foreignId('user_id')->constrained();
            $table->foreignId('category_id')->constrained();
            $table->string('title', 100);
            $table->text('description');
            $table->string('location', 100);
            $table->string('photo')->nullable();
            $table->string('status', 10)->default('baru');
            $table->timestamps();

            $table->index('created_at');
            $table->index('status');"""
b.ubah(M, b.isi(M).replace("$table->timestamps();", kol), cps=22); time.sleep(0.8)
b.sorot(M, "foreignId('user_id')", "Wajib menunjuk ke id di tabel users", 5.0, tanda="b05_fk"); b.sorot(M, "foreignId('category_id')", "Sama, ke tabel categories", 3.0, tanda="b05_fk2")
b.sorot(M, "'title', 100", "Kolom isi laporan", 8.0, tanda="b05_kolom", n=5); b.sorot(M, "$table->timestamps()", "created_at dan updated_at", 3.5, tanda="b05_ts")
b.sorot(M, "index('created_at')", "Index: dua kolom yang sering disaring", 5.0, tanda="b05_index", n=2); r.tanda("b05_akhir")
# b06 report_updates
b.term(); r.tanda("b06"); b.jalan("php artisan make:model ReportUpdate -m", cps=18, tunggu=1.5, sampai="Migration")
M = mig("report_updates"); r.kamera(None); r.tanda("b06_mig"); b.lihat(M, "$table->timestamps()", jeda=0.8)
kol = """$table->foreignId('report_id')->constrained();
            $table->foreignId('user_id')->constrained();
            $table->string('status', 10);
            $table->text('note');
            $table->string('photo')->nullable();
            $table->timestamp('created_at')->useCurrent();"""
b.ubah(M, b.isi(M).replace("$table->timestamps();", kol), cps=22); time.sleep(0.6)
b.sorot(M, "useCurrent", "Hanya created_at: baris riwayat tidak pernah diubah", 6.0, tanda="b06_created"); r.tanda("b06_akhir")
# b07 migrate:fresh + show create table
b.besar(); r.tanda("b07"); b.jalan("php artisan migrate:fresh", cps=16, tunggu=1.5, sampai="report_updates", label="Hapus semua tabel, buat ulang dari awal", dur=5.0); time.sleep(1.0)
r.tanda("b07_mysql"); b.mysql(); r.tanda("b07_show"); b.sql("SHOW CREATE TABLE reports\\G", tunggu=1.5); r.kamera(None); r.label("SQL yang ditulis Laravel untuk kita", 4.0); time.sleep(8.0); r.tanda("b07_akhir")
b.sql("exit", tunggu=1.0); b.kecil()
# b08 model Report: fillable
MR = "app/Models/Report.php"; penuh = acuan(MR)
i = penuh.index("    // Status yang boleh"); j = penuh.index("    protected $fillable"); k = penuh.index("    public function bolehKe")
relasi = penuh[:i] + penuh[j:k].rstrip() + "\n}\n"
fill = relasi[:relasi.index("    public function user()")].rstrip() + "\n}\n"
r.tanda("b08"); b.lihat(MR, jeda=1.5); r.tanda("b08_ketik"); b.ubah(MR, fill, cps=14); b.sorot(MR, "$fillable", "Hanya empat kolom yang boleh diisi dari form", 9.0, tanda="b08_fill"); r.tanda("b08_akhir")
# b09 relasi
r.tanda("b09"); b.ubah(MR, relasi, cps=24); time.sleep(0.5)
b.sorot(MR, "belongsTo(User::class)", "Satu laporan dimiliki satu pengguna", 4.0, tanda="b09_user"); b.sorot(MR, "hasMany(ReportUpdate::class)", "Satu laporan punya banyak baris riwayat", 4.0, tanda="b09_updates")
MU = "app/Models/User.php"; r.tanda("b09_usermodel"); b.ubah(MU, acuan(MU), cps=24); b.sorot(MU, "public function reports()", "reports() dan isAdmin()", 4.0, tanda="b09_fungsi")
r.tanda("b09_lain"); b.ubah("app/Models/ReportUpdate.php", acuan("app/Models/ReportUpdate.php"), cps=30); r.label("ReportUpdate: tanpa updated_at", 3.0); time.sleep(3.0)
b.ubah("app/Models/Category.php", acuan("app/Models/Category.php"), cps=30); r.label("Category: tanpa kolom waktu", 3.0); time.sleep(3.0); r.tanda("b09_akhir")
# b10 seeder
DS = "database/seeders/DatabaseSeeder.php"; r.tanda("b10"); b.lihat(DS, jeda=1.0); b.ubah(DS, acuan(DS), cps=30); time.sleep(0.5)
b.sorot(DS, "foreach ([", "Enam kategori", 3.0, tanda="b10_kat", n=3); b.sorot(DS, "hendra@nusabakti.test", "Tiga akun: Pak Hendra, Lina, Dimas", 4.0, tanda="b10_akun")
b.sorot(DS, "$hendra->role = 'admin'", "Kata sandi ditulis biasa, disimpan sebagai hash", 5.0, tanda="b10_sandi", ke=1)
r.kamera(None); r.tanda("b10_contoh"); b.salin("database/seeders/ContohSeeder.php", "ContohSeeder.php: salin dari GitHub", 4.0)
b.term(); r.tanda("b10_seed"); b.jalan("php artisan migrate:fresh --seed", cps=18, tunggu=1.5, sampai="DatabaseSeeder", label="Tabel dibuat ulang, lalu diisi", dur=3.0)
r.tekan("Control+l", 0.3); b.jalan("php artisan db:seed --class=ContohSeeder", cps=18, tunggu=2.0, sampai="INFO", label="48 laporan contoh", dur=3.0); r.tanda("b10_akhir")
# b11-b14 SQL
b.besar(); b.mysql(); r.tanda("b11")
b.sql(["SELECT r.title, u.name, c.name AS kategori", "FROM reports r", "JOIN users u ON u.id = r.user_id", "JOIN categories c ON c.id = r.category_id", "LIMIT 5;"], "Judul, pelapor, dan kategori dari tiga tabel", 5.0); r.tanda("b11_akhir")
r.tekan("Control+l", 0.4); r.tanda("b12"); b.sql("SELECT status, COUNT(*) FROM reports GROUP BY status;", "Jumlah laporan di setiap status", 4.5)
r.tanda("b12_bulan"); b.sql(["SELECT COUNT(*) FROM reports", "WHERE created_at >= '2026-11-01'", "  AND created_at <  '2026-12-01';"], "Awal bulan ini sampai sebelum awal bulan depan", 6.0); r.tanda("b12_akhir")
r.tekan("Control+l", 0.4); r.tanda("b14"); b.sql("SELECT COUNT(*) FROM reports WHERE created_at LIKE '%11%';", "Query AI: 13 laporan", 4.0)
r.tanda("b14_rentang"); b.sql(["SELECT COUNT(*) FROM reports", "WHERE created_at >= '2026-11-01' AND created_at < '2026-12-01';"], "Cara rentang: 9 laporan", 4.0)
r.tanda("b14_selisih"); b.sql(["SELECT title, created_at FROM reports", "WHERE created_at LIKE '%11%' AND created_at < '2026-11-01';"], "Empat laporan bulan lain: jam 11", 6.0); r.tanda("b14_akhir")
b.sql("exit", tunggu=1.0); b.kecil(); b.term(); b.commit("Tabel dan model", "b14_commit"); time.sleep(1.0); r.tanda("b14_commit_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
sh("git tag -f bab-04"); print("CACAT", CACAT); print(sh("git status --short | head; git log --oneline | head -3").stdout)
