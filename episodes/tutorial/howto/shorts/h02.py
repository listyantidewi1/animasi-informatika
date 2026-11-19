KODE = "H02"; NAMA = "Cara_Pasang_dan_Atur_Git"
JUDUL = "Cara pasang dan<br>atur <b>Git</b> pertama kali"
LANGKAH = ["Pasang", "Nama", "Branch", "Cek"]
VIDEO = "Git dari Nol: Commit Pertamamu"
LAFAL = [("GitHub", "Git Hab"), ("git-scm.com", "git es se em dot kom")]
BEATS = [
 ("kait", "Baru pertama memakai Git? Sebelum membuat commit, kamu perlu mengatur Git dulu. Begini caranya.", None),
 ("pasang", "Pertama, pasang Git. Di Windows, unduh dari `git-scm.com` lalu klik Next sampai selesai. Di Mac atau Linux, pakai perintah di layar.", None),
 ("versi", "Setelah terpasang, buka terminal atau Git Bash, lalu ketik `git --version`. Kalau nomor versi muncul, Git siap dipakai.", "Setelah terpasang, buka terminal atau Git Bash, lalu ketik, git, minus minus version. Kalau nomor versi muncul, Git siap dipakai."),
 ("nama", "Kedua, kenalkan dirimu ke Git. Ketik `git config --global user.name`, lalu tulis namamu di dalam tanda kutip.", "Kedua, kenalkan dirimu ke Git. Ketik, git config, minus minus global, user name, lalu tulis namamu di dalam tanda kutip."),
 ("email", "Lalu atur email dengan perintah yang mirip. Pakai email yang sama dengan akun GitHub-mu.", None),
 ("branch", "Ketiga, jadikan main sebagai nama branch utama, supaya sama dengan GitHub.", "Ketiga, jadikan main sebagai nama brench utama, supaya sama dengan Git Hab."),
 ("cek", "Terakhir, cek hasilnya dengan `git config --global --list`. Nama, email, dan branch main sudah tersimpan.", "Terakhir, cek hasilnya dengan, git config, minus minus global, minus minus list. Nama, email, dan brench main sudah tersimpan."),
 ("sekali", "Pengaturan ini cukup dilakukan sekali. Nama dan email inilah yang tercatat di setiap commit yang kamu buat.", None),
 ("ajak", "Mau langsung membuat commit pertamamu? Tonton video lengkapnya di kanal ini.", None),
]
async def ADEGAN(r):
    await r.beat(0, pad=0.6)
    await r.langkah(1)
    async def a1():
        await r.tidur(1.0)
        await r.kartu("Pasang Git", "Windows : unduh dari git-scm.com\n          lalu Next sampai Finish\nMac     : xcode-select --install\nLinux   : sudo apt install git")
    await r.beat(1, a1, pad=1.4)
    await r.kartu(None)
    async def a2():
        await r.tidur(2.6); await r.ketik("git --version"); await r.enter()
        await r.tunggu("git version"); await r.sorot("git version", 1, True)
    await r.beat(2, a2, pad=1.4)
    await r.lepas(); await r.langkah(2)
    async def a3():
        await r.tidur(2.5); await r.ketik('git config --global user.name "Sinta Ayu"', cps=16)
        await r.sorot('"Sinta Ayu"'); await r.enter(0.6)
    await r.beat(3, a3, pad=1.2)
    await r.lepas()
    async def a4():
        await r.tidur(0.8); await r.ketik('git config --global user.email "sinta@mail.id"', cps=16)
        await r.sorot('"sinta@mail.id"'); await r.enter(0.6)
    await r.beat(4, a4, pad=1.2)
    await r.lepas(); await r.langkah(3)
    async def a5():
        await r.tidur(0.8); await r.ketik("git config --global init.defaultBranch main", cps=16)
        await r.sorot("init.defaultBranch main"); await r.enter(0.6)
    await r.beat(5, a5, pad=1.2)
    await r.lepas(); await r.langkah(4); await r.bersih()
    async def a6():
        await r.tidur(1.0); await r.ketik("git config --global --list", cps=15); await r.enter()
        await r.tunggu("init.defaultbranch"); await r.tidur(0.3)
        await r.sorot("user.name=", 3, True)
    await r.beat(6, a6, pad=1.4)
    await r.beat(7, pad=0.8)
    await r.lepas()
    async def a8():
        await r.tidur(0.5); await r.akhir(VIDEO)
    await r.beat(8, a8, pad=1.8)
