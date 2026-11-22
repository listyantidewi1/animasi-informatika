"""Potongan playlist per bab dari hasil/Pxx.mp4 + SRT penuh baru."""
import os, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import peta
H = "/mnt/project-files/siparkir/typing-along"; HASIL = H + "/hasil"; OUT = H + "/per-bab"; os.makedirs(OUT, exist_ok=True)
GR = [("SiParkir_01_Pembuka_Persiapan_Kebutuhan", ["P00", "P01", "P02"]), ("SiParkir_02_Database_Migration", ["P03", "P04"]),
      ("SiParkir_03_Login_Admin", ["P05", "P06"]), ("SiParkir_04_Tarif_Masuk_Keluar", ["P07", "P08"]),
      ("SiParkir_05_Struk_Rekap", ["P09", "P10"]), ("SiParkir_06_Test_Online", ["P11", "P12"])]
def dur(f): return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))
def ts(s): h, m = divmod(int(s), 3600); m, d = divmod(m, 60); return f"{h}:{m:02d}:{d:02d}" if h else f"{m}:{d:02d}"
def srt_t(s): ms = round(s * 1000); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); d, ms = divmod(ms, 1000); return f"{h:02d}:{m:02d}:{d:02d},{ms:03d}"
D = {p: dur(f"{HASIL}/{p}.mp4") for p in peta.BAB}; mulai = {}; t = 0
for p in peta.BAB: mulai[p] = t; t += D[p]
srt = peta.baca_srt(f"{H}/SiParkir_Laravel_dari_Nol_typing_along.srt")
JUDUL = dict(zip(peta.BAB, [l.split(" ", 1)[1] for l in open(H + "/chapter.txt").read().strip().split("\n")]))
for nama, ps in GR:
    a = mulai[ps[0]]; b = mulai[ps[-1]] + D[ps[-1]]
    lst = f"/home/user/kerja/pb_{nama}.txt"; open(lst, "w").write("".join(f"file '{HASIL}/{p}.mp4'\n" for p in ps))
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", "-movflags", "+faststart", f"{OUT}/{nama}.mp4"], check=True)
    sub = [(x - a, y - a, s) for x, y, s in srt if a - 0.01 <= x < b]
    open(f"{OUT}/{nama}.srt", "w").write("\n".join(f"{i+1}\n{srt_t(x)} --> {srt_t(y)}\n{s}\n" for i, (x, y, s) in enumerate(sub)))
    open(f"{OUT}/{nama}_chapter.txt", "w").write("\n".join(f"{ts(mulai[p]-a)} {JUDUL[p]}" for p in ps) + "\n")
    print(nama, ts(b - a))
