"""Gabung L00..L09 menjadi satu video penuh, satu SRT, dan daftar chapter YouTube."""
import subprocess, glob, re, os, json
B = "/home/user/lapor"; OUT = B + "/akhir"; os.makedirs(OUT, exist_ok=True)
BAB = [("L00", "Pembuka: aplikasi buatan AI yang membocorkan laporan"), ("L01", "Bab 1: Persiapan, dari komputer kosong sampai Laravel berjalan"), ("L02", "Bab 2: Kebutuhan, mengobrol dengan pemakai"),
       ("L03", "Bab 3: Merancang data, empat tabel"), ("L04", "Bab 4: Migration dan SQL"), ("L05", "Bab 5: Login dan peran"), ("L06", "Bab 6: Form laporan dan upload foto yang aman"),
       ("L07", "Bab 7: Halaman petugas dan alur status"), ("L08", "Bab 8: Halaman siswa dan hak akses"), ("L09", "Bab 9: Test otomatis dan online dengan HTTPS")]
def dur(f): return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout)
def ts(s): h, m = divmod(int(s), 3600); m, d = divmod(m, 60); return f"{h}:{m:02d}:{d:02d}" if h else f"{m}:{d:02d}"
def srt_t(s): ms = round(s * 1000); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); d, ms = divmod(ms, 1000); return f"{h:02d}:{m:02d}:{d:02d},{ms:03d}"
def srt_s(t): h, m, r = t.split(":"); d, ms = r.split(","); return int(h) * 3600 + int(m) * 60 + int(d) + int(ms) / 1000
daftar, bab, srt, t0, n = [], [], [], 0.0, 1
for kode, judul in BAB:
    f = glob.glob(f"{B}/{kode}/{kode}_*.mp4"); f = [x for x in f if "_short" not in x][0]
    daftar.append(f"file '{f}'"); bab.append(f"{ts(t0)} {judul}")
    for blok in open(f[:-4] + ".srt").read().strip().split("\n\n"):
        bar = blok.split("\n"); a, b = [srt_s(x.strip()) for x in bar[1].split("-->")]
        srt.append(f"{n}\n{srt_t(a + t0)} --> {srt_t(b + t0)}\n" + "\n".join(bar[2:])); n += 1
    t0 += dur(f)
open("/tmp/claude-0/gabung.txt", "w").write("\n".join(daftar) + "\n")
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", "/tmp/claude-0/gabung.txt", "-c", "copy", "-movflags", "+faststart", OUT + "/SiLapor_Laravel_dari_Nol.mp4"], check=True)
open(OUT + "/SiLapor_Laravel_dari_Nol.srt", "w").write("\n\n".join(srt) + "\n")
open(OUT + "/chapter.txt", "w").write("\n".join(bab) + "\n")
print("durasi total", ts(t0)); print("\n".join(bab))
