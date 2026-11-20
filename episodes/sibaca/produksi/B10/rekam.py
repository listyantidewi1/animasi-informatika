import sys, time; sys.path.insert(0, "/home/user/baca/alat")
from tulis import Bab, CACAT, sh, matikan, siapkan, server
from tahap import APP
siapkan("bab-09", "contoh", jalan=False); server(vite=False)
b = Bab("/home/user/baca/B10/rek"); r = b.r
AP = "server/app.js"
r.t0 = time.time(); b.term(); b.jalan("cd web", tunggu=0.5); b.jalan("npm run dev", sampai="Local:", tunggu=1.5, maks=60)
for k in ("kamera", "label", "tanda"): r.log[k].clear()
r.mulai(); r.kamera(None); time.sleep(1.0)
# b02 build
r.kamera_terminal(); r.tanda("b02"); r.label("Terminal kedua: Vite masih berjalan", 2.5); time.sleep(2.6); r.tekan("Control+c", 1.0); r.label("Ctrl+C: Vite berhenti", 2.0); time.sleep(1.5)
r.tekan("Control+l", 0.4); r.tanda("b02_build"); b.jalan("npm run build", tunggu=1.5, sampai="built in", maks=120)
b.besar(); r.tanda("b02_dist"); b.jalan("ls dist", tunggu=1.2); b.jalan("ls dist/assets", tunggu=1.2); r.kamera(r.kotak(".part.panel"), pad=0)
r.tanda("b02_isi"); r.label("Satu HTML, satu JavaScript, satu CSS, dan huruf Inter", 7.0); time.sleep(7.4)
r.tanda("b02_semua"); r.label("Semuanya ada di laptop ini, tidak ada yang dari internet", 5.0); time.sleep(5.5); r.tanda("b02_akhir")
b.kecil()
# b03 Express menyajikan dist
r.kamera(None); r.tanda("b03_ketik"); b.ubah(AP, APP[10], cps=16); time.sleep(0.4); b.lihat(AP, "app.use('/api/auth'", jeda=1.0); r.tanda("b03"); time.sleep(3.0)
b.sorot(AP, "const dist = path.resolve", "express.static: berkas di dist bisa diminta browser", 7.5, tanda="b03_static", n=2)
b.sorot(AP, "app.get('/{*semua}'", "Alamat lain, misalnya /pinjaman", 5.0, tanda="b03_semua", zoom=1.3)
r.tanda("b03_react"); r.label("Server mengirim index.html, React menentukan halamannya", 9.0); time.sleep(9.5)
b.sorot(AP, "app.use('/api', (req, res) => res.status(404)", "Alamat API yang salah ketik: pesan yang jelas", 7.0, tanda="b03_404", zoom=1.3)
b.sorot("web/.gitignore", "dist", "dist tidak ikut ke GitHub, bisa dibuat ulang kapan saja", 8.5, tanda="b03_ignore"); r.tanda("b03_akhir")
# b04 npm start
pj = b.isi("package.json"); CT = '    "contoh": "node --env-file=.env database/isi-contoh.js"'; assert pj.count(CT + "\n") == 1
pj2 = pj.replace(CT + "\n", CT + ',\n    "start": "node --env-file=.env server/app.js"\n')
r.kamera(None); r.tanda("b04"); b.ubah("package.json", pj2, cps=14); b.sorot("package.json", '"start"', "start: seperti dev, tanpa --watch", 4.0, tanda="b04_start")
matikan()
b.term(); r.tanda("b04_jalan"); r.label("Server lama dihentikan dulu dengan Ctrl+C", 3.0); b.jalan("cd ..", tunggu=0.8); b.jalan("npm start", tunggu=1.5, sampai="SiBaca berjalan", maks=30, label="npm start: satu program di port 3000", dur=4.0); r.tanda("b04_akhir")
# b09 commit
time.sleep(1.0); r.tanda("b09"); r.tekan("Control+c", 1.2); b.commit("Berjalan tanpa internet", tanda="b09_commit"); time.sleep(1.0); r.tanda("b09_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
matikan(); sh("git tag -f bab-10"); print("CACAT", CACAT); print(sh("git status --short | head; git log --oneline | head -3; ls web/dist").stdout)
