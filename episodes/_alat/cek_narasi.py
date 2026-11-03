"""Cek panjang narasi: berapa baris kartu narasi tiap beat (huruf 44 px tebal 700, lebar 1660 px, sama dengan kiko-core.js).

    python3 episodes/_alat/cek_narasi.py <kode> [--maks 3]

Kartu tiga baris berawal di y≈841; empat baris di y≈784 dan bisa menutupi gambar di bawahnya.
"""
import sys
from PIL import ImageFont
from episode import find_root, load_script

root, rest = find_root(sys.argv[1:])
maks = int(rest[rest.index("--maks") + 1]) if "--maks" in rest else 3
font = ImageFont.truetype("/usr/share/fonts/opentype/inter/Inter-Bold.otf", 44)


def lines(s):
    out, cur = [], ""
    for w in s.split(" "):
        t = cur + " " + w if cur else w
        if font.getlength(t) > 1660 and cur: out.append(cur); cur = w
        else: cur = t
    return out + ([cur] if cur else [])


bad = 0
for b in load_script(root)["beats"]:
    n = len(lines(b["text"]))
    if n > maks:
        bad += 1
        print(f"{b['id']:10s} {n} baris  top≈{round(1056 - (n * 44 * 1.3 + 44))}  {b['text'][:70]}…")
print(f"{bad} beat lebih dari {maks} baris" if bad else f"semua beat ≤ {maks} baris")
