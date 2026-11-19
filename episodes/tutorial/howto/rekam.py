import asyncio, os, pty, fcntl, termios, struct, subprocess, time, json, sys, threading, functools, http.server, wave
import websockets
from playwright.async_api import async_playwright
sys.path.insert(0, "/tmp/claude-0/ht"); from naskah import BEATS
H = "/tmp/claude-0/ht"
def dur(f):
    with wave.open(f) as w: return w.getnframes()/w.getframerate()
D = [dur(f"{H}/suara2/{i:02d}_{k}.wav") for i,(k,_,_) in enumerate(BEATS)]
COLS, ROWS = 48, 26
# --- PTY shell sebagai murid ---
pid, fd = pty.fork()
if pid == 0:
    os.environ["TERM"]="xterm-256color"; os.environ["COLORTERM"]="truecolor"; os.execvp("su", ["su", "-", "siswa", "-w", "TERM,COLORTERM"])
fcntl.ioctl(fd, termios.TIOCSWINSZ, struct.pack("HHHH", ROWS, COLS, 0, 0))
klien = set()
async def ws_h(ws):
    klien.add(ws)
    try: await ws.wait_closed()
    finally: klien.discard(ws)
async def baca_pty():
    loop = asyncio.get_running_loop(); q = asyncio.Queue()
    loop.add_reader(fd, lambda: q.put_nowait(os.read(fd, 65536)))
    while True:
        b = await q.get()
        for w in list(klien):
            try: await w.send(b)
            except Exception: pass
def tulis(s): os.write(fd, s.encode())
async def ketik(s, cps=13):
    for ch in s:
        tulis(ch); await asyncio.sleep(1/cps * (1.6 if ch == " " else 1))
log = {"beats": [], "cepat": []}
async def main():
    threading.Thread(target=lambda: http.server.ThreadingHTTPServer(("127.0.0.1", 8766),
        functools.partial(http.server.SimpleHTTPRequestHandler, directory=f"{H}/web")).serve_forever(), daemon=True).start()
    await websockets.serve(ws_h, "127.0.0.1", 8765)
    asyncio.create_task(baca_pty())
    # siapkan prompt pendek
    await asyncio.sleep(1.0)
    tulis("clear\r")
    async with async_playwright() as p:
        b = await p.chromium.launch_persistent_context(f"{H}/profil", headless=False, no_viewport=True, args=["--app=http://127.0.0.1:8766/index.html", "--window-position=0,0", "--window-size=1080,1920", "--force-device-scale-factor=1", "--hide-scrollbars"], env={**os.environ, "DISPLAY": ":99"})
        await asyncio.sleep(2.0); pg = b.pages[0]; await asyncio.sleep(1.5)
        uk = await pg.evaluate('ukuran'); print('ukuran', uk)
        fcntl.ioctl(fd, termios.TIOCSWINSZ, struct.pack('HHHH', uk[1], uk[0], 0, 0)); await asyncio.sleep(0.5)
        tulis("\x0c"); await asyncio.sleep(0.8)
        ff = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "x11grab", "-framerate", "30", "-video_size", "1080x1920", "-draw_mouse", "0", "-i", ":99",
                               "-c:v", "libx264", "-preset", "veryfast", "-crf", "16", "-pix_fmt", "yuv420p", f"{H}/rekaman.mp4"], stdin=subprocess.PIPE)
        T0 = time.time(); now = lambda: time.time() - T0
        await asyncio.sleep(0.8)
        async def ada(sub):
            return any(sub in l for l in await pg.evaluate("baris()"))
        async def tunggu(sub, maks=180):
            a = now()
            while not await ada(sub):
                await asyncio.sleep(0.2)
                if now() - a > maks: raise RuntimeError("tak muncul: " + sub)
            return now() - a
        async def beat(i, aksi=None, pad=0.6):
            k, layar, _ = BEATS[i]
            await pg.evaluate("s=>teks(s)", layar)
            t = now(); log["beats"].append([i, t]); print("beat", i, k, round(t, 2), flush=True)
            if aksi: await aksi()
            sisa = t + D[i] + pad - now()
            if sisa > 0: await asyncio.sleep(sisa)
        J = lambda js: pg.evaluate(js)
        # 0 kait
        await beat(0, pad=0.8)
        # 1 pasang
        await J("langkah(1)")
        async def a1():
            await asyncio.sleep(2.2); await ketik("curl -fsSL https://claude.ai/install.sh | bash")
            await J("sorot('curl -fsSL')")
        await beat(1, a1, pad=0.5)
        await J("lepas()"); tulis("\r")
        # 2 windows (instalasi berjalan di belakang)
        async def a2():
            await asyncio.sleep(0.4); await J("kartu(true)")
        await beat(2, a2, pad=1.6)
        await J("kartu(false)")
        a = now(); await tunggu("Installation complete"); b2 = now()
        if b2 - a > 1.0: log["cepat"].append([a + 0.3, b2 - 0.2])
        await asyncio.sleep(0.6)
        # 3 path
        async def a3():
            await J("sorot('successfully installed')"); await asyncio.sleep(3.6)
            await J("sorot('is not in your PATH', 1, true)"); await asyncio.sleep(2.6)
            await J("lepas()")
            await ketik("echo 'export PATH=\"$HOME/.local/bin:$PATH\"' >> ~/.bashrc && source ~/.bashrc", cps=22)
            tulis("\r"); await asyncio.sleep(2.2)
        await beat(3, a3, pad=0.8)
        # 4 versi
        await J("langkah(2)"); tulis("\x0c"); await asyncio.sleep(0.4)
        async def a4():
            await asyncio.sleep(1.4); await ketik("claude --version"); await asyncio.sleep(0.4); tulis("\r")
            await tunggu("(Claude Code)"); await J("sorot('(Claude Code)', 1, true)")
        await beat(4, a4, pad=1.2)
        await J("lepas()")
        # 5 folder
        await J("langkah(3)"); tulis("\x0c"); await asyncio.sleep(0.4)
        async def a5():
            await asyncio.sleep(1.0); await ketik("mkdir proyek-pertama"); tulis("\r"); await asyncio.sleep(0.5)
            await ketik("cd proyek-pertama"); tulis("\r"); await asyncio.sleep(0.5)
            await ketik("claude"); await asyncio.sleep(0.3); tulis("\r")
        await beat(5, a5, pad=0.2)
        a = now(); await tunggu("Choose the text style"); b2 = now()
        if b2 - a > 1.0: log["cepat"].append([a + 0.3, b2 - 0.2])
        await asyncio.sleep(0.5)
        # 6 tema
        async def a6():
            await J("sorot('Auto (match terminal)', 7, true)"); await asyncio.sleep(2.2)
            tulis("\x1b[B"); await asyncio.sleep(1.0); await J("sorot('Dark mode', 1, true, true)"); await asyncio.sleep(1.4)
            tulis("\r"); await J("lepas()")
        await beat(6, a6, pad=0.4)
        await tunggu("Select login method")
        # 7 login
        await J("langkah(4)")
        async def a7():
            await asyncio.sleep(0.8); await J("sorot('Claude account with subscription', 2, true)")
        await beat(7, a7, pad=1.0)
        # 8 akun
        await beat(8, pad=1.8)
        log["akhir"] = now()
        ff.communicate(b"q"); await b.close()
    json.dump(log, open(f"{H}/rekam_log.json", "w"), indent=1); print(log)
    os._exit(0)
asyncio.run(main())
