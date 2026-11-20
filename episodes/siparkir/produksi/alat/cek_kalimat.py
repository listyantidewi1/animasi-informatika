"""Lembar periksa sinkron per kalimat untuk beat yang punya waktu ElevenLabs (suara/bNN.json).
Tiap kalimat: satu bingkai di akhir kalimat itu (apa yang sudah tampil saat kalimat selesai diucapkan) + teksnya.
python3 cek_kalimat.py EP no [no...] -> /tmp/claude-0/qa/kal_EP_no.jpg"""
import sys, json, re, subprocess, os, glob
from PIL import Image, ImageDraw, ImageFont
sys.path.insert(0, os.path.dirname(__file__)); from durasi import nm
ep = sys.argv[1]; B = f"/home/user/parkir/{ep}"; mp4 = [f for f in glob.glob(f"{B}/{ep}_*.mp4") if "_short" not in f][0]
W = {w["no"]: w for w in json.load(open(f"{B}/waktu.json"))}; nas = {b["no"]: b["teks"] for b in json.load(open(f"/home/user/parkir/naskah_{ep}.json"))}
nas.update({b["no"]: b["teks"] for b in json.load(open("/home/user/parkir/naskah_sisip.json")).get(ep, [])})
fn = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 17); os.makedirs("/tmp/claude-0/qa", exist_ok=True)
for no in [float(x) if "." in x else int(x) for x in sys.argv[2:]]:
    j = json.load(open(f"{B}/suara/b{nm(no)}.json")); kal = [x.strip() for x in re.split(r"(?<=[.!?])\s+", nas[no]) if x.strip()]
    t0 = W[no]["mulai"]; akhir = [W[no]["kalT"][i] + e - W[no]["w"][i] for i, e in enumerate(j["kalimat"][1:] + [j["akhir"]])]  # sudah termasuk hening sisipan
    n = len(kal); kol = 2 if n <= 4 else 3; bar = -(-n // kol); w, h, th = 800, 450, 64
    lb = Image.new("RGB", (w * kol, (h + th) * bar), "white"); d = ImageDraw.Draw(lb)
    for i, (k, e) in enumerate(zip(kal, akhir)):
        t = t0 + e - 0.15; f = f"/tmp/claude-0/qa/_k.png"
        subprocess.run(["ffmpeg", "-nostdin", "-loglevel", "error", "-y", "-ss", f"{t:.3f}", "-i", mp4, "-frames:v", "1", "-vf", f"scale={w}:-1", f], check=True)
        x, y = (i % kol) * w, (i // kol) * (h + th); lb.paste(Image.open(f), (x, y))
        d.text((x + 6, y + h + 3), f"[{i}] selesai {e:.1f}s: {k[:78]}", fill="black", font=fn); d.text((x + 6, y + h + 24), k[78:165], fill="black", font=fn); d.text((x + 6, y + h + 44), k[165:250], fill="black", font=fn)
    o = f"/tmp/claude-0/qa/kal_{ep}_{nm(no)}.jpg"; lb.save(o, quality=85); print(o)
