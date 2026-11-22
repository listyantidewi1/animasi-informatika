"""Daftar potongan rekaman yang berisi ketikan (kode, perintah terminal, SQL) di video SiParkir.
Kunci: (bab, beat, indeks part) seperti dicetak rencana_*.json.
jenis: 'kode' = isi berkas (label alamat GitHub), 'cmd' = perintah terminal / SQL, 'teks' = ubah satu baris berkas lokal."""
GH = "github.com/listyantidewi1/SiParkir/blob/"
TREE = "github.com/listyantidewi1/SiParkir/tree/"
M = "database/migrations/"
MIG = {"rates": M + "2026_11_20_091902_create_rates_table.php", "areas": M + "2026_11_20_091911_create_areas_table.php",
       "vehicles": M + "2026_11_20_091915_create_vehicles_table.php", "parkings": M + "2026_11_20_091948_create_parkings_table.php",
       "activity_logs": M + "2026_11_20_092022_create_activity_logs_table.php", "users": M + "0001_01_01_000000_create_users_table.php"}
def K(tag, path, ket=None): return dict(jenis="kode", tag=tag, isi=GH + f"{tag}/{path}", ket=ket)
def KD(tag, folder, ket): return dict(jenis="kode", tag=tag, isi=TREE + f"{tag}/{folder}", ket=ket)
def C(cmd, tetap=False): return dict(jenis="cmd", isi=cmd, tetap=tetap)
def T(isi): return dict(jenis="teks", isi=isi)
def commit(p): return C(f'git add .   lalu   git commit -m "{p}"')

KETIK = {
 # Bab 1
 ("P01", 6, 0): C("laravel new siparkir --database=mysql --pest --no-boost"),
 ("P01", 8, 0): C("mysql -u root -p"),
 ("P01", 8, 1): C("CREATE DATABASE siparkir;"),
 ("P01", 8, 2): C("CREATE USER 'siparkir'@'localhost' IDENTIFIED BY 'gantiSandiIni!';"),
 ("P01", 8, 3): C("GRANT ALL ON siparkir.* TO 'siparkir'@'localhost';"),
 ("P01", 9, 2): T('.env:   DB_USERNAME=siparkir   dan   DB_PASSWORD="gantiSandiIni!"'),
 ("P01", 11, 4): T("config/app.php:   'timezone' => 'Asia/Jakarta',"),
 ("P01", 12, 0): C("php artisan migrate"),
 ("P01", 13, 0): C("php artisan serve"),
 ("P01", 14, 0): C('git init   lalu   git add .   lalu   git commit -m "Proyek Laravel baru"'),
 # Bab 4
 ("P04", 2, 1): K("bab-04", MIG["users"]),
 ("P04", 3, 1): C("php artisan make:model Rate -m"),
 ("P04", 4, 1): K("bab-04", MIG["rates"]),
 ("P04", 5, 0): K("bab-04", MIG["areas"]),
 ("P04", 5, 1): K("bab-04", MIG["vehicles"]),
 ("P04", 6, 1): K("bab-04", MIG["parkings"]),
 ("P04", 7, 0): K("bab-04", MIG["parkings"]),
 ("P04", 7, 2): K("bab-04", MIG["parkings"]),
 ("P04", 7, 5): K("bab-04", MIG["activity_logs"]),
 ("P04", 8, 1): C("php artisan migrate --pretend"),
 ("P04", 9, 1): K("bab-04", "app/Models/Parking.php"),
 ("P04", 10, 0): K("bab-04", "app/Models/Vehicle.php"),
 ("P04", 10, 2): KD("bab-04", "app/Models", "Rate.php, Area.php, ActivityLog.php"),
 ("P04", 11, 1): K("bab-04", "database/seeders/DatabaseSeeder.php"),
 ("P04", 12, 0): C("php artisan migrate:fresh --seed"),
 ("P04", 12, 2): C("mysql -u siparkir -p siparkir"),
 ("P04", 12, 3): C("SELECT type, first_hour, next_hour, daily_max FROM rates;   lalu   SELECT name, email, role FROM users;"),
 ("P04", 14, 1): commit("Tabel dan model"),
 # Bab 5
 ("P05", 2, 1): K("bab-05", "resources/views/layouts/app.blade.php"),
 ("P05", 3, 0): K("bab-05", "resources/views/auth/masuk.blade.php"),
 ("P05", 4, 0): C("php artisan make:controller AuthController"),
 ("P05", 4, 1): K("bab-05", "app/Http/Controllers/AuthController.php"),
 ("P05", 5, 2): K("bab-05", "app/Models/User.php"),
 ("P05", 6, 1): C("php artisan make:middleware Peran"),
 ("P05", 6, 2): K("bab-05", "app/Http/Middleware/Peran.php"),
 ("P05", 7, 0): K("bab-05", "bootstrap/app.php"),
 ("P05", 7, 3): K("bab-05", "routes/web.php"),
 ("P05", 8, 1): C("php artisan serve"),
 ("P05", 10, 1): commit("Login dan tiga peran"),
 # Bab 6
 ("P06", 2, 1): C("php artisan make:controller Admin/AreaController --resource"),
 ("P06", 2, 3): K("bab-06", "routes/web.php", "baris Route::resource('area', ...)"),
 ("P06", 2, 6): C("php artisan route:list"),
 ("P06", 2, 7): K("bab-06", "app/Http/Controllers/Admin/AreaController.php"),
 ("P06", 4, 2): K("bab-06", "resources/views/admin/area/form.blade.php"),
 ("P06", 5, 5): T(".env:   APP_LOCALE=id"),
 ("P06", 6, 4): K("bab-06", "routes/web.php"),
 ("P06", 7, 0): K("bab-06", "app/Models/Concerns/Tercatat.php"),
 ("P06", 8, 0): KD("bab-06", "app/Models", "Area, Vehicle, User, Rate: tambah use Tercatat;"),
 ("P06", 10, 1): commit("Halaman admin dan log aktivitas"),
 # Bab 7
 ("P07", 3, 0): C("php artisan make:test BiayaTest --unit"),
 ("P07", 3, 1): K("bab-07", "tests/Unit/BiayaTest.php", "bagian pertama"),
 ("P07", 4, 0): K("bab-07", "tests/Unit/BiayaTest.php", "test kedua"),
 ("P07", 4, 5): K("bab-07", "tests/Unit/BiayaTest.php", "test ketiga"),
 ("P07", 5, 0): C("php artisan test"),
 ("P07", 7, 1): C("php artisan test"),
 ("P07", 8, 0): K("bab-07", "app/Support/Biaya.php", "langkah 1"),
 ("P07", 9, 0): K("bab-07", "app/Support/Biaya.php"),
 ("P07", 10, 0): C("php artisan test"),
 ("P07", 10, 1): commit("Rumus tarif dan test"),
 # Bab 8
 ("P08", 2, 0): C("php artisan make:controller ParkingController"),
 ("P08", 2, 1): K("bab-08", "app/Http/Controllers/ParkingController.php", "fungsi index"),
 ("P08", 2, 4): K("bab-08", "app/Http/Controllers/ParkingController.php", "fungsi masuk"),
 ("P08", 5, 2): K("bab-08", "app/Http/Controllers/ParkingController.php", "lalu app/Models/Parking.php"),
 ("P08", 7, 1): K("bab-08", "routes/web.php"),
 ("P08", 8, 2): C("mysql -u siparkir -p siparkir"),
 ("P08", 8, 3): C("INSERT INTO parkings (vehicle_id, area_id, entry_user_id, entered_at, open) VALUES (1, 1, 2, NOW(), 1);"),
 ("P08", 12, 1): commit("Kendaraan masuk dan keluar"),
 # Bab 9
 ("P09", 2, 1): C("composer require bacon/bacon-qr-code", tetap=True),
 ("P09", 2, 4): K("bab-09", "app/Support/Qr.php"),
 ("P09", 3, 0): K("bab-09", "resources/views/layouts/cetak.blade.php"),
 ("P09", 4, 0): K("bab-09", "resources/views/parkir/tiket.blade.php"),
 ("P09", 4, 5): K("bab-09", "resources/views/parkir/struk.blade.php"),
 ("P09", 8, 1): commit("Tiket dan struk 58 mm"),
 # Bab 10
 ("P10", 2, 1): C("php artisan db:seed --class=ContohSeeder"),
 ("P10", 3, 0): C("php artisan make:controller RekapController"),
 ("P10", 3, 1): K("bab-10", "app/Http/Controllers/RekapController.php", "bagian pertama"),
 ("P10", 4, 0): K("bab-10", "app/Http/Controllers/RekapController.php", "total dan harian"),
 ("P10", 5, 0): K("bab-10", "app/Http/Controllers/RekapController.php", "daftar transaksi"),
 ("P10", 6, 1): K("bab-10", "routes/web.php"),
 ("P10", 7, 1): C("php artisan db:seed --class=BanyakSeeder", tetap=True),
 ("P10", 7, 2): C("mysql -u siparkir -p siparkir"),
 ("P10", 7, 3): C("EXPLAIN SELECT COUNT(*), SUM(fee) FROM parkings WHERE exited_at >= '2026-10-01' AND exited_at < '2026-11-01'\\G"),
 ("P10", 8, 0): C("EXPLAIN SELECT COUNT(*), SUM(fee) FROM parkings IGNORE INDEX (parkings_exited_at_index) WHERE ...\\G"),
 ("P10", 10, 0): C("SELECT COUNT(*), SUM(fee) FROM parkings WHERE exited_at BETWEEN '2026-10-01' AND '2026-10-31';"),
 ("P10", 10, 2): C("SELECT COUNT(*), SUM(fee) FROM parkings WHERE exited_at >= '2026-10-01' AND exited_at < '2026-11-01';"),
 ("P10", 10, 3): C("SELECT COUNT(*), SUM(fee) FROM parkings WHERE DATE(exited_at) = '2026-10-31';"),
 ("P10", 11, 0): commit("Rekap pendapatan untuk owner"),
 # Bab 11
 ("P11", 2, 2): K("bab-11", "tests/Pest.php"),
 ("P11", 2, 4): K("bab-11", "tests/Feature/PeranTest.php"),
 ("P11", 3, 5): K("bab-11", "tests/Feature/ParkirTest.php"),
 ("P11", 5, 0): C("php artisan test"),
 ("P11", 5, 3): T("routes/web.php:   hapus middleware('peran:admin') sebentar, nanti dikembalikan"),
 ("P11", 5, 4): C("php artisan test"),
 ("P11", 5, 6): T("routes/web.php dikembalikan seperti semula, lalu   php artisan test"),
 ("P11", 7, 1): commit("Feature test untuk peran dan transaksi"),
 # Bab 12
 ("P12", 3, 0): K("bab-12", "Dockerfile"),
 ("P12", 3, 4): K("bab-12", ".dockerignore"),
 ("P12", 4, 0): K("bab-12", "compose.yaml"),
 ("P12", 5, 0): commit("Docker Compose untuk server"),
}
