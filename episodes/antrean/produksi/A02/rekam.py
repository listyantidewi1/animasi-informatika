import sys, time; sys.path.insert(0, "/home/user/antre/alat")
from rekam_vs import VS
import subprocess
subprocess.run("/home/user/antre/alat/reset_vs.sh", shell=True)
r = VS("/home/user/antre/A02/rek")
r.mulai(); r.kamera(None); time.sleep(0.6)
r.tanda("b14"); r.fokus_terminal(); time.sleep(0.4)
r.terminal("mkdir docs", tunggu=0.6); r.terminal("cp ~/Unduhan/erd.png docs/", tunggu=1.2)
r.kamera(None); time.sleep(0.3)
r.fokus_editor(); r.buka("erd.png"); time.sleep(0.5); r.tanda("b14_gambar"); time.sleep(3.0)
r.fokus_terminal(); time.sleep(0.3)
r.terminal("git add docs", tunggu=0.6); r.terminal('git commit -m "Rancangan database"', tunggu=1.5)
r.label("Rancangan masuk Git", 3); time.sleep(1.5); r.tanda("b14_akhir"); r.kamera(None); time.sleep(0.8); r.selesai()
