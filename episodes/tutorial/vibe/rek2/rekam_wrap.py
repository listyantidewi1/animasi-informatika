from wvc import *
import shutil
I = "/tmp/wrap/isi"; P = "/tmp/wrap/patungan"; RAW = "/home/user/vibe/raw"
for n, d in [("main.js", "src"), ("hitung.test.js", "src"), ("hitung.js", "src"), ("sw.js", "public"), ("SPEK.md", ".")]:
    shutil.copy(f"{I}/{n}", f"{P}/{d}/{n}")
v = WVC(f"{RAW}/W04c")
v.palet("View: Toggle Panel Visibility"); time.sleep(1); v.tata_editor(440); time.sleep(0.5)
def siap(path):
    v.buka(path); time.sleep(0.8); v.tombol("Control+Home", 0.5); v.pg.mouse.move(-10, -10); time.sleep(0.8)
# --- W04c: main.js
siap("src/main.js")
v.mulai(f"{RAW}/W04c"); v.tanda("mulai"); v.tunggu(3)
for nama, top in [("blok_state", 1), ("blok_template", 10), ("blok_tampil", 36), ("blok_submit_menu", 56), ("blok_submit_orang", 70)]:
    v.gulir_ke(top); v.tanda(nama); v.tunggu(4.5)
v.tanda("commit"); v.tunggu(2); v.tanda("akhir"); v.stop()
# --- W05a: hitung.test.js
siap("src/hitung.test.js")
v.mulai(f"{RAW}/W05a"); v.tanda("mulai"); v.tunggu(0.5); v.tanda("baca_tes"); v.tunggu(4)
v.gulir_ke(14); v.tunggu(4); v.gulir_ke(1); v.tanda("baca_tes_akhir"); v.tunggu(0.5); v.tanda("akhir"); v.stop()
# --- W05b1: ketik aturan 6 di SPEK.md
siap("SPEK.md")
for _ in range(33): v.pg.keyboard.press("ArrowDown"); time.sleep(0.02)
v.tombol("End", 0.3); v.gulir_ke(20); time.sleep(0.8)
v.mulai(f"{RAW}/W05b1"); v.tanda("mulai"); v.tunggu(1); v.tanda("spek_aturan6")
v.ketik_editor("\n6. Kalau ada menu yang belum dipilih pemakannya, jangan menghitung.\n   Tampilkan pesan: \"Ada menu yang belum dipilih pemakannya\".", 40)
v.tombol("Control+s", 0.8); v.tunggu(2); v.tanda("spek_aturan6_akhir"); v.tunggu(0.5); v.tanda("akhir"); v.stop()
# --- W05b2: baca hitung.js
siap("src/hitung.js")
v.mulai(f"{RAW}/W05b2"); v.tanda("mulai"); v.tunggu(0.5)
v.gulir_ke(9); v.tanda("baca_bagiatas"); v.tunggu(6)
v.gulir_ke(40); v.tanda("baca_bulat"); v.tunggu(9)
v.tanda("prompt_sambung"); v.tunggu(0.5); v.tanda("akhir"); v.stop()
# --- W09b: baca sw.js
siap("public/sw.js")
v.mulai(f"{RAW}/W09b"); v.tanda("mulai"); v.tunggu(0.5)
for top, nama, lama in [(1, "baca_versi", 6), (12, "baca_daftar", 9), (26, "baca_install", 7), (38, "baca_activate", 7), (52, "baca_fetch", 8)]:
    v.gulir_ke(top); v.tanda(nama); v.tunggu(lama)
v.tanda("akhir"); v.stop(); v.ctx.close(); v.pw.stop()
