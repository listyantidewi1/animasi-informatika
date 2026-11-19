import sys, time, os, re, subprocess; sys.path.insert(0, "/home/user/lapor/alat")
from tulis import Bab, CACAT, P, sh, acuan, siapkan
siapkan("bab-07", "isi")
b = Bab("/home/user/lapor/L08/rek"); r = b.r
RC = "app/Http/Controllers/ReportController.php"; RW = "routes/web.php"; VI = "resources/views/reports/index.blade.php"; VS_ = "resources/views/reports/show.blade.php"
PL = "app/Policies/ReportPolicy.php"; CSS = "public/css/gaya.css"; LY = "resources/views/layouts/app.blade.php"
rcA = acuan(RC); rc = b.isi(RC); i = rcA.index("    public function index"); j = rcA.index("    public function create"); IDX = rcA[i:j]
RC1 = rc.replace("    public function create", IDX + "    public function create", 1)
G = "use Illuminate\\Support\\Facades\\Gate;\n"; RC2 = rcA.replace(G, "").replace("        Gate::authorize('view', $report);\n", "").replace("        Gate::authorize('view', Report::findOrFail($update->report_id));\n", "")
assert RC1 == RC2, "RC1 beda dari acuan tanpa Gate"
rw = b.isi(RW); RW1 = rw.replace("    Route::view('/laporan', 'reports.index');\n", "    Route::get('/laporan', [ReportController::class, 'index']);\n"); assert RW1 != rw
assert RW1 == acuan(RW), "route akhir beda dari acuan"
css = b.isi(CSS); CSS1 = css.replace(".riwayat p { margin: 6px 0 0; }", ".riwayat p { margin: 6px 0 0; white-space: pre-line; }"); assert CSS1 == acuan(CSS)
if "--cek" in sys.argv: sys.exit()

r.mulai(); r.kamera(None); time.sleep(0.8)
# b02 daftar laporan siswa
r.tanda("b02"); b.ubah(RC, RC1, cps=24); time.sleep(0.5); b.sorot(RC, "$request->user()->reports()", "Berangkat dari pengguna yang login: pasti hanya miliknya", 10.0, tanda="b02_sorot"); r.tanda("b02_akhir")
# b03 halaman daftar
r.tanda("b03"); b.ubah(VI, acuan(VI), cps=52); time.sleep(0.5); b.sorot(VI, '<a class="kartu laporan"', "Setiap laporan menjadi kartu", 6.0, tanda="b03_kartu", n=5)
b.sorot(VI, "@empty", "Kalau kosong: kalimat ajakan", 4.5, tanda="b03_kosong", n=2); r.tanda("b03_route"); b.ubah(RW, RW1, cps=26); time.sleep(1.5); r.tanda("b03_akhir")
# b05 policy
b.term(); r.tanda("b05"); b.jalan("php artisan make:policy ReportPolicy", cps=18, tunggu=1.5, sampai="created", label="Policy: bolehkah pengguna ini melakukan ini?", dur=3.0)
r.kamera(None); r.tanda("b05_ketik"); b.ubah(PL, acuan(PL), cps=22); time.sleep(0.5); b.sorot(PL, "return $user->id", "Boleh kalau pemiliknya, atau admin", 8.0, tanda="b05_sorot"); r.tanda("b05_akhir")
# b06 Gate::authorize
r.tanda("b06"); b.ubah(RC, rcA, cps=24); time.sleep(0.5); b.sorot(RC, "Gate::authorize('view', $report);", "Di awal fungsi show", 4.5, tanda="b06_show", ke=1)
b.sorot(RC, "Gate::authorize('view', $report);", "Juga di fungsi foto", 3.5, tanda="b06_foto", ke=2); b.sorot(RC, "Gate::authorize('view', Report::findOrFail", "Dan foto riwayat", 3.5, tanda="b06_fr"); r.tanda("b06_akhir")
# b07 dua kurung kurawal
b.sorot(VS_, "<h1>{{ $report->title }}</h1>", "{{ }} mengubah karakter khusus HTML menjadi teks biasa", 8.0, tanda="b07"); r.tanda("b07_akhir")
# b08 serve untuk HP
b.term(); r.tanda("b08"); b.jalan("php artisan serve --host 0.0.0.0", cps=16, tunggu=2.0, sampai="Server running", label="--host 0.0.0.0: bisa dibuka dari perangkat lain di WiFi yang sama", dur=5.0); time.sleep(1.0); r.tanda("b08_akhir")
r.tekan("Control+c", 1.0); r.tekan("Control+l", 0.3)
# b09 viewport dan CSS
b.sorot(LY, 'name="viewport"', "meta viewport: lebar halaman mengikuti layar", 4.5, tanda="b09_meta"); b.sorot(CSS, "max-width", "Satu kolom dengan lebar maksimal", 5.0, tanda="b09_css"); r.tanda("b09_akhir")
# b11 perbaikan yang benar + commit
r.tanda("b11"); b.ubah(CSS, CSS1, cps=14); b.sorot(CSS, "pre-line", "Baris baru diatur lewat CSS, {{ }} tetap dipakai", 5.0, tanda="b11_css"); r.tanda("b11_akhir")
b.term(); b.commit("Halaman siswa dan policy", tanda="b11_commit"); time.sleep(1.0); r.tanda("b11_commit_akhir")
r.selesai(); print("CACAT", CACAT)
sh("git tag -f bab-08"); print(sh("git status --short; git log --oneline | head -3").stdout)
