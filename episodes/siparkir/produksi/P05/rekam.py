import sys, time, os; sys.path.insert(0, "/home/user/parkir/alat")
from tulis import Bab, CACAT, P, sh, acuan, siapkan, banding
T = "bab-05"
siapkan("bab-04", "seed")
b = Bab("/home/user/parkir/P05/rek"); r = b.r
r.mulai(); r.kamera(None); time.sleep(0.8)
# b02 gaya.css (salin) + layout
G = "public/css/gaya.css"; b.salin(G, tag=T); r.tanda("b02_css"); b.lihat(G, jeda=1.0); r.label("gaya.css: sudah disalin ke public/css", 4.0); time.sleep(4.5)
LY = "resources/views/layouts/app.blade.php"; r.tanda("b02_layout"); b.ubah(LY, acuan(LY, T), cps=30); time.sleep(0.6)
b.sorot(LY, "@yield('isi')", "Tempat setiap halaman menaruh isinya", 6.5, tanda="b02_yield"); r.tanda("b02_akhir")
# b03 halaman masuk
MS = "resources/views/auth/masuk.blade.php"; r.kamera(None); r.tanda("b03"); b.ubah(MS, acuan(MS, T), cps=26); time.sleep(0.6)
b.sorot(MS, 'method="POST"', "Dikirim dengan POST ke /masuk", 5.5, tanda="b03_post")
b.sorot(MS, "@csrf", "Kode rahasia dari Laravel untuk setiap form", 10.5, tanda="b03_csrf"); r.tanda("b03_akhir")
# b04 AuthController
b.term(); r.tanda("b04"); b.jalan("php artisan make:controller AuthController", cps=16, tunggu=1.5, sampai="created successfully", label="Controller untuk masuk dan keluar", dur=3.0)
AC = "app/Http/Controllers/AuthController.php"; r.kamera(None); r.tanda("b04_ketik"); b.lihat(AC, jeda=0.8); b.ubah(AC, acuan(AC, T), cps=26); time.sleep(0.6)
b.sorot(AC, "$request->validate([", "Email dan kata sandi harus terisi", 5.5, tanda="b04_valid", n=4)
b.sorot(AC, "Auth::attempt($data)", "Cari pengguna, cocokkan kata sandi dengan hash", 9.0, tanda="b04_attempt")
b.sorot(AC, "withErrors", "Satu pesan yang sama untuk dua kesalahan", 12.5, tanda="b04_pesan"); r.tanda("b04_akhir")
# b05 regenerate + beranda
b.sorot(AC, "session()->regenerate()", "Nomor sesi diganti tepat setelah login", 13.0, tanda="b05_regen")
b.sorot(AC, "redirect()->intended('/')", "Arahkan ke beranda", 3.5, tanda="b05_arah")
MU = "app/Models/User.php"; r.kamera(None); r.tanda("b05_user"); b.lihat(MU, "'password' => 'hashed'", jeda=0.8); b.ubah(MU, acuan(MU, T), cps=24); time.sleep(0.5)
b.sorot(MU, "return match ($this->role)", "Beranda berbeda untuk tiap peran", 8.5, tanda="b05_match", n=5); r.tanda("b05_akhir")
# b06 middleware Peran
b.term(); r.tanda("b06"); b.jalan("php artisan make:middleware Peran", cps=16, tunggu=1.5, sampai="created successfully", label="Berkas baru di app/Http/Middleware", dur=3.0)
MP = "app/Http/Middleware/Peran.php"; r.kamera(None); r.tanda("b06_ketik"); b.lihat(MP, "public function handle", jeda=1.0); b.ubah(MP, acuan(MP, T), cps=14); time.sleep(0.6)
b.sorot(MP, "abort_unless", "Peran tidak ada dalam daftar? Hentikan: 403", 8.0, tanda="b06_abort")
b.sorot(MP, "string ...$peran", "Tiga titik: boleh lebih dari satu peran", 7.5, tanda="b06_titik"); r.tanda("b06_akhir")
# b07 alias + routes
BA = "bootstrap/app.php"; r.kamera(None); r.tanda("b07"); b.lihat(BA, "withMiddleware", jeda=0.8); b.ubah(BA, acuan(BA, T), cps=16); time.sleep(0.5)
b.sorot(BA, "alias(['peran'", "Nama pendeknya: peran", 4.5, tanda="b07_alias")
for v in ["resources/views/parkir/index.blade.php", "resources/views/admin/index.blade.php", "resources/views/rekap/index.blade.php"]: b.salin(v, tag=T)   # tiga halaman sementara
RW = "routes/web.php"; r.kamera(None); r.tanda("b07_routes"); b.lihat(RW, jeda=1.0); r.tanda("b07_ketik"); b.ubah(RW, acuan(RW, T), cps=28); time.sleep(0.6)
b.sorot(RW, "throttle:5,1", "Halaman masuk: lima percobaan per menit", 6.0, tanda="b07_throttle")
b.sorot(RW, "Route::middleware('auth')", "Semua halaman lain: harus login", 6.0, tanda="b07_auth")
b.sorot(RW, "peran:petugas", "Halaman parkir: hanya petugas", 3.6, tanda="b07_petugas")
b.sorot(RW, "peran:admin", "Halaman /admin/…: hanya admin", 4.2, tanda="b07_admin")
b.sorot(RW, "peran:owner", "Halaman rekap: hanya owner", 3.8, tanda="b07_owner"); r.tanda("b07_akhir")
# b08 serve
b.term(); r.tanda("b08"); time.sleep(0.8); r.tanda("b08_cmd"); b.jalan("php artisan serve", cps=16, tunggu=1.5, sampai="Server running", label="Buka localhost:8000 di browser", dur=3.5); r.tanda("b08_akhir")
time.sleep(0.5); r.tekan("Control+c", 1.5)
# b10 commit
b.term(); b.commit("Login dan tiga peran", "b10_commit"); time.sleep(1.0); r.tanda("b10_commit_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
sh("git tag -f bab-05"); print("CACAT", CACAT); banding(T); print(sh("git status --short | head; git log --oneline | head -3").stdout)
