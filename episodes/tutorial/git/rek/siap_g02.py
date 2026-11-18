import sys; sys.path.insert(0, "/home/user/git-seri/rek")
from proyek import *
R = "/home/user/proyek/raka/siantre"; rumah("Raka", "raka@majujaya.id")
dasar_g01(R)
ganti(R, "server.js", "JAM_BUKA = '08.00'", "JAM_BUKA = '07.00'"); commit(R, "Ubah jam buka menjadi 07.00", "2026-11-11T08:05:00+07:00")
shutil.copy(D + "/package.json", R + "/package.json"); commit(R, "Tambahkan package.json", "2026-11-11T10:20:00+07:00")
print(git(R, "log", "--oneline"))
