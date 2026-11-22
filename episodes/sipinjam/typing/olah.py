"""Typing along SiPinjam: pasca-olah satu video bab.
python3 olah.py <Pxx> [--uji DETIK_MULAI DETIK_AKHIR]
- Bagian yang dipercepat (label "dipercepat Nx") diputar ulang pada kecepatan asli (1x).
- Setelah tiap blok ketikan: bekukan hasil ketikan (tahan), bilah bawah mengajak menjeda video.
- Bilah bawah (video diperkecil 95%, tidak menutupi apa pun): berkas yang diketik + alamat GitHub-nya.
- Akhir bab: bekukan frame terakhir 2,5 dtk.
- Narasi: dipotong di jeda antarkalimat, tiap potongan digeser mengikuti gambar (tidak dipercepat).
Keluaran: out/<Pxx>.mp4 + out/<Pxx>.srt + out/<Pxx>.waktu.json (idempoten: tulis ke .tmp lalu rename)."""
import json, sys, os, subprocess, re, glob
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont

FPS = 30; W0, H0 = 1920, 1080; SK = 0.95; WS, HS = 1824, 1026; X0 = (W0 - WS) // 2; BAR = H0 - HS
BG = (11, 16, 32)  # RGB
BAB = dict(eval(open("/home/user/animasi-informatika/episodes/sipinjam/produksi/alat/gabung.py").read().split("BAB = ")[1].split("\ndef dur")[0]))
TAG = {f"P{i:02d}": f"bab-{i:02d}" for i in (1, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13)}
URL_PERINTAH = "github.com/listyantidewi1/animasi-informatika/blob/main/bahan-tutorial/SiPinjam/README.md"
F_B = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"; F_M = "/usr/share/fonts/opentype/inter/Inter-Medium.otf"
if not os.path.exists(F_M): F_M = "/usr/share/fonts/opentype/inter/Inter-Regular.otf"

def fnt(p, s): return ImageFont.truetype(p, s)
def bilah(ep, jenis, berkas, tahan):
    """Gambar bilah bawah 1920x54 (BGR numpy)."""
    im = Image.new("RGB", (W0, BAR), BG); d = ImageDraw.Draw(im)
    d.line([(0, 0), (W0, 0)], fill=(45, 55, 85), width=2)
    no = int(ep[1:]); x = 24; cy = BAR // 2 + 1
    def chip(txt, warna, teks=(11, 16, 32), f=fnt(F_B, 21)):
        nonlocal x
        w = d.textlength(txt, font=f) + 28
        d.rounded_rectangle([x, 9, x + w, BAR - 8], radius=9, fill=warna); d.text((x + 14, cy), txt, font=f, fill=teks, anchor="lm"); x += w + 16
    if tahan:
        # ikon jeda + ajakan
        f = fnt(F_B, 23); txt = "Belum selesai mengetik? Jeda dulu videonya."
        w = d.textlength(txt, font=f) + 70
        d.rounded_rectangle([x, 7, x + w, BAR - 6], radius=10, fill=(251, 191, 36))
        d.rectangle([x + 18, 17, x + 24, BAR - 16], fill=BG); d.rectangle([x + 30, 17, x + 36, BAR - 16], fill=BG)
        d.text((x + 50, cy), txt, font=f, fill=BG, anchor="lm"); x += w + 18
    else:
        chip("BAB %d" % no if no else "PEMBUKA", (251, 191, 36))
    fk = fnt(F_M, 22); fu = fnt(F_B, 22)
    if jenis == "berkas" and berkas and ep in TAG:
        if not tahan:
            d.text((x, cy), "Diketik:", font=fk, fill=(160, 170, 200), anchor="lm"); x += d.textlength("Diketik:", font=fk) + 10
            d.text((x, cy), berkas, font=fu, fill=(255, 255, 255), anchor="lm"); x += d.textlength(berkas, font=fu) + 24
        kanan = [("Salin dari ", fk, (160, 170, 200)), (f"github.com/listyantidewi1/SiPinjam/blob/{TAG[ep]}/{berkas}", fu, (125, 211, 252))]
    elif jenis == "perintah":
        if not tahan:
            d.text((x, cy), "Perintah terminal dan SQL", font=fu, fill=(255, 255, 255), anchor="lm")
        kanan = [("Salin dari ", fk, (160, 170, 200)), (URL_PERINTAH, fu, (125, 211, 252))]
    else:
        if not tahan:
            jd = BAB[ep].split(": ", 1)[-1]
            d.text((x, cy), jd, font=fu, fill=(255, 255, 255), anchor="lm")
        kanan = [("Kode lengkap ", fk, (160, 170, 200)), ("github.com/listyantidewi1/SiPinjam", fu, (125, 211, 252))]
    # teks kanan, rata kanan; kecilkan bila bertabrakan
    for s in (22, 20, 18, 17, 16):
        kk = [(t, fnt(F_B if f is fu else F_M, s), c) for t, f, c in kanan]
        lebar = sum(d.textlength(t, font=f) for t, f, c in kk)
        if W0 - 24 - lebar > x + 10: break
    xr = W0 - 24 - lebar
    d.rectangle([xr - 12, 3, W0, BAR], fill=BG)
    for t, f, c in kk:
        d.text((xr, cy), t, font=f, fill=c, anchor="lm"); xr += d.textlength(t, font=f)
    return cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR)

def label_kecepatan():
    im = Image.new("RGB", (int(300 * SK), int(56 * SK)), (14, 20, 36)); d = ImageDraw.Draw(im)
    d.text((im.width // 2, im.height // 2), "kecepatan asli", font=fnt(F_B, 27), fill=(163, 230, 53), anchor="mm")
    return cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR)

def dur(f): return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))

def main():
    ep = sys.argv[1]; uji = "--uji" in sys.argv
    src = [f for f in sorted(glob.glob("bab/*.mp4"))][int(ep[1:])]
    base = os.path.basename(src)[:-4]
    runs = json.load(open(f"scan/{base}.speed.json"))
    peta = json.load(open("peta.json")).get(ep, [[0, "umum", None]])
    N = int(subprocess.check_output(["ffprobe", "-v", "error", "-count_packets", "-select_streams", "v", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", src]))  # jumlah frame nyata (durasi kontainer bisa lebih panjang)
    # --- kecepatan per frame masukan
    S = np.ones(N + 400)
    for a, b, s in runs:
        if s > 1: S[int(round(a * FPS)):int(round(b * FPS))] = s
    S = S[:N]
    # --- blok ketikan = run S>1 yang berdekatan (celah < 0,6 dtk digabung)
    blok = []; i = 0
    while i < N:
        if S[i] > 1:
            j = i
            while j < N and (S[j] > 1 or (j + 18 < N and S[j:j + 18].max() > 1)): j += 1
            blok.append((i, j)); i = j
        else: i += 1
    # --- tahan setelah blok: sebanding dengan panjang ketikan setelah diperlambat
    tahan = {}
    for a, b in blok:
        pjg = S[a:b].sum() / FPS
        tahan[b - 1] = min(10.0, max(4.0, 2.5 + 0.08 * pjg))
    tahan[N - 1] = tahan.get(N - 1, 0) + 2.5  # akhir bab: freeze frame terakhir
    # --- peta keluaran: tiap frame masukan -> jumlah salinan
    cum = np.concatenate([[0], np.cumsum(S)]); C = np.round(cum).astype(int)
    rep = np.diff(C)
    hold_frames = {k: int(round(v * FPS)) for k, v in tahan.items()}
    # W(t) waktu keluaran untuk waktu masukan t
    tambah = np.zeros(N + 1, dtype=int)
    for k, v in hold_frames.items(): tambah[k + 1:] += v
    def Wt(t):
        i = min(N, max(0, int(t * FPS))); fr = t * FPS - i
        base_ = C[i] + (fr * (S[i] if i < N else 1)) + tambah[i]
        return base_ / FPS
    total_out = (C[N] + sum(hold_frames.values())) / FPS
    # --- bagian (bilah) per waktu masukan
    def bagian(t):
        cur = peta[0]
        for p in peta:
            if p[0] <= t + 0.05: cur = p
        return cur[1], cur[2]
    # --- audio: potong di jeda, geser
    wav = f"tmp/{ep}_in.wav"; os.makedirs("tmp", exist_ok=True); os.makedirs("out", exist_ok=True)
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", src, "-vn", "-ac", "2", "-ar", "48000", "-f", "f32le", wav], check=True)
    A = np.fromfile(wav, dtype=np.float32).reshape(-1, 2); SR = 48000
    lg = subprocess.run(["ffmpeg", "-i", src, "-af", "silencedetect=noise=-40dB:d=0.12", "-f", "null", "-"], capture_output=True, text=True).stderr
    ss = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", lg)]; se = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", lg)]
    tepi = [0.0] + [(a + b) / 2 for a, b in zip(ss, se)] + [len(A) / SR]
    tepi = sorted(set(round(x, 3) for x in tepi))
    potong = []; akhir = 0.0
    out_a = np.zeros((int((total_out + 1) * SR), 2), dtype=np.float32)
    for c0, c1 in zip(tepi[:-1], tepi[1:]):
        if c1 - c0 < 0.01: continue
        t0 = max(Wt(c0), akhir); x = A[int(c0 * SR):int(c1 * SR)]
        k = int(t0 * SR); n = min(len(x), len(out_a) - k)
        if n > 0: out_a[k:k + n] += x[:n]
        potong.append((c0, c1, t0 - c0)); akhir = t0 + (c1 - c0)
    total_out = max(total_out, akhir)
    out_a = out_a[:int(total_out * SR)]
    out_a.tofile(f"tmp/{ep}_out.f32")
    def geser(t):
        g = 0.0
        for c0, c1, o in potong:
            if c0 <= t + 0.02: g = o
            else: break
        return t + g
    # --- SRT
    srt_in = open(f"tmp/{ep}_in.srt").read().strip().split("\n\n")
    def ss_(s): h, m, r = s.split(":"); d, ms = r.split(","); return int(h) * 3600 + int(m) * 60 + int(d) + int(ms) / 1000
    def tt(x): ms = round(x * 1000); h, ms = divmod(ms, 3600000); m, ms = divmod(ms, 60000); d, ms = divmod(ms, 1000); return f"{h:02d}:{m:02d}:{d:02d},{ms:03d}"
    srt = []
    for blk in srt_in:
        bar = blk.split("\n"); a, b = [ss_(x.strip()) for x in bar[1].split("-->")]
        na = geser(a); nb = max(na + 0.5, geser(max(a, b - 0.05)) + 0.05)
        srt.append([na, nb, "\n".join(bar[2:])])
    for i in range(len(srt) - 1): srt[i][1] = min(srt[i][1], srt[i + 1][0] - 0.02)
    open(f"out/{ep}.srt.tmp", "w").write("\n\n".join(f"{i+1}\n{tt(a)} --> {tt(b)}\n{t}" for i, (a, b, t) in enumerate(srt)) + "\n")
    json.dump({"src": src, "N": N, "blok": [[a / FPS, b / FPS] for a, b in blok], "tahan": {str(k / FPS): v for k, v in tahan.items()},
               "durasi_lama": N / FPS, "durasi_baru": total_out, "peta": peta}, open(f"out/{ep}.waktu.json", "w"), indent=1)
    print(ep, "lama", round(N / FPS, 1), "baru", round(total_out, 1), "blok", len(blok), flush=True)
    if "--rencana" in sys.argv: return
    # --- video
    a_uji, b_uji = (float(sys.argv[sys.argv.index("--uji") + 1]), float(sys.argv[sys.argv.index("--uji") + 2])) if uji else (0, 1e9)
    bil = {}; lk = label_kecepatan(); lx, ly = X0 + int(1590 * SK), int(988 * SK)
    vtmp = f"tmp/{ep}_v.mp4"
    dec = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-i", src, "-f", "rawvideo", "-pix_fmt", "bgr24", "-"], stdout=subprocess.PIPE, bufsize=10**8)
    enc = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W0}x{H0}", "-r", str(FPS), "-i", "-",
                            "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", vtmp], stdin=subprocess.PIPE, bufsize=10**8)
    kanvas = np.zeros((H0, W0, 3), np.uint8); kanvas[:] = BG[::-1]
    for i in range(N):
        raw = dec.stdout.read(W0 * H0 * 3)
        if len(raw) < W0 * H0 * 3: break
        t = i / FPS
        n_rep = rep[i]; n_hold = hold_frames.get(i, 0)
        if t < a_uji - 0.1 or t > b_uji: continue
        fr = np.frombuffer(raw, np.uint8).reshape(H0, W0, 3)
        kanvas[:HS, X0:X0 + WS] = cv2.resize(fr, (WS, HS), interpolation=cv2.INTER_AREA)
        if S[i] > 1: kanvas[ly:ly + lk.shape[0], lx:lx + lk.shape[1]] = lk
        jenis, berkas = bagian(t)
        for tahan_ in ([False] * n_rep + [True] * n_hold):
            key = (jenis, berkas, tahan_ and i != N - 1)
            if key not in bil: bil[key] = bilah(ep, *key)
            kanvas[HS:] = bil[key]
            enc.stdin.write(kanvas.tobytes())
    enc.stdin.close(); enc.wait(); dec.kill()
    if uji:
        a0, b0 = Wt(a_uji), Wt(b_uji)
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", vtmp, "-ss", f"{a0:.3f}", "-f", "f32le", "-ar", "48000", "-ac", "2", "-i", f"tmp/{ep}_out.f32",
                        "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", f"out/uji_{ep}.mp4"], check=True)
        print("uji", a0, b0); return
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", vtmp, "-f", "f32le", "-ar", "48000", "-ac", "2", "-i", f"tmp/{ep}_out.f32",
                    "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", f"out/{ep}.tmp.mp4"], check=True)
    os.replace(f"out/{ep}.tmp.mp4", f"out/{ep}.mp4"); os.replace(f"out/{ep}.srt.tmp", f"out/{ep}.srt")
    print("SELESAI", ep, dur(f"out/{ep}.mp4"), flush=True)

if __name__ == "__main__":
    main()
