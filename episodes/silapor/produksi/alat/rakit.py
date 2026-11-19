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
    base = f"/home/user/lapor/{ep}"; tmp = f"{base}/tmp"; os.makedirs(tmp, exist_ok=True)
    spec = importlib.util.spec_from_file_location("spec", f"{base}/spec.py"); S = importlib.util.module_from_spec(spec); spec.loader.exec_module(S)
    A = audio(ep); naskah = {b["no"]: b["teks"] for b in json.load(open(f"/home/user/lapor/naskah_{ep}.json"))}
    naskah.update({b["no"]: b["teks"] for b in json.load(open("/home/user/lapor/naskah_sisip.json")).get(ep, [])})  # beat sisipan bernomor pecahan
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
        # --- waktu mulai tiap kalimat di dalam berkas suara (nyata bila ada, kalau tidak perkiraan dari panjang kalimat)
        kal = [x.strip() for x in re.split(r"(?<=[.!?])\s+", naskah[no]) if x.strip()]; tot = sum(len(x) for x in kal)
        w = [A[no] * sum(len(x) for x in kal[:j]) / tot for j in range(len(kal))]
        wj = f"{base}/{SDIR}/b{nm(no)}.json"
        if os.path.exists(wj):
            w2 = json.load(open(wj))["kalimat"]
            if len(w2) == len(kal): w = w2
            else: print(f"  peringatan b{nm(no)}: jumlah kalimat {len(kal)} != waktu {len(w2)}")
        # --- kelompok: tiap bagian rekaman ber-`kalimat=k` membuka kelompok baru yang mulai bersama kalimat k.
        # Tiap bagian hanya dipercepat sampai `maks`-nya sendiri; kalau gambar belum selesai saat kalimat berikutnya
        # seharusnya mulai, NARASI yang menunggu (hening disisipkan sebelum kalimat itu), bukan gambar yang dikebut.
        ekor = [p for p in parts if p.get("ekor")]; inti = [p for p in parts if not p.get("ekor")]
        grup = [dict(k=0, parts=[])]
        for p in inti:
            kk = min(p.get("kalimat", -1), len(kal) - 1)
            if kk > grup[-1]["k"]: grup.append(dict(k=kk, parts=[]))
            grup[-1]["parts"].append(p)
        def batas(k): return 0.0 if k == 0 else lead + w[k] - 0.2
        geser = [0.0] * len(kal); tunda = 0.0; potongA = []
        for gi, g in enumerate(grup):
            akhir = batas(grup[gi + 1]["k"]) if gi + 1 < len(grup) else lead + A[no] + tail
            ag = akhir - batas(g["k"])
            rk = [p for p in g["parts"] if p["k"] != "adegan"]; ad = [p for p in g["parts"] if p["k"] == "adegan"]
            for p in g["parts"]: p["_pre"] = 0.0
            tetap = 0.0; lentur = []
            for p in rk:
                if p.get("asli"): p["_d"] = p["_L"] / p.get("speed", 1); p["_sp"] = p.get("speed", 1); tetap += p["_d"]
                else: lentur.append(p)
            minflex = sum(p.get("min", 5) for p in ad)
            sisa = ag - tetap - minflex; rem = list(lentur)
            while rem:
                need = max(1.0, sum(p["_L"] / p.get("speed", 1) for p in rem) / max(0.1, sisa))
                cap = [p for p in rem if p.get("maks", 1.6) < need]
                if not cap:
                    for p in rem: p["_sp"] = p.get("speed", 1) * need; p["_d"] = p["_L"] / p["_sp"]
                    break
                for p in cap:
                    p["_sp"] = p.get("speed", 1) * p.get("maks", 1.6); p["_d"] = p["_L"] / p["_sp"]; sisa -= p["_d"]; rem.remove(p)
            drek = sum(p["_d"] for p in rk); longgar = ag - drek - minflex
            if ad:
                W = sum(p.get("bobot", 1) for p in ad); prop = [(ag - drek) * p.get("bobot", 1) / W for p in ad]
                if all(d >= p.get("min", 5) - 1e-6 for d, p in zip(prop, ad)):
                    for d, p in zip(prop, ad): p["_d"] = d
                else:
                    for p in ad: p["_d"] = p.get("min", 5) + max(0, longgar) * p.get("bobot", 1) / W
            elif longgar > 0:
                if rk: rk[-1]["_d"] += longgar; g["_tahan"] = (rk[-1], longgar)  # tahan bingkai terakhir sampai kalimat berikutnya
                else: tunda += longgar
            pra = 0.0
            if tunda and g["parts"]:
                pra = tunda
                p0 = g["parts"][0]; p0["_d"] += tunda
                if p0["k"] != "adegan": p0["_pre"] = tunda
                tunda = 0.0
            lebih = sum(p["_d"] for p in g["parts"]) - ag - pra
            if lebih > 0.05 and g["parts"]:  # sebelum membuat narasi menunggu, pakai dulu waktu diam tepat sebelum kelompok ini (mulai lebih awal)
                p0 = g["parts"][0]
                if p0.get("_pre", 0) > 1.0:
                    c = min(lebih, p0["_pre"] - 1.0, 5.0); p0["_pre"] -= c; p0["_d"] -= c; lebih -= c
                elif gi and grup[gi - 1].get("_tahan") and grup[gi - 1]["_tahan"][1] > 1.0:
                    pp, amt = grup[gi - 1]["_tahan"]; c = min(lebih, amt - 1.0, 5.0); pp["_d"] -= c; lebih -= c
            if lebih > 0.05 and gi + 1 < len(grup):
                kn = grup[gi + 1]["k"]
                for j in range(kn, len(kal)): geser[j] += lebih
                potongA.append((w[kn] - 0.1, lebih))
        for p in ekor: p["_pre"] = 0.0; p["_d"] = p["_L"] / p.get("speed", 1); p["_sp"] = p.get("speed", 1)
        D = sum(p["_d"] for p in parts)
        # bingkai latar untuk adegan setelah rekaman
        prev = None; files = []; tp = 0.0
        kalT = [lead + w[j] + geser[j] for j in range(len(kal))]  # detik mulai tiap kalimat (sudah termasuk hening sisipan)
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
        rencana.append({"no": no, "D": D, "audio": A[no], "files": files, "lead": lead, "kalT": kalT, "w": w, "potong": potongA})
        if potongA: print("  hening narasi: " + ", ".join(f"sebelum {c:.1f} dtk +{g:.1f}" for c, g in potongA))
        print(f"b{nm(no)} D={D:.1f} audio={A[no]:.1f} " + " ".join(f"{p['k']}:{p['_d']:.1f}" + (f"x{p['_sp']:.2f}" + (f"+{p['_pre']:.1f}" if p['_pre'] else '') if p['k'] != 'adegan' else '') for p in parts), flush=True)
    json.dump([{"no": r["no"], "mulai": sum(x["D"] for x in rencana if x["no"] < r["no"]), "D": r["D"], "kalT": r["kalT"], "w": r["w"], "audio": r["audio"]} for r in rencana], open(f"{base}/waktu.json", "w"))
    if os.environ.get("RENCANA"): return
    ADG.render(jobs, ["/home/user/lapor/alat/web/antre.js", "/home/user/lapor/alat/web/lapor.js"] + [x for x in [f"{base}/adegan.js"] if os.path.exists(x)] + getattr(S, "SKRIP", []))
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
            src = f"{base}/{SDIR}/b{nm(r['no'])}.mp3"
            if not r["potong"]:
                sh("ffmpeg", "-loglevel", "error", "-y", "-i", src, "-af", f"adelay={int(r['lead']*1000)}:all=1,apad", "-t", f"{r['D']:.3f}", "-ar", "48000", "-ac", "2", w)
            else:  # narasi dipotong di jeda antarkalimat, lalu tiap potongan digeser
                tepi = [0.0] + [c for c, g in r["potong"]] + [r["audio"] + 0.5]; og = 0.0; fc = []; nama = []
                for q in range(len(tepi) - 1):
                    if q: og += r["potong"][q - 1][1]
                    fc.append(f"[0:a]atrim=start={tepi[q]:.3f}:end={tepi[q+1]:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.02,areverse,afade=t=in:d=0.02,areverse,adelay={int((r['lead'] + tepi[q] + og) * 1000)}:all=1[s{q}]"); nama.append(f"[s{q}]")
                fc.append("".join(nama) + f"amix=inputs={len(nama)}:normalize=0,apad[o]")
                sh("ffmpeg", "-loglevel", "error", "-y", "-i", src, "-filter_complex", ";".join(fc), "-map", "[o]", "-t", f"{r['D']:.3f}", "-ar", "48000", "-ac", "2", w)
            f.write(f"file '{w}'\n")
    sh("ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{tmp}/audio.txt", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000", f"{tmp}/audio.wav")
    out = f"{base}/{S.NAMA}.mp4" if SDIR == "suara" else f"{base}/uji_{S.NAMA}.mp4"
    sh("ffmpeg", "-loglevel", "error", "-y", "-i", f"{tmp}/video.mp4", "-i", f"{tmp}/audio.wav", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", out)
    # srt
    def ts(x): h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60; return f"{h:02d}:{m:02d}:{int(s):02d},{int((s % 1) * 1000):03d}"
    srt = []; t = 0; k = 1
    for r in rencana:
        kal = [s.strip() for s in re.split(r"(?<=[.!?])\s+", naskah[r["no"]]) if s.strip()]
        for j, s in enumerate(kal):
            d = (r["w"][j + 1] if j + 1 < len(kal) else r["audio"]) - r["w"][j]
            srt.append(f"{k}\n{ts(t + r['kalT'][j])} --> {ts(t + r['kalT'][j] + d - 0.05)}\n{s}\n"); k += 1
        t += r["D"]
    open(out.replace(".mp4", ".srt"), "w").write("\n".join(srt))
    print("SELESAI", out, dur_file(out))
if __name__ == "__main__":
    main(sys.argv[1], "--hanya-adegan" in sys.argv)
