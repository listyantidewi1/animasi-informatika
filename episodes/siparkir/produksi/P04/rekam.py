import sys, time, os; sys.path.insert(0, "/home/user/parkir/alat")
from tulis import Bab, CACAT, P, sh, acuan, siapkan, mig, banding
T = "bab-04"
siapkan("bab-01", "kosong")
b = Bab("/home/user/parkir/P04/rek"); r = b.r
def kolom(M, baru, cps=22): b.ubah(M, b.isi(M).replace("$table->timestamps();", baru), cps=cps)
r.mulai(); r.kamera(None); time.sleep(0.8)
# b02 users: kolom role
U = "database/migrations/0001_01_01_000000_create_users_table.php"
r.tanda("b02"); b.lihat(U, "Schema::create('users'", jeda=2.5); r.tanda("b02_ketik")
b.ubah(U, acuan(U, T), cps=13); time.sleep(0.6)
b.sorot(U, "'role'", "Nilai bawaan: petugas, hak yang paling kecil", 6.0, tanda="b02_role"); r.tanda("b02_akhir")
# b03 make:model -m
b.term(); r.tanda("b03"); time.sleep(1.0); r.tanda("b03_cmd"); b.jalan("php artisan make:model Rate -m", cps=14, tunggu=1.5, sampai="Migration", label="Dua berkas: model dan migration", dur=4.5)
r.tanda("b03_lain")
for i, n in enumerate(["Area", "Vehicle", "Parking", "ActivityLog"]):
    r.terminal(f"php artisan make:model {n} -m", cps=20, tunggu=0.3); t0 = time.time()
    while b.layar().count("Migration [") < i + 2 and time.time() - t0 < 30: time.sleep(0.3)
    time.sleep(1.3)
r.label("Lima model, lima migration", 3.0); time.sleep(3.0); r.tanda("b03_akhir")
# b04 rates
M = mig("rates"); r.kamera(None); r.tanda("b04"); b.lihat(M, "$table->timestamps()", jeda=1.5); r.tanda("b04_ketik")
kolom(M, """$table->string('type', 10)->unique();
            $table->unsignedInteger('first_hour');
            $table->unsignedInteger('next_hour');
            $table->unsignedInteger('daily_max');
            $table->timestamps();""", cps=16); time.sleep(0.6)
b.sorot(M, "unique", "Satu jenis kendaraan, satu tarif", 5.0, tanda="b04_unik")
b.sorot(M, "'first_hour'", "Jam pertama, jam berikutnya, batas harian", 9.0, tanda="b04_tiga", n=3); r.tanda("b04_akhir")
# b05 areas dan vehicles (cepat)
M = mig("areas"); r.kamera(None); r.tanda("b05"); b.lihat(M, "$table->timestamps()", jeda=0.8)
kolom(M, """$table->string('name', 40);
            $table->string('type', 10);
            $table->unsignedSmallInteger('capacity');
            $table->timestamps();""", cps=30); time.sleep(0.8)
M = mig("vehicles"); r.tanda("b05_veh"); b.lihat(M, "$table->timestamps()", jeda=0.8)
kolom(M, """$table->string('plate', 12)->unique();
            $table->string('type', 10);
            $table->string('owner', 60)->nullable();
            $table->timestamps();""", cps=30); time.sleep(0.6)
b.sorot(M, "'plate'", "Satu plat, satu baris kendaraan", 6.0, tanda="b05_plat"); r.tanda("b05_akhir")
# b06 parkings: sambungan
M = mig("parkings"); r.kamera(None); r.tanda("b06"); b.lihat(M, "$table->timestamps()", jeda=1.5); r.tanda("b06_ketik")
kolom(M, """$table->foreignId('vehicle_id')->constrained();
            $table->foreignId('area_id')->constrained();
            $table->foreignId('entry_user_id')->constrained('users');
            $table->foreignId('exit_user_id')->nullable()->constrained('users');
            $table->dateTime('entered_at');
            $table->dateTime('exited_at')->nullable();
            $table->unsignedInteger('fee')->nullable();
            $table->timestamps();""", cps=18); time.sleep(0.6)
b.sorot(M, "foreignId('vehicle_id')", "Wajib menunjuk ke id di tabel vehicles", 10.0, tanda="b06_fk")
b.sorot(M, "foreignId('entry_user_id')", "Nama kolom berbeda: tabelnya kita sebutkan", 8.5, tanda="b06_users", n=2)
b.sorot(M, "foreignId('exit_user_id')", "nullable: boleh kosong", 2.6, tanda="b06_null")
b.sorot(M, "'exited_at'", "Kosong selama kendaraan masih di dalam", 4.5, tanda="b06_null2", n=2); r.tanda("b06_akhir")
# b07 open, unique, index
r.kamera(None); r.tanda("b07"); b.editor()
kolom(M, """$table->boolean('open')->nullable()->default(true);
            $table->timestamps();""", cps=16); time.sleep(0.4)
b.sorot(M, "boolean('open')", "true = masih di dalam, NULL = sudah keluar", 4.5, tanda="b07_open")
r.kamera(None); r.tanda("b07_ketik2"); b.editor()
kolom(M, """$table->timestamps();

            $table->unique(['vehicle_id', 'open']);
            $table->index('entered_at');
            $table->index('exited_at');""", cps=18); time.sleep(0.6)
b.sorot(M, "unique(['vehicle_id', 'open'])", "Satu kendaraan hanya boleh punya satu transaksi terbuka", 8.0, tanda="b07_unik")
b.sorot(M, "index('entered_at')", "Index: seperti daftar isi buku", 9.0, tanda="b07_index", n=2); r.tanda("b07_akhir")
# activity_logs (di luar narasi, cepat)
M = mig("activity_logs"); r.kamera(None); r.tanda("b07_log"); b.lihat(M, "$table->timestamps()", jeda=0.6)
kolom(M, """$table->foreignId('user_id')->nullable()->constrained();
            $table->string('action', 40);
            $table->string('detail');
            $table->timestamps();""", cps=30); r.label("activity_logs: siapa, melakukan apa", 3.0); time.sleep(3.0); r.tanda("b07_log_akhir")
# b08 migrate --pretend
b.besar(); r.tanda("b08"); time.sleep(1.0); r.tanda("b08_cmd"); b.jalan("php artisan migrate --pretend", cps=14, tunggu=1.5, sampai="activity_logs_user_id_foreign", label="Hanya menampilkan SQL, belum menjalankannya", dur=5.0); time.sleep(1.0); r.tanda("b08_akhir")
b.kecil()
# b09 model Parking
MP = "app/Models/Parking.php"; r.tanda("b09"); b.lihat(MP, jeda=2.0); r.tanda("b09_ketik"); b.ubah(MP, acuan(MP, T), cps=26); time.sleep(0.6)
b.sorot(MP, "#[Fillable", "Hanya empat kolom yang boleh diisi dari array", 11.0, tanda="b09_fill")
b.sorot(MP, "public function vehicle()", "Setiap transaksi dimiliki satu kendaraan", 6.0, tanda="b09_vehicle", n=4); r.tanda("b09_akhir")
# b10 model Vehicle + lainnya
MV = "app/Models/Vehicle.php"; r.kamera(None); r.tanda("b10"); b.lihat(MV, jeda=0.8); b.ubah(MV, acuan(MV, T), cps=26); time.sleep(0.6)
b.sorot(MV, "public static function rapikan", "“b 1234 cd” menjadi “B1234CD”", 11.0, tanda="b10_rapikan", n=4)
r.kamera(None); r.tanda("b10_lain")
for rel in ["app/Models/Rate.php", "app/Models/Area.php", "app/Models/ActivityLog.php"]:
    b.lihat(rel, jeda=0.5); b.ubah(rel, acuan(rel, T), cps=34); time.sleep(1.5)
r.tanda("b10_akhir")
# b11 seeder
DS = "database/seeders/DatabaseSeeder.php"; r.kamera(None); r.tanda("b11"); b.lihat(DS, jeda=1.5); r.tanda("b11_ketik"); b.ubah(DS, acuan(DS, T), cps=30); time.sleep(0.6)
b.sorot(DS, "Rate::create(['type' => 'motor'", "Dua tarif dari jawaban Bu Ratna", 4.0, tanda="b11_tarif", n=2)
b.sorot(DS, "Area::create(['name' => 'Area Motor'", "Dua area", 2.5, tanda="b11_area", n=2)
b.sorot(DS, "['Bu Sinta'", "Empat akun contoh", 7.0, tanda="b11_akun", n=4)
b.sorot(DS, "$user->role = $peran", "role diisi di baris tersendiri, bukan lewat create", 10.0, tanda="b11_role"); r.tanda("b11_akhir")
# b12 migrate:fresh --seed + periksa di MySQL
b.besar(); r.tanda("b12"); b.jalan("php artisan migrate:fresh --seed", cps=14, tunggu=1.5, sampai="DatabaseSeeder", label="Hapus semua tabel, buat ulang, lalu isi data awal", dur=6.0); time.sleep(1.0)
r.tanda("b12_mysql"); b.mysql(); r.tanda("b12_rates"); b.sql("SELECT type, first_hour, next_hour, daily_max FROM rates;", "Dua tarif", 2.5, cps=26)
r.tanda("b12_users"); b.sql("SELECT name, email, role FROM users;", "Empat akun dengan perannya", 4.5, cps=26); r.tanda("b12_akhir")
b.sql("exit", tunggu=1.0); b.kecil()
# b14 commit
b.term(); b.commit("Tabel dan model", "b14_commit"); time.sleep(1.0); r.tanda("b14_commit_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
sh("git tag -f bab-04"); print("CACAT", CACAT); banding(T); print(sh("git status --short | head; git log --oneline | head -3").stdout)
