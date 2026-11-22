"""Pengendali sesi rekaman film3d: VS Code (code-server) + Claude Code di terminal."""
import sys, os, time, json, subprocess
sys.path.insert(0, os.path.dirname(__file__))
from vc import VC, STOP
RAW = "/home/user/animasi-informatika/episodes/tutorial/film3d/raw"
PROYEK = "/home/user/proyek/paket-terakhir"

class Sesi(VC):
    def __init__(self, nama):
        super().__init__(f"{RAW}/{nama}", folder=PROYEK)
        self.nama = nama
    def bersih(self):
        """Tutup semua editor dan terminal lama."""
        self.palet("View: Close All Editors"); time.sleep(0.5)
        self.palet("Terminal: Kill All Terminals"); time.sleep(1.0)
    def tata_awal(self, sidebar=230, panel=900):
        self.palet("Terminal: Create New Terminal"); time.sleep(2.5)
        try: self.tata(sidebar, panel)
        except Exception as e: print("tata gagal", e)
    def claude(self, tunggu=10):
        self.ketik("claude", 10); self.tombol("Enter", tunggu)
    def kirim(self, teks, cps=45, batas=3600):
        """Ketik prompt (baris baru = shift-enter via backslash), tunggu hook Stop."""
        dur = self.prompt(teks, cps=cps, batas=batas)
        print("prompt selesai", round(dur), "dtk", flush=True); return dur
    def catat(self, n): self.tanda(n)

def _klik(self, loc, jeda=0.8):
    b = loc.bounding_box(); x, y = b["x"] + b["width"] / 2, b["y"] + b["height"] / 2
    self.pg.mouse.move(x, y, steps=15); time.sleep(0.35); self.pg.mouse.click(x, y); time.sleep(jeda)
Sesi.klik = _klik
def _gerak_klik(self, x, y, jeda=0.8):
    self.pg.mouse.move(x, y, steps=15); time.sleep(0.35); self.pg.mouse.click(x, y); time.sleep(jeda)
Sesi.gerak_klik = _gerak_klik
def _menu_terminal_baru(self):
    # koordinat CSS dari tata letak tetap (2560x1440, DSF 1.6667)
    self.gerak_klik(19, 14, 1.0)          # tombol menu
    self.pg.mouse.move(104, 172, steps=12); time.sleep(1.0)   # Terminal
    self.pg.mouse.move(250, 172, steps=8); time.sleep(0.3)
    self.gerak_klik(310, 172, 1.5)        # New Terminal
Sesi.menu_terminal_baru = _menu_terminal_baru

def _ke_terminal(self, nama="claude"):
    """Fokus ke terminal bernama nama (klik daftar tab bila ada)."""
    if not self.pg.locator(".part.panel").first.is_visible():
        self.palet("View: Toggle Panel Visibility"); time.sleep(1)
    idx = {"claude": 0, "bash": 1}.get(nama, 0)
    tabs = self.pg.locator(".terminal-tabs-entry")
    if tabs.count() > idx and tabs.nth(idx).is_visible():
        self.klik(tabs.nth(idx), 0.6)
    else:
        raise RuntimeError("daftar tab terminal tidak terlihat")
    self.palet("Terminal: Focus Terminal"); time.sleep(0.5)
Sesi.ke_terminal = _ke_terminal
def _pratinjau(self, path):
    self.palet("View: Close All Editors"); time.sleep(0.5)
    self.buka(path); time.sleep(0.8)
    self.palet("Markdown: Open Preview"); time.sleep(1.5)
    self.palet("View: Join All Editor Groups"); time.sleep(0.8)
Sesi.pratinjau = _pratinjau
