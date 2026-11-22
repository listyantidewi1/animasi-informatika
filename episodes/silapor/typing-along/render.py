"""Render ulang SiLapor versi typing along dari data/rencana.json.
python3 render.py rencana        -> data/potongan.json (daftar potongan + peta waktu)
python3 render.py video [L04..]  -> potongan mp4 di /home/user/ta/potong (dilewati bila sudah ada: aman diulang)
python3 render.py audio          -> /home/user/ta/audio.wav
python3 render.py gabung         -> MP4 + SRT + chapter di /mnt/project-files/silapor/typing-along/"""
import json, os, sys, subprocess, hashlib, bisect
import numpy as np
from concurrent.futures import ThreadPoolExecutor
from tabel import tabel, BAB
import pita, srt as SRT
V = "/mnt/project-files/silapor/SiLapor_Laravel_dari_Nol.mp4"; DUR = 3945.556
POT = "/home/user/ta/potong"; OUTD = "/mnt/project-files/silapor/typing-along"; FPS = 30
T = tabel(); R = json.load(open("data/rencana.json"))
CW, CH, CX = 1766, 994, 77   # konten diperkecil 92%, pita 86 px di bawah
JUDUL = {"L00": "Pembuka: aplikasi buatan AI yang membocorkan laporan", "L01": "Bab 1: Persiapan, dari komputer kosong sampai Laravel berjalan", "L02": "Bab 2: Kebutuhan, mengobrol dengan pemakai",
         "L03": "Bab 3: Merancang data, empat tabel", "L04": "Bab 4: Migration dan SQL", "L05": "Bab 5: Login dan peran", "L06": "Bab 6: Form laporan dan upload foto yang aman",
         "L07": "Bab 7: Halaman petugas dan alur status", "L08": "Bab 8: Halaman siswa dan hak akses", "L09": "Bab 9: Test otomatis dan online dengan HTTPS"}
def bab_dari(t):
    for b in BAB:
        if T[b]["mulai"] - 1e-6 <= t < T[b]["mulai"] + T[b]["D"]: return b
    return BAB[-1]
def frames(F): return round(F * FPS) / FPS
# ---------- operasi ----------
def operasi():
    beku = []; lambat = []; label = []
    tt = [x for x in R["titik"]]
    prev = 0.0
    for x in tt:
        t = x["t"]
        if "lambat" in x: lambat.append((x["lambat"][0], x["lambat"][1], x["f"], x["s"]))
        if x["beku"]:
            beku.append(dict(t=t, F=frames(x["F"]), label=x["label"], bab=x["bab"], cepat="lambat" in x, audio=x["audio_t"]))
            c0 = T[x["bab"]]["mulai"]
            a = max(prev, c0, (x["lambat"][0] - 0.5) if "lambat" in x else t - 12.0)
            # label perintah singkat cukup muncul sejak ketikannya dimulai (maks 12 dtk sebelum titik)
            label.append((a, t, x["label"], x["bab"])); prev = t
    for b in BAB[1:]:
        c = T[b]["mulai"] - 0.25; beku.append(dict(t=c, F=2.5, label=[], bab=bab_dari(c), cepat=False, audio=c, bab_freeze=True))
    beku.sort(key=lambda z: z["t"])
    return beku, lambat, label
BEKU, LAMBAT, LABEL = operasi()
def regang(t):
    """Tambahan waktu video lama -> baru karena bagian diperlambat, sampai t."""
    s = 0.0
    for a, b, f, _ in LAMBAT:
        if t > a: s += (min(t, b) - a) * (f - 1)
    return s
def vbaru(t, setelah_beku=True):
    return t + regang(t) + sum(z["F"] for z in BEKU if (z["t"] < t or (setelah_beku and abs(z["t"] - t) < 1e-9)))
def ekstra_titik(z):
    e = z["F"]
    for a, b, f, _ in LAMBAT:
        if abs(b - z["t"]) < 0.6 or (a <= z["t"] <= b + 0.6): pass
    return e
def sisipan_audio():
    """Titik sisip audio: tiap beku + regangan lambat (dibebankan ke titik beku/akhir rentangnya)."""
    pts = []
    for z in BEKU: pts.append([z["audio"], z["F"]])
    for a, b, f, _ in LAMBAT:
        # cari titik beku pada ujung rentang ini; kalau tidak ada (lambat saja), sisip di jeda terdekat ujung rentang
        z = [x for x in BEKU if abs(x["t"] - b) < 2.5 and not x.get("bab_freeze")]
        g = z[0]["audio"] if z else jeda_terdekat(b)
        pts.append([g, (b - a) * (f - 1)])
    pts.sort(); return pts
SUB = SRT.baca("/mnt/project-files/silapor/SiLapor_Laravel_dari_Nol.srt")
def jeda_terdekat(t):
    for a, b, _ in SUB:
        if a - 0.05 <= t <= b + 0.02:
            nxt = [s[0] for s in SUB if s[0] > t]; return nxt[0] - 0.08
    return t
def abaru(t):
    return t + sum(e for g, e in sisipan_audio() if g < t)
# ---------- daftar potongan ----------
def label_di(t):
    for a, b, lab, bb in LABEL:
        if a <= t < b: return lab, bb
    return [], bab_dari(t)
def potongan():
    batas = {0.0, DUR}
    for z in BEKU: batas.add(z["t"])
    for a, b, f, _ in LAMBAT: batas |= {a, b}
    for a, b, _, _ in LABEL: batas |= {a, b}
    for b in BAB: batas.add(T[b]["mulai"])
    batas = sorted(x for x in batas if 0 <= x <= DUR)
    P = []
    for i in range(len(batas)):
        x0 = batas[i]
        for z in BEKU:
            if abs(z["t"] - x0) < 1e-9:
                n0 = vbaru(x0, False); lab, bb = (z["label"], z["bab"]) if not z.get("bab_freeze") else ([], z["bab"])
                P.append(dict(jenis="beku", src=x0, mulai=n0, akhir=n0 + z["F"], label=lab, bab=bb, tutup="dijeda" if (z["cepat"] or any(a - 0.01 <= x0 <= b + 0.1 for a, b, _, _ in LAMBAT)) else None))
        if i + 1 == len(batas): break
        x1 = batas[i + 1]
        if x1 - x0 < 1e-6: continue
        lam = [l for l in LAMBAT if l[0] - 1e-9 <= x0 and x1 <= l[1] + 1e-9]
        f = lam[0][2] if lam else 1.0
        lab, bb = label_di((x0 + x1) / 2)
        if not lab: bb = bab_dari((x0 + x1) / 2)
        tutup = None
        if lam: ef = lam[0][3] / f; tutup = ("kecepatan asli" if ef < 1.15 else f"dipercepat {ef:.1f}x".replace(".", ","))
        P.append(dict(jenis="putar", src=x0, src_akhir=x1, f=f, mulai=vbaru(x0, True), akhir=vbaru(x1, False), label=lab, bab=bb, tutup=tutup))
    for p in P:
        p["n"] = round(p["akhir"] * FPS) - round(p["mulai"] * FPS)
    return [p for p in P if p["n"] > 0]
def nama(p):
    h = hashlib.md5(json.dumps({k: p[k] for k in p if k not in ("mulai", "akhir")}, sort_keys=True).encode() + open(pita.__file__, "rb").read()).hexdigest()[:10]
    return f"{POT}/{round(p['mulai'] * FPS):07d}_{h}.mp4"
FONT = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"
def tutup_vf(teks):
    return (f"drawbox=x=iw-330:y=ih-92:w=300:h=56:color=0x0e1424:t=fill,"
            f"drawtext=fontfile={FONT}:text='{teks}':x=w-180-tw/2:y=h-64-th/2:fontsize=30:fontcolor=0xfbbf24,")
ENC = ["-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-r", "30", "-g", "60", "-video_track_timescale", "15360", "-an"]
def buat(p):
    out = nama(p)
    if os.path.exists(out) and os.path.getsize(out) > 1000: return out
    png = pita.berkas_pita(p["label"], p["bab"]); tmp = out + ".tmp.mp4"
    akhir = f"scale={CW}:{CH}:flags=lanczos,pad=1920:1080:{CX}:0:color=0x0b1020[v];[v][1:v]overlay=0:{CH},format=yuv420p[o]"
    if p["jenis"] == "putar":
        d = p["src_akhir"] - p["src"]
        vf = f"[0:v]trim=duration={d:.4f},setpts=PTS-STARTPTS," + (tutup_vf(p["tutup"]) if p["tutup"] else "") + f"setpts={p['f']:.5f}*PTS,fps=30,tpad=stop_mode=clone:stop_duration=2," + akhir
        cmd = ["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{max(0, p['src'] - 0.5 / FPS):.4f}", "-i", V, "-i", png, "-filter_complex", vf, "-map", "[o]", "-frames:v", str(p["n"])] + ENC + [tmp]
    else:
        jpg = out + ".png"
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", f"{max(0, p['src'] - 1.5 / FPS):.4f}", "-i", V, "-frames:v", "1", jpg], check=True)
        vf = "[0:v]" + (tutup_vf(p["tutup"])[:-1] + "," if p["tutup"] else "") + akhir
        cmd = ["ffmpeg", "-loglevel", "error", "-y", "-loop", "1", "-framerate", "30", "-i", jpg, "-i", png, "-filter_complex", vf, "-map", "[o]", "-frames:v", str(p["n"])] + ENC + [tmp]
    subprocess.run(cmd, check=True)
    if p["jenis"] == "beku": os.remove(jpg)
    os.replace(tmp, out); return out
if __name__ == "__main__":
    os.makedirs(POT, exist_ok=True); os.makedirs(OUTD, exist_ok=True)
    perintah = sys.argv[1]; P = potongan()
    if perintah == "rencana":
        json.dump(P, open("data/potongan.json", "w"), indent=0, ensure_ascii=False)
        tot = P[-1]["akhir"]; print(len(P), "potongan; durasi baru", f"{int(tot // 60)}:{tot % 60:04.1f}", "audio tambah", round(sum(e for _, e in sisipan_audio()), 2), "video tambah", round(tot - DUR, 2))
    elif perintah == "video":
        pilih = sys.argv[2:]
        Q = [p for p in P if not pilih or p["bab"] in pilih or bab_dari(p["src"]) in pilih]
        Q.sort(key=lambda p: -p["n"] if p["jenis"] == "putar" else 0)
        sel = 0
        with ThreadPoolExecutor(3) as ex:
            for i, o in enumerate(ex.map(buat, Q)):
                if i % 25 == 0: print(i, "/", len(Q), flush=True)
        print("selesai", len(Q))
    elif perintah == "audio":
        raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", V, "-vn", "-f", "s16le", "-ac", "2", "-ar", "48000", "-"], capture_output=True).stdout
        a = np.frombuffer(raw, np.int16).reshape(-1, 2); bag = []; pos = 0
        for g, e in sisipan_audio():
            k = min(len(a), round(g * 48000)); bag.append(a[pos:k]); bag.append(np.zeros((round(e * 48000), 2), np.int16)); pos = k
        bag.append(a[pos:]); b = np.concatenate(bag)
        n = round(P[-1]["akhir"] * FPS) * 1600
        b = b[:n] if len(b) >= n else np.concatenate([b, np.zeros((n - len(b), 2), np.int16)])
        import wave
        w = wave.open("/home/user/ta/audio.wav", "wb"); w.setnchannels(2); w.setsampwidth(2); w.setframerate(48000); w.writeframes(b.tobytes()); w.close()
        print("audio", len(b) / 48000)
    elif perintah == "gabung":
        with open("/home/user/ta/daftar.txt", "w") as f:
            for p in P:
                o = nama(p); assert os.path.exists(o), o; f.write(f"file '{o}'\n")
        out = f"{OUTD}/SiLapor_Laravel_dari_Nol_typing_along.mp4"; tmp = "/home/user/ta/gabung.mp4"
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", "/home/user/ta/daftar.txt", "-i", "/home/user/ta/audio.wav",
                        "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", tmp], check=True)
        subprocess.run(["cp", tmp, out], check=True)
        subs = [[abaru(a), abaru(b), t] for a, b, t in SUB]; SRT.tulis(out[:-4] + ".srt", subs)
        def ts(s): h, m = divmod(int(s), 3600); m, d = divmod(m, 60); return f"{h}:{m:02d}:{d:02d}" if h else f"{m}:{d:02d}"
        bab = [f"{ts(0 if b == 'L00' else vbaru(T[b]['mulai'], True))} {JUDUL[b]}" for b in BAB]
        open(f"{OUTD}/chapter.txt", "w").write("\n".join(bab) + "\n"); print("\n".join(bab))
