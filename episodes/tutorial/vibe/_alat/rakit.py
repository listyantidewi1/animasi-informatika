"""Rakit episode tutorial: potongan rekaman + adegan kanvas + narasi per beat -> mp4 + srt.
Spesifikasi Txx/spec.py: BEATS = {no: [bagian...]}, bagian = dict(k='rek'|'klip'|'adegan', ...)."""
import json, os, sys, subprocess, importlib.util, re
sys.path.insert(0, os.path.dirname(__file__))
from durasi import audio, LEAD, TAIL
import adegan as ADG
FPS = 30
def sh(*a): subprocess.run(a, check=True)
def dur_file(f): return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))
def bingkai(src, t, out):
    sh("ffmpeg", "-loglevel", "error", "-y", "-ss", f"{max(0, t):.3f}", "-i", src, "-frames:v", "1", "-q:v", "2", out)
def potong(src, a, b, speed, dur, out):
    vf = f"setpts=(PTS-STARTPTS)/{speed},fps={FPS},tpad=stop_mode=clone:stop_duration=30"
    sh("ffmpeg", "-loglevel", "error", "-y", "-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-i", src, "-vf", vf, "-t", f"{dur:.3f}", "-an",
       "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p", "-r", str(FPS), out)
def main(ep, hanya_adegan=False):
    base = f"/home/user/tut/{ep}"; tmp = f"{base}/tmp"; os.makedirs(tmp, exist_ok=True)
    spec = importlib.util.spec_from_file_location("spec", f"{base}/spec.py"); S = importlib.util.module_from_spec(spec); spec.loader.exec_module(S)
    A = audio(ep); naskah = {b["no"]: b["teks"] for b in json.load(open(f"/home/user/tut/naskah.json"))[ep]["beats"]}
    rek = {}
    for nama in getattr(S, "REKAMAN", ["rek"]):
        log = json.load(open(f"{base}/{nama}.json")); rek[nama] = {"src": f"{base}/{nama}_cam.mp4", "tanda": dict((n, t) for t, n in log["tanda"]), "log": log}
    rencana = []; jobs = []
    for no in sorted(S.BEATS):
        D = A[no] + LEAD + TAIL; parts = S.BEATS[no]
        # panjang alami bagian rekaman
        for p in parts:
            if p["k"] in ("rek", "klip"):
                R = rek[p.get("r", "rek")]; a = R["tanda"][p["a"]] if isinstance(p["a"], str) else p["a"]
                b = R["tanda"][p["b"]] if isinstance(p["b"], str) else p["b"]
                p["_a"], p["_b"] = a + p.get("da", 0), b + p.get("db", 0); p["_L"] = p["_b"] - p["_a"]
        fixL = sum(p["_L"] / p.get("speed", 1) for p in parts if p["k"] in ("rek", "klip"))
        flex = [p for p in parts if p["k"] == "adegan"]; minflex = sum(p.get("min", 5) for p in flex)
        speed = 1.0
        if fixL + minflex > D:
            need = fixL / max(0.1, D - minflex); speed = min(max(1.0, need), max([p.get("maks", 1.6) for p in parts if p["k"] in ("rek", "klip")] or [1]))
        fixL2 = fixL / speed; D = max(D, fixL2 + minflex)
        sisa = D - fixL2
        for p in parts:
            if p["k"] in ("rek", "klip"): p["_d"] = p["_L"] / p.get("speed", 1) / speed; p["_sp"] = p.get("speed", 1) * speed
        if flex:
            w = sum(p.get("bobot", 1) for p in flex)
            for p in flex: p["_d"] = sisa * p.get("bobot", 1) / w
        else:
            last = [p for p in parts if p["k"] in ("rek", "klip")][-1]; last["_d"] += sisa
        # bingkai latar untuk adegan setelah rekaman
        prev = None; files = []
        for i, p in enumerate(parts):
            out = f"{tmp}/b{no:02d}_{i}.mp4"; files.append(out)
            if p["k"] in ("rek", "klip"):
                R = rek[p.get("r", "rek")]
                if not hanya_adegan: potong(R["src"], p["_a"], p["_b"], p["_sp"], p["_d"], out)
                prev = (R["src"], p["_b"] - 0.05)
            else:
                a = dict(p.get("a", {}))
                if p.get("bg"):
                    src, t = prev if p["bg"] is True else (rek[p["bg"][0]]["src"], rek[p["bg"][0]]["tanda"].get(p["bg"][1], p["bg"][1]) if isinstance(p["bg"][1], str) else p["bg"][1])
                    png = f"{tmp}/bg_b{no:02d}_{i}.jpg"; bingkai(src, t, png); a["bg"] = png
                if callable(p.get("a_fn")): a.update(p["a_fn"](rek))
                jobs.append({"nama": p["nama"], "D": p["_d"], "a": a, "out": out})
        rencana.append({"no": no, "D": D, "audio": A[no], "files": files})
        print(f"b{no:02d} D={D:.1f} audio={A[no]:.1f} " + " ".join(f"{p['k']}:{p['_d']:.1f}" + (f"x{p['_sp']:.2f}" if p['k'] != 'adegan' else '') for p in parts), flush=True)
    ADG.render(jobs, [f"{base}/adegan.js"] + getattr(S, "SKRIP", []))
    # gabung video
    lst = f"{tmp}/daftar.txt"
    with open(lst, "w") as f:
        for r in rencana:
            for x in r["files"]: f.write(f"file '{x}'\n")
    sh("ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", f"{tmp}/video.mp4")
    # audio
    with open(f"{tmp}/audio.txt", "w") as f:
        for r in rencana:
            w = f"{tmp}/a{r['no']:02d}.wav"
            sh("ffmpeg", "-loglevel", "error", "-y", "-i", f"{base}/suara/b{r['no']:02d}.mp3", "-af", f"adelay={int(LEAD*1000)}:all=1,apad", "-t", f"{r['D']:.3f}", "-ar", "48000", "-ac", "2", w)
            f.write(f"file '{w}'\n")
    sh("ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", f"{tmp}/audio.txt", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000", f"{tmp}/audio.wav")
    out = f"{base}/{S.NAMA}.mp4"
    sh("ffmpeg", "-loglevel", "error", "-y", "-i", f"{tmp}/video.mp4", "-i", f"{tmp}/audio.wav", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", out)
    # srt
    def ts(x): h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60; return f"{h:02d}:{m:02d}:{int(s):02d},{int((s % 1) * 1000):03d}"
    srt = []; t = 0; k = 1
    for r in rencana:
        kal = [s.strip() for s in re.split(r"(?<=[.!?])\s+", naskah[r["no"]]) if s.strip()]
        tot = sum(len(s) for s in kal); t0 = t + LEAD
        for s in kal:
            d = r["audio"] * len(s) / tot; srt.append(f"{k}\n{ts(t0)} --> {ts(t0 + d - 0.05)}\n{s}\n"); k += 1; t0 += d
        t += r["D"]
    open(out.replace(".mp4", ".srt"), "w").write("\n".join(srt))
    json.dump([{"no": r["no"], "mulai": sum(x["D"] for x in rencana if x["no"] < r["no"]), "D": r["D"]} for r in rencana], open(f"{base}/waktu.json", "w"))
    print("SELESAI", out, dur_file(out))
if __name__ == "__main__":
    main(sys.argv[1], "--hanya-adegan" in sys.argv)
