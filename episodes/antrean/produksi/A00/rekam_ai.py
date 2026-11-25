import sys, time, subprocess, os; sys.path.insert(0, "/home/user/antre/alat")
os.environ["DIR"] = "/home/user/proyek/antrean-ai"
subprocess.run("/home/user/antre/alat/reset_vs.sh", shell=True, env=os.environ)
from rekam_vs import VS
def psql(q): return subprocess.run(["psql", "-U", "postgres", "-d", "antrean_ai", "-tAc", q], capture_output=True, text=True).stdout.strip()
psql("TRUNCATE tiket RESTART IDENTITY")
r = VS("/home/user/antre/A00/rek_ai", url="http://localhost:8080/?folder=/home/user/proyek/antrean-ai")
r.buka("server.js"); time.sleep(0.5)
r.mulai(); r.kamera(r.kotak(".editor-group-container"), pad=0); time.sleep(0.4)
r.tanda("kode"); r.label("Contoh kode bergaya hasil AI", 5); time.sleep(6.0)
r.fokus_terminal(); time.sleep(0.3); r.kamera_terminal()
r.tanda("server"); r.terminal("node server.js", tunggu=1.5)
r.perintah("Terminal: Create New Terminal", 1.2); r.kamera_terminal()
r.tanda("satu"); r.terminal("curl -X POST localhost:4000/api/tiket", cps=24, tunggu=1.2); r.label("Satu orang: lancar", 3); time.sleep(2.5)
r.tanda("satu_akhir")
ok = False
for k in range(300):
    psql("DELETE FROM tiket WHERE nomor > 1")
    r.pg.keyboard.press("Control+l"); time.sleep(0.4)
    r.tanda(f"coba{k}"); r.terminal("node serbu.js", cps=16, tunggu=2.0)
    g = psql("SELECT string_agg(nomor::text, ',') FROM (SELECT nomor FROM tiket GROUP BY nomor HAVING count(*) > 1) x")
    print(k, g, flush=True)
    if g and "," not in g:
        r.tanda("serbu"); r.label(f"Nomor {g} dibagikan dua kali", 4); open("/home/user/antre/A00/ganda.txt", "w").write(g); time.sleep(5.0); r.tanda("serbu_akhir"); ok = True; break
r.kamera(None); time.sleep(0.5); r.selesai(); print("OK" if ok else "GAGAL")
