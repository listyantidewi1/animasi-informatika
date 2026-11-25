"""Rakit episode tutorial: potongan rekaman + adegan kanvas + narasi per beat -> mp4 + srt.
Spesifikasi Txx/spec.py: BEATS = {no: [bagian...]}, bagian = dict(k='rek'|'klip'|'adegan', ...)."""
import json, os, sys, subprocess, importlib.util, re
sys.path.insert(0, os.path.dirname(__file__))
from durasi import audio, LEAD, TAIL, nm, SDIR
import adegan as ADG
FPS = 30
def sh(*a): subprocess.run(a, check=True)
def dur_file(f): return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))
def bingkai(src, t, out):
    sh("ffmpeg", "-loglevel", "error", "-y", "-ss", f"{max(0, t):.3f}", "-i", src, "-frames:v", "1", "-q:v", "2", out)
FONT = "/usr/share/fonts/opentype/inter/Inter-Bold.otf"
def potong(src, a, b, speed, dur, out, pre=0.0, crop=None):
    vf = (f"crop=iw*{crop[2]}:ih*{crop[3]}:iw*{crop[0]}:ih*{crop[1]},scale=1920:1080:flags=lanczos," if crop else "") + f"setpts=(PTS-STARTPTS)/{speed},fps={FPS},tpad=stop_mode=clone:stop_duration=30"
    if pre > 0.04: vf += f":start_mode=clone:start_duration={pre:.3f}"
    if speed >= 1.8:
        tx = f"dipercepat {speed:.1f}x".replace(".", ",")
        vf += (f",drawbox=x=w-330:y=h-92:w=300:h=56:color=0x0e1424@0.82:t=fill"
               f",drawtext=fontfile={FONT}:text='{tx}':x=w-180-tw/2:y=h-64-th/2:fontsize=30:fontcolor=0xfbbf24")
        if pre > 0.04: vf = vf.replace(":t=fill", f":t=fill:enable='gte(t,{pre:.3f})'").replace("fontcolor=0xfbbf24", f"fontcolor=0xfbbf24:enable='gte(t,{pre:.3f})'")
    sh("ffmpeg", "-loglevel", "error", "-y", "-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-i", src, "-vf", vf, "-t", f"{dur:.3f}", "-an",
       "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(FPS), out)
JEDA_AWAL, JEDA_AKHIR = 0.4, 1.6
def main(ep, hanya_adegan=False):
    base = f"/home/user/pinjam/{ep}"; tmp = f"{base}/tmp"; os.makedirs(tmp, exist_ok=True)
    spec = importlib.util.spec_from_file_location("spec", f"{base}/spec.py"); S = importlib.util.module_from_spec(spec); spec.loader.exec_module(S)
    A = audio(ep); naskah = {b["no"]: b["teks"] for b in json.load(open(f"/home/user/pinjam/naskah_{ep}.json"))}
    naskah.update({b["no"]: b["teks"] for b in json.load(open("/home/user/pinjam/naskah_sisip.json")).get(ep, [])})  # beat sisipan bernomor pecahan
    rek = {}
    for nama in getattr(S, "REKAMAN", ["rek"]):
        log = json.load(open(f"{base}/{nama}.json")); rek[nama] = {"src": f"{base}/{nama}_cam.mp4", "tanda": dict((n, t) for t, n in log["tanda"]), "log": log}
    rencana = []; jobs = []
    for no in sorted(S.BEATS):
        parts = S.BEATS[no]
        # Jeda supaya mudah diikuti: ±1,5 dtk antarbagian, lebih lega sebelum "Cek kerjaan AI", ±4 dtk antarbab.
        lead = JEDA_AWAL + (1.5 if no == min(S.BEATS) else 0) + (1.0 if parts and parts[0].get("nama", "").startswith("cekAI") else 0)
        tail = JEDA_AKHIR + (4.5 if no == max(S.BEATS) else 0) + max([p.get("tambah", 0) for p in parts] or [0])
        D = A[no] + lead + tail
        # panjang alami bagian rekaman
        for p in parts:
            if p["k"] in ("rek", "klip"):
                R = rek[p.get("r", "rek")]; a = R["tanda"][p["a"]] if isinstance(p["a"], str) else p["a"]
                b = R["tanda"][p["b"]] if isinstance(p["b"], str) else p["b"]
                p["_a"], p["_b"] = a + p.get("da", 0), b + p.get("db", 0); p["_L"] = p["_b"] - p["_a"]
        # asli=True: potongan sorot, diputar pada kecepatan asli dan tidak ikut dipercepat
        fixL = sum(p["_L"] / p.get("speed", 1) for p in parts if p["k"] in ("rek", "klip") and not p.get("asli"))
        asliL = sum(p["_L"] / p.get("speed", 1) for p in parts if p.get("asli"))
        D += sum(p["_L"] / p.get("speed", 1) for p in parts if p.get("ekor"))  # ekor: ketikan senyap di akhir beat, menambah panjang beat
        flex = [p for p in parts if p["k"] == "adegan"]; minflex = sum(p.get("min", 5) for p in flex)
        speed = 1.0
        if fixL + asliL + minflex > D:
            need = fixL / max(0.1, D - minflex - asliL); speed = min(max(1.0, need), max([p.get("maks", 1.6) for p in parts if p["k"] in ("rek", "klip") and not p.get("asli")] or [1]))
        for p in parts:
            p["_pre"] = 0.0
            if p.get("ekor"): p["_d"] = p["_L"] / p.get("speed", 1); p["_sp"] = p.get("speed", 1)
            elif p.get("asli"): p["_d"] = p["_L"] / p.get("speed", 1); p["_sp"] = p.get("speed", 1)  # asli + speed: kecepatan tetap
            elif p["k"] in ("rek", "klip"): p["_d"] = p["_L"] / p.get("speed", 1) / speed; p["_sp"] = p.get("speed", 1) * speed
        # sinkron: bagian rekaman dengan kalimat=k baru bergerak saat kalimat ke-k narasi mulai terdengar
        # (adegan sebelumnya diperpanjang sampai saat itu; kalau tidak ada adegan, layar diam dulu)
        kal = [x.strip() for x in re.split(r"(?<=[.!?])\s+", naskah[no]) if x.strip()]; tot = sum(len(x) for x in kal)
        t = 0.0; tunggu = []; kabur = False; sebelum = None; ruas = []
        for p in parts:
            if p["k"] == "adegan": tunggu.append(p); continue
            if "kalimat" in p:
                tk = lead + A[no] * sum(len(x) for x in kal[:p["kalimat"]]) / tot - 0.2
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
        # bingkai latar untuk adegan setelah rekaman
        prev = None; files = []; tp = 0.0
        kalT = [lead + A[no] * sum(len(x) for x in kal[:j]) / tot for j in range(len(kal))]  # detik mulai tiap kalimat
        wj = f"{base}/{SDIR}/b{nm(no)}.json"  # waktu kalimat sebenarnya dari ElevenLabs (suara.py --waktu)
        if os.path.exists(wj):
            w = json.load(open(wj))["kalimat"]
            if len(w) == len(kal): kalT = [lead + x for x in w]
            else: print(f"  peringatan b{nm(no)}: jumlah kalimat {len(kal)} != waktu {len(w)}")
        for i, p in enumerate(parts):
            out = f"{tmp}/b{nm(no)}_{i}.mp4"; files.append(out)
            if p["k"] in ("rek", "klip"):
                R = rek[p.get("r", "rek")]
                if not hanya_adegan and not os.environ.get("RENCANA"): potong(R["src"], p["_a"], p["_b"], p["_sp"], p["_d"], out, p["_pre"], p.get("crop"))
                prev = (R["src"], p["_b"] - 0.05)
            else:
                a = dict(p.get("a", {}))
                a["kal"] = [round(x - tp, 3) for x in kalT]  # relatif terhadap awal adegan ini
                if p.get("bg"):
                    src, t = prev if p["bg"] is True else (rek[p["bg"][0]]["src"], rek[p["bg"][0]]["tanda"].get(p["bg"][1], p["bg"][1]) if isinstance(p["bg"][1], str) else p["bg"][1])
                    png = f"{tmp}/bg_b{nm(no)}_{i}.jpg"; bingkai(src, t, png); a["bg"] = png
                if callable(p.get("a_fn")): a.update(p["a_fn"](rek))
                jobs.append({"nama": p["nama"], "D": p["_d"], "a": a, "out": out})
            tp += p["_d"]
        rencana.append({"no": no, "D": D, "audio": A[no], "files": files, "lead": lead})
        print(f"b{nm(no)} D={D:.1f} audio={A[no]:.1f} " + " ".join(f"{p['k']}:{p['_d']:.1f}" + (f"x{p['_sp']:.2f}" + (f"+{p['_pre']:.1f}" if p['_pre'] else '') if p['k'] != 'adegan' else '') for p in parts), flush=True)
    if os.environ.get("RENCANA"): return
    ADG.render(jobs, ["/home/user/pinjam/alat/web/antre.js", "/home/user/pinjam/alat/web/lapor.js"] + [x for x in [f"{base}/adegan.js"] if os.path.exists(x)] + getattr(S, "SKRIP", []))
    # gabung video
    lst = f"{tmp}/daftar.txt"
    with open(lst, "w") as f:
        for r in rencana:
            for x in r["files"]: f.write(f"file '{x}'\n")
    sh("ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", f"{tmp}/video.mp4")
    # audio
    with open(f"{tmp}/audio.txt", "w") as f:
        for r in rencana:
            w = f"{tmp}/a{nm(r['no'])}.wav"
            sh("ffmpeg", "-loglevel", "error", "-y", "-i", f"{base}/{SDIR}/b{nm(r['no'])}.mp3", "-af", f"adelay={int(r['lead']*1000)}:all=1,apad", "-t", f"{r['D']:.3f}", "-ar", "48000", "-ac", "2", w)
            f.write(f"file '{w}'\n")
    sh("ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{tmp}/audio.txt", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000", f"{tmp}/audio.wav")
    out = f"{base}/{S.NAMA}.mp4" if SDIR == "suara" else f"{base}/uji_{S.NAMA}.mp4"
    sh("ffmpeg", "-loglevel", "error", "-y", "-i", f"{tmp}/video.mp4", "-i", f"{tmp}/audio.wav", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", out)
    # srt
    def ts(x): h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60; return f"{h:02d}:{m:02d}:{int(s):02d},{int((s % 1) * 1000):03d}"
    srt = []; t = 0; k = 1
    for r in rencana:
        kal = [s.strip() for s in re.split(r"(?<=[.!?])\s+", naskah[r["no"]]) if s.strip()]
        tot = sum(len(s) for s in kal); t0 = t + r["lead"]
        for s in kal:
            d = r["audio"] * len(s) / tot; srt.append(f"{k}\n{ts(t0)} --> {ts(t0 + d - 0.05)}\n{s}\n"); k += 1; t0 += d
        t += r["D"]
    open(out.replace(".mp4", ".srt"), "w").write("\n".join(srt))
    json.dump([{"no": r["no"], "mulai": sum(x["D"] for x in rencana if x["no"] < r["no"]), "D": r["D"]} for r in rencana], open(f"{base}/waktu.json", "w"))
    print("SELESAI", out, dur_file(out))
if __name__ == "__main__":
    main(sys.argv[1], "--hanya-adegan" in sys.argv)
