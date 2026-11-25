import sys, time, os, re, subprocess; sys.path.insert(0, "/home/user/lapor/alat")
from tulis import Bab, CACAT, P, sh, acuan, siapkan
siapkan("bab-08", "isi")
b = Bab("/home/user/lapor/L09/rek"); r = b.r
TF = "tests/Feature/LaporanTest.php"; RC = "app/Http/Controllers/ReportController.php"
t = acuan(TF)
def uji(nama):
    i = t.index(f"    public function {nama}("); j = t.find("    public function ", i + 10); return t[i:(j if j > 0 else t.rindex("}"))].rstrip() + "\n"
kepala = t[:t.index("    public function test_tamu")]
T1 = kepala + uji("test_siswa_tidak_bisa_membuka_laporan_siswa_lain") + "}\n"
T2 = kepala + uji("test_siswa_tidak_bisa_membuka_laporan_siswa_lain") + "\n" + uji("test_status_selesai_tidak_bisa_kembali_ke_baru") + "\n" + uji("test_berkas_bukan_gambar_ditolak") + "}\n"
T1 = T1.replace("use Illuminate\\Http\\UploadedFile;\nuse Illuminate\\Support\\Facades\\Storage;\n", "")
rc = b.isi(RC); RUSAK = rc.replace("        Gate::authorize('view', $report);\n        $report->load", "        $report->load"); assert RUSAK != rc
for nm, c in [("T1", T1), ("T2", T2)]:
    open("/tmp/claude-0/c.php", "w").write(c); print(nm, subprocess.run(["php", "-l", "/tmp/claude-0/c.php"], capture_output=True, text=True).stdout.strip())
if "--cek" in sys.argv: sys.exit()
subprocess.run(f"rm -f {P}/tests/Feature/ExampleTest.php {P}/tests/Unit/ExampleTest.php", shell=True)

r.mulai(); r.kamera(None); time.sleep(0.8)
# b03 test privasi
r.tanda("b03"); b.ubah(TF, T1, cps=40); time.sleep(0.5); b.sorot(TF, "public function test_siswa_tidak_bisa_membuka", "Test pertama: menjaga privasi", 3.5, tanda="b03_nama")
b.sorot(TF, "$milikLina = $this->laporan", "Buat laporan milik Lina", 3.5, tanda="b03_lina"); b.sorot(TF, "actingAs($this->dimas)", "Menjadi Dimas, membuka laporan itu: harus forbidden", 7.0, tanda="b03_dimas")
b.sorot(TF, "use RefreshDatabase;", "Setiap test mulai dari database yang bersih", 5.0, tanda="b03_refresh"); r.kamera(None)
b.lihat("phpunit.xml", "DB_DATABASE", jeda=0.5); b.sorot("phpunit.xml", "DB_DATABASE", "Database test: terpisah, hanya di memori", 6.0, tanda="b03_memori", n=1); r.tanda("b03_akhir")
# b04 dua test lagi + lima dari GitHub
r.tanda("b04"); b.ubah(TF, T2, cps=44); time.sleep(0.5); b.sorot(TF, "public function test_status_selesai", "Test kedua: selesai tidak bisa kembali menjadi baru", 5.0, tanda="b04_status", n=10)
b.sorot(TF, "public function test_berkas_bukan_gambar", "Test ketiga: berkas PHP harus ditolak", 4.5, tanda="b04_upload", n=10); r.kamera(None)
b.salin(TF, "Lima test lain: salin LaporanTest.php dari GitHub", 4.5)
b.besar(); r.tanda("b04_jalan"); b.jalan("php artisan test", cps=14, tunggu=2.0, sampai="Duration", label="Semuanya hijau", dur=5.0, maks=180); time.sleep(1.5); r.tanda("b04_akhir"); b.kecil()
# b05 rusak lalu perbaiki
r.kamera(None); r.tanda("b05"); b.ubah(RC, RUSAK, cps=14); r.label("Baris Gate::authorize terhapus", 3.5); time.sleep(3.5)
b.besar(); r.tanda("b05_merah"); b.jalan("php artisan test", cps=14, tunggu=2.0, sampai="Duration", label="Merah: test privasi gagal", dur=6.0, maks=180); time.sleep(2.0); r.tanda("b05_merah_akhir"); b.kecil()
r.kamera(None); r.tanda("b05_balik"); b.ubah(RC, rc, cps=14); time.sleep(1.0)
b.besar(); r.tanda("b05_hijau"); b.jalan("php artisan test", cps=14, tunggu=2.0, sampai="Duration", label="Hijau lagi", dur=4.0, maks=180); time.sleep(1.0); r.tanda("b05_hijau_akhir"); b.kecil()
b.term(); b.commit("Test otomatis", tanda="b05_commit"); time.sleep(1.0); r.tanda("b05_commit_akhir")
r.selesai(); print("CACAT", CACAT)
sh("git tag -f bab-09"); print(sh("git status --short; git log --oneline | head -3").stdout)
