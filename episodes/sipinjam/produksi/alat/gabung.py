"""Gabung P00..P13 menjadi satu video penuh, satu SRT, dan daftar chapter YouTube."""
import subprocess, glob, re, os, json
B = "/home/user/pinjam"; OUT = B + "/akhir"; os.makedirs(OUT, exist_ok=True)
BAB = [("P00", "Pembuka: satu kamera, dua peminjam"), ("P01", "Bab 1: Persiapan XAMPP, VS Code, Git, dan database"), ("P02", "Bab 2: Kebutuhan dan empat aturan"),
       ("P03", "Bab 3: Merancang database, tujuh tabel"), ("P04", "Bab 4: CREATE TABLE, foreign key, dan index"), ("P05", "Bab 5: Function, stored procedure, dan transaksi"),
       ("P06", "Bab 6: Trigger dan log aktivitas"), ("P07", "Bab 7: PHP dan PDO, prepared statement"), ("P08", "Bab 8: Login, session, dan tiga peran"),
       ("P09", "Bab 9: CRUD alat untuk admin"), ("P10", "Bab 10: Halaman peminjam di HP"), ("P11", "Bab 11: Halaman petugas, denda, dan laporan PDF"),
       ("P12", "Bab 12: Menguji, sepuluh permintaan bersamaan"), ("P13", "Bab 13: Online dengan Nginx dan HTTPS")]
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
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", "/tmp/claude-0/gabung.txt", "-c", "copy", "-movflags", "+faststart", OUT + "/SiPinjam_PHP_MySQL_dari_Nol.mp4"], check=True)
open(OUT + "/SiPinjam_PHP_MySQL_dari_Nol.srt", "w").write("\n\n".join(srt) + "\n")
open(OUT + "/chapter.txt", "w").write("\n".join(bab) + "\n")
print("durasi total", ts(t0)); print("\n".join(bab))
