KODE = "H04"; NAMA = "Cara_Mengatasi_Merge_Conflict"
JUDUL = "Cara membereskan<br><b>merge conflict</b> di Git"
LANGKAH = ["Merge", "Baca", "Perbaiki", "Commit"]
VIDEO = "Merge Conflict: Membaca dan Membereskannya"
LAFAL = [("merge", "merj"), ("CONFLICT", "konflik"), ("nano", "nano")]
SIAPKAN = r"""git config --global user.name "Sinta Ayu" && git config --global user.email "sinta@mail.id" && git config --global init.defaultBranch main && mkdir -p ~/profil-kelas && cd ~/profil-kelas && git init -q && printf 'body {\n  color: black;\n}\n' > style.css && git add . && git commit -qm "Gaya awal" && git switch -qc warna-baru && sed -i 's/black/green/' style.css && git commit -qam "Warna hijau" && git switch -q main && sed -i 's/black/navy/' style.css && git commit -qam "Warna biru tua" """
BEATS = [
 ("kait", "Muncul tulisan CONFLICT saat merge? Jangan panik. Begini cara membereskannya.", "Muncul tulisan konflik saat merj? Jangan panik. Begini cara membereskannya."),
 ("merge", "Di sini, branch main dan branch warna-baru sama-sama mengubah baris yang sama. Saat kita menjalankan `git merge warna-baru`, Git berhenti dan menulis CONFLICT.", "Di sini, brench main dan brench warna baru sama-sama mengubah baris yang sama. Saat kita menjalankan, git merj warna baru, Git berhenti dan menulis konflik."),
 ("kenapa", "Git tidak tahu harus memilih yang mana, jadi ia meminta kamu yang memutuskan.", None),
 ("baca", "Buka berkasnya. Di antara tanda panah kiri dan garis sama dengan ada versi kita. Setelah garis itu, sampai tanda panah kanan, ada versi branch lain.", "Buka berkasnya. Di antara tanda panah kiri dan garis sama dengan, ada versi kita. Setelah garis itu, sampai tanda panah kanan, ada versi brench lain."),
 ("perbaiki", "Pilih isi yang benar, lalu hapus ketiga baris penanda itu. Di sini kita memakai editor nano dan memilih warna hijau.", None),
 ("simpan", "Simpan berkasnya, lalu tandai konflik selesai dengan `git add`, dan buat commit.", None),
 ("cek", "Cek dengan `git log --oneline --graph`. Kedua branch sudah tergabung dengan rapi.", "Cek dengan, git log, minus minus oneline, minus minus graf. Kedua brench sudah tergabung dengan rapi."),
 ("ajak", "Mau tahu cara mencegah konflik sejak awal? Tonton video lengkapnya.", None),
]
async def ADEGAN(r):
    await r.ketik("cd profil-kelas", cps=30); await r.enter(0.1); await r.tidur(0.3); await r.bersih()
    await r.beat(0, pad=0.4)
    await r.langkah(1)
    async def a1():
        await r.ketik("git branch"); await r.enter(); await r.tunggu("warna-baru"); await r.sorot("git branch", 3, True)
        await r.tidur(2.0); await r.lepas()
        await r.ketik("git merge warna-baru"); await r.enter(); await r.tunggu("Automatic merge failed")
        await r.sorot("CONFLICT", 2, True)
    await r.beat(1, a1, pad=1.0)
    await r.beat(2, pad=0.8)
    await r.lepas(); await r.langkah(2); await r.bersih()
    async def a3():
        await r.ketik("cat style.css"); await r.enter(); await r.tunggu(">>>>>>> warna-baru")
        await r.tidur(0.8); await r.sorot("<<<<<<< HEAD", 3, True, True)
        await r.tidur(3.4); await r.sorot("=======", 3, True, True)
    await r.beat(3, a3, pad=1.2)
    await r.lepas(); await r.langkah(3); await r.bersih()
    async def a4():
        await r.ketik("nano style.css"); await r.enter(); await r.tunggu("^X"); await r.tidur(1.0)
        r.tulis("\x1b[B"); await r.tidur(0.5)
        for _ in range(3):
            r.tulis("\x0b"); await r.tidur(0.7)
        r.tulis("\x1b[B"); await r.tidur(0.5); r.tulis("\x0b"); await r.tidur(1.0)
        await r.sorot("color: green;", 1, True)
    await r.beat(4, a4, pad=1.0)
    await r.lepas(); await r.langkah(4)
    async def a5():
        r.tulis("\x0f"); await r.tidur(0.6); r.tulis("\r"); await r.tidur(0.8); r.tulis("\x18"); await r.tidur(0.8)
        await r.bersih()
        await r.ketik("git add style.css"); await r.enter(); await r.tidur(0.4)
        await r.ketik('git commit -m "Pakai warna hijau"', cps=16); await r.enter(); await r.tunggu("] Pakai warna hijau")
        await r.sorot("] Pakai warna hijau", 1, True)
    await r.beat(5, a5, pad=1.2)
    await r.lepas(); await r.bersih()
    async def a6():
        await r.tidur(0.8); await r.ketik("git log --oneline --graph"); await r.enter(); await r.tunggu("Gaya awal")
        await r.sorot("Pakai warna hijau", 5, True)
    await r.beat(6, a6, pad=1.5)
    await r.lepas()
    async def a7():
        await r.tidur(0.5); await r.akhir(VIDEO)
    await r.beat(7, a7, pad=1.8)
