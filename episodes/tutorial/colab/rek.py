"""Rekam layar Colab ASLI (Chromium di Xvfb :99 + ffmpeg x11grab), sinkron per kalimat narasi.
Login dan run ditirukan lewat fx.js; tidak ada kredensial yang dikirim ke Google.
python3 rek.py            -> rek.mkv + rek.json
CEPAT=1 python3 rek.py    -> uji alur (durasi narasi dipendekkan)"""
import os, sys, time, json, random, subprocess
os.environ["DISPLAY"] = ":99"
from playwright.sync_api import sync_playwright
from naskah import BEATS

D = os.path.dirname(os.path.abspath(__file__))
W, H, DSF = 2560, 1440, 1.6667
CEPAT = float(os.environ.get("CEPAT", "0")) or None
K = json.load(open(D + "/keluaran.json"))
EMAIL = "nama.anda@gmail.com"
BERANDA = "https://colab.research.google.com/"
EDITOR = "https://colab.research.google.com/notebooks/empty.ipynb"
random.seed(7)

def durasi(i):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f"{D}/suara/{i}.mp3"], capture_output=True, text=True)
    return float(r.stdout.strip())
DUR = {b[0]: durasi(b[0]) for b in BEATS}

CURSOR_JS = r"""
(() => {
  const mk = () => {
    if (document.getElementById('__kursor')) return;
    const d = document.createElement('div'); d.id='__kursor';
    d.innerHTML = '<svg width="26" height="38" viewBox="0 0 26 38"><path d="M2 2 L2 30 L9 23.5 L13.8 35 L18.6 33 L13.9 21.8 L23 21.8 Z" fill="#111" stroke="#fff" stroke-width="2" stroke-linejoin="round"/></svg>';
    Object.assign(d.style,{position:'fixed',left:(window.__kx||-100)+'px',top:(window.__ky||-100)+'px',zIndex:2147483647,pointerEvents:'none',transform:'translate(-2px,-2px)',filter:'drop-shadow(0 2px 3px rgba(0,0,0,.35))'});
    const r = document.createElement('div'); r.id='__riak';
    Object.assign(r.style,{position:'fixed',width:'44px',height:'44px',marginLeft:'-22px',marginTop:'-22px',borderRadius:'50%',background:'rgba(255,170,0,.45)',zIndex:2147483646,pointerEvents:'none',transform:'scale(0)',opacity:0});
    document.documentElement.appendChild(r); document.documentElement.appendChild(d);
    addEventListener('mousemove', e => { d.style.left=e.clientX+'px'; d.style.top=e.clientY+'px'; }, true);
    addEventListener('mousedown', e => { r.style.transition='none'; r.style.left=e.clientX+'px'; r.style.top=e.clientY+'px'; r.style.transform='scale(.3)'; r.style.opacity=1; r.offsetWidth; r.style.transition='transform .35s ease-out, opacity .5s ease-out'; r.style.transform='scale(1.2)'; r.style.opacity=0; }, true);
  };
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', mk); else mk();
})();
"""

class Rek:
    def __init__(self):
        px = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
        self.log = {"src": [W, H], "kamera": [], "label": [], "tanda": [], "potong": [], "ucap": [], "kotak": {}}
        self.pw = sync_playwright().start()
        self.b = self.pw.chromium.launch(headless=False, proxy={"server": px} if px else None,
            args=[f"--window-size={round(W/DSF)},{round(H/DSF)}", "--window-position=0,0", f"--force-device-scale-factor={DSF}",
                  "--disable-infobars", "--test-type", "--hide-crash-restore-bubble", "--disable-search-engine-choice-screen",
                  "--disable-features=Translate,OmniboxOnDeviceHeadSuggestions"], ignore_default_args=["--enable-automation"])
        self.ctx = self.b.new_context(no_viewport=True, ignore_https_errors=True, locale="en-US")
        self.ctx.add_init_script(CURSOR_JS); self.ctx.add_init_script(path=D + "/fx.js")
        self.pg = self.ctx.new_page(); self.mx, self.my = 760, 420; self.t0 = None; self.akhir = 0; self.mulai_ucap = 0
        self.oy = 87

    # ---- waktu ----
    def mulai(self):
        import atexit
        for e in (".mkv", ".json"):
            if os.path.exists(D + "/rek" + e): os.remove(D + "/rek" + e)
        self.ff = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "x11grab", "-draw_mouse", "0", "-framerate", "30",
            "-video_size", f"{W}x{H}", "-i", ":99", "-c:v", "libx264", "-preset", "ultrafast", "-crf", "14", "-pix_fmt", "yuv420p", D + "/rek.mkv"], stdin=subprocess.PIPE)
        atexit.register(lambda: self.ff.poll() is None and self.ff.kill())
        time.sleep(1.0); self.pg.evaluate("() => { document.documentElement.style.background = '#000'; }"); self.t0 = time.time()
        self.pg.wait_for_timeout(400); self.pg.evaluate("() => { document.documentElement.style.background = ''; }")
    def t(self): return round(time.time() - self.t0, 3)
    def tidur(self, s):
        if s > 0: self.pg.wait_for_timeout(s * 1000)
    def selesai(self):
        self.tidur(0.3); self.ff.stdin.write(b"q"); self.ff.stdin.flush(); self.ff.wait()
        self.log["durasi"] = self.t(); json.dump(self.log, open(D + "/rek.json", "w"), indent=1)
        self.b.close(); self.pw.stop()
    def tanda(self, nama): self.log["tanda"].append([self.t(), nama])
    def simpan_kotak(self, nama, rect): self.log["kotak"][nama] = [rect[0] * DSF, (rect[1] + self.oy) * DSF, rect[2] * DSF, rect[3] * DSF]
    def ucap(self, i):
        """Mulai kalimat narasi i sekarang."""
        self.mulai_ucap = self.t(); d = DUR[i] * (CEPAT or 1); self.akhir = self.mulai_ucap + d; self.log["ucap"].append([self.mulai_ucap, i]); print(f"{self.mulai_ucap:7.2f} {i}", flush=True)
    def pada(self, dt):
        """Tunggu sampai dt detik sejak kalimat dimulai."""
        self.tidur(self.mulai_ucap + dt * (CEPAT or 1) - self.t())
    def habis(self, sisa=0.6):
        """Tunggu sampai kalimat selesai diucapkan + jeda."""
        self.tidur(self.akhir + sisa - self.t())
    def potong_mulai(self): self._p = self.t()
    def potong_selesai(self, sisa_awal=0.5, sisa_akhir=0.5):
        a, b = self._p + sisa_awal, self.t() - sisa_akhir
        if b - a > 0.3: self.log["potong"].append([round(a, 3), round(b, 3)])

    # ---- kamera & label ----
    def kamera(self, rect=None, zoom=None, pad=30, layar=False):
        if rect is None: self.log["kamera"].append([self.t(), None]); return
        x, y, w, h = rect; x -= pad; y -= pad; w += 2 * pad; h += 2 * pad
        if layar: sx, sy, sw, sh = x, y, w, h
        else: sx, sy, sw, sh = x * DSF, (y + self.oy) * DSF, w * DSF, h * DSF
        z = zoom or max(1.0, min(2.4, W / sw, H / sh))
        self.log["kamera"].append([self.t(), [sx + sw / 2, sy + sh / 2, round(z, 3)]])
    def label(self, teks, gaya="ketik", dur=None): self.log["label"].append([self.t(), teks, gaya, dur])
    def label_mati(self): self.log["label"].append([self.t(), None, None, None])
    def js(self, kode, arg=None): return self.pg.evaluate(kode, arg)
    def sorot(self, rect, pad=6): self.js("([r,p]) => __fx.sorot(r[0],r[1],r[2],r[3],p)", [list(rect[:4]), pad])
    def sorot_mati(self): self.js("() => window.__fx && __fx.sorotMati()")

    # ---- mouse & ketik ----
    def gerak(self, x, y, dur=0.7):
        n = max(8, int(dur * 50)); x0, y0 = self.mx, self.my
        for i in range(1, n + 1):
            k = i / n; e = k * k * (3 - 2 * k)
            self.pg.mouse.move(x0 + (x - x0) * e, y0 + (y - y0) * e); time.sleep(dur / n)
        self.mx, self.my = x, y
    def klik(self, rect=None, xy=None, dur=0.7):
        if rect: xy = (rect[0] + rect[2] / 2, rect[1] + rect[3] / 2)
        self.gerak(*xy, dur=dur); time.sleep(0.25); self.pg.mouse.down(); time.sleep(0.08); self.pg.mouse.up(); time.sleep(0.25)
    def ketik(self, teks, cps=5.5):
        for ch in teks:
            self.pg.keyboard.type(ch)
            d = 1 / cps * random.uniform(0.7, 1.35)
            if ch in ' (),"=+': d *= 1.25
            time.sleep(d)
    def kotak(self, sel, i=0):
        bb = self.pg.locator(sel).nth(i).bounding_box(); return [bb["x"], bb["y"], bb["width"], bb["height"]]
    def xketik(self, teks, cps=6):
        for ch in teks:
            subprocess.run(["xdotool", "type", "--delay", "0", ch]); time.sleep(1 / cps * random.uniform(0.7, 1.3))

def main():
    r = Rek(); pg = r.pg
    pg.goto("about:blank"); r.tidur(1.0)
    r.oy = r.js("() => window.outerHeight - window.innerHeight")
    OMNI = [150, 60, 1900, 56]                       # kotak alamat dalam piksel layar
    r.mulai(); r.tidur(1.0)

    # ================= BAGIAN 1: buka Colab dan login =================
    r.tanda("bab:a")
    r.ucap("a1"); r.pada(2.3)
    r.kamera([0, 0, 1500, 330], layar=True, zoom=1.7, pad=0)
    subprocess.run(["xdotool", "mousemove", "600", "88", "click", "1"]); r.tidur(0.5)
    r.pada(3.6); r.label("colab.research.google.com", "ketik")
    r.xketik("colab.research.google.com", cps=5); r.habis(0.4)
    r.tidur(1.3); subprocess.run(["xdotool", "key", "Return"]); r.label_mati()
    r.potong_mulai(); r.tidur(0.4); r.kamera(None)
    pg.wait_for_load_state("domcontentloaded"); pg.wait_for_selector('a[aria-label="Sign in"]', timeout=60000); r.tidur(3.0)
    r.js("() => __fx.beranda(false)"); pg.mouse.move(r.mx, r.my); r.potong_selesai(0.4, 1.0)
    r.ucap("a2"); r.habis(0.7)
    r.ucap("a3"); r.pada(3.4)
    s = r.kotak('a[aria-label="Sign in"]'); r.kamera([s[0] - 420, s[1] - 20, 520, 250], zoom=1.7); r.gerak(s[0] + s[2] / 2, s[1] + s[3] / 2 + 4, 0.9); r.sorot(s)
    r.habis(0.5); r.sorot_mati(); r.klik(s, dur=0.2)
    r.potong_mulai(); r.kamera(None)
    pg.wait_for_selector("#identifierId", timeout=60000); r.tidur(2.0)
    pg.route("**/*", lambda ro: ro.abort())           # kunci jaringan: tidak ada yang terkirim ke Google
    r.js("(e) => __fx.login(e)", EMAIL); pg.mouse.move(r.mx, r.my); r.potong_selesai(0.4, 0.8)
    r.ucap("a4"); r.pada(0.8)
    f = r.kotak("#identifierId"); n = r.kotak("#identifierNext")
    r.kamera(r.kotak("main"), pad=45)
    r.klik(f); r.label(EMAIL, "ketik"); r.ketik(EMAIL, cps=6); r.tidur(1.5); r.label_mati()
    r.sorot(n); r.tidur(0.3); r.klik(n); r.sorot_mati(); r.tidur(1.4)
    r.klik(f); r.label("password akun Google Anda", "catatan"); r.ketik("rahasia-1234", cps=6); r.tidur(1.2); r.label_mati()
    r.sorot(n); r.tidur(0.3); r.habis(0.2); r.klik(n); r.sorot_mati()
    r.potong_mulai(); r.kamera(None); pg.unroute("**/*")
    r.ctx.add_init_script("window.__masuk = true;")
    pg.goto(BERANDA, wait_until="domcontentloaded"); pg.wait_for_selector('a[aria-label="Sign in"], #fx-avatar', timeout=60000)
    r.js("() => __fx.beranda(true)"); r.tidur(3.0); pg.mouse.move(r.mx, r.my); r.potong_selesai(0.4, 0.8)
    r.ucap("a5"); r.pada(0.8)
    a = r.kotak("#fx-avatar"); r.kamera([a[0] - 430, a[1] - 20, 520, 250], zoom=1.7); r.pada(1.6); r.sorot(a, 8)
    r.habis(0.8); r.sorot_mati(); r.kamera(None); r.tidur(2.2)

    # ================= BAGIAN 2: membuat notebook =================
    r.tanda("bab:b")
    r.ucap("b1"); r.pada(5.3)
    nb = r.js("() => __fx.kotakDalam('New notebook$')")
    r.kamera([nb[0] - 80, nb[1] - 120, 700, 330], zoom=1.6); r.gerak(nb[0] + nb[2] / 2, nb[1] + nb[3] / 2 + 3, 0.9); r.sorot(nb)
    r.habis(0.5); r.sorot_mati(); r.klik(nb, dur=0.2)
    r.potong_mulai(); r.kamera(None)
    pg.goto(EDITOR, wait_until="domcontentloaded"); pg.wait_for_selector(".cell.code .monaco-editor", timeout=90000); r.tidur(3.0)
    r.js("() => __fx.rapikan()")
    r.js("""() => { for (const b of document.querySelectorAll('md-icon-button, button')) { const l = (b.getAttribute('aria-label') || b.getAttribute('data-aria-label') || b.title || ''); const q = b.getBoundingClientRect(); if (/close/i.test(l) && q.x > innerWidth * 0.6 && q.y > 150 && q.width > 0) { b.click(); return l; } } return null; }""")
    r.tidur(2.0); r.js("() => document.activeElement && document.activeElement.blur()"); pg.mouse.move(r.mx, r.my); r.potong_selesai(0.4, 1.0); r.log["tanda"].append([r._p + 0.45, "editor"])
    r.ucap("b2"); r.pada(0.9)
    dn = r.kotak("#doc-name")
    r.kamera([dn[0] - 70, dn[1] - 30, 560, 200], zoom=1.9); r.pada(2.2); r.sorot(dn, 4)
    r.pada(5.0); r.sorot_mati(); r.klik([dn[0], dn[1], dn[2] - 10, dn[3]]); r.gerak(dn[0] + 420, dn[1] + 16, 0.5)
    pg.keyboard.press("Control+a"); r.tidur(0.5); r.label("program_pertama.ipynb", "ketik"); r.ketik("program_pertama.ipynb", cps=5.5); r.tidur(0.8)
    pg.keyboard.press("Enter"); r.habis(1.2); r.label_mati()
    c0 = r.js("() => __fx.kotak(__fx.sel(0).querySelector('.inputarea'))"); KAM = lambda y, h: r.kamera([0, y, 800, h], zoom=1.9, pad=0)
    r.ucap("b3"); r.kamera([c0[0] - 70, c0[1] - 160, c0[2] + 100, 440]); r.pada(0.9); r.sorot(c0, 4)
    r.pada(6.6); rbt = r.js("() => __fx.kotak(__fx.sel(0).querySelector('colab-run-button'))"); r.sorot([rbt[0] + 3, rbt[1] + 3, rbt[2] - 6, rbt[3] - 6], 3)
    r.habis(1.0); r.sorot_mati(); r.tidur(1.8)

    # ================= BAGIAN 3: program pertama =================
    r.tanda("bab:c")
    r.ucap("c1"); KAM(c0[1] - 150, 420); r.pada(0.4)
    r.klik(xy=(c0[0] + 180, c0[1] + c0[3] / 2)); r.gerak(c0[0] + 430, c0[1] + 95, 0.6); r.pada(2.2); r.label(K["p1"], "ketik")
    r.ketik('print("Halo, dunia!', cps=5); pg.keyboard.press("End"); r.habis(1.8); r.label_mati()
    r.ucap("c2"); r.pada(0.5); b1 = r.js("() => __fx.kotakBaris(0, 1).slice(0, 4)"); r.sorot(b1, 5)
    r.pada(3.3); q = r.js("""() => __fx.kotakTeks(__fx.sel(0).querySelector('.view-lines'), '"Halo, dunia!"')"""); r.sorot(q, 4)
    r.habis(0.7); r.sorot_mati()
    r.ucap("c3"); r.pada(1.5); r.gerak(rbt[0] + rbt[2] / 2, rbt[1] + rbt[3] / 2, 0.9); r.sorot([rbt[0] + 3, rbt[1] + 3, rbt[2] - 6, rbt[3] - 6], 3)
    r.habis(0.5); r.sorot_mati(); r.klik(rbt, dur=0.2); r.js("() => { __fx.tunda(0); __fx.status('Connecting'); }")
    r.gerak(c0[0] + 560, c0[1] + 120, 0.6); r.tidur(0.3); r.kamera(None)
    r.ucap("c4"); r.pada(1.0); cb = r.kotak("colab-connect-button"); r.kamera([cb[0] - 330, cb[1] - 60, 520, 230], zoom=1.75); r.pada(1.8); r.sorot(cb, 4)
    r.pada(3.6); r.js("() => __fx.status('Initializing')"); r.pada(5.6); r.js("() => __fx.status('ok')"); r.habis(0.3); r.sorot_mati()
    KAM(c0[1] - 150, 420); r.tidur(0.9)
    r.ucap("c5"); r.pada(0.5); r.js("(h) => __fx.hasil(0, 1, h, false, '0s')", K["o1"]); r.tanda("hasil1")
    r.pada(1.4); o = r.js("() => __fx.kotakTeks(__fx.keluaran(0), 'Halo, dunia!')"); r.sorot(o, 6)
    r.pada(4.6); st = r.js("() => __fx.kotak(__fx.sel(0).querySelector('colab-run-button').shadowRoot.querySelector('.status'))"); r.sorot(st, 3)
    r.habis(1.0); r.sorot_mati(); r.tidur(1.8)

    # ================= BAGIAN 4: program kedua, lalu error =================
    r.tanda("bab:d")
    r.kamera(None); r.tidur(0.8)
    r.ucap("d1"); r.pada(2.4); ac = r.kotak("#toolbar-add-code"); r.kamera([0, ac[1] - 110, 760, 420], zoom=1.75, pad=0); r.gerak(ac[0] + ac[2] / 2, ac[1] + ac[3] / 2, 0.9); r.sorot(ac, 2)
    r.habis(0.4); r.sorot_mati(); r.klik(ac, dur=0.2); r.tidur(1.0)
    c1 = r.js("() => __fx.kotak(__fx.sel(1).querySelector('.inputarea'))"); KAM(c0[1] - 60, 440); r.tidur(1.2)
    r.ucap("d2"); r.pada(0.6); r.klik(xy=(c1[0] + 180, c1[1] + c1[3] / 2)); r.gerak(c1[0] + 520, c1[1] + 150, 0.6); r.pada(2.0)
    for j, baris in enumerate(K["p2"].split("\n")):
        if j: pg.keyboard.press("End"); time.sleep(0.2); pg.keyboard.press("Enter"); r.tidur(0.5)
        r.label(baris, "ketik")
        if baris.startswith("print("): r.ketik(baris[:-1], cps=6)       # kurung tutup otomatis
        elif baris.endswith('"'): r.ketik(baris[:-1], cps=6)            # tanda petik penutup otomatis
        else: r.ketik(baris, cps=6)
        pg.keyboard.press("End"); r.tidur(1.3)
    r.habis(0.3); r.tidur(2.2); r.label_mati(); r.tanda("ketik2")
    c1 = r.js("() => __fx.kotak(__fx.sel(1).querySelector('.inputarea'))"); rb2 = r.js("() => __fx.kotak(__fx.sel(1).querySelector('colab-run-button'))")
    r.ucap("d3"); r.pada(0.5); KAM(c1[1] - 60, 440); r.gerak(rb2[0] + rb2[2] / 2, rb2[1] + rb2[3] / 2, 0.8); r.pada(1.7); r.klik(rb2, dur=0.2); r.js("() => __fx.tunda(1)")
    r.tidur(0.9); r.js("(h) => __fx.hasil(1, 2, h + '<div class=\"fx-next\">Next steps:<span class=\"btn\"><md-icon style=\"--md-icon-size:18px\">spark</md-icon>Explain error</span></div>', true, '0s')", K["o2"]); r.tanda("galat")
    r.gerak(c1[0] + 640, c1[1] + 30, 0.6)
    r.pada(4.2); r.sorot(r.js("() => __fx.kotakTeks(__fx.keluaran(1), 'Halo, Rani')"), 5)
    r.pada(7.3); ko = r.js("() => __fx.kotak(__fx.keluaran(1).querySelector('pre') || __fx.keluaran(1))"); tb = r.js("() => { const a = __fx.kotakTeks(__fx.keluaran(1), '-----------'), b = __fx.kotakTeks(__fx.keluaran(1), 'TypeError: can only concatenate str (not \"int\") to str'), c = __fx.kotakTeks(__fx.keluaran(1), '---------------------------------------------------------------------------'); return [c[0], c[1], c[2], b[1] + b[3] - c[1]]; }"); r.sorot(tb, 6)
    r.habis(0.6)
    G = lambda s, ke=0: r.js("([s, k]) => __fx.kotakTeks(__fx.keluaran(1), s, k)", [s, ke])
    r.simpan_kotak("tb", tb); r.simpan_kotak("akhir", G('TypeError: can only concatenate str (not "int") to str')); r.simpan_kotak("pesan", G('can only concatenate str (not "int") to str')); r.simpan_kotak("panah", G('----> 4 print("Tahun depan umurku " + umur + 1)')); r.simpan_kotak("halo", G("Halo, Rani"))
    r.ucap("d4"); r.habis(0.9); r.sorot_mati(); r.tidur(0.5); r.tanda("galat_diam"); r.tidur(1.6)

    # ================= BAGIAN 5: membaca error dan memperbaiki =================
    r.tanda("bab:e")
    T = lambda s, ke=0: r.js("([s, k]) => __fx.kotakTeks(__fx.keluaran(1), s, k)", [s, ke])
    r.ucap("e1"); r.label("Langkah 1: lihat baris paling bawah", "langkah"); r.pada(1.3); r.sorot(T('TypeError: can only concatenate str (not "int") to str'), 5)
    r.pada(5.6); r.sorot(T("TypeError", 1), 4); r.habis(0.8)
    r.ucap("e2"); r.label("Langkah 2: baca pesannya", "langkah"); r.pada(1.3); r.sorot(T('can only concatenate str (not "int") to str'), 4); r.habis(0.8)
    r.ucap("e3"); r.label("Langkah 3: cari tanda panah", "langkah"); r.pada(1.3); r.sorot(T("----> 4"), 4); r.pada(3.6); r.sorot(T('----> 4 print("Tahun depan umurku " + umur + 1)'), 5); r.habis(0.8); r.label_mati()
    r.ucap("e4"); r.pada(1.6); b4 = r.js("() => __fx.kotakBaris(1, 4).slice(0, 4)"); r.sorot(b4, 5)
    r.pada(4.6); pl = r.js("""() => __fx.kotakTeks(__fx.kotakBaris(1, 4)[4], '" + umur')"""); r.sorot(pl, 4); r.habis(0.8); r.sorot_mati()
    r.ucap("e5"); r.pada(1.2); r.label('print("Tahun depan umurku", umur + 1)', "ketik")
    p1 = r.js("""() => __fx.kotakTeks(__fx.kotakBaris(1, 4)[4], '+')"""); r.sorot(p1, 4); r.pada(2.6)
    r.klik(xy=(p1[0] + p1[2] + 0.5, p1[1] + p1[3] / 2)); r.sorot_mati(); r.gerak(p1[0] + 60, p1[1] + 62, 0.5); r.tidur(0.4)
    pg.keyboard.press("Backspace"); r.tidur(0.7); pg.keyboard.press("Backspace"); r.tidur(0.7); r.ketik(",", cps=3); r.tidur(0.9)
    pg.keyboard.press("ArrowLeft"); r.tidur(0.45); pg.keyboard.press("ArrowLeft"); r.tidur(0.6); pg.keyboard.press("Backspace"); r.tidur(0.5); pg.keyboard.press("End")
    r.habis(0.4); r.sorot(r.js("() => __fx.kotakBaris(1, 4).slice(0, 4)"), 5); r.tidur(2.4); r.sorot_mati(); r.label_mati()
    print("baris 4:", r.js("() => __fx.kotakBaris(1, 4)[4].textContent"))
    r.ucap("e6"); r.pada(0.3); r.gerak(rb2[0] + rb2[2] / 2, rb2[1] + rb2[3] / 2, 0.7); r.klik(rb2, dur=0.2); r.js("() => __fx.tunda(1)")
    r.tidur(0.8); r.js("(h) => __fx.hasil(1, 3, h, false, '0s')", K["o3"]); r.tanda("beres"); r.gerak(c1[0] + 640, c1[1] + 30, 0.6)
    r.pada(4.4); r.sorot(r.js("() => __fx.kotakTeks(__fx.keluaran(1), 'Tahun depan umurku 16')"), 3); r.habis(1.0); r.sorot_mati(); r.tidur(0.5); r.tanda("beres_diam"); r.tidur(1.8)

    # ================= PENUTUP =================
    r.tanda("tutup")
    r.ucap("p1"); r.habis(0.8)        # panel tiga langkah ditambahkan saat perakitan
    r.tanda("tantangan"); r.ucap("p2"); r.pada(1.6); r.label("Tantangan: hapus satu tanda petik, jalankan, lalu baca error-nya", "catatan"); r.habis(2.5)
    r.selesai()

if __name__ == "__main__":
    main()
