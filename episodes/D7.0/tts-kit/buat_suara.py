"""Buat narasi Bahasa Indonesia dengan suara neural Microsoft (gratis) untuk episode Kiko D7.0.
Cara pakai (di laptop, sekali saja):  pip install edge-tts
Lalu jalankan di folder ini:          python buat_suara.py
Hasil: folder suara/ berisi satu MP3 per baris narasi (nama = id beat). Salin folder itu ke episodes/D7.0/suara_in/suara/,
lalu jalankan: python3 episodes/_alat/voice.py D7.0 1.18
Ganti VOICE menjadi "id-ID-ArdiNeural" untuk suara laki-laki. RATE "-10%" = sedikit lebih pelan.

UCAP: peta pelafalan khusus untuk suara saja (teks di layar tidak berubah). Suara id-ID biasanya sudah benar melafalkan
mouse, file, keyboard, zoom; istilah di bawah ini yang sering salah. Dengarkan satu-dua berkas dulu, hapus/ubah pasangan
yang justru terdengar aneh, lalu jalankan lagi (berkas yang sudah ada dilewati; hapus MP3-nya bila ingin dibuat ulang)."""
import asyncio, json, os, re, edge_tts
VOICE = "id-ID-GadisNeural"; RATE = "-10%"
UCAP = {"double click": "dabel klik", "touch screen": "tac skrin", "long press": "long pres", "swipe": "swaip",
        "pinch": "pinc", "drag": "dreg", "save": "seiv", "search": "serc", "scroll": "skrol"}
def ucap(teks):
    for a, b in UCAP.items(): teks = re.sub(r"\b" + re.escape(a) + r"\b", b, teks, flags=re.IGNORECASE)
    return teks
naskah = json.load(open("naskah.json", encoding="utf-8"))
os.makedirs("suara", exist_ok=True)
async def main():
    for b in naskah["beats"]:
        out = os.path.join("suara", b["id"] + ".mp3")
        if os.path.exists(out): continue
        await edge_tts.Communicate(ucap(b["text"]), VOICE, rate=RATE).save(out)
        print("ok", b["id"])
asyncio.run(main())
print("Selesai. Salin folder 'suara' ke episodes/D7.0/suara_in/suara/.")
