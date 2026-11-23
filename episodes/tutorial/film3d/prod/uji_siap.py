"""Gambar beberapa frame adegan bab instalasi untuk diperiksa: python3 uji_siap.py -> /tmp/uji_siap/lembar.jpg"""
import base64, os, pathlib, subprocess
from playwright.sync_api import sync_playwright
F = pathlib.Path(__file__).resolve().parent.parent
WEB = F.parent / "_alat" / "web"
BL = "C:\\Program Files\\Blender Foundation\\Blender 5.3"
UJI = [
 ("alat", 9, 12, {}), ("alat", 7, 8, dict(cek=True, judul="Kelima alat siap")),
 ("situs", 9, 12, dict(url="blender.org", merek="Blender", judulHal="Download Blender", ket="Gratis dan open source", tombol="Download Blender 5.3 untuk Windows")),
 ("pasang", 5, 8, dict(judul="Blender Setup", teks="Klik Next sampai selesai.")),
 ("pasang", 7, 10, dict(judul="Setup - VS Code", kepala="Select Additional Tasks", opsi=[["Create a desktop icon", 0], ['Add "Open with Code" action to file context menu', 1], ['Add "Open with Code" action to directory context menu', 1], ["Register Code as an editor for supported file types", 0], ["Add to PATH (requires shell restart)", 1]])),
 ("explorer", 8, 10, dict(path=BL, isi=[["5.3", "folder"], ["blender.exe", "file"], ["blender-launcher.exe", "file"], ["license", "folder"]], sorot=1, salin=True)),
 ("explorer", 8, 10, dict(path="C:\\Users\\kamu\\Documents", isi=[["paket-terakhir", "folder"]], sorot=0, baru=0, menu=["Open", "Open in Terminal", "Open with Code", "Copy as path", "Properties"], menuSorot=2)),
 ("start", 6, 8, dict(ketik="environment", hasil="Edit environment variables for your account")),
 ("envpath", 7, 10, dict(langkah=0)), ("envpath", 8, 10, dict(langkah=1, alamat=BL)),
 ("terminal", 7, 8, dict(baris=[dict(cmd="blender --version", out=["Blender 5.3.0"])], cap="Muncul nomor versi = berhasil")),
 ("terminal", 14, 15, dict(baris=[dict(cmd="git --version", out=["git version 2.52.0.windows.1"]), dict(cmd='git config --global user.name "Nama Kamu"'), dict(cmd='git config --global user.email "email@kamu.com"')])),
 ("editor", 9, 10, dict(folder="paket-terakhir", cmd="git init", out="Initialized empty Git repository in .../paket-terakhir/.git/")),
 ("galat", 9, 10, dict(kartu=[["blender : The term 'blender' is not recognized...", "Tutup terminal, lalu buka terminal baru. Periksa Path: harus folder, bukan file."], ["...running scripts is disabled on this system.", "Jalankan satu kali, lalu ketik Y:", "Set-ExecutionPolicy -Scope CurrentUser RemoteSigned"], ["ffmpeg : The term 'ffmpeg' is not recognized...", "Buka terminal baru setelah winget selesai."]])),
]
os.makedirs("/tmp/uji_siap", exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(args=["--allow-file-access-from-files"]); pg = b.new_page(viewport={"width": 1920, "height": 1080})
    pg.goto((WEB / "render.html").as_uri())
    for s in ["adegan.js", "siap.js"]: pg.evaluate("s => muatSkrip(s)", (F / s).as_uri())
    pg.evaluate("s => muat(s)", [])
    for i, (nama, t, D, a) in enumerate(UJI):
        d = pg.evaluate("([n,t,D,a]) => gambar(n,t,D,a)", [nama, t, D, a])
        open(f"/tmp/uji_siap/{i:02d}.jpg", "wb").write(base64.b64decode(d.split(",", 1)[1]))
    b.close()
subprocess.run("ffmpeg -loglevel error -y -pattern_type glob -i '/tmp/uji_siap/[0-9]*.jpg' -vf scale=640:-1,tile=3x5 /tmp/uji_siap/lembar.jpg", shell=True)
