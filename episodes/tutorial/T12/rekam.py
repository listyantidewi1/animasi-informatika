import sys, time
sys.path.insert(0, "/home/user/tut/alat"); sys.path.append("/home/user/tut/T12")
from rekam import Rekaman
from durasi import beat
from jupy import J, sel
from sel import C0, C1, C2, C3, C4, C5, C6
D = beat("T12")
r = Rekaman("/home/user/tut/T12/rek", "http://localhost:8888/notebooks/T12_angka.ipynb"); pg = r.pg; j = J(r)
pg.wait_for_selector(".jp-Cell .cm-content"); time.sleep(4); r.gerak(600, 500, 0.01)
def lihat(i, zoom=1.8, tahan=3.0):
    j.fokus_out(i, zoom=zoom); time.sleep(tahan)
r.mulai(); time.sleep(0.5); r.kamera(None); j.masuk(0)
r.tanda("b03"); j.ketik(C0, D[3] * 0.5, baris_baru=False); j.jalankan(0, 3.0); lihat(0, 1.6, 3.5); r.tanda("b03_akhir")
r.tanda("b04"); pg.locator(sel(1)).scroll_into_view_if_needed(); j.ketik(C1, D[4] * 0.55, baris_baru=False); j.jalankan(1, 2.0); lihat(1, 1.6, 3.5); r.tanda("b04_akhir")
r.tanda("b06"); j.ketik(C2, D[6] * 0.55, baris_baru=False); j.jalankan(2, 2.0); lihat(2, 2.2, 3.0); r.tanda("b06_akhir")
r.tanda("b07"); j.ketik(C3, D[7] * 0.45, baris_baru=False); j.jalankan(3, 2.0); lihat(3, 1.6, 3.5); r.tanda("b07_akhir")
r.tanda("b08"); j.ketik(C4, D[8] * 0.5, baris_baru=False); j.jalankan(4, 2.0); lihat(4, 1.5, 3.5); r.tanda("b08_akhir")
r.tanda("b10"); j.ketik(C5, 5.0, baris_baru=False); time.sleep(0.8); r.tanda("b10_tebak"); j.jalankan(5, 2.0); lihat(5, 1.5, 3.5); r.tanda("b10_salah")
j.ketik(C6, 4.5, baris_baru=False); j.jalankan(6, 2.0); lihat(6, 1.5, 3.5); r.tanda("b10_akhir")
time.sleep(0.5); r.selesai(); print("selesai", r.log["durasi"])
