"""Periksa video YouTube mana yang sudah tayang (publik), supaya halaman latihan hanya memasang video yang bisa diputar murid.
Video terjadwal masih pribadi; kalau dipasang, murid melihat "Video tidak tersedia".

  python3 episodes/_alat/yt_tayang.py            periksa semua ID di youtube_id.json, tulis youtube_tayang.json
  python3 episodes/_alat/yt_tayang.py --build    lalu bangun ulang halaman yang daftar videonya berubah

Cara periksa: oEmbed YouTube memberi judul hanya untuk video publik (atau tidak terdaftar); video terjadwal/pribadi tanpa judul.
Video yang pernah tayang tetap dianggap tayang bila pemeriksaan gagal karena jaringan (tidak ada yang dicabut tanpa jawaban jelas).
"""
import json, os, subprocess, sys, urllib.parse, urllib.request, glob

ALAT = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(ALAT))
SRC = os.path.join(ALAT, "youtube_id.json"); OUT = os.path.join(ALAT, "youtube_tayang.json")
import re


def yt_id(v):
    """Sama dengan build.py: link YouTube atau ID 11 karakter -> ID; selain itu kosong."""
    m = re.search(r"(?:youtu\.be/|v=|shorts/|embed/|live/)([A-Za-z0-9_-]{11})", v or "") or re.fullmatch(r"([A-Za-z0-9_-]{11})", (v or "").strip())
    return m.group(1) if m else ""


def cek(vid):
    """True = publik, False = belum tayang/pribadi, None = tidak terjawab (jaringan)."""
    u = "https://www.youtube.com/oembed?format=json&url=" + urllib.parse.quote("https://www.youtube.com/watch?v=" + vid)
    try:
        d = json.load(urllib.request.urlopen(u, timeout=20))
        return bool(d.get("title")), d.get("title", "")
    except urllib.error.HTTPError as e:
        return (False, "") if e.code in (401, 403, 404) else (None, "")
    except Exception:
        return None, ""


ids = {k: yt_id(v) for k, v in json.load(open(SRC, encoding="utf-8")).items() if not k.startswith("_")}
lama = json.load(open(OUT, encoding="utf-8")) if os.path.exists(OUT) else {}
baru = {}
for k, vid in ids.items():
    if not vid: continue
    ok, judul = cek(vid)
    if ok or (ok is None and lama.get(k, {}).get("id") == vid): baru[k] = {"id": vid, "judul": judul or lama.get(k, {}).get("judul", "")}
    print(f"{k:7} {vid}  {'tayang' if k in baru else 'belum tayang'}  {judul[:70]}")
ubah = sorted(k for k in set(baru) | set(lama) if baru.get(k, {}).get("id") != lama.get(k, {}).get("id"))
json.dump(dict(sorted(baru.items())), open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"\n{len(baru)} tayang dari {sum(1 for v in ids.values() if v)} alamat; berubah: {', '.join(ubah) or '-'}")

if "--build" in sys.argv and ubah:
    halaman = set()
    for p in glob.glob(os.path.join(ROOT, "episodes", "*", "script.json")) + glob.glob(os.path.join(ROOT, "episodes", "sim", "*", "script.json")):
        s = json.load(open(p, encoding="utf-8")); parts = list(s.get("parts", {}).keys()) or [s.get("episode")]
        if set(parts) & set(ubah):
            d = os.path.relpath(os.path.dirname(p), os.path.join(ROOT, "episodes")); halaman.add(d)
    for d in sorted(halaman):
        subprocess.run([sys.executable, os.path.join(ALAT, "build.py"), d], check=True)
    print("dibangun ulang:", ", ".join(sorted(halaman)))
