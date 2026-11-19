"""Perekam Short how-to: terminal sungguhan (pty siswa) + layar tambahan HTML, suara edge-tts Ardi.
Pakai: python3 rig.py ../shorts/h02.py"""
import asyncio, os, pty, fcntl, termios, struct, subprocess, time, json, sys, threading, functools, http.server, wave, hashlib, ssl, importlib.util, shutil
import websockets
import edge_tts, edge_tts.communicate as ec
from playwright.async_api import async_playwright
ec._SSL_CTX = ssl.create_default_context(cafile="/root/.ccr/ca-bundle.crt")
H = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(H)
spec = importlib.util.spec_from_file_location("s", sys.argv[1]); S = importlib.util.module_from_spec(spec); spec.loader.exec_module(S)
KODE = S.KODE; OUT = f"{ROOT}/keluar/{KODE}"; os.makedirs(OUT, exist_ok=True)
LAFAL = [("Claude Code", "Klod Kod"), ("Claude", "Klod"), ("claude", "klod"), ("PowerShell", "Pawer Syel"), ("--", " minus minus "), (".env", "dot env"), ("PATH", "path")] + getattr(S, "LAFAL", [])
def tts_teks(b):
    if len(b) > 2 and b[2]: return b[2].replace('`', '')
    t = b[1].replace('`', '')
    for a, c in LAFAL: t = t.replace(a, c)
    return t
def dur(f):
    with wave.open(f) as w: return w.getnframes() / w.getframerate()
async def suara():
    d = f"{ROOT}/suara/{KODE}"; os.makedirs(d, exist_ok=True); hasil = []
    for i, b in enumerate(S.BEATS):
        t = tts_teks(b); h = hashlib.md5(t.encode()).hexdigest()[:8]
        mp3 = f"{d}/{i:02d}_{h}.mp3"; wav = mp3[:-4] + ".wav"
        if not os.path.exists(wav):
            for k in range(4):
                try:
                    await edge_tts.Communicate(t, "id-ID-ArdiNeural", rate="+5%").save(mp3)
                    if os.path.getsize(mp3) > 1000: break
                except Exception as e: print("ulang", e); await asyncio.sleep(2)
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", mp3, "-af", "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,loudnorm=I=-16:TP=-1.5", "-ar", "44100", "-ac", "1", wav], check=True)
        hasil.append(wav)
    return hasil
def reset_siswa():
    subprocess.run("pkill -u siswa; sleep 0.5; userdel -r siswa 2>/dev/null; useradd -m -s /bin/bash siswa", shell=True)
    with open("/home/siswa/.bashrc", "a") as f: f.write("\nPS1='\\[\\e[1;34m\\]\\W\\[\\e[0m\\] \\[\\e[1;32m\\]$\\[\\e[0m\\] '\n")
    with open("/home/siswa/.bash_profile", "w") as f:
        f.write("unset NVM_DIR\nexport PATH=$HOME/.local/bin:/usr/sbin:/usr/bin:/sbin:/bin" + getattr(S, "PATH_EXTRA", "") + "\n[ -f ~/.bashrc ] && . ~/.bashrc\n")
    subprocess.run(["chown", "siswa:siswa", "/home/siswa/.bash_profile"])
    if getattr(S, "SIAPKAN", None):
        subprocess.run(["su", "-", "siswa", "-c", S.SIAPKAN], check=True)
def halaman():
    s = open(f"{H}/halaman.html").read()
    s = s.replace("/*JUDUL*/", S.JUDUL).replace("/*LANGKAH*/", json.dumps(S.LANGKAH)).replace("/*FONT*/", str(getattr(S, "FONT", 32)))
    s = s.replace("/*EXTRA_CSS*/", getattr(S, "EXTRA_CSS", "")).replace("<!--EXTRA_HTML-->", getattr(S, "EXTRA_HTML", "")).replace("/*EXTRA_JS*/", getattr(S, "EXTRA_JS", ""))
    open(f"{H}/_hal.html", "w").write(s)

class R:
    pass
async def main():
    WAV = await suara(); D = [dur(w) for w in WAV]
    print("durasi narasi", round(sum(D), 1), [round(x, 1) for x in D], flush=True)
    if "--suara" in sys.argv: return
    reset_siswa(); halaman()
    pid, fd = pty.fork()
    if pid == 0:
        os.environ.update(TERM="xterm-256color", COLORTERM="truecolor", LANG="C.UTF-8")
        os.execvp("su", ["su", "-", "siswa", "-w", "TERM,COLORTERM"])
    klien = set()
    async def ws_h(ws):
        klien.add(ws)
        try: await ws.wait_closed()
        finally: klien.discard(ws)
    q = asyncio.Queue(); loop = asyncio.get_running_loop()
    def rd():
        try: q.put_nowait(os.read(fd, 65536))
        except OSError: loop.remove_reader(fd)
    loop.add_reader(fd, rd)
    async def pompa():
        while True:
            b = await q.get()
            for w in list(klien):
                try: await w.send(b)
                except Exception: pass
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 8766), functools.partial(http.server.SimpleHTTPRequestHandler, directory=H))
    srv.RequestHandlerClass.log_message = lambda *a: None
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    wss = await websockets.serve(ws_h, "127.0.0.1", 8765); asyncio.create_task(pompa())
    log = {"beats": [], "cepat": []}
    async with async_playwright() as p:
        prof = f"{ROOT}/_profil"; shutil.rmtree(prof, ignore_errors=True)
        b = await p.chromium.launch_persistent_context(prof, headless=False, no_viewport=True, args=["--app=http://127.0.0.1:8766/_hal.html", "--window-position=0,0", "--window-size=1080,1920", "--force-device-scale-factor=1", "--hide-scrollbars", "--disable-features=Translate", "--no-proxy-server"], env={**os.environ, "DISPLAY": ":99"})
        await asyncio.sleep(2.0); pg = b.pages[0]; await asyncio.sleep(1.0)
        uk = await pg.evaluate("ukuran"); fcntl.ioctl(fd, termios.TIOCSWINSZ, struct.pack("HHHH", uk[1], uk[0], 0, 0))
        await asyncio.sleep(0.6); os.write(fd, b"clear\r"); await asyncio.sleep(0.8)
        ff = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "x11grab", "-framerate", "30", "-video_size", "1080x1920", "-draw_mouse", "0", "-i", ":99",
                               "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", "-pix_fmt", "yuv420p", f"{OUT}/_rekaman.mp4"], stdin=subprocess.PIPE)
        T0 = time.time()
        r = R(); r.pg = pg; r.now = lambda: time.time() - T0; r.D = D
        def tulis(s): os.write(fd, s.encode() if isinstance(s, str) else s)
        r.tulis = tulis
        async def tidur(s): await asyncio.sleep(s)
        r.tidur = tidur
        async def ketik(s, cps=13):
            for ch in s:
                tulis(ch); await asyncio.sleep(1 / cps * (1.6 if ch == " " else 1))
        r.ketik = ketik
        async def enter(jeda=0.3): await asyncio.sleep(jeda); tulis("\r")
        r.enter = enter
        async def js(expr, *a): return await pg.evaluate(expr, *a) if a else await pg.evaluate(expr)
        r.js = js
        async def sorot(sub, n=1, penuh=False, awal=False): return await pg.evaluate("a=>sorot(...a)", [sub, n, penuh, awal])
        r.sorot = sorot
        async def sorot_el(sel, pad=10): return await pg.evaluate("a=>sorotEl(...a)", [sel, pad])
        r.sorot_el = sorot_el
        async def sorot_kotak(bb, pad=8):
            await pg.evaluate("([b,p])=>{const hl=document.getElementById('hl'),w=document.getElementById('win').getBoundingClientRect();hl.style.left=(b.x-w.left-p)+'px';hl.style.top=(b.y-w.top-p)+'px';hl.style.width=(b.width+2*p)+'px';hl.style.height=(b.height+2*p)+'px';hl.style.opacity=1}", [bb, pad])
        r.sorot_kotak = sorot_kotak
        async def lepas(): await pg.evaluate("lepas()")
        r.lepas = lepas
        async def langkah(k): await pg.evaluate(f"langkah({k})")
        r.langkah = langkah
        async def kartu(judul=None, isi="", kode=True): await pg.evaluate("a=>kartu(...a)", [judul, isi, kode])
        r.kartu = kartu
        async def akhir(j=None): await pg.evaluate("j=>akhir(j)", j)
        r.akhir = akhir
        async def bersih(): tulis("\x0c"); await asyncio.sleep(0.4)
        r.bersih = bersih
        async def ada(sub): return any(sub in l for l in await pg.evaluate("baris()"))
        r.ada = ada
        async def tunggu(sub, maks=300, cepat=True):
            a = r.now()
            while not await ada(sub):
                await asyncio.sleep(0.2)
                if r.now() - a > maks: raise RuntimeError("tak muncul: " + sub)
            bb = r.now()
            if cepat and bb - a > 2.5: log["cepat"].append([a + 0.8, bb - 0.4])
            return bb - a
        r.tunggu = tunggu
        async def beat(i, aksi=None, pad=0.6):
            await pg.evaluate("s=>teks(s)", S.BEATS[i][1])
            t = r.now(); log["beats"].append([i, t]); print("beat", i, S.BEATS[i][0], round(t, 1), flush=True)
            if aksi: await aksi()
            sisa = max(t + D[i] + pad - r.now(), 1.5 if aksi else 0)
            if sisa > 0: await asyncio.sleep(sisa)
        r.beat = beat
        await asyncio.sleep(0.6)
        try:
            await S.ADEGAN(r)
        finally:
            log["akhir"] = r.now(); ff.communicate(b"q"); await b.close()
            json.dump(log, open(f"{OUT}/_log.json", "w"), indent=1)
    rakit(log, WAV, D)
    os.kill(pid, 9); os._exit(0)

def rakit(log, WAV, D):
    """Percepat bagian menunggu (6x), taruh narasi per beat, buat .srt dan lembar cek."""
    V = f"{OUT}/_rekaman.mp4"; cepat = sorted(log["cepat"]); F = 6.0
    def peta(t):
        s = 0
        for a, b in cepat:
            if t >= b: s += (b - a) * (1 - 1 / F)
            elif t > a: s += (t - a) * (1 - 1 / F)
        return t - s
    akhir = log["akhir"]
    if cepat:
        parts = []; flt = []; t0 = 0; n = 0
        for a, b in cepat:
            parts += [(t0, a, 1), (a, b, F)]; t0 = b
        parts.append((t0, akhir, 1))
        for (a, b, f) in parts:
            flt.append(f"[0:v]trim={a:.3f}:{b:.3f},setpts=(PTS-STARTPTS)/{f}[v{n}]"); n += 1
        fc = ";".join(flt) + ";" + "".join(f"[v{k}]" for k in range(n)) + f"concat=n={n}:v=1:a=0[v]"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", V, "-filter_complex", fc, "-map", "[v]", "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-r", "30", f"{OUT}/_video.mp4"], check=True)
        V = f"{OUT}/_video.mp4"
    ins = []; flt = []; srt = []
    def ts(x): m = int(x // 60); s = x % 60; return f"00:{m:02d}:{int(s):02d},{int(round((s % 1) * 1000)) % 1000:03d}"
    for n, (i, t) in enumerate(log["beats"]):
        tt = peta(t) + 0.15; ms = int(tt * 1000); ins += ["-i", WAV[i]]
        flt.append(f"[{n+1}:a]adelay={ms}|{ms}[a{n}]")
        srt.append(f"{n+1}\n{ts(tt)} --> {ts(tt + D[i])}\n{S.BEATS[i][1].replace('`', '')}\n")
    N = len(log["beats"])
    fc = ";".join(flt) + ";" + "".join(f"[a{k}]" for k in range(N)) + f"amix=inputs={N}:normalize=0,apad[a]"
    nama = f"{OUT}/{KODE}_{S.NAMA}_Short"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", V, *ins, "-filter_complex", fc, "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "160k", "-ar", "44100", "-shortest", nama + ".mp4"], check=True)
    open(nama + ".srt", "w").write("\n".join(srt))
    # lembar cek: frame di akhir tiap beat (setelah aksi) dan tengah
    from PIL import Image
    fr = []
    for n, (i, t) in enumerate(log["beats"]):
        nxt = log["beats"][n + 1][1] if n + 1 < N else akhir
        for tt in (peta(t) + 0.4 * (peta(nxt) - peta(t)), peta(nxt) - 1.0):
            f = f"{OUT}/_f{len(fr)}.png"
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{tt:.2f}", "-i", nama + ".mp4", "-frames:v", "1", "-vf", "scale=360:-1", f]); fr.append(f)
    k = 6; rows = (len(fr) + k - 1) // k; im = Image.new("RGB", (360 * k, 640 * rows))
    for j, f in enumerate(fr): im.paste(Image.open(f), ((j % k) * 360, (j // k) * 640)); os.remove(f)
    im.save(f"{OUT}/_lembar.jpg", quality=80)
    d = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", nama + ".mp4"]))
    print("SELESAI", nama + ".mp4", round(d, 1), "detik; cepat:", [(round(a, 1), round(b, 1)) for a, b in cepat])
if __name__ == "__main__":
    asyncio.run(main())
