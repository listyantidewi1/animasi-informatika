"""Kit Manim untuk D07: palet, teks, dan BabScene yang menyinkronkan animasi dengan waktu kata narasi.

Pemakaian di babN.py:
    class Bab1(BabScene):
        SEG = 1
        def beat_b1_1(self, b):
            self.play_at(b.at("Bilangan prima"), Write(...), dur=1.2)
            ...
Waktu dari timeline.json (suara sungguhan) atau timeline-perkiraan.json (sebelum suara ada).
Variabel lingkungan D07_TL memaksa salah satu berkas.
"""
import json, os
from manim import *

D = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(D)
TL_PATH = os.environ.get("D07_TL") or next(p for p in [os.path.join(ROOT, "timeline.json"), os.path.join(ROOT, "timeline-perkiraan.json")] if os.path.exists(p))
TL = json.load(open(TL_PATH))

# ---------- palet ----------
BG = "#0E1117"; INK = "#F2F4F8"; INK2 = "#AEB6C6"; DIM = "#5C6578"
PRIMA = "#F2C94C"; NOL = "#EB5757"; KRITIS = "#F2C94C"; LEAN = "#6FCF97"; AI = "#56CCF2"; UNGU = "#9B87F5"; ORANYE = "#F2994A"
PANEL = "#171C26"; GARIS = "#2A3242"
config.background_color = BG
FONT = "Inter"


def T(s, size=36, color=INK, weight=NORMAL, **kw):
    return Text(s, font=FONT, font_size=size, color=color, weight=weight, **kw)


def TB(s, size=36, color=INK, **kw):
    return T(s, size, color, weight=BOLD, **kw)


def kode(s, size=30, color=INK, **kw):
    return Text(s, font="DejaVu Sans Mono", font_size=size, color=color, **kw)


def blok_kode(baris, size=30, warna=INK, jarak=1.45):
    """Baris kode dengan indentasi yang benar (Text membuang spasi awal). Baris kosong tetap memakan tempat."""
    cw = kode("x" * 10, size).width / 10; h = kode("Xg", size).height * jarak
    g = VGroup()
    for i, s in enumerate(baris):
        isi = s.lstrip(" "); n = len(s) - len(isi)
        t = kode(isi if isi else "x", size, warna if isinstance(warna, str) else warna[i])
        if not isi: t.set_opacity(0)
        t.move_to(ORIGIN, aligned_edge=LEFT).shift(RIGHT * n * cw + DOWN * i * h)
        g.add(t)
    return g


def angka(x, dec=0):
    """Angka gaya Indonesia: titik ribuan, koma desimal."""
    s = f"{x:,.{dec}f}"
    return s.replace(",", "_").replace(".", ",").replace("_", ".")


def panel(w, h, color=PANEL, stroke=GARIS, r=0.18):
    return RoundedRectangle(width=w, height=h, corner_radius=r, fill_color=color, fill_opacity=1, stroke_color=stroke, stroke_width=2)


def jendela(judul, w=7.5, h=4.6, warna=GARIS):
    """Jendela aplikasi generik (tanpa merek): bilah judul + tiga titik."""
    badan = panel(w, h)
    bar = Rectangle(width=w, height=0.48, fill_color="#202737", fill_opacity=1, stroke_width=0).align_to(badan, UP)
    bar.round_corners(0.18) if hasattr(bar, "round_corners") else None
    titik = VGroup(*[Dot(radius=0.06, color=c) for c in ("#FF5F57", "#FEBC2E", "#28C840")]).arrange(RIGHT, buff=0.12).next_to(bar.get_left(), RIGHT, buff=0.25)
    jud = T(judul, 20, INK2).move_to(bar)
    return VGroup(badan, bar, titik, jud)


class Beat:
    def __init__(self, d, t0):
        self.d = d; self.id = d["id"]; self.text = d["text"]; self.t0 = d["start"] - t0
        self.start = self.t0; self.end = self.t0 + d["dur"]; self.dur = d["dur"]
        self.speech = d["speech"] - t0
        self.words = d.get("words") or []
        self.speech_end = self.t0 + (self.words[-1][2] if self.words else (d["speech"] - d["start"]) + d.get("audio", 1))

    def _idx(self, s, edge=0):
        i = self.text.find(s)
        if i < 0:
            raise ValueError(f"{self.id}: potongan '{s}' tidak ada di naskah")
        j = i + len(s) - 1 if edge else i
        toks = self.text.split(); pos = 0
        for k, w in enumerate(toks):
            a = self.text.index(w, pos); pos = a + len(w)
            if pos > j:
                return k
        return len(toks) - 1

    def at(self, s, off=0.0):
        """Waktu (relatif awal bab) saat potongan s mulai diucapkan."""
        k = self._idx(s, 0)
        return self.t0 + (self.words[k][1] if k < len(self.words) else 0) + off

    def at_end(self, s, off=0.0):
        k = self._idx(s, 1)
        return self.t0 + (self.words[k][2] if k < len(self.words) else 0) + off


class BabScene(MovingCameraScene):
    SEG = 0

    def setup(self):
        super().setup()
        beats = [b for b in TL["beats"] if b["seg"] == self.SEG]
        t0 = beats[0]["start"]
        self.B = [Beat(b, t0) for b in beats]
        self.total = self.B[-1].end
        self.segs = TL["segments"]

    # ---------- waktu ----------
    @property
    def now(self):
        return self.renderer.time

    def until(self, t):
        d = t - self.now
        if d > 1 / 60:
            self.wait(d)

    def play_at(self, t, *anims, dur=1.0, **kw):
        """Mulai animasi pada waktu t (detik dari awal bab); kalau sudah lewat, mulai sekarang."""
        self.until(t)
        self.play(*anims, run_time=max(dur, 1 / 30), **kw)

    # ---------- kartu bab ----------
    def kartu(self, seg):
        judul = self.segs[seg]
        bul = Circle(radius=0.75, fill_color=PRIMA, fill_opacity=1, stroke_width=0).shift(UP * 1.25)
        num = TB(str(seg), 80, BG).move_to(bul)
        jud = TB(judul, 64, INK)
        if jud.width > 12.6:   # pecah jadi dua baris seimbang
            w = judul.split(); best = min(range(1, len(w)), key=lambda i: abs(len(" ".join(w[:i])) - len(" ".join(w[i:]))))
            jud = VGroup(TB(" ".join(w[:best]), 64, INK), TB(" ".join(w[best:]), 64, INK)).arrange(DOWN, buff=0.25)
            if jud.width > 12.6: jud.scale_to_fit_width(12.6)
        jud.move_to(DOWN * 0.45)
        bul.next_to(jud, UP, buff=0.45); num.move_to(bul)
        garis = Line(LEFT * 0.8, RIGHT * 0.8, color=PRIMA, stroke_width=6).next_to(jud, DOWN, buff=0.35)
        latar = Rectangle(width=30, height=20, fill_color=BG, fill_opacity=1, stroke_width=0)
        return VGroup(latar, bul, num, jud, garis)

    def kartu_masuk(self):
        """Di awal bab (kecuali bab 0): kartu bab lalu memudar ke adegan."""
        if self.SEG == 0 or self.segs[self.SEG].strip().lower() == "penutup":
            return
        k = self.kartu(self.SEG)
        self.add(k); self.wait(0.6); self.play(FadeOut(k), run_time=0.5)

    def kartu_keluar(self):
        """Di akhir bab: layar meredup lalu tunggu sampai bab habis (jeda antarbab)."""
        last = self.B[-1]
        self.until(last.speech_end + 0.4)
        sisa = self.total - self.now
        if sisa > 0.1:
            if self.SEG + 1 < len(self.segs) and self.segs[self.SEG + 1].strip().lower() != "penutup":   # kartu bab berikutnya menutup layar (jeda antarbab lega)
                k = self.kartu(self.SEG + 1).move_to(self.camera.frame.get_center()).scale(self.camera.frame.width / config.frame_width)
                self.play(FadeIn(k), run_time=min(0.8, sisa))
            else:
                self.play(*[FadeOut(m) for m in self.mobjects], run_time=min(1.2, sisa))
            self.until(self.total)

    def construct(self):
        self.kartu_masuk()
        for b in self.B:
            fn = getattr(self, "beat_" + b.id, None)
            if fn:
                fn(b)
            if self.now > b.end + 0.05 and b is not self.B[-1]:
                print(f"PERINGATAN {b.id}: animasi lewat {self.now - b.end:.2f} dtk dari akhir beat")
            self.until(b.end if b is not self.B[-1] else b.start)
        self.kartu_keluar()
        self.until(self.total)
