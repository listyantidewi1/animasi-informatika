"""Rakit episode tutorial: potongan rekaman + adegan kanvas + narasi per beat -> mp4 + srt.
Spesifikasi Txx/spec.py: BEATS = {no: [bagian...]}, bagian = dict(k='rek'|'klip'|'adegan', ...)."""
import json, os, sys, subprocess, importlib.util, re
sys.path.insert(0, os.path.dirname(__file__))
from durasi import audio, LEAD, TAIL, nm
import adegan as ADG
FPS = 30
def sh(*a): subprocess.run(a, check=True)
def dur_file(f): return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))
def bingkai(src, t, out):
    sh("ffmpeg", "-loglevel", "error", "-y", "-ss", f"{max(0, t):.3f}", "-i", src, "-frames:v", "1", "-q:v", "2", out)
FONT = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"
def potong(src, a, b, speed, dur, out, pre=0.0, crop=None, ketik=False):
    vf = (f"crop=iw*{crop[2]}:ih*{crop[3]}:iw*{crop[0]}:ih*{crop[1]},scale=1920:1080:flags=lanczos," if crop else "") + f"setpts=(PTS-STARTPTS)/{speed},fps={FPS},tpad=stop_mode=clone:stop_duration=30"
    if pre > 0.04: vf += f":start_mode=clone:start_duration={pre:.3f}"
    if speed >= 1.8:
        tx = (f"mengetik · dipercepat {speed:.1f}x" if ketik else f"dipercepat {speed:.1f}x").replace(".", ","); lb = 470 if ketik else 300
        vf += (f",drawbox=x=w-{lb + 30}:y=h-92:w={lb}:h=56:color=0x0e1424@0.82:t=fill"
               f",drawtext=fontfile={FONT}:text='{tx}':x=w-{30 + lb // 2}-tw/2:y=h-64-th/2:fontsize=30:fontcolor=0xfbbf24")
        if pre > 0.04: vf = vf.replace(":t=fill", f":t=fill:enable='gte(t,{pre:.3f})'").replace("fontcolor=0xfbbf24", f"fontcolor=0xfbbf24:enable='gte(t,{pre:.3f})'")
    sh("ffmpeg", "-loglevel", "error", "-y", "-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-i", src, "-vf", vf, "-t", f"{dur:.3f}", "-an",
       "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(FPS), out)
JEDA_AWAL, JEDA_AKHIR = 0.4, 1.6
# --- Typing along (Dewi 22 Nov 2026) ---
BATAS_KODE = (2.0, 6.0, 60.0)   # ketikan kode: paling cepat 2x; blok sangat panjang boleh sampai 6x supaya tampil <= 60 dtk
BATAS_CMD = 2.5                 # potongan berisi perintah terminal: paling cepat 2,5x
BEKU_AKHIR_BAB, KARTU_BAB = 2.5, 4.0  # bekukan frame terakhir bab, lalu kartu bab tampil dulu sebelum narasi
import numpy as np, wave
import label_gh
from PIL import Image, ImageDraw, ImageFont
def ketikan(R, a, b, jenis):
    """(jumlah karakter, detik yang 'ditambahkan' batas cps, berkas terakhir, akhir ketikan terakhir) pada ruas [a, b] rekaman."""
    n = 0; tambah = 0.0; berkas = None; akhir = None
    for e in R["log"].get("ketik", []):
        t0, t1, c, f, j = e[:5]; ov = min(b, t1) - max(a, t0)
        if j != jenis or ov <= 0.05: continue
        fr = ov / max(0.01, t1 - t0); n += c * fr
        if len(e) > 6 and e[5] > e[6]: tambah += ov * (1 - e[6] / e[5])
        berkas = f; akhir = min(b, t1)
    return n, tambah, berkas, akhir
def kartu_jeda(src_mkv, t, berkas, bab, dur, out):
    """Titik jeda: frame penuh editor (tanpa zoom) dibekukan, dengan ajakan menjeda video dan alamat GitHub berkasnya."""
    png = out[:-4] + ".png"; bingkai(src_mkv, t, png)
    im = Image.open(png).convert("RGB").resize((1920, 1080), Image.LANCZOS).convert("RGBA"); d = ImageDraw.Draw(im, "RGBA")
    f1 = ImageFont.truetype(label_gh.FB, 40); f2 = ImageFont.truetype(label_gh.FS, 32)
    t1 = "TITIK JEDA"; t2 = "Jeda video di sini, ketik kodenya dulu, lalu lanjutkan."
    w = int(96 + f1.getlength(t1) + 36 + f2.getlength(t2) + 40); x0 = (1920 - w) // 2; y0 = 26; h = 84
    d.rounded_rectangle([x0, y0, x0 + w, y0 + h], 20, fill=(14, 20, 36, 240), outline=(255, 176, 32, 255), width=3)
    d.rounded_rectangle([x0 + 34, y0 + 24, x0 + 46, y0 + h - 24], 3, fill=(255, 176, 32, 255)); d.rounded_rectangle([x0 + 56, y0 + 24, x0 + 68, y0 + h - 24], 3, fill=(255, 176, 32, 255))
    d.text((x0 + 96, y0 + h / 2), t1, font=f1, fill=(251, 191, 36, 255), anchor="lm")
    d.text((x0 + 96 + f1.getlength(t1) + 36, y0 + h / 2), t2, font=f2, fill=(255, 255, 255, 255), anchor="lm")
    g = label_gh.pil(berkas, bab, besar=True); im.alpha_composite(g, (34, 1080 - 34 - g.size[1]))
    im.convert("RGB").save(png)
    sh("ffmpeg", "-loglevel", "error", "-y", "-loop", "1", "-framerate", str(FPS), "-i", png, "-t", f"{dur:.3f}", "-vf", "fade=t=in:st=0:d=0.25:alpha=0,format=yuv420p",
       "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(FPS), out)
def main(ep, hanya_adegan=False):
    base = f"/home/user/antre/{ep}"; tmp = f"{base}/tmp"; os.makedirs(tmp, exist_ok=True)
    spec = importlib.util.spec_from_file_location("spec", f"{base}/spec.py"); S = importlib.util.module_from_spec(spec); spec.loader.exec_module(S)
    A = audio(ep); naskah = {b["no"]: b["teks"] for b in json.load(open(f"/home/user/antre/naskah_{ep}.json"))}
    naskah.update({b["no"]: b["teks"] for b in json.load(open("/home/user/antre/naskah_sisip.json")).get(ep, [])})  # beat sisipan bernomor pecahan
    rek = {}
    for nama in getattr(S, "REKAMAN", ["rek"]):
        log = json.load(open(f"{base}/{nama}.json")); rek[nama] = {"src": f"{base}/{nama}_cam.mp4", "tanda": dict((n, t) for t, n in log["tanda"]), "log": log}
    rencana = []; jobs = []
    for no in sorted(S.BEATS):
        parts = S.BEATS[no]
        # Jeda supaya mudah diikuti: ±1,5 dtk antarbagian, lebih lega sebelum "Cek kerjaan AI", ±4 dtk antarbab.
        lead = JEDA_AWAL + (1.5 if no == min(S.BEATS) else 0) + (1.0 if parts and parts[0].get("nama", "").startswith("cekAI") else 0)
        if no == min(S.BEATS) and parts and parts[0].get("nama") == "kartuBab": lead = KARTU_BAB
        tail = JEDA_AKHIR if no != max(S.BEATS) else BEKU_AKHIR_BAB
        D = A[no] + lead + tail
        # panjang alami bagian rekaman
        for p in parts:
            if p["k"] in ("rek", "klip"):
                R = rek[p.get("r", "rek")]; a = R["tanda"][p["a"]] if isinstance(p["a"], str) else p["a"]
                b = R["tanda"][p["b"]] if isinstance(p["b"], str) else p["b"]
                p["_a"], p["_b"] = a + p.get("da", 0), b + p.get("db", 0); p["_Lasli"] = p["_b"] - p["_a"]
                nk, tk_, bk, ak = ketikan(R, p["_a"], p["_b"], "kode"); nc, tc_, _, _ = ketikan(R, p["_a"], p["_b"], "cmd")
                p["_kode"] = (nk, bk, ak, p.get("r", "rek")) if nk >= 12 and not p.get("asli") else None
                p["_batas"] = None
                if not p.get("asli"):
                    if nk >= 12: p["_batas"] = min(BATAS_KODE[1], max(BATAS_KODE[0], p["_Lasli"] / BATAS_KODE[2]))
                    elif nc >= 6: p["_batas"] = BATAS_CMD
                # _L = panjang "maya": seolah-olah diketik secepat rekaman lama, supaya rencana lama (dan sinkronnya) terhitung sama
                p["_L"] = max(0.5, p["_Lasli"] - tk_ - tc_)
        # asli=True: potongan sorot, diputar pada kecepatan asli dan tidak ikut dipercepat
        fixL = sum(p["_L"] / p.get("speed", 1) for p in parts if p["k"] in ("rek", "klip") and not p.get("asli"))
        asliL = sum(p["_L"] for p in parts if p.get("asli"))
        flex = [p for p in parts if p["k"] == "adegan"]; minflex = sum(p.get("min", 5) for p in flex)
        speed = 1.0
        if fixL + asliL + minflex > D:
            need = fixL / max(0.1, D - minflex - asliL); speed = min(max(1.0, need), max([p.get("maks", 1.6) for p in parts if p["k"] in ("rek", "klip") and not p.get("asli")] or [1]))
        for p in parts:
            p["_pre"] = 0.0
            if p.get("asli"): p["_d"] = p["_L"]; p["_sp"] = 1.0
            elif p["k"] in ("rek", "klip"): p["_d"] = p["_L"] / p.get("speed", 1) / speed; p["_sp"] = p.get("speed", 1) * speed
        # sinkron: bagian rekaman dengan kalimat=k baru bergerak saat kalimat ke-k narasi mulai terdengar
        # (adegan sebelumnya diperpanjang sampai saat itu; kalau tidak ada adegan, layar diam dulu)
        kal = [x.strip() for x in re.split(r"(?<=[.!?])\s+", naskah[no]) if x.strip()]; tot = sum(len(x) for x in kal)
        wj = json.load(open(f"{base}/suara/b{nm(no)}.json")); kal0 = wj["kalimat"]; senyap = wj.get("senyap", [True] * len(kal0))
        assert len(kal0) == len(kal), (no, len(kal0), len(kal))
        t = 0.0; tunggu = []; kabur = False; sebelum = None; ruas = []
        for p in parts:
            if p["k"] == "adegan": tunggu.append(p); continue
            if "kalimat" in p:
                tk = lead + kal0[min(p["kalimat"], len(kal0) - 1)] - 0.2
                if tunggu and not kabur:  # adegan tepat sebelum jangkar: adegan mengisi sampai kalimatnya
                    gap = tk - t; w = sum(q.get("bobot", 1) for q in tunggu)
                    for q in tunggu: q["_d"] = max(q.get("min", 5), gap * q.get("bobot", 1) / w); q["_tetap"] = True; t += q["_d"]
                else:
                    for q in tunggu: q["_d"] = q.get("min", 5); q["_tetap"] = True; t += q["_d"]  # adegan lalu rekaman lalu jangkar
                    gap = tk - t; lentur = [q for q in ruas if not q.get("asli")]; pj = sum(q["_d"] for q in lentur)
                    if gap < -0.05 and lentur:  # terlambat: percepat rekaman sejak jangkar sebelumnya
                        f = max(0.15, (pj + gap) / pj)
                        for q in lentur: q["_d"] *= f; q["_sp"] /= f
                        t -= pj * (1 - f); gap = tk - t
                    if gap < -0.3: print(f"  peringatan b{no}: jangkar kalimat {p['kalimat']} terlambat {-gap:.1f} dtk")
                    if gap > 0:
                        if sebelum is not None: sebelum["_d"] += gap; t += gap  # tahan akhir rekaman sebelumnya
                        else: p["_pre"] = gap; p["_d"] += gap
                tunggu = []; kabur = False; ruas = []
            elif tunggu: kabur = True
            t += p["_d"]; sebelum = p; ruas.append(p)
        flex = [p for p in parts if p["k"] == "adegan" and not p.get("_tetap")]; minflex = sum(p.get("min", 5) for p in flex)
        tetap = sum(p["_d"] for p in parts if p["k"] != "adegan" or p.get("_tetap"))
        D = max(D, tetap + minflex)
        sisa = D - tetap
        if flex:
            w = sum(p.get("bobot", 1) for p in flex)
            for p in flex: p["_d"] = sisa * p.get("bobot", 1) / w
        else:
            last = [p for p in parts if p["k"] in ("rek", "klip")][-1]; last["_d"] += sisa
        # ---- Tata ulang "typing along": ketikan tidak boleh lebih cepat dari batasnya. Waktu tambahan menjadi jeda narasi
        # di batas kalimat (narasi menunggu ketikan selesai), sehingga tiap bagian tetap mulai pada kalimat yang sama.
        Sv = [lead + x for x in kal0]; geser = [0.0] * len(kal0); t = 0.0; v = 0.0; jt = -1; prev = None
        for i, p in enumerate(parts):
            vd = p["_d"]
            if i > 0:
                js = [k for k in range(len(Sv)) if Sv[k] <= v + 0.5]
                if js:
                    j = js[-1]; o = v - Sv[j]; cur = Sv[j] + geser[j]; want = t - o
                    if want > cur + 0.05:
                        jj = j if j > jt else j + 1
                        while jj < len(Sv) and not senyap[jj]: jj += 1
                        if jj < len(Sv):
                            dlt = want - cur
                            for k in range(jj, len(Sv)): geser[k] += dlt
                            jt = jj
                    elif want < cur - 0.05 and prev is not None:
                        prev["_dn"] += cur - want; t += cur - want
            if p["k"] in ("rek", "klip"):
                cv = p["_L"] / p["_sp"]; spn = p["_Lasli"] / cv
                if p.get("_batas"): spn = min(spn, p["_batas"])
                spn = max(spn, 0.5); cn = p["_Lasli"] / spn; p["_spn"] = spn; p["_dn"] = vd + (cn - cv)
            else: p["_dn"] = vd
            t += p["_dn"]; v += vd; prev = p
        D = max(t, lead + A[no] + geser[-1] + tail)
        if D > t: parts[-1]["_dn"] += D - t
        kalT = [lead + kal0[j] + geser[j] for j in range(len(kal0))]  # detik mulai tiap kalimat dalam beat (sesudah digeser)
        # bingkai latar untuk adegan setelah rekaman
        prev = None; files = []; tp = 0.0
        for i, p in enumerate(parts):
            out = f"{tmp}/b{nm(no)}_{i}.mp4"; files.append(out)
            if p["k"] in ("rek", "klip"):
                R = rek[p.get("r", "rek")]
                if not hanya_adegan and not os.environ.get("RENCANA"): potong(R["src"], p["_a"], p["_b"], p["_spn"], p["_dn"], out, p["_pre"], p.get("crop"), bool(p.get("_kode")))
                prev = (R["src"], p["_b"] - 0.05)
            else:
                a = dict(p.get("a", {}))
                a["kal"] = [round(x - tp, 3) for x in kalT]  # relatif terhadap awal adegan ini
                if p.get("bg"):
                    src, t = prev if p["bg"] is True else (rek[p["bg"][0]]["src"], rek[p["bg"][0]]["tanda"].get(p["bg"][1], p["bg"][1]) if isinstance(p["bg"][1], str) else p["bg"][1])
                    png = f"{tmp}/bg_b{nm(no)}_{i}.jpg"; bingkai(src, t, png); a["bg"] = png
                if callable(p.get("a_fn")): a.update(p["a_fn"](rek))
                jobs.append({"nama": p["nama"], "D": p["_dn"], "a": a, "out": out})
            tp += p["_dn"]
        # Titik jeda di akhir beat yang mengetik kode: kode lengkap dibekukan + alamat GitHub
        kd = [p["_kode"] for p in parts if p.get("_kode")]; nk = sum(x[0] for x in kd); dj = 0.0
        if nk >= 60 and no not in getattr(S, "TANPA_JEDA", ()):
            dj = 5.0 if nk < 250 else 8.0; out = f"{tmp}/b{nm(no)}_jeda.mp4"; files.append(out)
            if not hanya_adegan and not os.environ.get("RENCANA"):
                kartu_jeda(f"{base}/{kd[-1][3]}.mkv", kd[-1][2] + 0.35, kd[-1][1], int(ep[1:]), dj, out)
        D += dj
        rencana.append({"no": no, "D": D, "audio": A[no], "files": files, "lead": lead, "kalT": kalT, "kal0": kal0, "kal": kal})
        print(f"b{nm(no)} D={D:.1f} audio={A[no]:.1f} geser={geser[-1]:.1f} jeda={dj:.0f} " + " ".join(f"{p['k']}:{p['_dn']:.1f}" + (f"x{p['_spn']:.2f}" + (f"+{p['_pre']:.1f}" if p['_pre'] else '') + ("K" if p.get('_kode') else '') if p['k'] != 'adegan' else '') for p in parts), flush=True)
    if os.environ.get("RENCANA"): return
    ADG.render(jobs, ["/home/user/antre/alat/web/antre.js", f"{base}/adegan.js"] + getattr(S, "SKRIP", []))
    # gabung video
    lst = f"{tmp}/daftar.txt"
    with open(lst, "w") as f:
        for r in rencana:
            for x in r["files"]: f.write(f"file '{x}'\n")
    sh("ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", f"{tmp}/video.mp4")
    # audio: tiap kalimat ditempatkan pada waktunya (jeda narasi hanya di batas kalimat)
    SR = 48000
    with open(f"{tmp}/audio.txt", "w") as f:
        for r in rencana:
            w = f"{tmp}/a{nm(r['no'])}.wav"
            raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", f"{base}/suara/b{nm(r['no'])}.mp3", "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True).stdout
            x = np.frombuffer(raw, np.int16); y = np.zeros(int(round(r["D"] * SR)), np.int16); k0 = r["kal0"] + [len(x) / SR + 1]
            for j in range(len(r["kal0"])):
                a0 = int(k0[j] * SR) if j else 0; a1 = min(len(x), int(k0[j + 1] * SR)); seg = x[a0:a1]
                p0 = int(r["kalT"][j] * SR) if j else int(r["lead"] * SR); seg = seg[:max(0, len(y) - p0)]; y[p0:p0 + len(seg)] = seg
            with wave.open(w, "wb") as wv: wv.setnchannels(1); wv.setsampwidth(2); wv.setframerate(SR); wv.writeframes(y.tobytes())
            f.write(f"file '{w}'\n")
    sh("ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{tmp}/audio.txt", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000", "-ac", "2", f"{tmp}/audio.wav")
    out = f"{base}/{S.NAMA}.mp4"
    sh("ffmpeg", "-loglevel", "error", "-y", "-i", f"{tmp}/video.mp4", "-i", f"{tmp}/audio.wav", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", out)
    # srt
    def ts(x): h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60; return f"{h:02d}:{m:02d}:{int(s):02d},{int((s % 1) * 1000):03d}"
    srt = []; t = 0; k = 1
    for r in rencana:
        for j, kl in enumerate(r["kal"]):
            a0 = t + r["kalT"][j]; a1 = t + (r["kalT"][j + 1] - 0.05 if j + 1 < len(r["kal"]) else r["kalT"][j] + r["audio"] - r["kal0"][j])
            if j + 1 < len(r["kal"]): a1 = min(a1, a0 + (r["kal0"][j + 1] - r["kal0"][j]))
            srt.append(f"{k}\n{ts(a0)} --> {ts(a1)}\n{kl}\n"); k += 1
        t += r["D"]
    open(out.replace(".mp4", ".srt"), "w").write("\n".join(srt))
    json.dump([{"no": r["no"], "mulai": sum(x["D"] for x in rencana if x["no"] < r["no"]), "D": r["D"]} for r in rencana], open(f"{base}/waktu.json", "w"))
    print("SELESAI", out, dur_file(out))
if __name__ == "__main__":
    main(sys.argv[1], "--hanya-adegan" in sys.argv)
