"""Waktu setiap kata narasi lewat ElevenLabs Forced Alignment (dari MP3 yang sudah ada, tanpa membuat suara ulang).
  python3 episodes/_alat/align_dok.py dok/D03            semua beat yang belum punya berkas waktu
  python3 episodes/_alat/align_dok.py dok/D03 --ulang    semua beat
Hasil: <episode>/suara_in/waktu/<id>.json = [[kata, mulai, selesai], ...] (detik, relatif terhadap awal MP3).
voice.py memakainya untuk menulis "words" per beat di timeline.json (relatif terhadap awal beat), sehingga at() di adegan
menempelkan gambar dan efek suara pada kata yang benar-benar diucapkan. Kunci API sama dengan suara_elevenlabs.py."""
import json, os, sys, subprocess
import episode as E

ROOT, args = E.find_root([a for a in sys.argv[1:] if not a.startswith("--")]); ULANG = "--ulang" in sys.argv
script = E.load_script(ROOT); SRC = os.path.join(ROOT, "suara_in", "suara"); OUT = os.path.join(ROOT, "suara_in", "waktu"); os.makedirs(OUT, exist_ok=True)
hdr = ["-H", "xi-api-key: " + os.environ["ELEVENLABS_API_KEY"]] if os.environ.get("ELEVENLABS_API_KEY") else []
n = 0
for b in script["beats"]:
    out = os.path.join(OUT, b["id"] + ".json"); mp3 = os.path.join(SRC, b["id"] + ".mp3")
    if (os.path.exists(out) and not ULANG) or not os.path.exists(mp3): continue
    for attempt in range(4):
        r = subprocess.run(["curl", "-s", "-X", "POST", "https://api.elevenlabs.io/v1/forced-alignment", *hdr, "-F", f"file=@{mp3}", "-F", f"text={b['text']}"],
                           capture_output=True, text=True, timeout=180)
        try: d = json.loads(r.stdout); words = [[w["text"], round(w["start"], 3), round(w["end"], 3)] for w in d["words"] if w["text"].strip()]; break
        except Exception: words = None
    if not words: raise SystemExit(f"{b['id']}: penyelarasan gagal: {r.stdout[:300]}")
    json.dump(words, open(out, "w"), ensure_ascii=False); n += 1; print(f"  ok {b['id']} ({len(words)} kata)", flush=True)
print(f"{n} beat diselaraskan -> {OUT}")
