import sys, time, os, re, subprocess; sys.path.insert(0, "/home/user/lapor/alat")
from tulis import Bab, CACAT, P, sh, acuan, siapkan
siapkan("bab-06", "isi")
b = Bab("/home/user/lapor/L07/rek"); r = b.r
KC = "app/Http/Controllers/Admin/ReportController.php"; RC = "app/Http/Controllers/ReportController.php"; RW = "routes/web.php"; MR = "app/Models/Report.php"
VI = "resources/views/admin/index.blade.php"; VS_ = "resources/views/reports/show.blade.php"
ac = acuan(KC)
def kelas(uses, *badan): return "<?php\n\nnamespace App\\Http\\Controllers\\Admin;\n\n" + "".join(f"use {u};\n" for u in sorted(uses)) + "\nclass ReportController extends Controller\n{\n" + "\n".join(badan) + "}\n"
i = ac.index("    public function index"); j = ac.index("    public function tanggapi"); INDEX = ac[i:j].rstrip() + "\n"; TANGGAPI = ac[j:ac.rindex("}")].rstrip() + "\n"
IDX1 = "    public function index()\n    {\n        return view('admin.index', [\n            'reports' => Report::with('user', 'category')->latest()->paginate(10),\n        ]);\n    }\n"
IDX2 = INDEX.replace("            'rekap' => Report::selectRaw('status, count(*) as jumlah')->groupBy('status')->pluck('jumlah', 'status'),\n", "")
t1 = TANGGAPI.index("        DB::transaction"); t2 = TANGGAPI.index("        return back()->with('pesan'")
TG1 = TANGGAPI[:t1] + TANGGAPI[t2:]
UA = ["App\\Http\\Controllers\\Controller", "App\\Models\\Report"]
UB = UA + ["App\\Models\\Category", "App\\Models\\User", "Illuminate\\Http\\Request", "Illuminate\\Support\\Carbon", "Illuminate\\Validation\\Rule"]
K1 = kelas(UA, IDX1); K2 = kelas(UB, IDX2); K3 = kelas(UB, INDEX); K4 = kelas(UB, INDEX, TG1); K5 = ac
assert K5 == kelas(UB + ["App\\Support\\Foto", "Illuminate\\Support\\Facades\\DB"], INDEX, TANGGAPI)
vi = acuan(VI); a1 = vi.index('<div class="rekap">'); a2 = vi.index('<form class="kartu saring">'); VI1 = vi[:a1] + vi[a2:]
rc = b.isi(RC); rcA = acuan(RC); k = rcA.index("    public function fotoRiwayat"); FR = rcA[k:rcA.rindex("}")].rstrip().replace("        Gate::authorize('view', Report::findOrFail($update->report_id));\n", "") + "\n"
RC2 = rc[:rc.rindex("}")].rstrip() + "\n\n" + FR + "}\n"; RC2 = RC2.replace("use App\\Models\\Report;\n", "use App\\Models\\Report;\nuse App\\Models\\ReportUpdate;\n")
rw = b.isi(RW)
RW1 = rw.replace("use App\\Http\\Controllers\\AuthController;\n", "use App\\Http\\Controllers\\Admin\\ReportController as KelolaController;\nuse App\\Http\\Controllers\\AuthController;\n").replace("        Route::view('/kelola', 'admin.index');\n", "        Route::get('/kelola', [KelolaController::class, 'index']);\n")
RW2 = RW1.replace("->name('laporan.foto');\n", "->name('laporan.foto');\n    Route::get('/riwayat/{update}/foto', [ReportController::class, 'fotoRiwayat'])->name('riwayat.foto');\n").replace("'index']);\n    });", "'index']);\n        Route::post('/kelola/{report}/tanggapan', [KelolaController::class, 'tanggapi'])->name('kelola.tanggapi');\n    });")
assert RW1 != rw and RW2 != RW1 and "tanggapi" in RW2 and "riwayat.foto" in RW2
for nm, c in [("K1", K1), ("K2", K2), ("K4", K4), ("RC2", RC2)]:
    open("/tmp/claude-0/c.php", "w").write(c); print(nm, subprocess.run(["php", "-l", "/tmp/claude-0/c.php"], capture_output=True, text=True).stdout.strip())
if "--cek" in sys.argv: sys.exit()

r.mulai(); r.kamera(None); time.sleep(0.8)
# b02 daftar: with
b.term(); r.tanda("b02"); b.jalan("php artisan make:controller Admin/ReportController", cps=18, tunggu=1.5, sampai="created", label="Controller di folder Admin", dur=2.5)
r.kamera(None); r.tanda("b02_ketik"); b.ubah(KC, K1, cps=22); time.sleep(0.5); b.sorot(KC, "Report::with", "with('user', 'category')", 5.0, tanda="b02_with"); r.tanda("b02_akhir")
# b03 paginate
b.sorot(KC, "paginate(10)", "paginate(10): sepuluh baris per halaman", 5.0, tanda="b03"); r.tanda("b03_akhir")
# b04 saringan
r.tanda("b04"); b.ubah(KC, K2, cps=30); time.sleep(0.5); b.sorot(KC, "$f = $request->validate", "Input saringan juga divalidasi", 5.0, tanda="b04_valid", n=7)
b.sorot(KC, "if (! empty($f['kategori']))", "Setiap saringan yang diisi menambah satu where", 5.0, tanda="b04_where", n=3)
b.sorot(KC, "if (! empty($f['bulan']))", "Awal bulan itu sampai sebelum awal bulan berikutnya", 7.0, tanda="b04_bulan", n=4); r.tanda("b04_akhir")
# b05 halaman
r.tanda("b05"); b.ubah(VI, VI1, cps=52); time.sleep(0.5); b.sorot(VI, '<form class="kartu saring">', "Form tanpa method berarti GET: saringan terlihat di alamat", 6.0, tanda="b05_form")
r.kamera(None); b.salin("resources/views/halaman.blade.php", "Tautan halaman: halaman.blade.php, salin dari GitHub", 4.0)
r.tanda("b05_route"); b.ubah(RW, RW1, cps=26); time.sleep(0.5); b.sorot(RW, "'/kelola'", "Alamat /kelola sekarang ke controller", 3.5, tanda="b05_rsorot"); r.tanda("b05_akhir")
# b06 rekap
r.tanda("b06"); b.ubah(KC, K3, cps=22); b.sorot(KC, "selectRaw", "GROUP BY status, seperti di bab empat", 5.0, tanda="b06_query")
r.tanda("b06_view"); b.ubah(VI, vi, cps=30); b.sorot(VI, '<div class="rekap">', "Rekap di bagian atas halaman", 4.0, tanda="b06_div", n=5); r.tanda("b06_akhir")
# b07 ALUR
r.tanda("b07"); b.ubah(MR, acuan(MR), cps=22); time.sleep(0.5); b.sorot(MR, "const ALUR", "Status yang boleh dituju dari setiap status", 4.0, tanda="b07_alur", n=6)
b.sorot(MR, "'baru' =>", "Dari baru: ke diproses atau ditolak", 3.5, tanda="b07_baru"); b.sorot(MR, "'diproses' =>", "Dari diproses: ke selesai", 3.0, tanda="b07_proses")
b.sorot(MR, "'selesai' =>", "Dari selesai dan ditolak: tidak ke mana-mana", 4.0, tanda="b07_selesai", n=2); b.sorot(MR, "in_array", "bolehKe: apakah tujuan ada di daftar?", 5.0, tanda="b07_boleh"); r.tanda("b07_akhir")
# b08 tanggapi
r.tanda("b08"); b.ubah(KC, K4, cps=30); time.sleep(0.5); b.sorot(KC, "public function tanggapi", "Validasi dulu", 3.0, tanda="b08_valid", n=7)
b.sorot(KC, "bolehKe($data['status'])", "Tetap, atau maju lewat langkah yang sah", 8.0, tanda="b08_alur", n=3, ke=1); b.sorot(KC, "'note' => 'required|max:1000'", "Catatan wajib: setiap perubahan punya alasan", 6.0, tanda="b08_note"); r.tanda("b08_akhir")
# b09 transaksi
r.tanda("b09"); b.ubah(KC, K5, cps=30); time.sleep(0.5); b.sorot(KC, "DB::transaction", "Riwayat ditambah dan status diubah, dalam satu kesatuan", 9.0, tanda="b09_trans", n=10); r.tanda("b09_akhir")
# b10 halaman detail lengkap
r.tanda("b10"); b.ubah(VS_, acuan(VS_), cps=56); time.sleep(0.5); b.sorot(VS_, "<h2>Riwayat</h2>", "Daftar riwayat", 3.0, tanda="b10_riwayat", n=3)
b.sorot(VS_, "@if (auth()->user()->isAdmin())", "Form tanggapan hanya untuk admin", 4.0, tanda="b10_admin"); b.sorot(VS_, "Report::ALUR[$report->status]", "Pilihan status diambil dari ALUR", 5.0, tanda="b10_alur", n=3)
r.tanda("b10_ctrl"); b.ubah(RC, RC2, cps=30); b.ubah(RW, RW2, cps=30); time.sleep(0.5); b.sorot(RW, "kelola.tanggapi", "Alamat untuk tanggapan dan foto riwayat", 4.0, tanda="b10_route"); r.tanda("b10_akhir")
# b13 commit
b.term(); b.commit("Halaman petugas", tanda="b13_commit"); time.sleep(1.0); r.tanda("b13_commit_akhir")
r.selesai(); print("CACAT", CACAT)
sh("git tag -f bab-07"); print(sh("git status --short; git log --oneline | head -3").stdout)
