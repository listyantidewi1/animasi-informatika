import sys; sys.path.insert(0, "/home/user/git-seri/rek")
from proyek import *
R = "/home/user/proyek/raka/siantre"; rumah("Raka", "raka@majujaya.id")
N = dict(nama="Nadia", email="nadia@majujaya.id")
dasar_g01(R)
shutil.copy(D + "/package.json", R + "/package.json"); commit(R, "Tambahkan package.json", "2026-11-11T10:20:00+07:00")
shutil.copytree(D + "/node_modules", R + "/node_modules", symlinks=True)
def cabang(br, perubahan, pesan, tgl, **k):
    git(R, "switch", "-q", "-c", br, "main")
    for f, a, b in perubahan: ganti(R, f, a, b)
    commit(R, pesan, tgl, **k); git(R, "switch", "-q", "main")
cabang("nadia/strip-nomor", [("antrean.js", "return 'A' + String", "return 'A-' + String")], "Tambah tanda strip pada nomor", "2026-11-14T09:10:00+07:00", **N)
cabang("raka/kode-layanan", [("antrean.js", "function formatNomor(n) {\n  return 'A' + String", "function formatNomor(n, layanan = 'A') {\n  return layanan + String"),
                             ("antrean.js", "function ambilNomor() {", "function ambilNomor(layanan) {"),
                             ("antrean.js", "return formatNomor(nomorTerakhir);", "return formatNomor(nomorTerakhir, layanan);")], "Tambah kode layanan pada nomor", "2026-11-14T10:25:00+07:00")
cabang("nadia/jam-wib", [("server.js", "JAM_BUKA = '08.00'", "JAM_BUKA = '08.00 WIB'"), ("server.js", "console.log('SiAntre jalan di http://localhost:3001')", "console.log('SiAntre siap di http://localhost:3001')")],
       "Tampilkan zona waktu jam buka", "2026-11-14T11:00:00+07:00", **N)
cabang("raka/jam-sabtu", [("server.js", "JAM_BUKA = '08.00'", "JAM_BUKA = '07.30'"), ("server.js", "console.log('SiAntre jalan di http://localhost:3001')", "console.log('Server SiAntre jalan di port 3001')")],
       "Majukan jam buka menjadi 07.30", "2026-11-14T13:40:00+07:00")
cabang("nadia/judul", [("public/index.html", "<h1>Bengkel Maju Jaya</h1>", "<h1>Bengkel Maju Jaya Motor</h1>")], "Perjelas judul halaman", "2026-11-14T14:05:00+07:00", **N)
cabang("raka/judul", [("public/index.html", "<h1>Bengkel Maju Jaya</h1>", "<h1>SiAntre - Bengkel Maju Jaya</h1>")], "Tambah nama aplikasi di judul", "2026-11-14T14:30:00+07:00")
print(git(R, "log", "--oneline", "--all", "--graph"))
