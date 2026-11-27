"""script.json (video utama) dan short/script.json dari naskah_doc.json (salinan tabel naskah di Claude Doc, sudah disunting Bu Dewi).
Kolom: [id, narasi, layar]. UCAP = ejaan khusus untuk TTS; HOLD = jeda setelah narasi (detik), diisi hold.json dari hitung_hold.py bila ada."""
import json, os
D = os.path.dirname(os.path.abspath(__file__))
rows = json.load(open(D + "/naskah_doc.json"))
SEG = ["Pembuka", "Masalahnya", "Apa itu Lean?", "Mencoba tanpa memasang apa pun", "Bukti langkah demi langkah", "Bisakah Lean dibohongi?",
       "Memasang di komputer sendiri", "Peta belajar selanjutnya", "Penutup"]
GANTI = [("r f l", "er ef el"), ("r w,", "er we,"), ("Perintah r w", "Perintah er we"), ("lipatDua", "lipat dua"), ("cari Lean 4", "cari Lean empat"),
         ("Theorem Proving in Lean 4", "Theorem Proving in Lean Four"), ("p q titik dua Prop", "pe, ki, titik dua Prop")]
def ucap(t):
    u = t
    for a, b in GANTI: u = u.replace(a, b)
    return u
HOLD = json.load(open(D + "/hold.json")) if os.path.exists(D + "/hold.json") else {}
def beats(awalan):
    out = []; rs = [r for r in rows if r[0].startswith(awalan)]
    for i, r in enumerate(rs):
        seg = int(r[0][1:].split("_")[0]) if awalan == "b" else 0
        akhir = i + 1 == len(rs) or (awalan == "b" and int(rs[i + 1][0][1:].split("_")[0]) != seg)
        b = {"id": r[0], "seg": seg, "scene": f"b{seg}", "text": r[1], "hold": HOLD.get(r[0], 6.3 if akhir else 0.6), "layar": r[2]}
        if ucap(r[1]) != r[1]: b["ucap"] = ucap(r[1])
        out.append(b)
    return out
JUDUL = "Apa Itu Lean 4? Belajar Bahasa Pemrograman yang Dipakai untuk Memeriksa Bukti Matematika Buatan AI"
dasar = {"episode": "L01", "title": JUDUL, "kind": "dokumenter", "label": "Tutorial · I Teach Software Engineering", "engine": "manim+rekam",
         "webgl": False, "audio_rate": 44100}
B = beats("b"); B[-1]["hold"] = HOLD.get(B[-1]["id"], 9.0)
json.dump({**dasar, "parts": {"L01": {"segs": list(range(len(SEG)))}}, "segments": SEG, "beats": B}, open(D + "/script.json", "w"), ensure_ascii=False, indent=1)
S = beats("s"); S[-1]["hold"] = 2.0
for b in S: b["hold"] = HOLD.get(b["id"], b["hold"] if b is S[-1] else 0.35)
os.makedirs(D + "/short", exist_ok=True)
json.dump({**dasar, "episode": "L01-short", "segments": ["Short"], "parts": {"L01-short": {"segs": [0]}}, "beats": S}, open(D + "/short/script.json", "w"), ensure_ascii=False, indent=1)
print(len(B), sum(len(b.get("ucap") or b["text"]) for b in B), len(S), sum(len(b.get("ucap") or b["text"]) for b in S))
