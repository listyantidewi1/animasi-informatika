"""Hal yang dipakai bersama oleh alat-alat di folder ini: menemukan folder episode, memuat naskah/timeline, menggabungkan mesin gambar.

Setiap episode punya dua versi animasi:
  - "teks"  : tanpa suara, dipacu waktu baca (timeline-teks.json, dibuat timing.py);
  - "suara" : teks + narasi neural (timeline.json + audio/narration.wav, dibuat voice.py).
"""
import json, os, re

ALAT = os.path.dirname(os.path.abspath(__file__))
EPISODES = os.path.dirname(ALAT)
VARIANTS = ("teks", "suara")
TIMELINE_FILE = {"teks": "timeline-teks.json", "suara": "timeline.json"}


def find_root(argv):
    """Folder episode: argumen pertama yang menyebut kode episode (D7.0), atau folder kerja saat ini."""
    args = list(argv)
    if args and os.path.exists(os.path.join(EPISODES, args[0], "script.json")):
        return os.path.join(EPISODES, args.pop(0)), args
    cwd = os.getcwd()
    if os.path.exists(os.path.join(cwd, "script.json")):
        return cwd, args
    raise SystemExit("Jalankan dari folder episode, atau sebut kodenya: python3 episodes/_alat/<alat>.py D7.0 ...")


def load_json(path):
    return json.load(open(path, encoding="utf-8"))


def save_json(obj, path):
    json.dump(obj, open(path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)


def load_script(root):
    return load_json(os.path.join(root, "script.json"))


def timeline_path(root, variant):
    return os.path.join(root, TIMELINE_FILE[variant])


def has_variant(root, variant):
    ok = os.path.exists(timeline_path(root, variant))
    if variant == "suara": ok = ok and os.path.exists(os.path.join(root, "audio", "narration.wav"))
    return ok


def load_timeline(root, variant):
    return load_json(timeline_path(root, variant))


def pick_variants(root, flags, need_audio=True):
    """Versi yang diminta lewat --teks/--suara; tanpa bendera: semua versi yang bahannya sudah ada."""
    want = [v for v in VARIANTS if f"--{v}" in flags]
    if not want:
        want = [v for v in VARIANTS if (has_variant(root, v) if need_audio or v == "teks" else os.path.exists(timeline_path(root, v)))]
    for v in want:
        if not os.path.exists(timeline_path(root, v)):
            raise SystemExit(f"{TIMELINE_FILE[v]} belum ada: jalankan {'timing.py' if v == 'teks' else 'voice.py'} dulu")
        if v == "suara" and need_audio and not os.path.exists(os.path.join(root, "audio", "narration.wav")):
            raise SystemExit("audio/narration.wav belum ada: jalankan voice.py dulu")
    if not want: raise SystemExit("belum ada timeline: jalankan timing.py (versi teks) atau voice.py (versi suara)")
    return want


def engine_js(root, script):
    """Mesin gambar episode = inti bersama + (opsional) modul bersama lain + adegan episode, digabung jadi satu teks."""
    files = script.get("engine", ["../_alat/kiko-core.js", "scenes.js"])
    return "\n".join(open(os.path.join(root, f), encoding="utf-8").read() for f in files)


def timeline_from(script, beats, total):
    """Timeline = semua kunci naskah (judul, segmen, kuis, bagian, dst.) + beats berwaktu + total."""
    return {**{k: v for k, v in script.items() if k != "beats"}, "beats": beats, "total": round(total, 3)}


def code_slug(code):
    return code.replace(".", "").lower()          # D7.5 -> d75


def title_slug(title):
    return re.sub(r"[^A-Za-z0-9]+", "_", title).strip("_")   # untuk nama berkas video
