from vc import *
SPEK = open("/home/user/vibe/teks/SPEK.md").read()
ATUR = open("/home/user/vibe/teks/CLAUDE.md").read()
v = VC("/home/user/vibe/raw/V02")
v.palet("View: Move Panel Right"); time.sleep(1)
v.palet("Terminal: Create New Terminal"); time.sleep(2); v.tata(); time.sleep(1); v.foto("/tmp/tata.png")
# V02: tulis spek
v.mulai("/home/user/vibe/raw/V02")
v.tanda("mulai"); v.tunggu(1.5)
v.perintah("touch SPEK.md", tunggu=1.2); v.buka("SPEK.md"); v.tanda("spek_kosong"); v.tunggu(2)
bag = SPEK.split("\n## ")
for i, b in enumerate(bag):
    teks = b if i == 0 else "\n## " + b
    nama = ["judul", "masalah", "pengguna", "fitur", "tidak", "aturan", "contoh"][i]
    v.tanda(nama)
    if nama == "contoh":
        a, rest = teks.split("| Orang", 1)
        v.ketik_editor(a, 55); v.tanda("tabel_hasil"); v.ketik_editor("| Orang" + rest, 55)
    else:
        v.ketik_editor(teks, 45)
    v.tunggu(0.6)
v.tombol("Control+s", 1); v.tanda("spek_selesai"); v.tunggu(2)
v.tombol("Control+Home", 1); v.tunggu(1.5); v.tanda("akhir")
v.stop()
# V03: siapkan proyek
v.mulai("/home/user/vibe/raw/V03")
v.tanda("mulai"); v.tunggu(1)
v.palet("Terminal: Focus Terminal")
v.perintah("git init", tunggu=1.5); v.tanda("git_init"); v.tunggu(2)
v.perintah("touch CLAUDE.md", tunggu=1); v.buka("CLAUDE.md"); v.tanda("claude_md"); v.tunggu(1)
v.ketik_editor(ATUR, 38); v.tombol("Control+s", 1); v.tanda("claude_md_selesai"); v.tunggu(2)
v.palet("Terminal: Focus Terminal")
v.perintah('node -p "0.1 + 0.2"', tunggu=2.5); v.tanda("desimal"); v.tunggu(3)
v.perintah('node -p "50213 + 0"', tunggu=1); v.tunggu(0.5)
v.perintah("clear", tunggu=0.5)
v.tanda("commit")
v.perintah("git add .", tunggu=1)
v.perintah('git commit -m "Spek dan aturan untuk AI"', tunggu=2.5); v.tunggu(2.5); v.tanda("akhir")
v.stop()
v.foto("/tmp/v03_akhir.png")
v.ctx.close(); v.pw.stop()
