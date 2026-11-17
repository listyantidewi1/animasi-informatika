import sys, time; sys.path.insert(0, "/home/user/antre/alat")
from rekam_vs import VS
import subprocess
subprocess.run("/home/user/antre/alat/reset_vs.sh kosong", shell=True)
r = VS("/home/user/antre/A01/rek")
r.mulai(); r.kamera(None); time.sleep(0.6)
r.tanda("b13"); r.berkas_baru("KEBUTUHAN.md"); r.kamera_editor()
r.ketik_kode(open("/home/user/antre/kode/KEBUTUHAN.md").read(), cps=40)
r.tekan("Control+s"); time.sleep(0.6); r.tanda("b13_git")
r.fokus_terminal(); time.sleep(0.5)
r.terminal("git init", tunggu=0.8); r.terminal("git add .", tunggu=0.6)
r.terminal('git commit -m "Kebutuhan versi 1"', tunggu=1.5); r.label("Commit pertama", 3)
time.sleep(1.5); r.tanda("b13_akhir"); r.kamera(None); time.sleep(1); r.selesai()
