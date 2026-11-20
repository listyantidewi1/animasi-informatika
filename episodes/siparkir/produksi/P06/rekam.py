import sys, time, os; sys.path.insert(0, "/home/user/parkir/alat")
from tulis import Bab, CACAT, P, sh, acuan, siapkan, banding
T = "bab-06"
siapkan("bab-05", "seed")
b = Bab("/home/user/parkir/P06/rek"); r = b.r
C = "app/Http/Controllers/Admin/"; V = "resources/views/admin/"
r.mulai(); r.kamera(None); time.sleep(0.8)
# b02 make:controller --resource, Route::resource, route:list
b.term(); r.tanda("b02"); time.sleep(0.8); r.tanda("b02_cmd")
b.jalan("php artisan make:controller Admin/AreaController --resource", cps=13, tunggu=1.5, sampai="created successfully", label="Berkas baru di app/Http/Controllers/Admin", dur=3.0)
AC = C + "AreaController.php"; r.kamera(None); r.tanda("b02_tujuh"); b.lihat(AC, "public function index", jeda=1.0); r.label("Tujuh fungsi kosong: index, create, store, show, edit, update, destroy", 5.5); time.sleep(5.5)
RW = "routes/web.php"; r.tanda("b02_routes"); rw = b.isi(RW)
sasaran = rw.replace("Route::view('/area', 'admin.index');", "Route::resource('area', AreaController::class)->except('show');").replace("use App\\Http\\Controllers\\AuthController;", "use App\\Http\\Controllers\\Admin\\AreaController;\nuse App\\Http\\Controllers\\AuthController;")
assert sasaran != rw
b.lihat(RW, "Route::view('/area'", jeda=1.0); b.ubah(RW, sasaran, cps=16); time.sleep(0.4); sh("rm -f resources/views/admin/index.blade.php")
b.sorot(RW, "Route::resource('area'", "Satu baris mendaftarkan semua alamat area", 5.0, tanda="b02_resource")
r.tanda("b02_except"); r.label("except('show'): tanpa halaman detail", 5.0); time.sleep(5.0)
b.besar(); r.tanda("b02_list"); b.jalan("php artisan route:list", cps=14, tunggu=1.5, sampai="Showing", label="Enam alamat admin/area, dari satu baris", dur=5.0); time.sleep(0.8); r.tanda("b02_akhir"); b.kecil()
# b03 isi AreaController
r.kamera(None); r.tanda("b03"); b.lihat(AC, jeda=0.6); b.ubah(AC, acuan(AC, T), cps=32); time.sleep(0.6)
b.sorot(AC, "public function index()", "index: ambil semua area, kirim ke tampilan", 5.5, tanda="b03_index", n=4)
b.sorot(AC, "public function store(", "store: menerima kiriman form", 5.5, tanda="b03_store", n=6)
b.sorot(AC, "private function periksa", "Aturan validasi ditulis satu kali di sini", 4.5, tanda="b03_periksa", n=8)
b.sorot(AC, "'name' => 'required|max:40'", "Nama wajib, jenis motor atau mobil, kapasitas 1 sampai 1000", 9.0, tanda="b03_aturan", n=3)
b.sorot(AC, "return $request->validate([", "Tidak lolos? Kembali ke form beserta pesannya", 7.5, tanda="b03_gagal")
b.sorot(AC, "Area::create($this->periksa($request))", "Yang disimpan hanya hasil validasi", 6.5, tanda="b03_simpan"); r.tanda("b03_akhir")
# b04 update dan destroy
b.sorot(AC, "public function update(Request $request, Area $area)", "Laravel mencarikan barisnya dari angka di alamat", 12.5, tanda="b04_update")
b.sorot(AC, "$area->parkings()->exists()", "Area yang sudah punya transaksi tidak bisa dihapus", 9.5, tanda="b04_hapus", n=3); r.tanda("b04_akhir")
# b05 tampilan: form diketik, daftar disalin
FM = V + "area/form.blade.php"; IX = V + "area/index.blade.php"
r.kamera(None); r.tanda("b05_form"); b.ubah(FM, acuan(FM, T), cps=32); time.sleep(0.6); r.tanda("b05_form_akhir")
b.salin(IX, tag=T); r.tanda("b05"); b.lihat(IX, jeda=1.0); r.label("index.blade.php: daftar area", 3.0); time.sleep(3.5)
b.sorot(FM, "old('name'", "old(): isian yang sudah diketik tidak hilang", 8.5, tanda="b05_old")
LY = "resources/views/layouts/app.blade.php"; b.sorot(LY, "@if ($errors->any())", "Layout: daftar pesan kesalahan di atas halaman", 7.0, tanda="b05_err", n=7); r.tanda("b05_err_akhir")
L = "lang/id/validation.php"; r.kamera(None); b.salin(L, tag=T); b.salin(".env.example", tag=T); r.tanda("b05_lang"); b.lihat(L, jeda=1.0); r.label("lang/id: salin dari github.com/listyantidewi1/SiParkir", 5.5); time.sleep(5.5)
r.tanda("b05_env"); env = b.isi(".env"); b.lihat(".env", "APP_LOCALE=", jeda=0.6); b.ubah(".env", env.replace("APP_LOCALE=en", "APP_LOCALE=id"), cps=10)
b.sorot(".env", "APP_LOCALE=", "Bahasa aplikasi: id", 4.0, tanda="b05_locale"); r.tanda("b05_akhir")
# b06 tiga halaman lain: disalin; baca UserController
for f in [C + "RateController.php", C + "VehicleController.php", C + "UserController.php", C + "LogController.php", V + "tarif/index.blade.php", V + "tarif/form.blade.php", V + "kendaraan/index.blade.php", V + "kendaraan/form.blade.php",
          V + "pengguna/index.blade.php", V + "pengguna/form.blade.php", V + "log.blade.php", "resources/views/halaman.blade.php"]: b.salin(f, tag=T)
UC = C + "UserController.php"; r.kamera(None); r.tanda("b06_uc"); b.lihat(UC, "public function update", jeda=2.5)
b.sorot(UC, "$user->fill($data)", "fill() hanya mengisi kolom yang ada di Fillable", 6.5, tanda="b06_fill")
b.sorot(UC, "$user->role = $data['role']", "role diisi di baris tersendiri", 4.5, tanda="b06_role", ke=2)
b.sorot(UC, "Rule::in(self::PERAN)", "Sudah dipastikan: salah satu dari tiga peran", 5.0, tanda="b06_in"); r.tanda("b06_uc_akhir")
r.kamera(None); r.tanda("b06_routes"); b.lihat(RW, "Route::resource('area'", jeda=0.6); b.ubah(RW, acuan(RW, T), cps=34); r.label("routes/web.php: tarif, kendaraan, pengguna, dan log", 6.0); time.sleep(6.0); r.tanda("b06_akhir")
# b07 trait Tercatat
TR = "app/Models/Concerns/Tercatat.php"; r.kamera(None); r.tanda("b07"); b.ubah(TR, acuan(TR, T), cps=24); time.sleep(0.6)
b.sorot(TR, "$kata = [", "Tiga kejadian: created, updated, deleted", 9.0, tanda="b07_tiga")
b.sorot(TR, "ActivityLog::catat", "Satu baris log: siapa pelakunya, data mana yang berubah", 10.5, tanda="b07_catat"); r.tanda("b07_akhir")
# b08 tempelkan ke empat model
r.kamera(None); r.tanda("b08")
for m in ["Area", "Vehicle", "User", "Rate"]:
    f = f"app/Models/{m}.php"; b.lihat(f, jeda=0.4); b.ubah(f, acuan(f, T), cps=34); time.sleep(0.5)
b.sorot("app/Models/Rate.php", "use Tercatat;", "Satu baris use di setiap model", 3.5, tanda="b08_use"); r.tanda("b08_akhir")
# b10 commit
b.term(); b.commit("Halaman admin dan log aktivitas", "b10_commit"); time.sleep(1.0); r.tanda("b10_commit_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
sh("git tag -f bab-06"); print("CACAT", CACAT); banding(T); print(sh("git status --short | head; git log --oneline | head -3").stdout)
