"""Mesin penyunting untuk rekaman bab: mengetik perubahan berkas di VS Code sungguhan sampai isinya sama dengan target,
lalu memeriksa hasilnya di disk. Dipakai rekam.py tiap bab."""
import os, time, difflib, subprocess, sys
sys.path.insert(0, os.path.dirname(__file__))
from rekam_vs import VS
P = "/home/user/proyek/siparkir"
CACAT = []

class Bab:
    def __init__(self, keluar, proyek=P, url=None):
        self.P = proyek
        self.r = VS(keluar, url=url or f"http://localhost:8080/?folder={proyek}")
        self.aktif = None
    # ---------- navigasi ----------
    def uri(self):
        try: return self.r.pg.evaluate("() => { const e = document.querySelector('.editor-group-container.active .monaco-editor[data-uri]'); return e ? e.getAttribute('data-uri') : ''; }")
        except Exception: return ""
    def buka(self, rel):
        r = self.r
        if self.uri().endswith("/" + rel) and r.pg.locator(".monaco-editor.focused").count(): return
        if "/" not in rel:  # berkas di folder utama (termasuk .env): klik di Explorer
            r.perintah("File: Focus on Files Explorer", 0.4); r.perintah("Collapse Folders in Explorer", 0.5)
            r.klik(f'.explorer-folders-view .monaco-list-row[aria-label="{rel}"]'); time.sleep(0.8)
            if self.uri().endswith("/" + rel): r.fokus_editor(); return
        for coba in range(3):
            r.pg.keyboard.press("Control+P"); time.sleep(0.5); r.ketik(rel, 40); time.sleep(0.9); r.pg.keyboard.press("Enter"); time.sleep(0.8)
            if self.uri().endswith("/" + rel):
                if r.pg.locator(".monaco-editor.focused").count() == 0: r.fokus_editor()
                return
            r.pg.keyboard.press("Escape"); time.sleep(0.3)
        raise Exception("buka gagal " + rel)
    def baru(self, rel):
        r = self.r
        r.perintah("File: Focus on Files Explorer", 0.4); r.perintah("Collapse Folders in Explorer", 0.5)
        r.berkas_baru(rel, akar=True)
        if not self.uri().endswith("/" + rel): time.sleep(1.0)
        if not self.uri().endswith("/" + rel): raise Exception("berkas baru gagal " + rel + " -> " + self.uri())
        r.fokus_editor()
    def ke(self, baris, kol=1):
        r = self.r; r.pg.keyboard.press("Control+g"); time.sleep(0.35); r.pg.keyboard.type(f"{baris}:{kol}"); time.sleep(0.25); r.pg.keyboard.press("Enter"); time.sleep(0.3)
    def simpan(self): self.r.tekan("Control+s", 0.5)
    def isi(self, rel):
        p = f"{self.P}/{rel}"; return open(p).read() if os.path.exists(p) else None
    # ---------- mengetik ----------
    def _ketik_baris(self, baris, cps, ikuti=True):
        r = self.r
        for i, b in enumerate(baris):
            if i:
                r.pg.keyboard.press("Enter"); time.sleep(0.07); r.pg.keyboard.press("Shift+Home")
            isi = b.lstrip(" "); sp = len(b) - len(isi)
            if sp: r.pg.keyboard.type(" " * sp)
            if ikuti and i % 4 == 0: r.kamera_editor()
            r.ketik(isi, cps); time.sleep(0.08)
    def ubah(self, rel, target, cps=24, ikuti=True, durasi=None):
        """Sunting berkas rel sampai isinya = target (teks utuh). Berkas baru dibuat lewat Explorer."""
        r = self.r; lama = self.isi(rel)
        if not target.endswith("\n"): target += "\n"
        if lama is None: self.baru(rel); lama = ""
        else: self.buka(rel)
        a = lama.split("\n"); b = target.split("\n")
        ops = [o for o in difflib.SequenceMatcher(None, a, b, autojunk=False).get_opcodes() if o[0] != "equal"]
        if durasi:
            n = sum(len(x.strip()) for o in ops for x in b[o[3]:o[4]]); nb = sum(o[4] - o[3] for o in ops)
            cps = max(8, min(70, n / max(1, durasi - 0.3 * nb)))
        geser = 0
        for tag, i1, i2, j1, j2 in ops:
            L = i1 + 1 + geser; n = i2 - i1; baru = b[j1:j2]
            if tag == "insert" and i1 == len(a) and a and a[-1] == "" and baru and baru[-1] == "":  # sisip setelah baris kosong terakhir: geser satu baris ke atas
                L -= 1; baru = [""] + baru[:-1]
            if tag == "replace" and n == len(baru) and all(self._mirip(x, y) for x, y in zip(a[i1:i2], baru)):
                for k, (x, y) in enumerate(zip(a[i1:i2], baru)):
                    pre = os.path.commonprefix([x, y]); xs, ys = x[len(pre):], y[len(pre):]
                    suf = os.path.commonprefix([xs[::-1], ys[::-1]]); xs, ys = xs[:len(xs) - len(suf)], ys[:len(ys) - len(suf)]
                    self.ke(L + k, len(pre) + 1)
                    if ikuti: r.kamera_editor()
                    time.sleep(0.4)
                    for _ in xs: r.pg.keyboard.press("Shift+ArrowRight"); time.sleep(0.03)
                    time.sleep(0.35)
                    if ys: r.ketik(ys, min(cps, 14))
                    elif xs: r.pg.keyboard.press("Delete")
                    time.sleep(0.3)
                continue
            if n:
                self.ke(L); 
                if ikuti: r.kamera_editor()
                time.sleep(0.3)
                for _ in range(n): r.pg.keyboard.press("Control+Shift+K"); time.sleep(0.12)
                geser -= n
            if baru:
                self.ke(L); r.pg.keyboard.press("Enter"); time.sleep(0.08); r.pg.keyboard.press("ArrowUp"); time.sleep(0.08)
                self._ketik_baris(baru, cps, ikuti); geser += len(baru)
        self.simpan(); time.sleep(0.3)
        if self.isi(rel) != target:
            CACAT.append(rel); print("CACAT", rel, flush=True)
            if os.environ.get("CACAT_STOP", "1") == "1" and len(CACAT) >= 2: print("BERHENTI: dua cacat", flush=True); os._exit(3)
            for d in list(difflib.unified_diff((self.isi(rel) or "").split("\n"), target.split("\n"), lineterm="", n=0))[:20]: print("   ", d, flush=True)
            open(f"{self.P}/{rel}", "w").write(target); time.sleep(1.0)
    @staticmethod
    def _mirip(x, y):
        if not x.strip() or not y.strip(): return False
        pre = os.path.commonprefix([x, y]); xs, ys = x[len(pre):], y[len(pre):]
        suf = os.path.commonprefix([xs[::-1], ys[::-1]])
        return len(xs) - len(suf) <= 40 and (len(pre) + len(suf)) >= 0.3 * max(len(x), len(y))
    # ---------- sorot baris yang sedang dijelaskan ----------
    def baris(self, rel, cari, ke=1):
        k = 0
        for i, b in enumerate(self.isi(rel).split("\n")):
            if cari in b:
                k += 1
                if k == ke: return i + 1
        raise Exception(f"tidak ketemu '{cari}' di {rel}")
    def sorot(self, rel, cari, label, dur=3.0, tanda=None, n=1, zoom=1.4, ke=1):
        """Kursor ke baris berisi `cari`, kamera mendekat, label tampil; n = jumlah baris yang disorot."""
        r = self.r; self.buka(rel); self.ke(self.baris(rel, cari, ke)); time.sleep(0.25)
        if tanda: r.tanda(tanda)
        r.kamera_editor(zoom=zoom)
        if n > 1 and r.log["kamera"][-1][1]: r.log["kamera"][-1][1] += [0, 0, n - 1]
        r.label(label, dur); time.sleep(dur)
    def lihat(self, rel, cari=None, jeda=1.0):
        """Buka berkas, tampilkan seluruh editor (tanpa zoom)."""
        self.buka(rel)
        if cari: self.ke(self.baris(rel, cari))
        self.editor(); time.sleep(jeda)
    def editor(self): self.r.kamera(self.r.kotak(".editor-group-container"), pad=0)
    # ---------- terminal ----------
    def term(self, bersih=True):
        r = self.r; r.kamera(None); r.fokus_terminal(); time.sleep(0.3)
        if bersih: r.tekan("Control+l", 0.3)
        r.kamera_terminal()
    def jalan(self, cmd, tunggu=1.5, cps=22, label=None, dur=3.0, sampai=None, maks=120):
        """Ketik perintah di terminal; sampai = teks yang ditunggu muncul di layar terminal."""
        r = self.r; y0 = self._ykursor(); r.terminal(cmd, cps=cps, tunggu=0.3)
        if sampai:
            t0 = time.time()
            while time.time() - t0 < maks:
                if sampai in self.layar(): break
                time.sleep(0.4)
            else: print("PERINGATAN: tidak muncul:", sampai, flush=True)
            self.ikuti(y0)
        time.sleep(tunggu)
        if label: r.label(label, dur); time.sleep(dur)
    def _ykursor(self):
        try: return self.r.pg.locator(".xterm-helper-textarea").first.bounding_box(timeout=2000)["y"]
        except Exception: return None
    def ikuti(self, y0, zoom=1.5):
        """Panel besar: bila keluaran melewati bingkai kamera, geser kamera ke bawah supaya baris terakhir (ringkasan) terlihat."""
        if not getattr(self, "_bsr", False) or y0 is None: return
        time.sleep(0.4); y1 = self._ykursor()
        if y1 is None: return
        hv = 650; atas = max(0, y0 - 30 - hv / 2)  # pasca memperlebar zoom terminal sampai tepi kanan (±1,29x), jadi tinggi bingkai ±672 px CSS
        if y1 + 50 <= atas + hv: return
        pn = self.r.kotak(".part.panel"); cy = y1 + 50 - hv / 2
        self.r.kamera([pn[0], cy - 130, pn[2] * 0.85, 260], zoom=zoom, pad=0); print("ikuti: kamera turun ke", round(cy), flush=True)
    def layar(self):
        try: return self.r.pg.evaluate("() => [...document.querySelectorAll('.xterm-rows > div, .xterm-accessibility-tree > div')].map(d => d.textContent).join('\\n')")
        except Exception: return ""
def sh(cmd, cwd=P): return subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)

# ---------- tambahan untuk bab kode ----------
A = "/home/user/acuan-siparkir/"
def acuan(rel, tag=None):
    """Isi berkas di aplikasi acuan. tag='bab-05' mengambil isi pada akhir bab itu (git show)."""
    if tag is None: return open(A + rel).read()
    return subprocess.run(["git", "show", f"{tag}:{rel}"], cwd=A, capture_output=True, text=True, check=True).stdout
def mig(nama, proyek=P):
    import glob
    return os.path.relpath(glob.glob(f"{proyek}/database/migrations/*_create_{nama}_table.php")[0], proyek)
def banding(tag, proyek=P):
    """Bandingkan proyek di kamera dengan acuan pada tag (nama berkas migration boleh berbeda)."""
    import re as _re
    daftar = subprocess.run(["git", "ls-tree", "-r", "--name-only", tag], cwd=A, capture_output=True, text=True).stdout.split()
    beda = []
    def norm(t): return _re.sub(r"\n\s*\n(\s*\}\);)", r"\n\1", t)
    for rel in daftar:
        if rel.startswith(".github/") or rel in ("CHANGELOG.md", ".styleci.yml"): continue  # hanya ada bila diambil dari sumber git
        m = _re.match(r"database/migrations/\d{4}_\d\d_\d\d_\d{6}_create_(\w+)_table.php", rel)
        try: sini = open(f"{proyek}/" + (mig(m.group(1), proyek) if m and not rel.startswith("database/migrations/0001") else rel)).read()
        except Exception: beda.append("TIDAK ADA " + rel); continue
        if norm(sini) != norm(acuan(rel, tag)): beda.append("BEDA " + rel)
    print("BANDING", tag, beda or "sama", flush=True); return beda
def _besar(self):
    """Panel terminal layar penuh (untuk keluaran panjang atau sesi mysql)."""
    self.r.kamera(None); self.r.fokus_terminal(); time.sleep(0.3); self.r.perintah("View: Toggle Maximized Panel", 0.8); self.r.tekan("Control+l", 0.3); self.r.kamera_terminal(); self._bsr = True
def _kecil(self):
    self._bsr = False; self.r.kamera(None); self.r.fokus_terminal(); time.sleep(0.2); self.r.perintah("View: Toggle Maximized Panel", 0.8)
def _tunggu(self, teks, maks=30):
    t0 = time.time()
    while time.time() - t0 < maks:
        if teks in self.layar(): return True
        time.sleep(0.3)
    print("PERINGATAN: tidak muncul:", teks, flush=True); return False
def _mysql(self, sandi="gantiSandiIni!"):
    r = self.r; r.terminal("mysql -u siparkir -p siparkir", tunggu=0.5); self.tunggu("Enter password"); time.sleep(0.8); r.ketik(sandi, 10); time.sleep(0.5); r.tekan("Enter", 0.5); self.tunggu("mysql>"); time.sleep(1.0); r.tekan("Control+l", 0.4)
def _sql(self, baris, label=None, dur=3.5, tunggu=1.2, cps=20):
    """Ketik satu perintah SQL (boleh beberapa baris) di sesi mysql."""
    r = self.r
    y0 = self._ykursor()
    for i, b in enumerate(baris if isinstance(baris, list) else [baris]): r.terminal(b, cps=cps, tunggu=0.35)
    time.sleep(min(tunggu, 0.8)); self.ikuti(y0); time.sleep(max(0, tunggu - 0.8))
    if label: r.label(label, dur); time.sleep(dur)
def _salin(self, rel, label=None, dur=3.0, tag=None):
    """Berkas bahan dari GitHub: disalin di luar kamera (isi pada akhir bab `tag`), lalu ditandai dengan label."""
    os.makedirs(os.path.dirname(f"{self.P}/{rel}"), exist_ok=True); open(f"{self.P}/{rel}", "w").write(acuan(rel, tag)); time.sleep(1.0)
    if label: self.r.label(label, dur); time.sleep(dur)
def _commit(self, pesan, tanda=None):
    r = self.r; r.tekan("Control+l", 0.3)
    if tanda: r.tanda(tanda)
    self.jalan("git add .", tunggu=1.0); self.jalan(f'git commit -m "{pesan}"', tunggu=2.0, label="Commit: " + pesan, dur=3.0)
for _n, _f in [("besar", _besar), ("kecil", _kecil), ("tunggu", _tunggu), ("mysql", _mysql), ("sql", _sql), ("salin", _salin), ("commit", _commit)]: setattr(Bab, _n, _f)
def siapkan(tag, seed=None):
    """Kembalikan proyek ke akhir bab sebelumnya dan database ke keadaan yang cocok (di luar kamera)."""
    subprocess.run("pkill -f 'artisan serve'", shell=True)
    print(sh(f"git reset -q --hard {tag} && git clean -qfd && git log --oneline | head -1").stdout)
    b = "/home/user/parkir/alat/bersih.sh " + P + " "
    if seed == "kosong": print(subprocess.run(b + "'php artisan migrate:fresh -q'", shell=True, capture_output=True, text=True).stderr[-300:])
    elif seed == "contoh": print(subprocess.run(b + "'php artisan migrate:fresh --seed -q && php artisan db:seed --class=ContohSeeder -q'", shell=True, capture_output=True, text=True).stderr[-300:])
    elif seed: print(subprocess.run(b + "'php artisan migrate:fresh --seed -q'", shell=True, capture_output=True, text=True).stderr[-300:])
    subprocess.run("rm -rf " + P + "/storage/framework/sessions/* " + P + "/storage/logs/*.log", shell=True)
    subprocess.run("/home/user/parkir/alat/reset_vs.sh", shell=True)
def _taruh(self, rel, isi, label=None, dur=3.0):
    """Berkas sementara/bahan yang ditulis di luar kamera, ditandai dengan label."""
    os.makedirs(os.path.dirname(f"{self.P}/{rel}"), exist_ok=True); open(f"{self.P}/{rel}", "w").write(isi); time.sleep(1.0)
    if label: self.r.label(label, dur); time.sleep(dur)
Bab.taruh = _taruh
