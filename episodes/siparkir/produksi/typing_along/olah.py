"""Perbaikan typing along SiParkir dari video jadi.
python3 olah.py P06 [--rencana]  -> hasil/P06.mp4 + hasil/P06.json (sisipan narasi) ; idempoten (lewati bila sudah ada)."""
import json, os, sys, subprocess, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import peta
from ketik import KETIK
FPS = 30; SRC = "/home/user/kerja/sumber.mp4"; TA = "/home/user/kerja/ta"
HASIL = os.environ.get("HASIL", "/mnt/project-files/siparkir/typing-along/hasil")
FONT_B = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"; FONT_R = "/usr/share/fonts/opentype/inter/Inter-Medium.otf"
ENC = ["-c:v", "libx264", "-preset", "fast", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(FPS), "-an"]
BAR = 84  # tinggi pita label bawah (menutupi juga kotak "dipercepat" lama)

def sh(a): subprocess.run(a, check=True)

def kebijakan(q, d):
    """Kecepatan baru v dan tahan H (detik) untuk part ketik q."""
    sp = q["_sp"]; L = q["_b"] - q["_a"]
    if d["jenis"] == "kode":
        v = 1.0 if sp > 1.0 else sp
        return v, min(9.0, max(4.0, 3.0 + L / 20.0))
    if d.get("tetap"): return sp, 0.0
    v = min(sp, 1.0)
    return v, (2.5 if d["jenis"] == "teks" else (1.0 if v != sp else 0.0))

def tulis(path, s): open(path, "w").write(s); return path

def label_filter(d, t0, t1, th0, tmp, nama):
    """drawbox/drawtext pita bawah dari t0 sampai t1 (detik, relatif segmen); ajakan jeda mulai th0."""
    en = f"enable='between(t,{t0:.3f},{t1:.3f})'"
    if d["jenis"] == "kode": chip = "SALIN DARI GITHUB"; teks = d["isi"] + (f"   ({d['ket']})" if d.get("ket") else "")
    elif d["jenis"] == "cmd": chip = "KETIK DI TERMINAL"; teks = d["isi"]
    else: chip = "UBAH"; teks = d["isi"]
    fs = 30 if len(teks) <= 80 else max(20, int(30 * 80 / len(teks)))
    f1 = tulis(f"{tmp}/{nama}_chip.txt", chip); f2 = tulis(f"{tmp}/{nama}_isi.txt", teks)
    vf = [f"drawbox=x=0:y=ih-{BAR}:w=iw:h={BAR}:color=0x0b1220@1:t=fill:{en}",
          f"drawbox=x=0:y=ih-{BAR}:w=iw:h=3:color=0xfbbf24@1:t=fill:{en}",
          f"drawtext=fontfile={FONT_B}:textfile={f1}:x=36:y=h-{BAR//2}-th/2:fontsize=24:fontcolor=0xfbbf24:{en}",
          f"drawtext=fontfile={FONT_R}:textfile={f2}:x=330:y=h-{BAR//2}-th/2:fontsize={fs}:fontcolor=0xf8fafc:{en}"]
    if th0 is not None:
        f3 = tulis(f"{tmp}/{nama}_jeda.txt", "Belum selesai mengetik?  Jeda video dulu, lalu lanjutkan.")
        ej = f"enable='between(t,{th0:.3f},{t1:.3f})'"
        vf += [f"drawbox=x=iw-860:y=ih-{BAR}-78:w=830:h=62:color=0x0b1220@1:t=fill:{ej}",
               f"drawbox=x=iw-860:y=ih-{BAR}-78:w=8:h=62:color=0xfbbf24@1:t=fill:{ej}",
               f"drawtext=fontfile={FONT_B}:textfile={f3}:x=w-830:y=h-{BAR}-47-th/2:fontsize=28:fontcolor=0xfbbf24:{ej}"]
    return ",".join(vf)

_JEDA = {}
def jeda_narasi(P, t0, F1):
    """Titik tengah jeda (koma, napas) >= 0,3 dtk di narasi bab, detik lokal."""
    if P in _JEDA: return _JEDA[P]
    import re as _re
    a1 = F1 / FPS
    r = subprocess.run(["ffmpeg", "-ss", f"{t0:.3f}", "-t", f"{a1-t0:.3f}", "-i", SRC, "-vn", "-af", "silencedetect=n=-38dB:d=0.3", "-f", "null", "-"], capture_output=True, text=True).stderr
    ev = _re.findall(r"silence_(start|end): ([\d.]+)", r); titik = []; st = 0.0
    for k, v in ev:
        if k == "start": st = float(v)
        else: titik.append(min(st + 0.4, (st + float(v)) / 2))
    _JEDA[P] = titik; return _JEDA[P]

def rencana(P):
    h = peta.peta(); B = h[P]; bab = peta.BAB; k = bab.index(P)
    F0 = round(B["t0"] * FPS); F1 = round(h[bab[k + 1]]["t0"] * FPS) if k + 1 < len(bab) else None
    if F1 is None:
        F1 = int(subprocess.check_output(["ffprobe", "-v", "error", "-count_packets", "-select_streams", "v", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", SRC]))
    # batas kalimat (detik lokal bab)
    kal = []; mulai = 0.0
    for b in B["beats"]:
        kal += [mulai + x for x in b["kalT"]]; mulai += b["D"]
    seg = []; sisip = []; cur = F0
    for q in B["parts"]:
        d = KETIK.get((P, q["no"], q["i"]))
        if not d: continue
        fa = round(q["t"] * FPS); fb = round((q["t"] + q["_d"]) * FPS)
        v, H = kebijakan(q, d)
        pre = round(q["_pre"] * FPS); fket = round((q["_b"] - q["_a"]) / q["_sp"] * FPS)
        fket = min(fket, fb - fa - pre); fsisa = (fb - fa) - pre - fket  # sisa = tahan lama (bingkai beku dari rakit)
        fket2 = round(fket * q["_sp"] / v); fH = round(H * FPS)
        n_baru = pre + fket2 + fsisa + fH; delta = n_baru - (fb - fa)
        if fa > cur: seg.append(dict(k="salin", fa=cur, fb=fa))
        seg.append(dict(k="ubah", fa=fa, fb=fb, pre=pre, fket=fket, fket2=fket2, fsisa=fsisa, fH=fH, d=d, n=n_baru,
                        id=f"b{q['no']:02d}_{q['i']}" if isinstance(q['no'], int) else f"b{q['no']}_{q['i']}", sp=q["_sp"], v=v))
        cur = fb
        if delta > 0:
            e = fb / FPS - B["t0"]; s = fa / FPS - B["t0"]
            cand = [c - 0.1 for c in kal if c - 0.1 >= s + 0.5]
            dekat = [c for c in cand if abs(c - e) <= 2.0]
            if dekat: c = min(dekat, key=lambda c: abs(c - e))
            else:
                g = [x for x in jeda_narasi(P, B["t0"], F1) if x >= s + 0.5 and abs(x - e) <= 8.0]
                dekat = cand
                pil = [(abs(x - e), x) for x in g] + [(abs(x - e) + 1.0, x) for x in dekat]
                c = min(pil)[1] if pil else (cand[0] if cand else F1 / FPS - B["t0"])
            sisip.append(dict(c=c, n=delta, e=e, id=seg[-1]["id"]))
    if cur < F1: seg.append(dict(k="salin", fa=cur, fb=F1))
    return dict(P=P, F0=F0, F1=F1, t0=B["t0"], seg=seg, sisip=sisip)

def render(R):
    P = R["P"]; tmp = f"/home/user/kerja/tmp_{P}"; os.makedirs(tmp, exist_ok=True); os.makedirs(HASIL, exist_ok=True)
    out = f"{HASIL}/{P}.mp4"
    if os.path.exists(out): print("sudah ada", out); return
    files = []
    for i, s in enumerate(R["seg"]):
        f = f"{tmp}/s{i:03d}.mp4"; files.append(f)
        if os.path.exists(f) and os.path.exists(f + ".ok"): continue
        if s["k"] == "salin":
            sh(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{s['fa']/FPS:.4f}", "-i", SRC, "-frames:v", str(s["fb"] - s["fa"])] + ENC + [f])
        else:
            pre, fk, fk2, fs, fH = s["pre"], s["fket"], s["fket2"], s["fsisa"], s["fH"]
            k = fk2 / max(1, fk)
            tb = (f"trim=start_frame={pre}:end_frame={pre+fk},setpts=(PTS-STARTPTS)*{k:.5f},fps={FPS},trim=end_frame={fk2},"
                  f"tpad=stop_mode=clone:stop_duration={(fs+fH)/FPS+1:.3f}")
            t_lab0 = pre / FPS; t_end = s["n"] / FPS; th0 = (pre + fk2 + fs) / FPS if s["d"]["jenis"] == "kode" else None
            lab = label_filter(s["d"], t_lab0, t_end, th0, tmp, f"s{i:03d}")
            if pre: fc = f"[0:v]split=2[v1][v2];[v1]trim=start_frame=0:end_frame={pre},setpts=PTS-STARTPTS[a];[v2]{tb}[b];[a][b]concat=n=2:v=1:a=0,{lab}[o]"
            else: fc = f"[0:v]{tb},{lab}[o]"
            sh(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{s['fa']/FPS:.4f}", "-i", SRC, "-filter_complex", fc, "-map", "[o]", "-frames:v", str(s["n"])] + ENC + [f])
        open(f + ".ok", "w").write("1"); print(P, "segmen", i + 1, "/", len(R["seg"]), s["k"], flush=True)
    lst = tulis(f"{tmp}/daftar.txt", "".join(f"file '{f}'\n" for f in files))
    sh(["ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", f"{tmp}/video.mp4"])
    # audio: narasi asli bab ini, hening disisipkan di batas kalimat
    import numpy as np
    SR = 48000; a0 = R["F0"] / FPS; a1 = R["F1"] / FPS
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-ss", f"{a0:.4f}", "-t", f"{a1-a0:.4f}", "-i", SRC, "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2)
    n_tot = round((a1 - a0) * SR); x = np.vstack([x, np.zeros((max(0, n_tot - len(x)), 2), np.float32)])[:n_tot]
    potong = []; pos = 0
    for s in sorted(R["sisip"], key=lambda s: s["c"]):
        c = int(round(s["c"] * SR)) + int(round((R["t0"] - a0) * SR)); c = max(pos, min(c, len(x)))
        potong += [x[pos:c], np.zeros((round(s["n"] / FPS * SR), 2), np.float32)]; pos = c
    potong.append(x[pos:]); y = np.vstack(potong)
    y.astype(np.float32).tofile(f"{tmp}/audio.f32")
    sh(["ffmpeg", "-loglevel", "error", "-y", "-i", f"{tmp}/video.mp4", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", f"{tmp}/audio.f32",
        "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", f"{tmp}/{P}.mp4"])
    sh(["cp", f"{tmp}/{P}.mp4", out + ".part"]); os.replace(out + ".part", out)
    json.dump(dict(R, seg=[{k: v for k, v in s.items() if k != "d"} for s in R["seg"]]), open(f"{HASIL}/{P}.json", "w"), indent=0)
    print("SELESAI", out, flush=True)

if __name__ == "__main__":
    R = rencana(sys.argv[1])
    tambah = sum(s["n"] for s in R["sisip"]) / FPS
    for s in R["sisip"]: print(f"  {s['id']}: +{s['n']/FPS:.1f} dtk, akhir part {s['e']:.1f}, narasi berhenti di {s['c']:.1f} (selisih {s['c']-s['e']:+.1f})")
    print(R["P"], f"durasi {(R['F1']-R['F0'])/FPS:.1f} -> {(R['F1']-R['F0'])/FPS + tambah:.1f} (+{tambah:.1f})")
    if "--rencana" not in sys.argv: render(R)
