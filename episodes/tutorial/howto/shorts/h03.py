import os, sys; sys.path.insert(0, os.path.dirname(__file__)); import web_umum as W
KODE = "H03"; NAMA = "Cara_Push_Pertama_ke_GitHub"
JUDUL = "Cara mengirim proyek<br>ke <b>GitHub</b> pertama kali"
LANGKAH = ["Repo", "Commit", "Remote", "Push"]
VIDEO = "Remote dan Pull Request"
EXTRA_CSS = W.CSS; EXTRA_HTML = W.HTML; EXTRA_JS = W.JS
LAFAL = [("GitHub", "Git Hab"), ("repository", "repositori"), ("git add .", "git add titik"), ("-u", "minus u"), ("README", "rid mi")]
SIAPKAN = """mkdir -p ~/catatan-belajar && cd ~/catatan-belajar && printf '# Catatan Belajar\\n\\nCatatan pelajaranku.\\n' > README.md && printf 'Senin: belajar Git\\n' > catatan.txt && git config --global user.name "Sinta Ayu" && git config --global user.email "sinta@mail.id" && git config --global init.defaultBranch main"""
BEATS = [
 ("kait", "Proyekmu masih tersimpan di laptop saja? Begini cara mengirimnya ke GitHub untuk pertama kali.", None),
 ("repo", "Pertama, buka GitHub, klik New repository, lalu beri nama. Biarkan pilihan README tidak dicentang, lalu klik Create repository.", None),
 ("alamat", "GitHub lalu menampilkan alamat repository dan perintah yang perlu kamu jalankan.", None),
 ("commit", "Kedua, di folder proyekmu, jalankan `git init`, lalu `git add .`, lalu `git commit` dengan pesan singkat.", None),
 ("remote", "Ketiga, sambungkan folder ini ke GitHub dengan `git remote add origin`, diikuti alamat repository tadi.", None),
 ("push", "Keempat, ketik `git push -u origin main` untuk mengirim kodemu.", "Keempat, ketik, git push, minus u, origin main, untuk mengirim kodemu."),
 ("token", "Saat diminta login, isi username GitHub-mu. Untuk password, pakai token, bukan password akun.", None),
 ("hasil", "Setelah terkirim, muat ulang halaman GitHub. Berkas proyekmu sudah muncul di sana.", None),
 ("ajak", "Mau tahu cara bekerja bersama tim lewat pull request? Tonton video lengkapnya.", "Mau tahu cara bekerja bersama tim lewat pul rikues? Tonton video lengkapnya."),
]
BARU = """<h2>Create a new repository</h2>
<div class="lbl">Owner / Repository name *</div><div class="inp" id="nm">sinta-ayu / catatan-belajar</div>
<div class="lbl">Description (optional)</div><div class="inp" style="color:#6e7681">Catatan pelajaranku</div>
<div class="chk"><div class="rad on"></div>Public</div><div class="chk"><div class="rad"></div>Private</div>
<div class="chk" id="rd"><div class="cb"></div>Add a README file</div>
<div class="btn" id="cr">Create repository</div>"""
KOSONG = """<h2>sinta-ayu / catatan-belajar</h2>
<div class="box"><div class="lbl" style="margin-top:0">Quick setup</div><code id="adr" style="font-size:24px">https://github.com/sinta-ayu/catatan-belajar.git</code></div>
<div class="box" id="cmd"><div class="lbl" style="margin-top:0">…or push an existing repository from the command line</div><code>git remote add origin https://github.com/
  sinta-ayu/catatan-belajar.git
git branch -M main
git push -u origin main</code></div>"""
ISI = """<h2>sinta-ayu / catatan-belajar</h2><div class="muted" style="margin-bottom:20px">Public · 1 commit · main</div>
<div class="box" id="files"><div class="row"><div class="muted">Sinta Ayu</div><div style="flex:1"></div><div class="muted">Commit pertama</div></div>
<div class="row"><div class="ic f"></div>README.md<div style="flex:1"></div><div class="muted">baru saja</div></div>
<div class="row"><div class="ic f"></div>catatan.txt<div style="flex:1"></div><div class="muted">baru saja</div></div></div>
<div class="box"><h2 style="font-size:34px">Catatan Belajar</h2><div>Catatan pelajaranku.</div></div>"""
async def ADEGAN(r):
    await r.js("a=>hal(...a)", ["github.com/new", BARU]); await r.js("web(true)"); await r.js("wjudul('Terminal')")
    await r.beat(0, pad=0.5)
    await r.langkah(1)
    async def a1():
        await r.tidur(2.4); await r.sorot_el("#nm"); await r.tidur(2.4); await r.sorot_el("#rd"); await r.tidur(2.6); await r.sorot_el("#cr")
    await r.beat(1, a1, pad=0.8)
    await r.lepas(); await r.js("a=>hal(...a)", ["github.com/sinta-ayu/catatan-belajar", KOSONG])
    async def a2():
        await r.tidur(0.6); await r.sorot_el("#adr", 6); await r.tidur(2.0); await r.sorot_el("#cmd", 6)
    await r.beat(2, a2, pad=1.0)
    await r.lepas(); await r.js("web(false)"); await r.langkah(2)
    async def a3():
        await r.ketik("cd catatan-belajar"); await r.enter(); await r.tidur(0.4)
        await r.ketik("git init"); await r.enter(); await r.tunggu("Initialized"); await r.tidur(0.6)
        await r.ketik("git add ."); await r.enter(); await r.tidur(0.6)
        await r.ketik('git commit -m "Commit pertama"'); await r.enter(); await r.tunggu("files changed")
        await r.sorot("Commit pertama", 2, True)
    await r.beat(3, a3, pad=1.5)
    await r.lepas(); await r.langkah(3); await r.bersih()
    async def a4():
        await r.tidur(1.0); await r.ketik("git remote add origin https://github.com/sinta-ayu/catatan-belajar.git", cps=22); await r.enter()
        await r.tidur(0.6); await r.ketik("git remote -v"); await r.enter(); await r.tunggu("(push)"); await r.sorot("git remote -v", 5, True)
    await r.beat(4, a4, pad=1.5)
    await r.lepas(); await r.langkah(4)
    async def a5():
        await r.tidur(1.0); await r.ketik("git push -u origin main"); await r.sorot("git push -u origin main")
    await r.beat(5, a5, pad=0.6)
    await r.lepas()
    async def a6():
        await r.tidur(0.3); await r.kartu("Password = token", "GitHub > Settings > Developer settings\n> Personal access tokens > Generate")
    await r.beat(6, a6, pad=1.6)
    await r.kartu(None); await r.js("a=>hal(...a)", ["github.com/sinta-ayu/catatan-belajar", ISI]); await r.js("web(true)")
    async def a7():
        await r.tidur(1.2); await r.sorot_el("#files", 6)
    await r.beat(7, a7, pad=1.2)
    await r.lepas()
    async def a8():
        await r.tidur(0.5); await r.akhir(VIDEO)
    await r.beat(8, a8, pad=1.8)
