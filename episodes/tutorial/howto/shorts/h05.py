KODE = "H05"; NAMA = "Cara_Pasang_Node_js"
JUDUL = "Cara pasang <b>Node.js</b><br>dan cek versinya"
LANGKAH = ["Pasang", "Muat", "LTS", "Cek"]
VIDEO = "Membangun Aplikasi dari Nol: Sistem Antrean Bengkel"
LAFAL = [("Node.js", "Node jes"), ("nvm", "en vi em"), ("npm", "en pi em"), ("LTS", "el ti es"), ("-v", "minus vi")]
BEATS = [
 ("kait", "Mau membuat aplikasi web dengan JavaScript? Langkah pertamanya adalah memasang Node.js. Begini caranya.", None),
 ("windows", "Di Windows atau Mac, buka nodejs.org, unduh versi LTS, lalu klik Next sampai selesai.", "Di Windows atau Mek, buka node jes dot org, unduh versi el ti es, lalu klik Next sampai selesai."),
 ("nvm", "Di Linux, cara paling rapi adalah memakai nvm. Jalankan perintah pemasangan nvm ini di terminal.", None),
 ("muat", "Setelah selesai, muat ulang pengaturan terminal dengan `source ~/.bashrc`, supaya perintah nvm dikenali.", "Setelah selesai, muat ulang pengaturan terminal dengan perintah sors, supaya perintah en vi em dikenali."),
 ("lts", "Sekarang pasang Node.js versi LTS dengan `nvm install --lts`. Versi LTS adalah versi stabil yang dirawat paling lama.", "Sekarang pasang Node jes versi el ti es dengan, en vi em install, minus minus el ti es. Versi el ti es adalah versi stabil yang dirawat paling lama."),
 ("cek", "Terakhir, cek dengan `node -v` dan `npm -v`. Kalau keduanya menampilkan nomor versi, Node.js siap dipakai.", "Terakhir, cek dengan, node minus vi, dan, en pi em minus vi. Kalau keduanya menampilkan nomor versi, Node jes siap dipakai."),
 ("ajak", "Mau langsung membangun aplikasi lengkap dengan Node.js? Tonton video lengkapnya.", "Mau langsung membangun aplikasi lengkap dengan Node jes? Tonton video lengkapnya."),
]
async def ADEGAN(r):
    await r.beat(0, pad=0.5)
    await r.langkah(1)
    async def a1():
        await r.tidur(0.6); await r.kartu("Windows dan Mac", "1. Buka nodejs.org\n2. Unduh versi LTS\n3. Next sampai Finish")
    await r.beat(1, a1, pad=1.4)
    await r.kartu(None)
    async def a2():
        await r.tidur(2.0); await r.ketik("curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash", cps=24); await r.enter()
        await r.tunggu("Close and reopen your terminal"); await r.tidur(0.3); await r.sorot("Close and reopen", 1, True)
    await r.beat(2, a2, pad=1.0)
    await r.lepas(); await r.langkah(2); await r.bersih()
    async def a3():
        await r.tidur(1.6); await r.ketik("source ~/.bashrc"); await r.enter(); await r.tidur(0.6)
        await r.ketik("nvm --version"); await r.enter(); await r.tunggu("0.40.3"); await r.sorot("0.40.3", 1, True)
    await r.beat(3, a3, pad=1.0)
    await r.lepas(); await r.langkah(3); await r.bersih()
    async def a4():
        await r.tidur(1.0); await r.ketik("nvm install --lts"); await r.enter()
        await r.tunggu("Now using node"); await r.tidur(0.3); await r.sorot("Now using node", 1, True)
    await r.beat(4, a4, pad=1.2)
    await r.lepas(); await r.langkah(4); await r.bersih()
    async def a5():
        await r.tidur(1.0); await r.ketik("node -v"); await r.enter(); await r.tidur(0.8)
        await r.ketik("npm -v"); await r.enter(); await r.tidur(0.8); await r.sorot("node -v", 4, True)
    await r.beat(5, a5, pad=1.4)
    await r.lepas()
    async def a6():
        await r.tidur(0.5); await r.akhir(VIDEO)
    await r.beat(6, a6, pad=1.8)
