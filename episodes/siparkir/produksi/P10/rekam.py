import sys, time, os, subprocess; sys.path.insert(0, "/home/user/parkir/alat")
from tulis import Bab, CACAT, P, sh, acuan, siapkan, banding
T = "bab-10"
siapkan("bab-09", "seed")
b = Bab("/home/user/parkir/P10/rek"); r = b.r
def prompt(maks=120):
    t0 = time.time()
    while time.time() - t0 < maks:
        L = [x for x in b.layar().split("\n") if x.strip()]
        if L and L[-1].rstrip().endswith("$"): return True
        time.sleep(0.5)
    print("PERINGATAN: prompt tidak kembali", flush=True)
RC = "app/Http/Controllers/RekapController.php"; penuh = acuan(RC, T); B = penuh.split("\n")
iT = next(i for i, x in enumerate(B) if "'total' =>" in x); iH = next(i for i, x in enumerate(B) if "'harian' =>" in x); iX = next(i for i, x in enumerate(B) if "'transaksi' =>" in x)
A1 = "\n".join(B[:iT] + B[iX + 1:]); A2 = "\n".join(B[:iX] + B[iX + 1:])
r.mulai(); r.kamera(None); time.sleep(0.8)
# b02 ContohSeeder
CS = "database/seeders/ContohSeeder.php"; b.salin(CS, tag=T); r.tanda("b02"); b.lihat(CS, jeda=1.0); r.label("ContohSeeder: salin dari github.com/listyantidewi1/SiParkir", 5.0); time.sleep(5.0)
b.term(); r.tanda("b02_cmd"); b.jalan("php artisan db:seed --class=ContohSeeder", cps=16, tunggu=0.5, sampai="Seeding"); prompt(); time.sleep(0.8)
r.tanda("b02_isi"); r.label("Sekitar 2.400 transaksi tiruan, 1 Oktober sampai 19 November", 6.5); time.sleep(6.5)
b.sorot(CS, "mt_srand(2026)", "Acak, tetapi selalu sama setiap kali dijalankan", 8.5, tanda="b02_srand"); r.tanda("b02_akhir")
# b03 RekapController: validasi dan batas waktu
b.term(); r.tanda("b03"); b.jalan("php artisan make:controller RekapController", cps=16, tunggu=1.5, sampai="created successfully")
r.kamera(None); r.tanda("b03_ketik"); b.lihat(RC, jeda=0.6); b.ubah(RC, A1, cps=28); time.sleep(0.6)
b.sorot(RC, "$data = $request->validate([", "Tanggal dari dan sampai divalidasi dulu", 3.8, tanda="b03_valid", n=4)
b.sorot(RC, "$selesai = Parking::where('exited_at', '>=', $dari)", "Dari awal tanggal pertama, sampai SEBELUM awal hari berikutnya", 15.0, tanda="b03_batas"); r.tanda("b03_akhir")
# b04 total dan per hari
r.kamera(None); r.tanda("b04"); b.editor(); b.ubah(RC, A2, cps=30); time.sleep(0.6)
b.sorot(RC, "'total' =>", "COUNT dan SUM dihitung MySQL; PHP hanya menerima satu baris", 18.0, tanda="b04_total")
b.sorot(RC, "'harian' =>", "Per hari: cara yang sama, ditambah GROUP BY tanggal", 6.5, tanda="b04_harian", n=4); r.tanda("b04_akhir")
# b05 daftar transaksi: paginate dan with
r.kamera(None); r.tanda("b05"); b.editor(); b.ubah(RC, penuh, cps=26); time.sleep(0.6)
b.sorot(RC, "'transaksi' =>", "paginate(20): dua puluh baris per halaman", 5.0, tanda="b05_pag")
r.tanda("b05_with"); r.label("with('vehicle', 'area'): plat dan nama area diambil sekaligus", 8.0); time.sleep(8.0); r.tanda("b05_akhir")
# b06 tampilan (salin) dan route
RV = "resources/views/rekap/index.blade.php"; b.salin(RV, tag=T); r.kamera(None); r.tanda("b06"); b.lihat(RV, jeda=0.8); r.label("Tampilan rekap: salin dari github.com/listyantidewi1/SiParkir", 4.0); time.sleep(4.0)
RW = "routes/web.php"; r.tanda("b06_routes"); b.lihat(RW, "Route::view('/rekap'", jeda=0.6); b.ubah(RW, acuan(RW, T), cps=24); time.sleep(0.5)
b.sorot(RW, "Route::get('/rekap', [RekapController::class, 'index'])", "Route rekap diarahkan ke controller", 3.0); r.tanda("b06_akhir")
# b07 BanyakSeeder + EXPLAIN
BS = "database/seeders/BanyakSeeder.php"; b.salin(BS, tag=T); r.kamera(None); r.tanda("b07"); b.lihat(BS, jeda=0.8); r.label("BanyakSeeder: 200.000 transaksi dari dua tahun sebelumnya", 4.0); time.sleep(4.0)
b.besar(); r.tanda("b07_seed"); b.jalan("php artisan db:seed --class=BanyakSeeder", cps=16, tunggu=0.5, sampai="Seeding"); prompt(240); time.sleep(1.0)
r.tanda("b07_mysql"); b.mysql()
Q = "WHERE exited_at >= '2026-10-01' AND exited_at < '2026-11-01'"
r.tanda("b07_ketik"); b.sql(["EXPLAIN SELECT COUNT(*), SUM(fee) FROM parkings", Q + "\\G"], tunggu=1.5, cps=24)
r.tanda("b07_hasil"); r.label("EXPLAIN: MySQL menceritakan rencananya", 3.5); time.sleep(3.8)
r.label("key: index pada jam keluar dipakai", 6.0); time.sleep(6.2); r.label("rows: hanya sekitar 1.500 baris yang dibaca", 6.0); time.sleep(6.5); r.tanda("b07_akhir")
# b08 IGNORE INDEX
r.tekan("Control+l", 0.5); r.tanda("b08"); b.sql(["EXPLAIN SELECT COUNT(*), SUM(fee) FROM parkings IGNORE INDEX (parkings_exited_at_index)", Q + "\\G"], tunggu=1.5, cps=24)
r.tanda("b08_hasil"); r.label("type: ALL, rows: dua ratus ribu lebih", 6.5); time.sleep(6.8); r.label("Seluruh tabel dibaca hanya untuk menemukan satu bulan", 9.0); time.sleep(9.5); r.tanda("b08_akhir")
# b10 bukti BETWEEN
r.tekan("Control+l", 0.5); r.tanda("b10"); b.sql(["SELECT COUNT(*), SUM(fee) FROM parkings", "WHERE exited_at BETWEEN '2026-10-01' AND '2026-10-31';"], tunggu=1.2, cps=24)
r.tanda("b10_between"); r.label("Query AI dengan BETWEEN: 1.470 kendaraan", 5.0); time.sleep(5.3)
r.tanda("b10_kita"); b.sql(["SELECT COUNT(*), SUM(fee) FROM parkings", Q + ";"], "Query kita: 1.500 kendaraan", 4.0, tunggu=1.2, cps=30)
r.tanda("b10_30"); b.sql("SELECT COUNT(*), SUM(fee) FROM parkings WHERE DATE(exited_at) = '2026-10-31';", "Yang hilang: 30 kendaraan pada tanggal 31, Rp177.000", 7.0, tunggu=1.2, cps=30); r.tanda("b10_akhir")
b.sql("exit", tunggu=1.0); b.kecil()
# b11 commit
b.term(); b.commit("Rekap pendapatan untuk owner", "b11_commit"); time.sleep(1.0); r.tanda("b11_commit_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
sh("git tag -f bab-10"); print("CACAT", CACAT); banding(T); print(sh("git status --short | head; git log --oneline | head -3").stdout)
