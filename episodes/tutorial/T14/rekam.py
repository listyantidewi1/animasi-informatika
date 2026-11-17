import sys, time, subprocess, os
sys.path.insert(0, "/home/user/tut/alat"); sys.path.append("/home/user/tut/T14")
from rekam import Rekaman
from durasi import beat
from jupy import J, sel
from sel import C0, C1, C2, C3, C4
D = beat("T14")
for f in ["/home/user/tut/nb/hasil_nilai.xlsx"]:
    if os.path.exists(f): os.remove(f)
r = Rekaman("/home/user/tut/T14/rek", "http://localhost:8888/notebooks/T14_nilai.ipynb"); pg = r.pg; j = J(r)
pg.wait_for_selector(".jp-Cell .cm-content"); time.sleep(4); r.gerak(600, 500, 0.01)
def calc(berkas, tahan, kam):
    p = subprocess.Popen(["soffice", "--calc", "--nologo", "--norestore", berkas], cwd="/home/user/tut/nb", env=dict(os.environ, DISPLAY=":99", SAL_FORCEDPI="200"), stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(9); r.log["kamera"].append([r.t(), kam]); time.sleep(tahan); r.log["kamera"].append([r.t(), None])
    subprocess.run(["pkill", "-f", "soffice.bin"]); time.sleep(1.5)
def lihat(i, zoom=1.8, tahan=3.0): j.fokus_out(i, zoom=zoom); time.sleep(tahan)
r.mulai(); time.sleep(0.5); r.kamera(None)
r.tanda("b03"); calc("nilai_kelas.xlsx", 5.0, [560, 320, 2.3]); r.tanda("b03_jupyter"); pg.bring_to_front(); time.sleep(0.5); j.masuk(0)
j.ketik(C0, 5.0, baris_baru=False); j.jalankan(0, 2.0); lihat(0, 1.7, 3.0); r.tanda("b03_akhir")
r.tanda("b05"); j.ketik(C1, D[5] * 0.45, baris_baru=False); j.jalankan(1, 1.5); lihat(1, 1.7, 3.5); r.tanda("b05_akhir")
r.tanda("b06"); j.ketik(C2, 4.0, baris_baru=False); time.sleep(0.8); r.tanda("b06_tebak"); j.jalankan(2, 1.5); lihat(2, 1.7, 4.0); r.tanda("b07_salah")
j.ketik(C3, D[7] * 0.35, baris_baru=False); j.jalankan(3, 1.5); lihat(3, 1.7, 4.0); r.tanda("b07_akhir")
r.tanda("b08"); j.ketik(C4, D[8] * 0.5, baris_baru=False); j.jalankan(4, 2.0); lihat(4, 2.0, 1.5); r.tanda("b08_buka")
calc("hasil_nilai.xlsx", 6.0, [560, 320, 2.3]); r.tanda("b08_akhir")
time.sleep(0.5); r.selesai(); print("selesai", r.log["durasi"])
