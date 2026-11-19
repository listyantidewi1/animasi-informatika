import os, sys; sys.path.insert(0, os.path.dirname(__file__)); import web_umum as W
KODE = "H06"; NAMA = "Cara_Membuat_Proyek_Laravel_Pertama"
JUDUL = "Cara membuat proyek<br><b>Laravel</b> pertamamu"
LANGKAH = ["Cek", "Buat", "Jalankan", "Buka"]
VIDEO = "Membangun Aplikasi Laravel dari Nol: Lapor Sarana Sekolah"
PATH_EXTRA = ":/opt/siswa-bin"
EXTRA_CSS = W.CSS + "#web iframe{position:absolute;left:0;top:56px;width:508px;height:482px;border:0;background:#fff;transform:scale(2);transform-origin:0 0}"
EXTRA_HTML = W.HTML; EXTRA_JS = W.JS
LAFAL = [("Laravel", "Lárafel"), ("Herd", "Herd"), ("composer", "kompouser"), ("Composer", "Kompouser"), ("php artisan serve", "pe ha pe artisan serf"), ("PHP", "pe ha pe"), ("-v", "minus vi"), ("composer -V", "kompouser minus vi besar"), ("-V", "minus vi besar")]
BEATS = [
 ("kait", "Ingin mulai belajar Laravel? Begini cara membuat proyek pertamamu dan membukanya di browser.", None),
 ("herd", "Kalau kamu memakai Windows atau Mac, cara termudah adalah memasang Laravel Herd. Herd sudah berisi PHP dan Composer.", None),
 ("cek", "Pertama, pastikan PHP dan Composer sudah ada. Ketik `php -v` lalu `composer -V`.", "Pertama, pastikan pe ha pe dan kompouser sudah ada. Ketik, pe ha pe minus vi, lalu, kompouser minus vi besar."),
 ("buat", "Kedua, buat proyek baru dengan `composer create-project laravel/laravel`, diikuti nama folder proyekmu.", "Kedua, buat proyek baru dengan, kompouser kriet project, lárafel garis miring lárafel, diikuti nama folder proyekmu."),
 ("tunggu", "Composer akan mengunduh semua yang dibutuhkan, lalu menyiapkan database. Tunggu sampai muncul tulisan DONE di baris terakhir.", "Kompouser akan mengunduh semua yang dibutuhkan, lalu menyiapkan database. Tunggu sampai muncul tulisan, Don, di baris terakhir."),
 ("serve", "Ketiga, masuk ke folder proyek, lalu jalankan `php artisan serve`. Laravel akan memberi alamat server lokal.", None),
 ("buka", "Keempat, buka alamat itu di browser. Kalau halaman sambutan Laravel muncul, proyekmu sudah berjalan.", None),
 ("ajak", "Mau membangun aplikasi Laravel yang lengkap sampai online? Tonton video lengkapnya.", None),
]
async def ADEGAN(r):
    await r.beat(0, pad=0.5)
    async def a1():
        await r.tidur(0.4); await r.kartu("Windows dan Mac", "Unduh Laravel Herd di herd.laravel.com\nlalu pasang. PHP dan Composer\nsudah ikut terpasang.")
    await r.beat(1, a1, pad=1.4)
    await r.kartu(None); await r.langkah(1)
    async def a2():
        await r.tidur(1.6); await r.ketik("php -v"); await r.enter(); await r.tunggu("Zend"); await r.sorot("PHP 8", 1, True)
        await r.tidur(1.0); await r.ketik("composer -V"); await r.enter(); await r.tunggu("Composer version"); await r.sorot("Composer version", 1, True)
    await r.beat(2, a2, pad=1.2)
    await r.lepas(); await r.langkah(2); await r.bersih()
    async def a3():
        await r.tidur(1.5); await r.ketik("composer create-project laravel/laravel sekolahku", cps=18); await r.enter()
    await r.beat(3, a3, pad=0.4)
    async def a4():
        await r.tunggu("create_jobs_table", maks=400); await r.tidur(0.6); await r.sorot("Running migrations", 7, True)
    await r.beat(4, a4, pad=1.2)
    await r.lepas(); await r.langkah(3); await r.bersih()
    async def a5():
        await r.ketik("cd sekolahku"); await r.enter(); await r.tidur(0.5)
        await r.ketik("php artisan serve"); await r.enter(); await r.tunggu("127.0.0.1:8000"); await r.tidur(0.4); await r.sorot("http://127.0.0.1:8000", 1)
    await r.beat(5, a5, pad=1.4)
    await r.lepas(); await r.langkah(4)
    await r.js("a=>hal(...a)", ["127.0.0.1:8000", '<iframe src="http://127.0.0.1:8000"></iframe>']); await r.tidur(1.2)
    await r.js("web(true)")
    async def a6():
        await r.tidur(0.8); await r.sorot_el("#url", 6)
    await r.beat(6, a6, pad=1.4)
    await r.lepas()
    async def a7():
        await r.tidur(0.5); await r.akhir(VIDEO)
    await r.beat(7, a7, pad=1.8)
