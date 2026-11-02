"""Buat narasi Bahasa Indonesia dengan suara neural Microsoft (gratis) untuk episode Kiko.
Cara pakai (di laptop, sekali saja):  pip install edge-tts
Lalu jalankan:                        python buat_suara.py
Hasil: folder suara/ berisi satu MP3 per baris narasi. Zip folder itu dan unggah ke percakapan.
Ganti VOICE menjadi "id-ID-ArdiNeural" untuk suara laki-laki. RATE "-10%" = sedikit lebih pelan."""
import asyncio, json, os, edge_tts
VOICE = "id-ID-GadisNeural"; RATE = "-10%"
naskah = json.load(open("naskah.json", encoding="utf-8"))
os.makedirs("suara", exist_ok=True)
async def main():
    for b in naskah["beats"]:
        out = os.path.join("suara", b["id"] + ".mp3")
        if os.path.exists(out): continue
        await edge_tts.Communicate(b["text"], VOICE, rate=RATE).save(out)
        print("ok", b["id"])
asyncio.run(main())
print("Selesai. Zip folder 'suara' lalu unggah.")
