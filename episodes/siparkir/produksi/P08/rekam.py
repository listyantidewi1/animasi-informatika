import sys, time, os, subprocess; sys.path.insert(0, "/home/user/parkir/alat")
from tulis import Bab, CACAT, P, sh, acuan, siapkan, banding
T = "bab-08"
def my(q): return subprocess.run(["mysql", "siparkir", "-e", q], capture_output=True, text=True)
siapkan("bab-07", "seed")
b = Bab("/home/user/parkir/P08/rek"); r = b.r
PC = "app/Http/Controllers/ParkingController.php"; penuh = acuan(PC, T)
iS = penuh.index("    public function store("); iW = penuh.index("    public function show(")
A1 = penuh[:iS].rstrip() + "\n}\n"; A2 = penuh[:iW].rstrip() + "\n}\n"
r.mulai(); r.kamera(None); time.sleep(0.8)
# b02 controller + index
b.term(); r.tanda("b02"); b.jalan("php artisan make:controller ParkingController", cps=16, tunggu=1.5, sampai="created successfully")
r.kamera(None); r.tanda("b02_ketik"); b.lihat(PC, jeda=0.6); b.ubah(PC, A1, cps=28); time.sleep(0.6)
b.sorot(PC, "return view('parkir.index'", "Dua hal: daftar area dan kendaraan yang sedang parkir", 11.0, tanda="b02_dua", n=4)
b.sorot(PC, "withCount(['parkings as terisi'", "terisi: jumlah transaksi yang masih open", 8.5, tanda="b02_count"); r.tanda("b02_akhir")
# b03 store: validasi, rapikan, transaction
r.kamera(None); r.tanda("b03"); b.editor(); b.ubah(PC, A2, cps=32); time.sleep(0.6)
b.sorot(PC, "$data = $request->validate([", "Validasi dulu", 3.5, tanda="b03_rapi", n=4)
b.sorot(PC, "$plat = Vehicle::rapikan", "Plat dirapikan: fungsi dari bab 4", 6.0, tanda="b03_plat")
b.sorot(PC, "DB::transaction(function ()", "Semua langkah di dalamnya berhasil bersama, atau batal bersama", 14.0, tanda="b03_trans"); r.tanda("b03_akhir")
# b04 firstOrCreate, area, lockForUpdate
b.sorot(PC, "Vehicle::firstOrCreate", "Cari kendaraannya; kalau belum ada, buat", 10.0, tanda="b04_first")
b.sorot(PC, "Area::where('type', $vehicle->type)", "Area yang sejenis dan masih punya tempat", 5.0, tanda="b04_area", n=2)
r.tanda("b04_kunci"); r.label("lockForUpdate: baris area dikunci sampai transaction selesai", 6.5); time.sleep(6.5); r.tanda("b04_akhir")
# b05 periksa ganda, lalu buat transaksi
b.sorot(PC, "$vehicle->parkings()->where('open', true)->exists()", "Masih di dalam? Petugas mendapat pesan yang jelas", 14.5, tanda="b05_cek", n=3)
b.sorot(PC, "return Parking::create([", "Jam masuk dari now(): jam server saat itu", 8.5, tanda="b05_buat", n=6); r.tanda("b05_akhir")
# b06 keluar: sisa controller + model
r.kamera(None); r.tanda("b06"); b.editor(); b.ubah(PC, penuh, cps=34); time.sleep(0.5)
MP = "app/Models/Parking.php"; b.lihat(MP, jeda=0.5); b.ubah(MP, acuan(MP, T), cps=34); time.sleep(0.5)
b.sorot(PC, "public function formKeluar", "formKeluar: rincian dan biaya saat ini", 11.0, tanda="b06_form", n=6)
b.sorot(PC, "public function keluar(", "keluar: yang benar-benar menyimpan", 3.5, tanda="b06_keluar")
b.sorot(PC, "// Jam keluar dan biaya ditentukan server", "Biaya dihitung lagi oleh server, saat tombol ditekan", 7.0, tanda="b06_server", n=3)
b.sorot(PC, "$parking->exited_at = now()", "Jam keluar, biaya, petugas; open dikosongkan", 6.5, tanda="b06_simpan", n=4)
b.sorot(MP, "public function biaya(", "Meneruskan ke class Biaya yang sudah lulus test", 8.0, tanda="b06_model", n=6); r.tanda("b06_akhir")
# b07 tampilan (salin) + route
for v in ["index", "tiket", "keluar", "struk"]: b.salin(f"resources/views/parkir/{v}.blade.php", tag=T)
r.kamera(None); r.tanda("b07"); b.lihat("resources/views/parkir/index.blade.php", jeda=0.8); r.label("Tampilan: salin dari github.com/listyantidewi1/SiParkir", 4.5); time.sleep(4.5)
RW = "routes/web.php"; r.tanda("b07_routes"); b.lihat(RW, "Route::view('/parkir'", jeda=0.6); b.ubah(RW, acuan(RW, T), cps=32); time.sleep(0.5)
b.sorot(RW, "Route::get('/parkir', [ParkingController::class, 'index'])", "Semua alamat parkir di dalam kelompok petugas", 3.5, tanda="b07_rsorot", n=7); r.tanda("b07_akhir")
# b08 bukti di MySQL: baris kedua ditolak aturan unik (di luar kamera: satu motor sedang di dalam)
print(my("INSERT INTO vehicles (id, plate, type, created_at, updated_at) VALUES (1, 'N1234AB', 'motor', NOW(), NOW()); INSERT INTO parkings (id, vehicle_id, area_id, entry_user_id, entered_at, open, created_at, updated_at) VALUES (1, 1, 1, 2, NOW(), 1, NOW(), NOW());").stderr)
b.besar(); r.tanda("b08_mysql"); b.mysql(); r.tanda("b08_ketik")
b.sql(["INSERT INTO parkings (vehicle_id, area_id, entry_user_id, entered_at, open)", "VALUES (1, 1, 2, NOW(), 1);"], tunggu=1.5, cps=22); r.tanda("b08_error")
r.label("ERROR 1062: Duplicate entry", 4.0); time.sleep(4.2); r.label("Aturan unik di database menolak baris kedua", 6.0); time.sleep(6.3); r.tanda("b08_akhir")
b.sql("exit", tunggu=1.0); b.kecil()
print(my("SET FOREIGN_KEY_CHECKS=0; TRUNCATE parkings; TRUNCATE vehicles; TRUNCATE activity_logs; SET FOREIGN_KEY_CHECKS=1;").stderr)
# b12 commit
b.term(); b.commit("Kendaraan masuk dan keluar", "b12_commit"); time.sleep(1.0); r.tanda("b12_commit_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
sh("git tag -f bab-08"); print("CACAT", CACAT); banding(T); print(sh("git status --short | head; git log --oneline | head -3").stdout)
