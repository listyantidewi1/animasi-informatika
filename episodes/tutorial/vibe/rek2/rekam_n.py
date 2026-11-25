from nvc import *
import subprocess, shutil, glob
RAW = "/home/user/vibe/raw"; P = "/home/kamu/patungan"
def kosongkan():
    for f in glob.glob(P + "/*") + glob.glob(P + "/.[!.]*"):
        shutil.rmtree(f) if os.path.isdir(f) else os.remove(f)
mode = sys.argv[1]
if mode == "N02":
    os.rename(P, f"/tmp/wrap/arsip/patungan_{int(time.time())}"); os.makedirs(P)
    v = NVC(f"{RAW}/N02"); v.pg.mouse.move(1200, 700)
    v.mulai(f"{RAW}/N02"); v.tanda("mulai"); v.tunggu(1.5)
    v.klik(v.pg.locator(".menubar-menu-button").first); v.tanda("menu")
    v.arahkan(v.pg.get_by_role("menuitem", name="File").first, 0.8)
    v.klik(v.pg.get_by_role("menuitem", name="Open Folder...").first, 1.5); v.tanda("dialog")
    v.klik(v.pg.locator(".quick-input-list .monaco-list-row", has_text="patungan").first, 1.0)
    v.klik(v.pg.locator(".quick-input-widget .monaco-button", has_text="OK").first, 1.0); v.tanda("ok")
    time.sleep(7); v.pg = v.ctx.pages[0]; v.tanda("folder_terbuka"); v.tunggu(1.5)
    v.arahkan(v.pg.locator(".explorer-folders-view, .pane-header").first, 0.8)
    v.klik(v.pg.locator('[aria-label^="New File"]').first, 1.0); v.tanda("berkas_baru")
    v.ketik("SPEK.md", 6); time.sleep(0.6); v.tombol("Enter", 1.5); v.tanda("spek_terbuka"); v.tunggu(1.5)
    v.ketik_editor("# Spek: Patungan\n", 12); v.tunggu(2.5); v.tanda("akhir"); v.stop()
    v.ctx.close(); v.pw.stop()
if mode == "N04a":
    os.rename(P, f"/tmp/wrap/arsip/patungan_{int(time.time())}"); os.makedirs(P)
    subprocess.run(f"cd {P} && git -C /home/user/proyek/patungan archive 2a33f28 | tar -x -C {P} && git init -q && git add . && git -c user.name=kamu -c user.email=kamu@laptop commit -qm 'Spek dan aturan untuk AI'", shell=True, check=True)
    v = NVC(f"{RAW}/N04a", folder=P); v.buka("SPEK.md"); time.sleep(1)
    v.palet("Terminal: Create New Terminal"); time.sleep(2); v.tata(220, 760); time.sleep(1)
    v.palet("Terminal: Kill All Terminals"); time.sleep(1.5); v.pg.mouse.move(1200, 700)
    v.mulai(f"{RAW}/N04a"); v.tanda("mulai"); v.tunggu(1.5)
    v.klik(v.pg.locator(".menubar-menu-button").first); v.tanda("menu")
    v.arahkan(v.pg.get_by_role("menuitem", name="Terminal").first, 0.8)
    v.klik(v.pg.get_by_role("menuitem", name="New Terminal").first, 2.5); v.tanda("terminal")
    v.pg.mouse.move(-10, -10)
    v.ketik("# pasang sekali saja: npm install -g @anthropic-ai/claude-code", 22); time.sleep(0.5); v.tombol("Enter", 1.0); v.tanda("pasang"); v.tunggu(2)
    v.ketik("claude", 8); time.sleep(0.5); v.tanda("ketik_claude"); v.tombol("Enter", 5); v.tanda("claude_buka"); v.tunggu(2)
    v.foto("/tmp/wrap/n04a_end.png"); v.tunggu(2); v.tanda("akhir"); v.stop()
    v.ctx.close(); v.pw.stop()
if mode == "N04c":
    v = NVC(f"{RAW}/N04c", folder=P); v.buka("src/main.js"); time.sleep(1)
    v.palet("Terminal: Create New Terminal"); time.sleep(2); v.tata(220, 760); time.sleep(1); v.pg.mouse.move(-10, -10)
    v.perintah("clear", tunggu=0.8)
    v.mulai(f"{RAW}/N04c"); v.tanda("mulai"); v.tunggu(1)
    v.perintah("npm run dev", tunggu=3.5); v.tanda("dev_lokal"); v.tunggu(2)
    v.tombol("Control+c", 1.2); v.tanda("berhenti"); v.tunggu(1)
    v.ketik("npm run dev -- --host", 10); time.sleep(0.5); v.tanda("ketik_host"); v.tombol("Enter", 3.5); v.tanda("network"); v.tunggu(4)
    v.foto("/tmp/wrap/n04c_end.png"); v.tanda("akhir"); v.stop()
    v.ctx.close(); v.pw.stop()
