from vc import *
def baca(v, path, blok):
    v.buka(path); time.sleep(0.5)
    v.palet("View: Hide Panel"); time.sleep(0.8)
    for nama, baris in blok:
        v.tombol("Control+g", 0.4); v.ketik(str(baris), 20); v.tombol("Enter", 0.3)
        v.tanda(nama); v.tunggu(3.5)
    v.palet("View: Show Terminal" ) if False else None
    v.pilih_terminal(0)
v = VC("/home/user/vibe/raw/V04c")
v.pilih_terminal(0); print("terminal ok")
# --- V04c: baca main.js dengan editor lebar, lalu commit lewat AI
v.mulai("/home/user/vibe/raw/V04c"); v.tanda("mulai"); v.tunggu(1)
baca(v, "src/main.js", [("blok_state", 1), ("blok_template", 11), ("blok_tampil", 38), ("blok_submit_menu", 58), ("blok_submit_orang", 72)])
v.tanda("commit"); v.prompt("Commit semua perubahan dengan pesan: Kerangka: input menu dan orang", cps=40, batas=300)
v.tunggu(3); v.tanda("akhir"); v.stop()
# --- V05a: tes dulu
v.mulai("/home/user/vibe/raw/V05a"); v.tanda("mulai"); v.tunggu(1)
v.perintah("/clear", tunggu=2)
v.tanda("prompt_tes")
v.prompt("Pasang Vitest. Buat berkas src/hitung.test.js berisi satu tes\nuntuk fungsi hitungPatungan(struk) di src/hitung.js.\nPakai contoh di SPEK.md bagian 6. Angka yang diharapkan:\nAndi 50300, Bela 50300, Citra 47100, Dimas 39700, kelebihan 290.\nJangan buat fungsinya dulu.", cps=40, batas=900)
v.tanda("tes_jadi"); v.tunggu(3)
v.palet("File: Refresh Explorer"); time.sleep(0.5)
v.buka("src/hitung.test.js"); v.palet("View: Hide Panel"); time.sleep(0.8); v.tanda("baca_tes"); v.tunggu(4)
v.tombol("Control+End", 0.5); v.tunggu(4); v.tombol("Control+Home", 0.5); v.tanda("baca_tes_akhir")
v.pilih_terminal(0)
v.tanda("vitest_merah"); v.bash("npx vitest run", tunggu=12); v.tanda("vitest_merah_akhir"); v.tunggu(2)
v.tanda("prompt_fungsi")
v.prompt("Sekarang buat fungsi hitungPatungan di src/hitung.js sampai tes lulus.\nIkuti aturan hitung di SPEK.md bagian 5.", cps=40, batas=900)
v.tanda("fungsi_jadi"); v.tunggu(3)
v.tanda("vitest2"); v.bash("npx vitest run", tunggu=12); v.tanda("vitest2_akhir"); v.tunggu(2)
v.stop(); v.foto("/tmp/v05a.png"); v.ctx.close(); v.pw.stop()
