"""Pembantu rekaman browser: kursor tiruan yang terlihat, gerak halus, ketik per huruf, server Laravel di luar kamera."""
import sys, os, time, subprocess, random
sys.path.insert(0, os.path.dirname(__file__))
from rekam_web import Web, CW, CH, DSF
KURSOR = """(() => { if (window.__kur) return; const pasang = () => { if (document.getElementById('__kur')) return;
  const k = document.createElement('div'); k.id = '__kur'; k.style.cssText = 'position:fixed;left:0;top:0;width:22px;height:22px;z-index:2147483647;pointer-events:none;transform:translate(-100px,-100px)';
  k.innerHTML = '<svg width="22" height="22" viewBox="0 0 22 22"><path d="M2 1 L2 18 L7 13.5 L10.5 21 L13.5 19.5 L10 12.5 L17 12.5 Z" fill="#111" stroke="#fff" stroke-width="1.6"/></svg>';
  document.documentElement.appendChild(k); const p = JSON.parse(sessionStorage.__kp || '[400,300]'); k.style.transform = `translate(${p[0]}px,${p[1]}px)`; };
  window.__kur = 1; document.addEventListener('DOMContentLoaded', pasang); if (document.body) pasang();
  addEventListener('mousemove', e => { const k = document.getElementById('__kur'); if (k) k.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; sessionStorage.__kp = JSON.stringify([e.clientX, e.clientY]); }, true);
  addEventListener('mousedown', e => { const r = document.createElement('div'); r.style.cssText = `position:fixed;left:${e.clientX - 18}px;top:${e.clientY - 18}px;width:36px;height:36px;border-radius:50%;border:3px solid #f59e0b;z-index:2147483646;pointer-events:none;transition:all .45s;opacity:1`;
    document.documentElement.appendChild(r); requestAnimationFrame(() => { r.style.transform = 'scale(1.8)'; r.style.opacity = '0'; }); setTimeout(() => r.remove(), 500); }, true); })()"""
class Peramban(Web):
    def __init__(self, keluar, url="about:blank", **k):
        super().__init__(keluar, "about:blank", **k); self.mx, self.my = 400, 300
        if url != "about:blank": self.pg.goto(url); time.sleep(0.8)
        self.atasUI = self.pg.evaluate("() => window.outerHeight - window.innerHeight")
    def gerak(self, x, y, dur=0.6):
        n = max(8, int(dur * 50)); x0, y0 = self.mx, self.my
        for i in range(1, n + 1):
            k = i / n; e = k * k * (3 - 2 * k); xx, yy = x0 + (x - x0) * e, y0 + (y - y0) * e; self.pg.mouse.move(xx, yy)
            subprocess.run(['xdotool', 'mousemove', str(int(xx * DSF)), str(int((yy + self.atasUI) * DSF))], env=dict(os.environ, DISPLAY=':99')); time.sleep(dur / n * 0.6)
        self.mx, self.my = x, y
    def kotak(self, sel):
        l = self.pg.locator(sel).first; l.scroll_into_view_if_needed(); time.sleep(0.15); bb = l.bounding_box(); return [bb["x"], bb["y"], bb["width"], bb["height"]]
    def klik(self, sel, dur=0.6, jeda=0.5):
        x, y, w, h = self.kotak(sel); self.gerak(x + w / 2, y + h / 2, dur); time.sleep(0.15); self.pg.mouse.down(); time.sleep(0.07); self.pg.mouse.up(); time.sleep(jeda)
    def ketik(self, sel, teks, cps=14):
        self.klik(sel, jeda=0.25)
        for ch in teks: self.pg.keyboard.type(ch); time.sleep(1 / cps * random.uniform(0.6, 1.4))
        time.sleep(0.3)
    def pilih(self, sel, label, jeda=0.6):
        x, y, w, h = self.kotak(sel); self.gerak(x + w / 2, y + h / 2); time.sleep(0.3); self.pg.select_option(sel, label=label); time.sleep(jeda)
    def alamat(self, url, tampil=None, cps=16, jeda=1.0):
        """Ketik alamat di bilah alamat (terlihat), lalu buka."""
        X = lambda *k: subprocess.run(["xdotool", *k], env=dict(os.environ, DISPLAY=":99"))
        X("mousemove", "600", "88"); X("click", "1"); time.sleep(0.3); X("key", "ctrl+a"); time.sleep(0.3)
        for ch in (tampil or url): X("type", ch); time.sleep(1 / cps * random.uniform(0.6, 1.4))
        time.sleep(0.6); X("key", "Return"); time.sleep(0.4)
        try: self.pg.wait_for_load_state("load", timeout=15000)
        except Exception: pass
        time.sleep(jeda)
    def kam(self, sel=None, zoom=None, pad=24, rect=None):
        """Kamera ke elemen halaman (koordinat halaman digeser tinggi bilah browser)."""
        if sel is None and rect is None: self.kamera(None); return
        x, y, w, h = rect or self.kotak(sel); self.kamera([x, y + self.atasUI, w, h], zoom, pad)
    def kam_alamat(self, zoom=1.7): self.kamera([0, 0, CW / zoom, CH / zoom], zoom, pad=0)
    def gulir(self, dy, dur=0.8):
        n = max(6, int(dur * 30))
        for i in range(n): self.pg.mouse.wheel(0, dy / n); time.sleep(dur / n)
        time.sleep(0.3)
def server(proyek="/home/user/proyek/sipinjam", port=8000, host="127.0.0.1"):
    subprocess.run(f"pkill -f 'php -S .*:{port}'", shell=True); time.sleep(0.5)
    p = subprocess.Popen(["/home/user/pinjam/alat/bersih.sh", proyek, f"PHP_CLI_SERVER_WORKERS=4 exec php -S {host}:{port} -t public >/tmp/claude-0/serve_{port}.log 2>&1"])
    for i in range(40):
        if subprocess.run(f"curl -s -o /dev/null --noproxy '*' http://127.0.0.1:{port}/index.php", shell=True).returncode == 0: break
        time.sleep(0.3)
    return p
def matikan(port=8000): subprocess.run(f"pkill -f 'php.*-S .*:{port}'", shell=True)
