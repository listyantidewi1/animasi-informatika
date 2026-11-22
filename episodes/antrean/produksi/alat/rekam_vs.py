import re
"""Perekam VS Code sungguhan (code-server) di Chromium --app pada Xvfb :99 2560x1440.
Menyimpan <keluar>.mkv dan <keluar>.json (kamera, label, tanda) untuk pasca.py."""
import os, time, json, random, subprocess, atexit, shutil, glob
CPS_KODE, CPS_TERM = 16, 20  # batas kecepatan ketik mentah (typing along)
os.environ["DISPLAY"] = ":99"
from playwright.sync_api import sync_playwright
W, H, DSF = 2560, 1440, 1.6667
URL = "http://localhost:8080/?folder=/home/user/proyek/siantre"

def hentikan_lama(skrip, proyek="/home/user/proyek/siantre"):
    """Matikan proses 'node <skrip>' lama di folder proyek (job yang lolos dari kill %1)."""
    for d in os.listdir("/proc"):
        if not d.isdigit(): continue
        try:
            cmd = open(f"/proc/{d}/cmdline", "rb").read().split(b"\0")
            if cmd[:2] == [b"node", skrip.encode()] and os.readlink(f"/proc/{d}/cwd") == proyek:
                os.kill(int(d), 15); time.sleep(0.3)
        except Exception: pass

class VS:
    def __init__(self, keluar, url=URL, profil="/tmp/claude-0/prof_rek"):
        self.keluar = keluar; self.log = {"src": [W, H], "kamera": [], "label": [], "tanda": [], "berkas": [], "ketik": []}
        self.akar = url.split("folder=")[-1]; self.berkas = None
        shutil.rmtree(profil, ignore_errors=True)
        self.pw = sync_playwright().start()
        self.ctx = self.pw.chromium.launch_persistent_context(profil, headless=False, no_viewport=True,
            timezone_id="Asia/Jakarta", locale="id-ID",
            args=[f"--app={url}", f"--window-size={round(W/DSF)},{round(H/DSF)}", "--window-position=0,0",
                  f"--force-device-scale-factor={DSF}", "--disable-infobars", "--test-type", "--hide-crash-restore-bubble"],
            ignore_default_args=["--enable-automation"])
        time.sleep(1.5); self.pg = self.ctx.pages[0]; self.mx, self.my = 900, 500
        self.pg.wait_for_selector(".monaco-workbench", timeout=60000); time.sleep(5)
        self.pg.mouse.move(self.mx, self.my)
        self.perintah("Notifications: Toggle Do Not Disturb Mode", 0.6)

    # --- rekaman ---
    def mulai(self):
        if os.path.exists(self.keluar + ".mkv"): os.remove(self.keluar + ".mkv")
        self.ff = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "x11grab", "-draw_mouse", "1", "-framerate", "30",
            "-video_size", f"{W}x{H}", "-i", ":99", "-c:v", "libx264", "-preset", "ultrafast", "-crf", "14", "-pix_fmt", "yuv420p",
            self.keluar + ".mkv"], stdin=subprocess.PIPE)
        atexit.register(lambda: self.ff.poll() is None and self.ff.kill())
        time.sleep(0.5); self.t0 = time.time()
    def t(self): return round(time.time() - self.t0, 3)
    def selesai(self):
        time.sleep(0.4); self.ff.stdin.write(b"q"); self.ff.stdin.flush(); self.ff.wait()
        self.log["durasi"] = self.t(); json.dump(self.log, open(self.keluar + ".json", "w"), indent=1)
        self.ctx.close(); self.pw.stop()
    def tanda(self, nama): self.log["tanda"].append([self.t(), nama]); print(f"[{self.t():7.2f}] {nama}", flush=True)
    def label(self, teks, dur=3.0, posisi="atas"): self.log["label"].append([self.t(), teks, dur, posisi])

    # --- kamera (kotak dalam css px) ---
    def kamera(self, rect=None, zoom=None, pad=30):
        if rect is None: self.log["kamera"].append([self.t(), None]); return
        x, y, w, h = rect; x -= pad; y -= pad; w += 2 * pad; h += 2 * pad
        sx, sy, sw, sh = x * DSF, y * DSF, w * DSF, h * DSF
        z = zoom or max(1.0, min(2.2, W / sw, H / sh))
        self.log["kamera"].append([self.t(), [sx + sw / 2, sy + sh / 2, z]])
    def kotak(self, sel):
        bb = self.pg.locator(sel).first.bounding_box(); return [bb["x"], bb["y"], bb["width"], bb["height"]]
    def kamera_editor(self, zoom=1.45):
        """Fokus ke baris kursor di editor, lebar tetap supaya kode terbaca."""
        loc = self.pg.locator(".monaco-editor.focused .cursors-layer .cursor").first
        try: c = loc.bounding_box(timeout=3000)
        except Exception:
            print("kamera_editor: editor tidak fokus, fokuskan ulang", flush=True)
            self.pg.keyboard.press("Escape"); time.sleep(0.2); self.fokus_editor()
            try: c = loc.bounding_box(timeout=3000)
            except Exception: c = None
        ed = self.kotak(".editor-group-container")
        if not c: self.kamera(ed); return
        self.kamera([ed[0], c["y"] - 120, ed[2] * 0.9, 240], zoom=zoom, pad=0)
    def kamera_terminal(self, zoom=1.5):
        tx = self.pg.locator(".xterm-helper-textarea").first.bounding_box(); pn = self.kotak(".part.panel")
        if not tx: self.kamera(pn); return
        self.kamera([pn[0], tx["y"] - 160, pn[2] * 0.85, 260], zoom=zoom, pad=0)

    # --- mouse ---
    def gerak(self, x, y, dur=0.6):
        n = max(8, int(dur * 60)); x0, y0 = self.mx, self.my
        for i in range(1, n + 1):
            k = i / n; e = k * k * (3 - 2 * k)
            self.pg.mouse.move(x0 + (x - x0) * e, y0 + (y - y0) * e); time.sleep(dur / n)
        self.mx, self.my = x, y
    def klik(self, sel=None, xy=None, dur=0.6):
        if sel:
            x, y, w, h = self.kotak(sel); xy = (x + w / 2, y + h / 2)
        self.gerak(*xy, dur=dur); time.sleep(0.1); self.pg.mouse.down(); time.sleep(0.07); self.pg.mouse.up(); time.sleep(0.25)

    # --- catatan berkas aktif dan ketikan (untuk label GitHub dan titik jeda) ---
    def _t(self): return self.t() if hasattr(self, "t0") else 0.0
    def catat_berkas(self, nama, baru=False):
        c = [f for f in glob.glob(self.akar + "/**/" + os.path.basename(nama), recursive=True) + glob.glob(self.akar + "/" + os.path.basename(nama)) if "/node_modules/" not in f]
        c = sorted(set(c), key=lambda f: (-os.path.getctime(f) if baru else 0, not f.endswith("/" + nama), len(f)))
        self.berkas = os.path.relpath(c[0], self.akar) if c else nama
        self.log["berkas"].append([self._t(), self.berkas]); print(f"[{self._t():7.2f}] berkas {self.berkas}", flush=True)
    def _di_editor(self):
        try: return bool(self.pg.evaluate("() => !!(document.activeElement && document.activeElement.closest('.editor-group-container'))"))
        except Exception: return False
    # --- ketik ---
    def ketik(self, teks, cps=16, _catat=True):
        if _catat and len(teks) >= 12:
            ed = self._di_editor(); minta = cps; cps = min(cps, CPS_KODE if ed else CPS_TERM); t0 = self._t(); self.ketik(teks, cps, _catat=False)
            self.log["ketik"].append([t0, self._t(), len(teks), self.berkas if ed else None, "kode" if ed else "cmd", minta, cps]); return
        for ch in teks:
            self.pg.keyboard.type(ch)
            d = 1 / cps * random.uniform(0.55, 1.45)
            if ch in " (),;:": d *= 1.3
            time.sleep(d)
    def ketik_kode(self, kode, cps=16, ikuti=True, durasi=None):
        """Ketik kode baris demi baris (autoIndent mati, jadi spasi diketik sendiri).
        durasi: perkiraan total detik, cps disesuaikan."""
        baris = kode.strip("\n").split("\n"); minta = cps; cps = min(cps, CPS_KODE); t_mulai = self._t()
        # Kalau kursor berada sebelum teks yang sudah ada di baris ini, teks itu jangan ikut "terdorong" di belakang
        # kursor selama mengetik (membingungkan penonton): pindahkan dulu ke baris bawah, lalu sambung lagi di akhir.
        pisah = False
        try:
            info = self.pg.evaluate("""() => {
                const ed = document.querySelector('.monaco-editor.focused'); if (!ed) return null;
                const st = document.getElementById('status.editor.selection'); const m = st && st.textContent.match(/Col (\\d+)/);
                const cur = ed.querySelector('.view-overlays .current-line'); if (!m || !cur) return null;
                const top = cur.parentElement.style.top;
                for (const l of ed.querySelectorAll('.view-lines .view-line')) if (l.style.top === top) return [l.textContent.replace(/\\u00a0/g, ' '), +m[1]];
                return null; }""")
            if info and info[0][info[1] - 1:].strip():
                pisah = True; self.pg.keyboard.press("Enter"); time.sleep(0.08); self.pg.keyboard.press("ArrowUp"); time.sleep(0.05); self.pg.keyboard.press("End"); time.sleep(0.1)
        except Exception as e: print("pisah?", e)
        if durasi:
            n = sum(len(b.strip()) for b in baris); cps = max(6, min(CPS_KODE, n / max(1, durasi - 0.35 * len(baris))))
        for i, b in enumerate(baris):
            if i:
                self.pg.keyboard.press("Enter"); time.sleep(0.1)
                self.pg.keyboard.press("Shift+Home")  # indentasi otomatis editor (mis. YAML) ikut terpilih lalu tertimpa
            isi = b.lstrip(" "); sp = len(b) - len(isi)
            if sp: self.pg.keyboard.type(" " * sp)
            if ikuti and (i % 4 == 0): self.kamera_editor()
            self.ketik(isi, cps, _catat=False); time.sleep(0.12)
        self.log["ketik"].append([t_mulai, self._t(), sum(len(b.strip()) for b in baris), self.berkas, "kode", minta, cps])
        if pisah: self.pg.keyboard.press("Delete"); time.sleep(0.1)  # sambung lagi: hasil akhir sama persis
    def tekan(self, k, jeda=0.3): self.pg.keyboard.press(k); time.sleep(jeda)
    def perintah(self, nama, jeda=0.8):
        """Jalankan perintah VS Code lewat Command Palette (F1)."""
        self.pg.keyboard.press("F1"); time.sleep(0.5); self.pg.keyboard.type(nama); time.sleep(0.7)
        self.pg.keyboard.press("Enter"); time.sleep(jeda)
    def terminal(self, cmd, cps=18, tunggu=1.0, ikuti=True):
        if ikuti: self.kamera_terminal()
        m = re.search(r"node (\S+) &$", cmd.strip())
        if m: hentikan_lama(m.group(1))  # pastikan server lama di port yang sama sudah mati
        t0 = self._t(); self.ketik(cmd, min(cps, CPS_TERM), _catat=False); self.log["ketik"].append([t0, self._t(), len(cmd), None, "cmd", cps, min(cps, CPS_TERM)]); time.sleep(0.6)
        self.pg.keyboard.press("Enter"); time.sleep(tunggu)
    def fokus_terminal(self):
        self.perintah("Terminal: Focus Terminal", 0.6)
    def fokus_editor(self):
        self.pg.keyboard.press("Control+1"); time.sleep(0.4)  # fokus grup editor tanpa membuka palet perintah
        di_editor = self.pg.evaluate("() => !!(document.activeElement && document.activeElement.closest('.editor-group-container'))")
        if not di_editor and self.pg.locator(".monaco-editor.focused").count() == 0:
            self.perintah("View: Focus Active Editor Group", 0.4)
    def buka(self, nama):
        for coba in range(3):
            self.pg.keyboard.press("Control+P"); time.sleep(0.6); self.ketik(nama, 22); time.sleep(0.9); self.pg.keyboard.press("Enter"); time.sleep(0.8)
            try:
                if nama.split("/")[-1] in self.pg.locator(".tab.active").first.inner_text(timeout=2000):
                    if self.pg.locator(".monaco-editor.focused").count() == 0: self.fokus_editor()
                    self.catat_berkas(nama); return
            except Exception: pass
            self.pg.keyboard.press("Escape"); time.sleep(0.3)
        print("buka gagal", nama, flush=True)
    def berkas_baru(self, nama, akar=False):
        """Klik tombol New File di Explorer lalu ketik nama berkas (relatif ke folder yang sedang dipilih)."""
        if akar:  # klik ruang kosong di Explorer supaya berkas dibuat di folder utama
            b = self.kotak(".explorer-folders-view"); self.klik(xy=(b[0] + b[2] / 2, b[1] + b[3] - 30)); time.sleep(0.3)
        self.gerak(200, 36, 0.5); time.sleep(0.4)
        self.klik('[aria-label^="New File"]'); time.sleep(0.4); self.ketik(nama, 14); time.sleep(0.3)
        self.pg.keyboard.press("Enter"); time.sleep(1.0); self.catat_berkas(nama, baru=True)
