"""Ekspor naskah narasi untuk dibacakan TTS lain (eksplorasi suara):
  <episode>/tts-kit/naskah-tts.txt   satu baris per beat:  id<TAB>teks
  <episode>/tts-kit/naskah-tts.csv   kolom id,teks (untuk alat TTS massal)
  <episode>/tts-kit/naskah.json      salinan script.json untuk buat_suara.py (edge-tts)
Simpan hasil suaranya sebagai <id>.mp3 (boleh .wav/.m4a/.ogg) di <episode>/suara_in/suara/, lalu jalankan voice.py.
  python3 episodes/_alat/naskah_tts.py D7.0"""
import csv, json, os, shutil, sys
import episode as E

ROOT, _ = E.find_root(sys.argv[1:])
script = E.load_script(ROOT)
kit = os.path.join(ROOT, "tts-kit"); os.makedirs(kit, exist_ok=True)
with open(os.path.join(kit, "naskah-tts.txt"), "w", encoding="utf-8") as f:
    f.write(f"# {script['episode']} {script['title']} — satu baris per potongan narasi: id<TAB>teks. Simpan suaranya sebagai <id>.mp3\n")
    for b in script["beats"]: f.write(f"{b['id']}\t{b['text']}\n")
with open(os.path.join(kit, "naskah-tts.csv"), "w", encoding="utf-8", newline="") as f:
    w = csv.writer(f); w.writerow(["id", "teks"])
    for b in script["beats"]: w.writerow([b["id"], b["text"]])
shutil.copy(os.path.join(ROOT, "script.json"), os.path.join(kit, "naskah.json"))
print(f"{len(script['beats'])} baris -> {kit}/naskah-tts.txt, naskah-tts.csv, naskah.json")
