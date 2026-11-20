import sys, time, os; sys.path.insert(0, "/home/user/baca/alat")
from tulis import Bab, CACAT, P, sh, matikan, siapkan, acuan, server
import tahap as T
siapkan("bab-05", "contoh")
for f in ["web/README.md", "web/public/icons.svg"]:
    if os.path.exists(f"{P}/{f}"): os.remove(f"{P}/{f}")
b = Bab("/home/user/baca/B06/rek"); r = b.r
W = "web/src/"
r.mulai(); r.kamera(None); time.sleep(1.0)
# b03 merapikan proyek Vite
r.tanda("b03"); b.lihat(W + "main.jsx", jeda=1.0); r.label("Isi folder web/src buatan Vite", 3.0); time.sleep(1.5)
r.tanda("b03_hapus"); r.kamera(None); b.hapus(W + "App.css"); b.hapus(W + "index.css"); b.hapus(W + "assets"); r.label("App.css, index.css, dan folder assets dihapus", 3.5); time.sleep(3.5)
b.term(); r.tanda("b03_pasang"); b.jalan("cd web", tunggu=0.8); b.jalan("npm install react-router @fontsource/inter", tunggu=1.5, sampai="added", maks=180)
r.tanda("b03_router"); r.label("react-router: berpindah halaman", 3.5); time.sleep(3.8)
r.tanda("b03_inter"); r.label("@fontsource/inter: huruf Inter tersimpan di dalam proyek", 7.0); time.sleep(9.5)
r.kamera(None); r.tanda("b03_gaya"); b.salin(W + "gaya.css"); b.salin("web/public/favicon.svg"); b.lihat(W + "gaya.css", jeda=0.8); r.label("gaya.css: warna dan ukuran, disalin dari GitHub", 4.5); time.sleep(5.0)
VC = b.isi("web/vite.config.js"); assert VC.count("  plugins: [react()],\n") == 1
VC2 = VC.replace("  plugins: [react()],\n", "  plugins: [react()],\n  server: {\n    // Saat mengembangkan, permintaan ke /api diteruskan ke server Express.\n    proxy: { '/api': 'http://localhost:3000' }\n  },\n")
r.kamera(None); r.tanda("b03_vite"); b.ubah("web/vite.config.js", VC2, cps=16); time.sleep(0.5)
b.sorot("web/vite.config.js", "proxy:", "/api diteruskan ke Express di port 3000", 7.0, tanda="b03_proxy"); r.tanda("b03_akhir")
IH = b.isi("web/index.html"); IH2 = IH.replace('lang="en"', 'lang="id"').replace("<title>web</title>", "<title>SiBaca</title>"); assert IH2 == acuan("web/index.html")
r.kamera(None); r.tanda("b03_html"); b.ubah("web/index.html", IH2, cps=12); b.sorot("web/index.html", "<title>", "index.html: bahasa dan judul halaman", 3.0); r.tanda("b03_html_akhir")
# b04 api.js
r.kamera(None); r.tanda("b04"); b.ubah(W + "api.js", T.API[6], cps=18); time.sleep(0.6)
b.sorot(W + "api.js", "export async function api", "Satu pintu untuk semua permintaan", 4.5, tanda="b04_pintu")
b.sorot(W + "api.js", "const res = await fetch", "fetch: kirim JSON kalau ada isinya", 6.0, tanda="b04_fetch", n=5)
b.sorot(W + "api.js", "if (!res.ok)", "Gagal: lempar error berisi pesan server", 6.0, tanda="b04_gagal")
b.sorot(W + "api.js", "fetch('/api' + alamat", "/api: tanpa nama komputer, tanpa port", 6.0, tanda="b04_relatif")
r.tanda("b04_nama"); r.label("Alamat relatif", 3.0); time.sleep(3.3)
r.tanda("b04_ingat"); r.label("Ingat baris ini sampai Bab 10", 7.0); time.sleep(7.5); r.tanda("b04_akhir")
# b05 Masuk.jsx
M = W + "halaman/Masuk.jsx"
r.kamera(None); r.tanda("b05"); b.ubah(M, acuan(M), cps=26); time.sleep(0.6)
b.sorot(M, "const [nis, setNis]", "Tiga state: nis, sandi, galat", 8.0, tanda="b05_state", n=3)
b.sorot(M, "const [nis, setNis]", "useState: nilai saat ini, dan fungsi pengubahnya", 7.0, tanda="b05_use")
b.sorot(M, "<input value={nis}", "Menampilkan state, tiap ketikan mengubah state", 6.5, tanda="b05_input")
b.sorot(M, "async function kirim", "Saat form dikirim", 4.0, tanda="b05_kirim")
b.sorot(M, "setelahMasuk(await api", "Berhasil: data pengguna diserahkan ke induk", 3.8, tanda="b05_hasil")
b.sorot(M, "setGalat(err.message)", "Gagal: pesan disimpan ke state galat", 2.8, tanda="b05_galat")
b.sorot(M, "{galat && <p", "React menampilkannya sendiri", 3.0); r.tanda("b05_akhir")
# b06 main.jsx dan App.jsx
MJ = W + "main.jsx"
r.kamera(None); r.tanda("b06_main"); b.ubah(MJ, acuan(MJ), cps=18); time.sleep(0.6)
b.sorot(MJ, "<BrowserRouter>", "Aplikasi dibungkus BrowserRouter", 4.0, tanda="b06", n=3)
b.sorot(MJ, "@fontsource/inter/400.css", "Huruf Inter dan gaya.css", 4.0, n=4)
AJ = W + "App.jsx"
r.kamera(None); r.tanda("b06_app"); b.kosongkan(AJ); b.ubah(AJ, T.APPX[6], cps=28); time.sleep(0.6)
b.sorot(AJ, "const [pengguna, setPengguna]", "State: pengguna yang sedang login", 4.5, tanda="b06_state")
b.sorot(AJ, "useEffect(() => {", "Saat pertama dibuka: bertanya ke /auth/saya", 6.0, tanda="b06_efek", n=3)
r.tanda("b06_luar"); r.label("useEffect: pekerjaan di luar tampilan", 5.0); time.sleep(5.5)
b.sorot(AJ, "if (!pengguna) {", "Belum login: Masuk atau Daftar", 4.0, tanda="b06_belum", n=8)
b.sorot(AJ, "<header>", "Sudah login: nama aplikasi, Keluar, Katalog", 5.0, tanda="b06_sudah", n=7)
r.kamera(None); r.tanda("b06_daftar"); b.salin(W + "halaman/Daftar.jsx"); b.lihat(W + "halaman/Daftar.jsx", jeda=0.8); r.label("Daftar.jsx: disalin dari GitHub", 4.0); time.sleep(4.5); r.tanda("b06_akhir")
# b07 Katalog.jsx
KJ = W + "halaman/Katalog.jsx"
r.kamera(None); r.tanda("b07"); b.ubah(KJ, T.KAT[6], cps=28); time.sleep(0.6)
b.sorot(KJ, "const [buku, setBuku]", "buku: array kosong, status: memuat", 5.5, tanda="b07_state", n=2)
b.sorot(KJ, "api('/buku')", "Meminta daftar buku", 3.0, tanda="b07_minta")
b.sorot(KJ, ".then((data)", "Berhasil: simpan, status siap", 4.0, tanda="b07_then")
b.sorot(KJ, ".catch(()", "Gagal: status gagal", 2.6, tanda="b07_catch")
b.sorot(KJ, "{status === 'memuat'", "Satu baris tampilan untuk tiap keadaan", 7.0, tanda="b07_keadaan", n=2)
b.sorot(KJ, "{buku.map((b) => (", "map: tiap buku menjadi satu kartu", 4.2, tanda="b07_map")
b.sorot(KJ, "<li key={b.id}", "key unik: id buku", 8.0, tanda="b07_key"); r.tanda("b07_akhir")
# b10 commit
b.term(); r.tanda("b10_cd"); b.jalan("cd ..", tunggu=0.8); b.commit("React pertama", tanda="b10_commit"); time.sleep(1.0); r.tanda("b10_akhir")
r.kamera(None); time.sleep(0.8); r.selesai()
matikan(); sh("git tag -f bab-06"); print("CACAT", CACAT); print(sh("git status --short | head; git log --oneline | head -3; cd web && npx vite build 2>&1 | tail -3").stdout)
