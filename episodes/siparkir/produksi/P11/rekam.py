import sys, time, os; sys.path.insert(0, "/home/user/parkir/alat")
from tulis import Bab, CACAT, P, sh, acuan, siapkan, banding
T = "bab-11"
siapkan("bab-10", "seed")
b = Bab("/home/user/parkir/P11/rek"); r = b.r
r.mulai(); r.kamera(None); time.sleep(0.8)
# b02 phpunit.xml dan Pest.php
PX = "phpunit.xml"; r.tanda("b02"); b.lihat(PX, jeda=2.0)
b.sorot(PX, 'name="DB_CONNECTION"', "Selama test: SQLite di dalam memori, hilang setelah selesai", 12.0, tanda="b02_xml", n=2)
PP = "tests/Pest.php"; r.kamera(None); r.tanda("b02_pest"); b.lihat(PP, "RefreshDatabase::class)", jeda=1.2); b.ubah(PP, acuan(PP, T), cps=10); time.sleep(0.4)
b.sorot(PP, "->use(RefreshDatabase::class)", "Setiap test mulai dari tabel yang bersih", 6.5, tanda="b02_use"); r.tanda("b02_akhir")
# b03 PeranTest
PT = "tests/Feature/PeranTest.php"; r.kamera(None); r.tanda("b03"); b.ubah(PT, acuan(PT, T), cps=34); time.sleep(0.6)
r.tanda("b03_atas"); b.lihat(PT, "beforeEach", jeda=2.2)
b.sorot(PT, "beforeEach(function () {", "Sebelum setiap test: seeder, lalu satu pengguna tiap peran", 7.0, tanda="b03_before", n=6)
b.sorot(PT, "$this->actingAs($this->petugas)->get($alamat)->assertForbidden()", "actingAs: test bertindak sebagai petugas", 4.5, tanda="b03_acting")
r.label("assertForbidden: jawabannya harus 403", 7.0); time.sleep(7.0)
b.sorot(PT, "})->with(['/admin/area'", "Test yang sama diulang untuk lima halaman admin", 6.0, tanda="b03_with")
b.sorot(PT, "test('tamu diarahkan ke halaman masuk'", "Tamu dialihkan ke halaman masuk", 4.5, tanda="b03_lain", n=3)
b.sorot(PT, "test('owner hanya bisa melihat rekap'", "Owner hanya bisa membuka rekap", 4.5, n=5); r.tanda("b03_akhir")
# b04 ParkirTest
KT = "tests/Feature/ParkirTest.php"; r.kamera(None); r.tanda("b04"); b.ubah(KT, acuan(KT, T), cps=36); time.sleep(0.6)
r.tanda("b04_atas"); b.sorot(KT, "test('biaya dihitung server dari jam masuk, bukan dari form'", "Satu kendaraan, dari masuk sampai keluar", 4.0, n=9, zoom=1.25)
b.sorot(KT, "$this->travelTo('2026-11-02 07:00')", "Jam diatur ke 07.00, lalu petugas mengirim plat", 8.0, tanda="b04_masuk", n=2)
b.sorot(KT, "$this->travelTo('2026-11-02 09:20')", "Pukul 09.20 keluar, sambil mengirim biaya 0", 11.0, tanda="b04_keluar", n=2)
b.sorot(KT, "expect(Parking::first())->fee->toBe(4000)", "Yang tersimpan tetap 4000, dan open menjadi NULL", 7.5, tanda="b04_harap")
b.sorot(KT, "test('kendaraan yang sama tidak bisa masuk dua kali'", "Masuk dua kali: ditolak", 4.5, tanda="b04_lain", n=6)
b.sorot(KT, "test('area yang penuh menolak kendaraan baru'", "Area penuh: ditolak", 4.5, n=8); r.tanda("b04_akhir")
# b05 test hijau, rusak, merah, pulih
b.besar(); r.tanda("b05"); b.jalan("php artisan test", cps=14, tunggu=1.5, sampai="Duration", maks=180); r.tanda("b05_hijau"); r.label("27 test, semuanya hijau", 5.0); time.sleep(5.5); b.kecil()
RW = "routes/web.php"; asli = b.isi(RW); rusak = asli.replace("Route::middleware('peran:admin')->prefix('admin')", "Route::prefix('admin')"); assert rusak != asli
r.kamera(None); r.tanda("b05_rute"); b.sorot(RW, "Route::middleware('peran:admin')->prefix('admin')", "Penjaga halaman admin", 4.5)
r.tanda("b05_hapus"); b.ubah(RW, rusak, cps=12); r.label("peran:admin terhapus, seolah-olah tidak sengaja", 5.0); time.sleep(5.0)
b.besar(); r.tanda("b05_test2"); b.jalan("php artisan test", cps=16, tunggu=1.5, sampai="Duration", maks=180); r.tanda("b05_merah"); r.label("Merah: petugas bisa membuka halaman admin", 7.0); time.sleep(7.5); b.kecil()
r.kamera(None); r.tanda("b05_pulih"); b.lihat(RW, "Route::prefix('admin')", jeda=0.6); b.ubah(RW, asli, cps=14); time.sleep(0.5)
b.besar(); b.jalan("php artisan test", cps=18, tunggu=1.5, sampai="Duration", maks=180); r.label("Baris dikembalikan: hijau lagi", 4.0); time.sleep(4.5); r.tanda("b05_akhir"); b.kecil()
# b07 commit
b.term(); b.commit("Feature test untuk peran dan transaksi", "b07_commit"); time.sleep(1.0); r.tanda("b07_commit_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
sh("git tag -f bab-11"); print("CACAT", CACAT); banding(T); print(sh("git status --short | head; git log --oneline | head -3").stdout)
