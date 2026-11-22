"""Gabung versi typing along: bab lama tanpa ketikan (Pembuka, Persiapan, Bab 1-2) diambil dari video lama apa adanya,
Bab 3-12 dari hasil rakit baru. Keluaran di akhir/: mp4, srt, chapter.txt."""
import subprocess, glob, re, os, json
B = "/home/user/antre"; OUT = B + "/akhir"; os.makedirs(OUT, exist_ok=True); LAMA = "/mnt/project-files/antrean/Sistem_Antrean_dari_Nol"
JUDUL = {"A03": "Bab 3: SQL dengan tangan sendiri", "A04": "Bab 4: Server pertama", "A05": "Bab 5: REST API ambil nomor",
         "A06": "Bab 6: Dua petugas menekan Panggil bersamaan", "A07": "Bab 7: Reservasi slot tanpa dobel booking", "A08": "Bab 8: Login dan keamanan",
         "A09": "Bab 9: Layar TV real time dan suara", "A10": "Bab 10: Halaman pelanggan, petugas, dan TV", "A11": "Bab 11: Laporan dan pengujian",
         "A12": "Bab 12: Online dengan Docker dan HTTPS"}
def dur(f): return float(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries", "stream=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout.strip())
def ts(s): h, m = divmod(int(s), 3600); m, d = divmod(m, 60); return f"{h}:{m:02d}:{d:02d}" if h else f"{m}:{d:02d}"
def srt_t(s): ms = round(s * 1000); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); d, ms = divmod(ms, 1000); return f"{h:02d}:{m:02d}:{d:02d},{ms:03d}"
def srt_s(t): h, m, r = t.split(":"); d, ms = r.split(","); return int(h) * 3600 + int(m) * 60 + int(d) + int(ms) / 1000
def blok(f): return [b.split("\n") for b in open(f).read().strip().split("\n\n")]
# batas bab lama: kalimat pertama Bab 3 mulai 1,9 dtk setelah awal bab (lead lama)
k3 = [x.strip() for x in re.split(r"(?<=[.!?])\s+", json.load(open(B + "/naskah_A03.json"))[0]["teks"])][0]
lama = blok(LAMA + ".srt"); i3 = next(i for i, b in enumerate(lama) if " ".join(b[2:]).strip() == k3)
T = float(os.environ.get("BATAS") or 1247.14)  # tepat sebelum keyframe awal Bab 3 (1247,1497) di video lama
bagian = OUT + "/lama_00_02.mp4"
if not os.path.exists(bagian):
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", LAMA + ".mp4", "-t", f"{T:.3f}", "-c", "copy", bagian], check=True)
daftar = [f"file '{bagian}'"]; srt = []; n = 1
for b in lama[:i3]:
    srt.append(f"{n}\n{b[1]}\n" + "\n".join(b[2:])); n += 1
bab = [l.strip() for l in open("/mnt/project-files/antrean/chapter.txt") if "Bab 3" not in l and re.match(r"\d", l)][:4]  # Pembuka, Persiapan, Bab 1, Bab 2
t0 = dur(bagian); print("bagian lama", T, t0)
for kode, judul in JUDUL.items():
    f = [x for x in glob.glob(f"{B}/{kode}/{kode}_*.mp4") if "_short" not in x][0]
    daftar.append(f"file '{f}'"); bab.append(f"{ts(t0)} {judul}")
    for b in blok(f[:-4] + ".srt"):
        a, z = [srt_s(x.strip()) for x in b[1].split("-->")]
        srt.append(f"{n}\n{srt_t(a + t0)} --> {srt_t(z + t0)}\n" + "\n".join(b[2:])); n += 1
    t0 += dur(f)
open("/tmp/claude-0/gabung.txt", "w").write("\n".join(daftar) + "\n")
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", "/tmp/claude-0/gabung.txt", "-c", "copy", "-movflags", "+faststart", OUT + "/Sistem_Antrean_dari_Nol.mp4"], check=True)
open(OUT + "/Sistem_Antrean_dari_Nol.srt", "w").write("\n\n".join(srt) + "\n")
open(OUT + "/chapter.txt", "w").write("\n".join(bab) + "\n")
print("durasi total", ts(t0)); print("\n".join(bab))
