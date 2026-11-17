import sys, time, os, subprocess; sys.path.insert(0, "/home/user/antre/alat")
P = "/home/user/proyek/siantre"; K = "/home/user/antre/kode/A10/"
subprocess.run(f"cd {P} && git reset -q --hard bab-09 && git clean -qfd", shell=True)
subprocess.run("fuser -k 3000/tcp 4005/tcp", shell=True, stderr=subprocess.DEVNULL)
subprocess.run("/home/user/antre/alat/reset_vs.sh", shell=True)
from rekam_vs import VS
r = VS("/home/user/antre/A10/rek")
def baris_ke(path, teks):
    r.tekan("Control+s", 0.3)
    for i, b in enumerate(open(path).read().split("\n")):
        if teks in b: return i + 1
    raise Exception("tidak ketemu " + teks)
def ke_baris(n): r.tekan("Control+g", 0.4); r.ketik(str(n), 12); r.tekan("Enter", 0.3)
def ganti_baris(n, teks, cps=18): ke_baris(n); r.tekan("End", 0.1); r.tekan("Shift+Home", 0.1); r.tekan("Shift+Home", 0.2); r.ketik(teks, cps)
def sisip_setelah(path, cari, teks, cps=20): ke_baris(baris_ke(path, cari)); r.tekan("End", 0.1); r.tekan("Enter", 0.2); r.ketik(teks, cps)
def sisip_sebelum(path, cari, kode, cps=40): ke_baris(baris_ke(path, cari)); r.tekan("Home", 0.1); r.tekan("Home", 0.1); r.kamera_editor(); r.ketik_kode(kode, cps=cps); r.tekan("Enter", 0.1); r.tekan("Enter", 0.2)
def editor(): r.kamera(r.kotak(".editor-group-container"), pad=0)
def term(): r.kamera(None); r.fokus_terminal(); time.sleep(0.3); r.tekan("Control+l", 0.3); r.kamera_terminal()
def ke_editor(nama): r.kamera(None); r.fokus_editor(); r.buka(nama); time.sleep(0.3)
def isi_ulang(nama, berkas, cps):  # ganti seluruh isi berkas yang sudah ada
    ke_editor(nama); r.tekan("Control+a", 0.2); r.tekan("Delete", 0.3); r.kamera_editor(); r.ketik_kode(open(K + berkas).read(), cps=cps); r.tekan("Control+s", 0.4)
def baru(nama, berkas, cps): r.kamera(None); r.berkas_baru(nama, akar=True); r.kamera_editor(); r.ketik_kode(open(K + berkas).read(), cps=cps); r.tekan("Control+s", 0.4)
PB = P + "/public/"; LK = P + "/src/routes/loket.js"; TK = P + "/src/routes/tiket.js"; SV = P + "/src/server.js"
r.mulai(); r.kamera(None); time.sleep(0.6)
# b03 umum.js: api
r.tanda("b03"); baru("public/umum.js", "umum_a.js", 26); r.tanda("b03_akhir")
# b04 el, dengarkan
r.tanda("b04"); r.tekan("Control+End", 0.2); r.tekan("Enter", 0.1); r.tekan("Enter", 0.2); r.ketik_kode(open(K + "umum_b.js").read(), cps=30); r.tekan("Control+s", 0.4)
ke_baris(baris_ke(PB + "umum.js", "e.textContent = teks")); r.kamera_editor(zoom=1.7); r.label("textContent, bukan innerHTML", 3); time.sleep(3.0); r.tanda("b04_akhir")
# b05 gaya.css dan halaman ambil nomor
r.tanda("b05"); baru("public/gaya.css", "gaya.css", 140); baru("public/index.html", "index.html", 90); editor(); time.sleep(0.8); r.tanda("b05_akhir")
# b06 cegah dua nomor
r.tanda("b06"); ganti_baris(baris_ke(PB + "index.html", "pesan.textContent = '';"), "      tombol.disabled = true; // cegah dua nomor", 22); r.kamera_editor()
r.tekan("End", 0.1); r.tekan("Enter", 0.2); r.ketik("      pesan.textContent = 'Sedang mengambil nomor…';", 26)
sisip_setelah(PB + "index.html", "pesan.textContent = e.message;", "        tombol.disabled = false;", 24); r.tekan("Control+s", 0.4); r.kamera_editor(); time.sleep(1.5); r.tanda("b06_akhir")
# b07 halaman tiket
r.tanda("b07"); isi_ulang("public/tiket.html", "tiket.html", 90); editor(); time.sleep(0.8); r.tanda("b07_sorot")
ke_baris(baris_ke(PB + "tiket.html", "Masih ada ${depan}")); r.kamera_editor(zoom=1.6); r.label("Pesan menyesuaikan status", 3); time.sleep(3.0); r.tanda("b07_akhir")
# b08 tidak pernah layar kosong
ke_baris(baris_ke(PB + "tiket.html", "$('putus').hidden")); r.kamera_editor(zoom=1.6); r.tanda("b08"); r.label("Koneksi terputus: beri tahu", 3); time.sleep(3.0)
ke_baris(baris_ke(PB + "tiket.html", "$('baru').hidden = false")); r.kamera_editor(zoom=1.6); r.label("Tiket tidak ada: tombol ambil nomor baru", 3); time.sleep(3.0); r.tanda("b08_akhir")
# b09 layar petugas
r.tanda("b09"); baru("public/petugas.html", "petugas.html", 100); r.tanda("b09_api")
ke_editor("loket.js"); editor(); ganti_baris(baris_ke(LK, "require('../db')"), "const { pool, transaksi } = require('../db');", 24)
sisip_sebelum(LK, "// Panggil berikutnya", open(K + "antrean_loket.js").read(), cps=70); r.tekan("Control+s", 0.4)
ke_editor("petugas.html"); ke_baris(baris_ke(PB + "petugas.html", "const BOLEH")); r.kamera_editor(zoom=1.6); r.label("Tombol mengikuti diagram status", 3); time.sleep(3.0); r.tanda("b09_akhir")
# b10 layar TV dan QR
r.tanda("b10"); isi_ulang("public/tv.html", "tv.html", 110)
ke_editor("routes/tiket.js"); editor(); sisip_sebelum(TK, "// Membuat tiket baru", open(K + "ringkas.js").read(), cps=60); r.tekan("Control+s", 0.4)
ke_editor("server.js"); editor(); ke_baris(baris_ke(SV, "app.get('/api/siaran'")); r.tekan("End", 0.1); r.tekan("Enter", 0.2); r.kamera_editor(); r.ketik_kode(open(K + "qr.js").read(), cps=40); r.tekan("Control+s", 0.4); r.tanda("b10_npm")
term(); r.terminal("rm public/tv.js public/tiket.js", cps=30, tunggu=0.4); r.terminal("npm install qrcode", cps=24, tunggu=1.0)
for _ in range(200):
    if os.path.exists(P + "/node_modules/qrcode/package.json"): break
    time.sleep(0.25)
time.sleep(2.0); r.label("QR dibuat server dari alamat aplikasi", 3); time.sleep(2.0); r.tanda("b10_akhir")
# b12 versi AI: innerHTML
r.kamera(None); r.berkas_baru("uji/tv-ai.js", akar=True); r.kamera_editor()
r.tanda("b12"); r.ketik_kode(open(K + "tv-ai.js").read(), cps=90); r.tekan("Control+s", 0.4)
ke_baris(baris_ke(P + "/uji/tv-ai.js", "innerHTML")); r.kamera_editor(zoom=1.6); r.label("Contoh kode bergaya hasil AI", 3); time.sleep(3.0); r.tanda("b12_akhir")
# b14 commit
term(); r.tekan("Control+l", 0.3)
r.tanda("b14"); r.terminal("git add .", tunggu=0.6); r.terminal('git commit -m "Halaman pelanggan, petugas, dan TV"', tunggu=1.5); r.label("Commit", 2.5); time.sleep(2.5); r.tanda("b14_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
subprocess.run(f"cd {P} && git tag -f bab-10", shell=True)
