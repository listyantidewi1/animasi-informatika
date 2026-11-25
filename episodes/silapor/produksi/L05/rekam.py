import sys, time, os; sys.path.insert(0, "/home/user/lapor/alat")
from tulis import Bab, CACAT, P, sh, acuan, siapkan
siapkan("bab-04", "isi")
b = Bab("/home/user/lapor/L05/rek"); r = b.r
AC = "app/Http/Controllers/AuthController.php"; RW = "routes/web.php"; LY = "resources/views/layouts/app.blade.php"
ac = acuan(AC); i1 = ac.index("    public function formDaftar"); i2 = ac.index("    public function keluar")
AC1 = ac[:i1].rstrip() + "\n}\n"; AC2 = ac[:i2].rstrip() + "\n}\n"
KEPALA = "<?php\n\nuse App\\Http\\Controllers\\AuthController;\nuse Illuminate\\Support\\Facades\\Route;\n\n"
M1 = "Route::get('/masuk', [AuthController::class, 'formMasuk'])->name('login');\nRoute::post('/masuk', [AuthController::class, 'masuk']);\n"
D1 = "Route::get('/daftar', [AuthController::class, 'formDaftar']);\nRoute::post('/daftar', [AuthController::class, 'daftar']);\n"
B1 = "\nRoute::get('/', fn () => redirect('/laporan'));\nRoute::view('/laporan', 'reports.index');\n"
K1 = "Route::post('/keluar', [AuthController::class, 'keluar']);\n"
R1 = KEPALA + M1 + B1
R2 = KEPALA + M1 + D1 + B1
R3 = R2 + K1
def ind(s): return "".join(("    " + x if x.strip() else x) for x in s.splitlines(True))
def grup(throttle, admin):
    m = M1.replace("'masuk']);", "'masuk'])->middleware('throttle:5,1');") if throttle else M1
    dalam = ("Route::get('/', fn () => redirect(auth()->user()->isAdmin() ? '/kelola' : '/laporan'));\n" if admin else "Route::get('/', fn () => redirect('/laporan'));\n") + K1 + "\nRoute::view('/laporan', 'reports.index');\n"
    if admin: dalam += "\nRoute::middleware(Admin::class)->group(function () {\n    Route::view('/kelola', 'admin.index');\n});\n"
    kep = KEPALA.replace("use Illuminate", "use App\\Http\\Middleware\\Admin;\nuse Illuminate") if admin else KEPALA
    return kep + "Route::middleware('guest')->group(function () {\n" + ind(m + D1) + "});\n\nRoute::middleware('auth')->group(function () {\n" + ind(dalam) + "});\n"
R4, R5, R6 = grup(False, False), grup(False, True), grup(True, True)
SEM = "@extends('layouts.app')\n@section('judul', '%s')\n@section('isi')\n<div class=\"kartu\">\n    <h1>%s</h1>\n    <p class=\"redup\">Halaman ini kita isi di bab berikutnya.</p>\n</div>\n@endsection\n"

r.mulai(); r.kamera(None); time.sleep(0.8)
# b02 hash di tabel users
b.besar(); b.mysql(); r.tanda("b02"); b.sql("SELECT name, password FROM users;", "Yang tersimpan adalah hash, bukan kata sandinya", 5.0, tunggu=1.5)
r.label("Kata sandi Lina dan Dimas sama, hash-nya berbeda", 5.0); time.sleep(6.0); r.tanda("b02_akhir"); b.sql("exit", tunggu=1.0); b.kecil()
# b03 gaya.css + layout
r.kamera(None); r.tanda("b03"); b.salin("public/css/gaya.css", "gaya.css: salin dari GitHub ke public/css", 4.5)
r.tanda("b03_layout"); b.ubah(LY, acuan(LY), cps=34); time.sleep(0.6); b.lihat(LY, "<header", jeda=2.0)
b.sorot(LY, "@yield('isi')", "Tempat setiap halaman menaruh isinya", 5.0, tanda="b03_yield"); r.tanda("b03_akhir")
# b04 halaman masuk
VM = "resources/views/auth/masuk.blade.php"; r.tanda("b04"); b.ubah(VM, acuan(VM), cps=26); time.sleep(0.6)
b.sorot(VM, 'method="POST"', "Form dikirim dengan POST", 3.5, tanda="b04_post"); b.sorot(VM, "@csrf", "Kode rahasia, supaya situs lain tidak bisa mengirim form ini", 9.0, tanda="b04_csrf"); r.tanda("b04_akhir")
# b05 AuthController: masuk
b.term(); r.tanda("b05"); b.jalan("php artisan make:controller AuthController", cps=18, tunggu=1.5, sampai="created", label="Controller baru", dur=2.5)
r.kamera(None); r.tanda("b05_ketik"); b.ubah(AC, AC1, cps=26); time.sleep(0.6)
b.sorot(AC, "$request->validate", "Validasi input", 3.5, tanda="b05_valid", n=4); b.sorot(AC, "Auth::attempt", "Cari email, cocokkan kata sandi dengan hash", 6.0, tanda="b05_attempt")
b.sorot(AC, "withErrors", "Satu pesan untuk dua kesalahan", 9.0, tanda="b05_pesan"); r.tanda("b05_akhir")
# b06 regenerate
b.sorot(AC, "regenerate", "Nomor sesi diganti tepat setelah login", 6.0, tanda="b06"); r.tanda("b06_akhir")
# b07 route
r.kamera(None); r.tanda("b07"); b.taruh("resources/views/reports/index.blade.php", SEM % ("Laporan saya", "Laporan saya"), "Halaman sementara: reports/index.blade.php", 3.0)
r.tanda("b07_route"); b.ubah(RW, R1, cps=24); time.sleep(0.5); b.sorot(RW, "Route::get('/masuk'", "Alamat /masuk: tampilkan form, lalu terima kirimannya", 5.0, tanda="b07_sorot", n=2); r.tanda("b07_akhir")
# b08 daftar
VD = "resources/views/auth/daftar.blade.php"; r.tanda("b08"); b.ubah(VD, acuan(VD), cps=44); time.sleep(0.5); b.lihat(VD, "<h1>", jeda=2.0)
r.tanda("b08_ctrl"); b.ubah(AC, AC2, cps=28); time.sleep(0.5)
b.sorot(AC, "'name' => 'required|max:60'", "Nama, kelas, email unik, kata sandi dua kali", 8.0, tanda="b08_valid", n=4); b.sorot(AC, "User::create", "Akun dibuat, lalu langsung login", 4.0, tanda="b08_create")
MU = "app/Models/User.php"; b.sorot(MU, "#[Fillable", "role tidak ada di daftar ini", 11.0, tanda="b08_fill")
r.tanda("b08_route"); b.ubah(RW, R2, cps=28); time.sleep(1.5); r.tanda("b08_akhir")
# b09 keluar
r.tanda("b09"); b.ubah(AC, ac, cps=28); time.sleep(0.5); b.sorot(AC, "Auth::logout", "Keluar: sesi dihapus", 3.0, tanda="b09_logout", n=3)
b.ubah(RW, R3, cps=28); b.sorot(RW, "'/keluar'", "Keluar memakai POST", 3.5, tanda="b09_route")
b.sorot(LY, 'action="/keluar"', "Tombol Keluar adalah form POST, bukan tautan", 8.0, tanda="b09_form", n=5); r.tanda("b09_akhir")
# b10 middleware auth
r.tanda("b10"); b.ubah(RW, R4, cps=24); time.sleep(0.6); b.sorot(RW, "middleware('auth')", "Harus login dulu", 6.0, tanda="b10_auth")
b.sorot(RW, "middleware('guest')", "Hanya untuk yang belum login", 4.0, tanda="b10_guest"); r.tanda("b10_akhir")
# b11 middleware Admin
b.term(); r.tanda("b11"); b.jalan("php artisan make:middleware Admin", cps=18, tunggu=1.5, sampai="created", label="Middleware buatan sendiri", dur=2.5)
MA = "app/Http/Middleware/Admin.php"; r.kamera(None); r.tanda("b11_ketik"); b.ubah(MA, acuan(MA), cps=20); time.sleep(0.5)
b.sorot(MA, "abort_unless", "Bukan admin? Jawab 403", 5.5, tanda="b11_abort")
r.kamera(None); b.taruh("resources/views/admin/index.blade.php", SEM % ("Kelola", "Kelola laporan"), "Halaman sementara: admin/index.blade.php", 3.0)
r.tanda("b11_route"); b.ubah(RW, R5, cps=24); time.sleep(0.5); b.sorot(RW, "middleware(Admin::class)", "Halaman kelola dijaga middleware Admin", 4.5, tanda="b11_grup", n=3); r.tanda("b11_akhir")
# b12 throttle
r.tanda("b12"); b.ubah(RW, R6, cps=18); time.sleep(0.4); b.sorot(RW, "throttle:5,1", "Paling banyak 5 percobaan per menit", 6.0, tanda="b12_sorot"); r.tanda("b12_akhir")
# b14 commit
b.term(); b.commit("Login dan peran", tanda="b14_commit"); time.sleep(1.0); r.tanda("b14_commit_akhir")
r.selesai(); print("CACAT", CACAT)
sh("git tag -f bab-05"); print(sh("git status --short; git log --oneline | head -3").stdout)
