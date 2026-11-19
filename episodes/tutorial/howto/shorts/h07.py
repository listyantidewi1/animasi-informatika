KODE = "H07"; NAMA = "Cara_Mengisi_File_env"
JUDUL = "Cara mengisi berkas<br><b>.env</b> dengan benar"
LANGKAH = ["Salin", "Isi", "Aturan", "Aman"]
VIDEO = "Membangun Aplikasi dari Nol: Sistem Antrean Bengkel"
LAFAL = [(".env.example", "dot env dot eksampel"), (".gitignore", "dot git ignor"), ("cat .env", "ket dot env"), ("cp", "si pi"), ("GitHub", "Git Hab"), ("git status", "git stetus")]
SIAPKAN = r"""git config --global user.name "Sinta Ayu" && git config --global user.email "sinta@mail.id" && git config --global init.defaultBranch main && mkdir -p ~/antrean && cd ~/antrean && printf '# Pengaturan aplikasi antrean\nPORT=3000\nDB_HOST=localhost\nDB_PORT=5432\nDB_NAME=antrean\nDB_USER=postgres\nDB_PASSWORD=\nAPP_NAME="Antrean Bengkel"\n' > .env.example && printf 'node_modules/\n.env\n' > .gitignore && printf 'console.log("halo")\n' > app.js && git init -q && git add . && git commit -qm "Proyek awal" """
BEATS = [
 ("kait", "Aplikasimu gagal terhubung ke database? Sering kali masalahnya ada di berkas .env. Begini cara mengisinya dengan benar.", None),
 ("salin", "Pertama, jangan mengubah .env.example. Salin dulu menjadi .env dengan perintah `cp`. Di Windows, pakai perintah `copy`.", None),
 ("isi", "Kedua, buka .env, lalu isi password database sesuai pengaturan di komputermu.", None),
 ("aturan", "Perhatikan aturannya. Jangan ada spasi di sekitar tanda sama dengan, dan nilai yang mengandung spasi diberi tanda kutip.", None),
 ("simpan", "Simpan berkasnya, lalu periksa isinya dengan `cat .env`.", None),
 ("aman", "Ketiga, pastikan .env tidak ikut terkirim ke GitHub. Nama .env harus tertulis di berkas .gitignore.", None),
 ("cek", "Jalankan `git status`. Kalau .env tidak muncul di daftar, password-mu aman.", None),
 ("ajak", "Mau melihat .env dipakai di aplikasi sungguhan? Tonton video lengkapnya.", None),
]
async def ADEGAN(r):
    await r.ketik("cd antrean", cps=30); await r.enter(0.1); await r.tidur(0.3); await r.bersih()
    await r.beat(0, pad=0.5)
    await r.langkah(1)
    async def a1():
        await r.ketik("ls -a"); await r.enter(); await r.tidur(0.6); await r.sorot(".env.example")
        await r.tidur(1.5); await r.lepas(); await r.ketik("cp .env.example .env"); await r.enter(); await r.tidur(0.4)
        await r.ketik("ls -a"); await r.enter(); await r.tidur(0.6); await r.sorot(".env ")
    await r.beat(1, a1, pad=1.0)
    await r.lepas(); await r.langkah(2); await r.bersih()
    async def a2():
        await r.ketik("nano .env"); await r.enter(); await r.tunggu("^X"); await r.tidur(0.8)
        for _ in range(6):
            r.tulis("\x1b[B"); await r.tidur(0.25)
        r.tulis("\x05"); await r.tidur(0.4); await r.ketik("rahasia123", cps=10); await r.tidur(0.4)
        await r.sorot("DB_PASSWORD=rahasia123", 1, True)
    await r.beat(2, a2, pad=1.0)
    await r.lepas(); await r.langkah(3)
    async def a3():
        await r.tidur(0.4); await r.kartu("Benar dan salah", "Benar : DB_PASSWORD=rahasia123\nSalah : DB_PASSWORD = rahasia123\n\nBenar : APP_NAME=\"Antrean Bengkel\"\nSalah : APP_NAME=Antrean Bengkel")
    await r.beat(3, a3, pad=1.8)
    await r.kartu(None)
    async def a4():
        r.tulis("\x0f"); await r.tidur(0.6); r.tulis("\r"); await r.tidur(0.8); r.tulis("\x18"); await r.tidur(0.8); await r.bersih()
        await r.ketik("cat .env"); await r.enter(); await r.tunggu("APP_NAME"); await r.sorot("DB_PASSWORD=rahasia123", 1, True)
    await r.beat(4, a4, pad=1.2)
    await r.lepas(); await r.langkah(4); await r.bersih()
    async def a5():
        await r.tidur(1.0); await r.ketik("cat .gitignore"); await r.enter(); await r.tidur(0.6); await r.sorot(".env", 1, True, True)
    await r.beat(5, a5, pad=1.0)
    await r.lepas()
    async def a6():
        await r.tidur(0.6); await r.ketik("git status"); await r.enter(); await r.tunggu("nothing to commit"); await r.sorot("nothing to commit", 1, True)
    await r.beat(6, a6, pad=1.4)
    await r.lepas()
    async def a7():
        await r.tidur(0.5); await r.akhir(VIDEO)
    await r.beat(7, a7, pad=1.8)
