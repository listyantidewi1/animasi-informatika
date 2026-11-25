import sys, time, os, re, subprocess; sys.path.insert(0, "/home/user/lapor/alat")
from tulis import Bab, CACAT, P, sh, acuan, siapkan
siapkan("bab-05", "isi")
env = open(P + "/.env").read().replace("APP_LOCALE=id", "APP_LOCALE=en"); open(P + "/.env", "w").write(env)
subprocess.run(f"rm -rf {P}/lang", shell=True)
b = Bab("/home/user/lapor/L06/rek"); r = b.r
RC = "app/Http/Controllers/ReportController.php"; RW = "routes/web.php"; FT = "app/Support/Foto.php"
ac = acuan(RC)
def fn(nama):
    i = ac.index(f"    public function {nama}("); j = ac.find("    public function ", i + 10); return ac[i:(j if j > 0 else ac.rindex("}"))].rstrip() + "\n"
def kelas(uses, *badan): return "<?php\n\nnamespace App\\Http\\Controllers;\n\n" + "".join(f"use {u};\n" for u in sorted(uses)) + "\nclass ReportController extends Controller\n{\n" + "\n".join(badan) + "}\n"
VAL4 = """        $data = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|max:100',
            'location' => 'required|max:100',
            'description' => 'required|max:2000',
        ]);
"""
VAL5 = VAL4.replace("        ]);", "            'photo' => 'nullable|mimes:jpg,jpeg,png|max:4096',\n        ]);")
BUAT = """
        $report = new Report($data);
        $report->user_id = $request->user()->id;
%s        $report->save();

        return redirect()->route('laporan.show', $report)->with('pesan', 'Laporan terkirim.');
"""
FOTO = "        if ($request->hasFile('photo')) {\n            $report->photo = Foto::simpan($request->file('photo'));\n        }\n"
def store(isi): return "    public function store(Request $request)\n    {\n" + isi + "    }\n"
U0 = ["App\\Models\\Category", "Illuminate\\Http\\Request"]
show = fn("show").replace("        Gate::authorize('view', $report);\n", ""); foto = fn("foto").replace("        Gate::authorize('view', $report);\n", "")
C1 = kelas(["App\\Models\\Category"], fn("create"))
C2 = kelas(U0, fn("create"), store(VAL4))
C3 = kelas(U0 + ["App\\Models\\Report"], fn("create"), store(VAL4 + BUAT % ""))
C4 = kelas(U0 + ["App\\Models\\Report"], fn("create"), store(VAL5 + BUAT % ""))
C5 = kelas(U0 + ["App\\Models\\Report", "App\\Support\\Foto"], fn("create"), store(VAL5 + BUAT % FOTO))
U6 = U0 + ["App\\Models\\Report", "App\\Support\\Foto", "Illuminate\\Support\\Facades\\Storage"]
C6 = kelas(U6, fn("create"), store(VAL5 + BUAT % FOTO), foto)
C7 = kelas(U6 + ["Illuminate\\Support\\Facades\\DB"], fn("create"), fn("store"), foto)
C8 = kelas(U6 + ["Illuminate\\Support\\Facades\\DB"], fn("create"), fn("store"), show, foto)
rw = b.isi(RW)
RWA = rw.replace("use App\\Http\\Controllers\\AuthController;\n", "use App\\Http\\Controllers\\AuthController;\nuse App\\Http\\Controllers\\ReportController;\n").replace("    Route::view('/laporan', 'reports.index');\n",
    "    Route::view('/laporan', 'reports.index');\n    Route::get('/laporan/buat', [ReportController::class, 'create']);\n    Route::post('/laporan', [ReportController::class, 'store']);\n")
RWB = RWA.replace("'store']);\n", "'store']);\n    Route::get('/laporan/{report}/foto', [ReportController::class, 'foto'])->name('laporan.foto');\n")
RWC = RWB.replace("    Route::get('/laporan/{report}/foto'", "    Route::get('/laporan/{report}', [ReportController::class, 'show'])->name('laporan.show');\n    Route::get('/laporan/{report}/foto'")
sv = acuan("resources/views/reports/show.blade.php"); SHOW = sv[:sv.index("<h2>Riwayat</h2>")].rstrip() + "\n@endsection\n"

r.mulai(); r.kamera(None); time.sleep(0.8)
# b02 form
b.term(); r.tanda("b02"); b.jalan("php artisan make:controller ReportController", cps=18, tunggu=1.5, sampai="created")
r.kamera(None); r.tanda("b02_ctrl"); b.ubah(RC, C1, cps=22); time.sleep(0.5); b.sorot(RC, "Category::orderBy", "Daftar kategori dikirim ke halaman", 4.0, tanda="b02_kat")
VC = "resources/views/reports/create.blade.php"; r.tanda("b02_view"); b.ubah(VC, acuan(VC), cps=44); time.sleep(0.5)
b.sorot(VC, "@foreach", "Kategori tampil sebagai pilihan", 3.5, tanda="b02_pilih", n=3); b.sorot(VC, "@csrf", "@csrf, seperti biasa", 3.0, tanda="b02_csrf")
b.sorot(VC, "enctype", "enctype: supaya isi fotonya ikut terkirim", 8.0, tanda="b02_enctype"); r.tanda("b02_route"); b.ubah(RW, RWA, cps=28); time.sleep(1.2); r.tanda("b02_akhir")
# b03 validasi
r.tanda("b03"); b.ubah(RC, C2, cps=24); time.sleep(0.5); b.sorot(RC, "exists:categories,id", "Kategori harus ada di tabel categories", 4.0, tanda="b03_exists")
b.sorot(RC, "'title' => 'required|max:100'", "Judul wajib, paling panjang 100 karakter", 4.5, tanda="b03_title"); r.kamera(None)
b.salin("lang/id/validation.php", "Pesan error bahasa Indonesia: lang/id/validation.php, salin dari GitHub", 4.5); r.tanda("b03_env")
b.ubah(".env", open(P + "/.env").read().replace("APP_LOCALE=en", "APP_LOCALE=id"), cps=10); b.sorot(".env", "APP_LOCALE", "Bahasa aplikasi: id", 3.5, tanda="b03_locale"); b.taruh(".env.example", open(P + "/.env.example").read().replace("APP_LOCALE=en", "APP_LOCALE=id")); r.tanda("b03_akhir")
# b04 pemilik laporan
r.tanda("b04"); b.ubah(RC, C3, cps=24); time.sleep(0.5); b.sorot(RC, "$report->user_id", "Pemilik = orang yang sedang login, bukan isian form", 10.0, tanda="b04_user"); r.tanda("b04_akhir")
# b05 aturan foto
r.tanda("b05"); b.ubah(RC, C4, cps=18); time.sleep(0.4); b.sorot(RC, "mimes:jpg,jpeg,png", "Pengaman 1: isi berkas diperiksa, ukuran dibatasi 4 MB", 10.0, tanda="b05_mimes"); r.tanda("b05_akhir")
# b06 class Foto
r.tanda("b06"); b.ubah(FT, acuan(FT), cps=24); time.sleep(0.6); b.sorot(FT, "imagecreatefromstring", "Berkas dibaca sebagai gambar", 4.0, tanda="b06_baca")
b.sorot(FT, "imagescale", "Dikecilkan kalau terlalu lebar", 3.0, tanda="b06_kecil"); b.sorot(FT, "imagejpeg", "Pengaman 2: ditulis ulang sebagai JPEG baru", 5.0, tanda="b06_tulis")
b.sorot(FT, "Str::random(40)", "Pengaman 3: nama diganti 40 karakter acak", 6.0, tanda="b06_nama"); r.tanda("b06_pakai"); b.ubah(RC, C5, cps=24); b.sorot(RC, "Foto::simpan", "Dipakai di fungsi store", 3.5, n=1); r.tanda("b06_akhir")
# b08 Storage::put
b.sorot(FT, "Storage::put", "Disimpan di storage/app/private, di luar folder public", 7.0, tanda="b08"); r.tanda("b08_akhir")
# b09 route foto
r.tanda("b09"); b.ubah(RW, RWB, cps=24); b.sorot(RW, "/foto'", "Alamat khusus untuk foto", 4.5, tanda="b09_route"); r.tanda("b09_ctrl"); b.ubah(RC, C6, cps=24)
b.sorot(RC, "Storage::response", "Controller yang mengambil dan mengirim berkasnya", 5.0, tanda="b09_resp"); r.tanda("b09_akhir")
# b10 transaction
r.tanda("b10"); b.ubah(RC, C7, cps=24); time.sleep(0.5); b.sorot(RC, "$report->updates()->create", "Baris riwayat pertama: Laporan dibuat", 5.0, tanda="b10_riwayat", n=5)
b.sorot(RC, "DB::transaction", "Keduanya berhasil bersama, atau keduanya dibatalkan", 7.0, tanda="b10_trans"); r.tanda("b10_akhir")
# b11 halaman detail + daftar
VS_ = "resources/views/reports/show.blade.php"; r.tanda("b11"); b.ubah(VS_, SHOW, cps=48); time.sleep(0.5); b.lihat(VS_, "<article", jeda=1.5)
r.tanda("b11_ctrl"); b.ubah(RC, C8, cps=28); time.sleep(0.5); b.sorot(RC, "public function show", "Fungsi show: ambil laporan, tampilkan halamannya", 4.0, n=6)
r.tanda("b11_route"); b.ubah(RW, RWC, cps=28); time.sleep(0.5); b.lihat(RW, "Route::middleware('auth')", jeda=3.0); r.tanda("b11_akhir")
# b14 commit
b.term(); b.commit("Form laporan dan upload foto", tanda="b14_commit"); time.sleep(1.0); r.tanda("b14_commit_akhir")
r.selesai(); print("CACAT", CACAT)
sh("git tag -f bab-06"); print(sh("git status --short; git log --oneline | head -3").stdout)
