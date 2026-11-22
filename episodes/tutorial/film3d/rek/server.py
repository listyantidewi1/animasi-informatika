"""Server sesi: memegang browser VS Code, menjalankan perintah Python dari /tmp/sesi/q/*.py berurutan.
Setiap perintah dieksekusi dengan variabel v (Sesi). Hasil/print ke /tmp/sesi/log.txt, selesai -> /tmp/sesi/done/<nama>."""
import os, sys, time, glob, traceback, io, contextlib
sys.path.insert(0, os.path.dirname(__file__))
from sesi import *
Q = "/tmp/sesi/q"; D = "/tmp/sesi/done"
os.makedirs(Q, exist_ok=True); os.makedirs(D, exist_ok=True)
v = Sesi("_server")
log = open("/tmp/sesi/log.txt", "a", buffering=1)
log.write("siap\n")
while True:
    fs = sorted(glob.glob(Q + "/*.py"))
    if not fs: time.sleep(0.3); continue
    f = fs[0]; nama = os.path.basename(f); kode = open(f).read(); os.remove(f)
    log.write(f"== {nama} mulai {time.strftime('%H:%M:%S')}\n")
    buf = io.StringIO()
    try:
        with contextlib.redirect_stdout(buf): exec(kode, globals())
        status = "ok"
    except Exception:
        status = "ERROR\n" + traceback.format_exc()
    log.write(buf.getvalue() + f"== {nama} {status} {time.strftime('%H:%M:%S')}\n")
    open(f"{D}/{nama}", "w").write(status + "\n" + buf.getvalue())
    if "BERHENTI" in kode: break
